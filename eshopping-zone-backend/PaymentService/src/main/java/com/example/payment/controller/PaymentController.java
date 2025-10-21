package com.example.payment.controller;

import com.example.payment.dto.Payment;
import com.example.payment.feign.OrderServiceClient;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import com.razorpay.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/payment")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private OrderServiceClient orderServiceClient;

    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED,
        ERROR
    }

    @GetMapping("/create-order")
    public ModelAndView createOrder(@RequestParam("amount") int amount,
                                    @RequestParam("orderId") String orderId) throws RazorpayException {
        // Sanity log for keys (never log secrets)
        log.info("Init Razorpay client with keyId ending: {}", keyId != null && keyId.length() > 4 ? keyId.substring(keyId.length() - 4) : "NULL");

        RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

        // Razorpay requires paise
        long amountInPaise = BigDecimal.valueOf(amount).multiply(BigDecimal.valueOf(100)).longValue();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", orderId);

        Order order = razorpay.orders.create(orderRequest);

        // Build the payment page model (serves payment view that auto-opens Razorpay Checkout)
        ModelAndView mav = new ModelAndView("payment");
        mav.addObject("orderId", order.get("id").toString());   // Razorpay order id for Checkout
        mav.addObject("amount", amountInPaise);                  // send paise if your view expects it; or divide in the view
        mav.addObject("keyId", keyId);

        // Update order-service with "PENDING"
        Payment payment = new Payment();
        payment.setOrderId(Integer.parseInt(orderId));           // your system order id
        payment.setRazorpayId(order.get("id").toString());       // Razorpay order id
        payment.setPaymentId("");                                // not known yet
        payment.setPaymentStatus(PaymentStatus.PENDING.name());
        payment.setAmount(amount);                                // store rupees in your system
        payment.setPaymentMethod("RAZORPAY");
        payment.setTransactionDetails("Payment Pending");
        orderServiceClient.updatePaymentStatus(payment);

        return mav;
    }

    @RequestMapping(value = "/payment-callback", method = {RequestMethod.POST, RequestMethod.GET})
    public RedirectView paymentCallback(
            @RequestParam("razorpay_order_id") String razorpayOrderId,
            @RequestParam("razorpay_payment_id") String razorpayPaymentId,
            @RequestParam("razorpay_signature") String razorpaySignature) {

        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            // Signature verification
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);
            Utils.verifyPaymentSignature(attributes, keySecret);

            // Fetch order to get original receipt and amount
            Order razorpayOrder = razorpay.orders.fetch(razorpayOrderId);
            String originalOrderId = razorpayOrder.get("receipt").toString();

            // Razorpay amount is in paise; convert to rupees for your system
            BigDecimal amountInPaise = new BigDecimal(razorpayOrder.get("amount").toString());
            BigDecimal amountInRupees = amountInPaise.divide(BigDecimal.valueOf(100));

            Payment payment = new Payment();
            payment.setOrderId(Integer.parseInt(originalOrderId));
            payment.setRazorpayId(razorpayOrderId);
            payment.setPaymentId(razorpayPaymentId);
            payment.setPaymentStatus(PaymentStatus.COMPLETED.name());
            payment.setAmount(amountInRupees.doubleValue());
            payment.setPaymentMethod("RAZORPAY");
            payment.setTransactionDetails("Payment Successful");
            orderServiceClient.updatePaymentStatus(payment);

            // Redirect to SPA route with query params
            return new RedirectView(String.format("/payment-success?orderId=%s&amount=%s&status=SUCCESS",
                    originalOrderId, amountInRupees.toPlainString()));

        } catch (RazorpayException e) {
            log.error("Payment verification failed", e);
            try {
                RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
                Order razorpayOrder = razorpay.orders.fetch(razorpayOrderId);
                String originalOrderId = razorpayOrder.get("receipt").toString();

                BigDecimal amountInPaise = new BigDecimal(razorpayOrder.get("amount").toString());
                BigDecimal amountInRupees = amountInPaise.divide(BigDecimal.valueOf(100));

                Payment payment = new Payment();
                payment.setOrderId(Integer.parseInt(originalOrderId));
                payment.setRazorpayId(razorpayOrderId);
                payment.setPaymentId(razorpayPaymentId);
                payment.setPaymentStatus(PaymentStatus.FAILED.name());
                payment.setAmount(amountInRupees.doubleValue());
                payment.setPaymentMethod("RAZORPAY");
                payment.setTransactionDetails("Payment Failed: " + e.getMessage());
                orderServiceClient.updatePaymentStatus(payment);

                return new RedirectView(String.format("/payment-success?orderId=%s&amount=%s&status=FAILED",
                        originalOrderId, amountInRupees.toPlainString()));
            } catch (Exception ex) {
                log.error("Failed to update order after payment failure", ex);
                return new RedirectView("/payment-success?status=ERROR");
            }
        }
    }

    @PostMapping("/get-key")
    public String getKey() {
        return keyId;
    }

    @GetMapping(value = "/success", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView showSuccessPage() {
        return new ModelAndView("payment-success");
    }

    @GetMapping(value = "/error", produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView showErrorPage() {
        return new ModelAndView("payment-error");
    }
}