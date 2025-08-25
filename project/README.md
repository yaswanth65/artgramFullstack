# Multi-Branch Franchise Management System

A comprehensive management system for craft and art studios with multiple branches, featuring event bookings, product sales, and integrated Razorpay payments.

## Features

### 🎨 Core Functionality
- **Multi-Branch Management** - Manage multiple studio locations
- **Event Booking System** - Daily classes and special workshops
- **E-commerce Store** - Craft supplies and art materials
- **User Management** - Admin, Branch Manager, and Customer roles
- **Real-time Tracking** - Order and shipment tracking

### 💳 Payment Integration
- **Razorpay Integration** - Secure payment processing
- **Multiple Payment Methods** - Cards, UPI, Net Banking, Wallets
- **Real-time Payment Status** - Instant payment confirmation
- **Payment Analytics** - Revenue tracking and reporting

### 📱 Responsive Design
- **Mobile-First** - Optimized for all devices
- **Touch-Friendly** - Intuitive mobile interactions
- **Adaptive Layouts** - Seamless experience across screen sizes

### 🔐 Role-Based Access
- **Admin Dashboard** - Complete system management
- **Manager Dashboard** - Branch-specific operations
- **Customer Dashboard** - Bookings and order tracking

## Payment Setup

### Razorpay Configuration

1. **Get Razorpay Credentials**
   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Get your Key ID and Key Secret from API Keys section

2. **Update Configuration**
   ```typescript
   // In src/utils/razorpay.ts
   const razorpayOptions: RazorpayOptions = {
     key: 'YOUR_RAZORPAY_KEY_ID', // Replace with actual key
     ...options
   };
   ```

3. **Test Mode**
   - Use test credentials for development
   - Switch to live credentials for production

### Payment Flow

1. **Event Booking**
   - Select event and seats
   - Razorpay checkout opens
   - Payment confirmation
   - Booking created with QR code

2. **Product Purchase**
   - Add items to cart
   - Proceed to checkout
   - Razorpay payment gateway
   - Order confirmation with tracking

## Demo Credentials

### Admin Access
- **Email:** admin@craftfactory.com
- **Password:** password

### Branch Manager Access
- **Email:** hyderabad@craftfactory.com
- **Password:** password

### Customer Access
- **Email:** customer@example.com
- **Password:** password

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Icons:** Lucide React
- **Payments:** Razorpay
- **Build Tool:** Vite
- **Routing:** React Router DOM

## Key Components

### Payment Integration
- `src/utils/razorpay.ts` - Payment utilities
- Integrated in EventBooking and Store components
- Real-time payment status updates

### Dashboard Features
- **Admin:** Complete system oversight
- **Manager:** Branch operations and QR verification
- **Customer:** Booking and order management

### Responsive Design
- Mobile-optimized layouts
- Touch-friendly interactions
- Adaptive typography and spacing

## Security Features

- **Secure Payments** - PCI DSS compliant via Razorpay
- **Role-based Access** - Proper authorization checks
- **Data Validation** - Input sanitization and validation
- **Error Handling** - Graceful error management

## Support

For technical support or feature requests, please contact the development team.

---

**Craft Factory** - Inspiring creativity through technology