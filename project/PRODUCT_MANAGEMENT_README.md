# Product Management System with Branch-Based Filtering

## Overview

This implementation adds a comprehensive product management system with branch-based filtering to the Craft Factory application. Users can now browse products specific to each branch location (Hyderabad, Vijayawada, and Bangalore).

## Features Implemented

### 1. **Product Model** (`server/src/models/Product.ts`)

- Complete product schema with all necessary fields
- Branch-based product assignment
- Inventory management (quantity tracking)
- Product categorization
- Image support and metadata
- SKU and dimension tracking

### 2. **Products API** (`server/src/routes/products.ts`)

- **GET** `/api/products` - Get all products with optional filters
- **GET** `/api/products/:id` - Get specific product by ID
- **GET** `/api/products/branch/:branchId` - Get products by branch
- **POST** `/api/products` - Create new product
- **PUT** `/api/products/:id` - Update existing product
- **DELETE** `/api/products/:id` - Delete product

### 3. **Branch-Based Store Interface**

- **Branch Selection Dropdown**: Users can select from Hyderabad, Vijayawada, or Bangalore
- **Dynamic Product Loading**: Products automatically filter based on selected branch
- **Real-time Inventory**: Shows current stock levels for each branch
- **Fallback Handling**: Gracefully handles API failures with local data

### 4. **Enhanced Store Component** (`src/components/Customer/Store.tsx`)

- Branch selection interface at the top of the store page
- Loading states during product fetching
- Empty state messages when no products are available
- Branch-specific product displays
- Integration with existing cart and checkout functionality

### 5. **Updated Data Context** (`src/contexts/DataContext.tsx`)

- `fetchProductsByBranch()` function for API integration
- Enhanced product management functions
- Improved state management for branch selection

## Database Seeding

### Comprehensive Seed Script (`server/src/scripts/seedData.ts`)

Populates the database with:

#### **Branches:**

- Craft Factory Hyderabad
- Craft Factory Vijayawada
- Craft Factory Bangalore

#### **Users:**

- Admin user
- Branch managers for each location
- Sample customers

#### **Products by Branch:**

**Hyderabad (3 products):**

- Hyderabad Slime Making Kit - ₹1,200
- Hyderabad Art Supply Bundle - ₹2,500
- Hyderabad Tufting Starter Kit - ₹3,500

**Vijayawada (3 products):**

- Vijayawada Glitter Slime Kit - ₹1,100
- Vijayawada Kids Craft Set - ₹800
- Vijayawada Premium Paint Set - ₹1,800

**Bangalore (4 products):**

- Bangalore Crystal Slime Kit - ₹1,350
- Bangalore Professional Art Kit - ₹3,200
- Bangalore Advanced Tufting Set - ₹4,200
- Bangalore Craft Combo Pack - ₹2,800

## Setup Instructions

### 1. **Install Dependencies**

```bash
# Backend
cd server
npm install
npm install --save-dev @types/cors @types/morgan ts-node

# Frontend
cd ..
npm install
```

### 2. **Environment Setup**

Create `.env` file in the server directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

### 3. **Database Seeding**

```bash
cd server
npm run seed-all
```

This will create:

- ✅ 3 branches
- ✅ 7 users
- ✅ 10 products
- ✅ Sample bookings

### 4. **Start the Application**

```bash
# Start backend (Terminal 1)
cd server
npm run dev

# Start frontend (Terminal 2)
cd ..
npm run dev
```

## Usage

### **For Customers:**

1. Navigate to the Store page
2. Select a branch from the branch selection buttons at the top
3. Browse products specific to that branch
4. Use filters to narrow down products by category
5. Add products to cart and proceed with checkout

### **For Administrators:**

- Use the API endpoints to manage products
- Create branch-specific inventory
- Monitor stock levels across branches

## API Examples

### Get Products by Branch

```bash
curl -X GET "http://localhost:5001/api/products/branch/hyderabad"
```

### Create New Product

```bash
curl -X POST "http://localhost:5001/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Craft Kit",
    "description": "Amazing new craft kit",
    "price": 1500,
    "quantity": 25,
    "branchId": "hyderabad",
    "category": "Craft Kits",
    "isActive": true
  }'
```

## Login Credentials

| Role               | Email                       | Password |
| ------------------ | --------------------------- | -------- |
| Admin              | admin@craftfactory.com      | password |
| Hyderabad Manager  | hyderabad@craftfactory.com  | password |
| Vijayawada Manager | vijayawada@craftfactory.com | password |
| Bangalore Manager  | bangalore@craftfactory.com  | password |
| Customer           | customer@example.com        | password |

## Technical Implementation Details

### **Frontend Architecture:**

- React components with TypeScript
- Context API for state management
- API integration with fallback to local data
- Responsive design with Tailwind CSS

### **Backend Architecture:**

- Express.js with TypeScript
- MongoDB with Mongoose ODM
- RESTful API design
- Comprehensive error handling

### **Data Flow:**

1. User selects branch in Store component
2. Component calls `fetchProductsByBranch()` from DataContext
3. API request made to `/api/products/branch/:branchId`
4. Products filtered and displayed with branch-specific information
5. Cart and checkout functionality works with branch context

## Branch-Specific Features

### **Hyderabad Branch:**

- Focuses on complete starter kits
- Premium tufting supplies
- Higher-end art materials

### **Vijayawada Branch:**

- Specializes in kids' products
- Glitter and special effects items
- Budget-friendly options

### **Bangalore Branch:**

- Advanced crafting supplies
- Professional-grade materials
- Combo packs and variety sets

## Future Enhancements

- **Inventory Sync**: Real-time inventory updates across branches
- **Branch-Specific Pricing**: Different pricing strategies per location
- **Location-Based Auto-Selection**: Automatically select branch based on user location
- **Inter-Branch Transfers**: Move inventory between branches
- **Branch Performance Analytics**: Sales and inventory analytics per branch

## Error Handling

- **API Failures**: Graceful fallback to local product data
- **Network Issues**: Loading states and retry mechanisms
- **Empty States**: Clear messaging when no products are available
- **Validation**: Comprehensive input validation on both frontend and backend

This implementation provides a robust foundation for managing products across multiple branch locations while maintaining excellent user experience and administrative control.
