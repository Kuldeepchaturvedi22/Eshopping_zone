package com.notificationservice.service;

import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class PdfReceiptService {

    private final TemplateEngine templateEngine;

    public PdfReceiptService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateReceipt(Map<String, Object> receiptData) throws IOException {
        try {
            // Add additional receipt data
            receiptData.putIfAbsent("receiptNumber", "RCP-" + System.currentTimeMillis());
            receiptData.putIfAbsent("generatedDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            receiptData.putIfAbsent("companyName", "E-Shopping Zone");
            receiptData.putIfAbsent("companyAddress", "123 Shopping Street, Commerce City, CC 12345");
            receiptData.putIfAbsent("companyPhone", "+1 (555) 123-4567");
            receiptData.putIfAbsent("companyEmail", "support@eshoppingzone.com");
            
            String htmlContent = generateReceiptHtml(receiptData);
            return convertHtmlToPdf(htmlContent);
        } catch (Exception e) {
            throw new IOException("Failed to generate PDF receipt: " + e.getMessage(), e);
        }
    }

    private String generateReceiptHtml(Map<String, Object> receiptData) {
        Context context = new Context();
        
        // Add all receipt data to context
        context.setVariables(receiptData);
        
        // Add current date and time if not provided
        if (!receiptData.containsKey("currentDate")) {
            context.setVariable("currentDate", LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }
        if (!receiptData.containsKey("currentTime")) {
            context.setVariable("currentTime", LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        }
        
        return templateEngine.process("receipt-pdf", context);
    }

    private byte[] convertHtmlToPdf(String htmlContent) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        try (PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdfDocument = new PdfDocument(writer)) {
            
            HtmlConverter.convertToPdf(htmlContent, pdfDocument.getWriter());
        }
        
        return outputStream.toByteArray();
    }
}