import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText,
    Badge,
    Chip,
    Paper
} from '@mui/material';
import {
    Store as StoreIcon,
    ShoppingCart as CartIcon,
    LocalAtm as WalletIcon,
    Notifications as NotificationIcon
} from '@mui/icons-material';

export default function MerchantDashboard() {
    // Dummy data - would come from backend in a real implementation
    const [merchant] = useState({
        name: "John's Store",
        email: "john@example.com",
        joinDate: "Jan 2023",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    });

    const [stats] = useState({
        totalSales: "$12,450",
        totalOrders: 156,
        pendingOrders: 8,
        walletBalance: "$3,245.50",
        availableForWithdrawal: "$2,850.00",
        pendingFunds: "$395.50"
    });

    const [recentOrders] = useState([
        { id: "#ORD-5523", customer: "Sarah Johnson", amount: "$125.00", status: "Delivered", date: "Aug 15, 2023" },
        { id: "#ORD-5524", customer: "Mike Peters", amount: "$78.50", status: "Processing", date: "Aug 14, 2023" },
        { id: "#ORD-5525", customer: "Emma Wilson", amount: "$245.00", status: "Pending", date: "Aug 14, 2023" },
        { id: "#ORD-5526", customer: "Tom Smith", amount: "$56.25", status: "Delivered", date: "Aug 13, 2023" },
    ]);

    return (
        <Box sx={{ padding: 3 }}>
            {/* Header with merchant info */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar
                            src={merchant.avatar}
                            alt={merchant.name}
                            sx={{ width: 70, height: 70 }}
                        />
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4">{merchant.name}</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {merchant.email} • Member since {merchant.joinDate}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Badge badgeContent={3} color="error">
                            <NotificationIcon />
                        </Badge>
                    </Grid>
                </Grid>
            </Paper>

            {/* Stats Summary */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <StoreIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Store Overview</Typography>
                            </Box>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography variant="body1">Total Sales: {stats.totalSales}</Typography>
                            <Typography variant="body1">Total Orders: {stats.totalOrders}</Typography>
                            <Typography variant="body1" color="warning.main">
                                Pending Orders: {stats.pendingOrders}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <CartIcon color="secondary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Recent Orders</Typography>
                            </Box>
                            <Divider sx={{ my: 1.5 }} />
                            <List dense disablePadding>
                                {recentOrders.slice(0, 3).map((order) => (
                                    <ListItem key={order.id} disablePadding sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={`${order.id} - ${order.customer}`}
                                            secondary={`${order.amount} • ${order.date}`}
                                        />
                                        <Chip
                                            label={order.status}
                                            size="small"
                                            color={
                                                order.status === "Delivered" ? "success" :
                                                    order.status === "Processing" ? "info" : "warning"
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <WalletIcon color="success" sx={{ mr: 1 }} />
                                <Typography variant="h6">Wallet</Typography>
                            </Box>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                {stats.walletBalance}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Available for withdrawal: {stats.availableForWithdrawal}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Pending: {stats.pendingFunds}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* All Orders */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>All Recent Orders</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {recentOrders.map((order) => (
                            <React.Fragment key={order.id}>
                                <ListItem>
                                    <Grid container>
                                        <Grid item xs={3}>
                                            <Typography variant="body1">{order.id}</Typography>
                                            <Typography variant="body2" color="text.secondary">{order.date}</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body1">{order.customer}</Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body1">{order.amount}</Typography>
                                        </Grid>
                                        <Grid item xs={3} textAlign="right">
                                            <Chip
                                                label={order.status}
                                                color={
                                                    order.status === "Delivered" ? "success" :
                                                        order.status === "Processing" ? "info" : "warning"
                                                }
                                            />
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
}