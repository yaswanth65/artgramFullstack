import React, { createContext, useContext, useState, useEffect } from 'react';
import { Branch, Event, Product, Order, Booking, CMSContent, User } from '../types';

interface DataContextType {
  branches: Branch[];
  events: Event[];
  products: Product[];
  orders: Order[];
  bookings: Booking[];
  cmsContent: CMSContent[];
  managers: User[];
  selectedBranch: string | null;
  setSelectedBranch: (branchId: string | null) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  verifyQRCode: (qrCode: string) => Promise<boolean>;
  updateCMSContent: (content: CMSContent) => Promise<void>;
  deleteCMSContent: (id: string) => Promise<void>;
  addCMSContent: (content: Omit<CMSContent, 'id' | 'updatedAt'>) => Promise<void>;
  addManager: (manager: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateManager: (manager: User) => Promise<void>;
  deleteManager: (id: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  addTrackingUpdate: (orderId: string, update: Omit<TrackingUpdate, 'id'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches] = useState<Branch[]>([
    {
      id: 'pune',
      name: 'Craft Factory Pune',
      location: 'Pune',
      address: '123 MG Road, Pune, Maharashtra 411001',
      phone: '+91 98765 43210',
      email: 'pune@craftfactory.com',
      stripeAccountId: 'acct_pune123',
      managerId: '2',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'mumbai',
      name: 'Craft Factory Mumbai',
      location: 'Mumbai',
      address: '456 Marine Drive, Mumbai, Maharashtra 400001',
      phone: '+91 98765 43211',
      email: 'mumbai@craftfactory.com',
      stripeAccountId: 'acct_mumbai123',
      managerId: '3',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Daily Slime Making Class',
      description: 'Learn to make colorful, stretchy slime with safe ingredients',
      branchId: 'pune',
      date: '2024-01-20',
      time: '14:00',
      duration: 60,
      maxSeats: 10,
      bookedSeats: 3,
      price: 500,
      materials: ['Glue', 'Borax', 'Food coloring', 'Glitter'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Advanced Craft Workshop',
      description: 'Create beautiful handicrafts with professional techniques',
      branchId: 'mumbai',
      date: '2024-01-21',
      time: '15:00',
      duration: 90,
      maxSeats: 8,
      bookedSeats: 2,
      price: 800,
      materials: ['Clay', 'Paints', 'Brushes', 'Varnish'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      title: 'Kids Art & Craft Session',
      description: 'Fun-filled creative session for children aged 5-12',
      branchId: 'pune',
      date: '2024-01-22',
      time: '10:00',
      duration: 90,
      maxSeats: 10,
      bookedSeats: 5,
      price: 600,
      materials: ['Paper', 'Crayons', 'Stickers', 'Scissors'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Complete Slime Kit',
      description: 'Everything you need to make slime at home',
      price: 1200,
      images: ['https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651195/DSC07659_zj2pcc.jpg'],
      category: 'Slime Kits',
      branchId: 'pune',
      stock: 25,
      materials: ['Glue', 'Activator', 'Colors', 'Glitter', 'Mixing bowl'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Art Supply Bundle',
      description: 'Professional art supplies for serious crafters',
      price: 2500,
      images: ['https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755025999/IMG-20250807-WA0003_u999yh.jpg'],
      category: 'Art Supplies',
      branchId: 'mumbai',
      stock: 15,
      materials: ['Canvas', 'Acrylic paints', 'Brushes', 'Palette', 'Easel'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Kids Craft Starter Pack',
      description: 'Perfect starter kit for young artists',
      price: 800,
      images: ['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'],
      category: 'Kids Supplies',
      branchId: 'pune',
      stock: 30,
      materials: ['Colored paper', 'Safety scissors', 'Glue sticks', 'Crayons'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Premium Paint Set',
      description: 'High-quality acrylic paints for professional results',
      price: 1800,
      images: ['https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'],
      category: 'Art Supplies',
      branchId: 'mumbai',
      stock: 20,
      materials: ['Acrylic paints', 'Brushes', 'Palette knife', 'Canvas board'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const [managers, setManagers] = useState<User[]>([
    {
      id: '2',
      email: 'pune@craftfactory.com',
      name: 'Pune Branch Manager',
      role: 'branch_manager',
      branchId: 'pune',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      email: 'mumbai@craftfactory.com',
      name: 'Mumbai Branch Manager',
      role: 'branch_manager',
      branchId: 'mumbai',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [cmsContent, setCmsContent] = useState<CMSContent[]>([
    {
      id: '0',
      type: 'carousel',
      title: 'Welcome to Craft Factory',
      content: 'Discover the joy of crafting with our expert-led workshops and premium supplies',
      images: [
        'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651195/DSC07659_zj2pcc.jpg',
        'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755025999/IMG-20250807-WA0003_u999yh.jpg'

      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '0.5',
      type: 'carousel',
      title: 'Premium Art Supplies',
      content: 'Shop our curated collection of high-quality art and craft materials',
      images: [
        
        'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755025999/IMG-20250807-WA0003_u999yh.jpg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '0.6',
      type: 'carousel',
      title: 'Creative Workshops for All Ages',
      content: 'Join our fun-filled workshops designed for children and adults alike',
      images: [
        'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755026061/HAR05826_hv05wz.jpg',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '1',
      type: 'hero',
      title: 'Welcome to Craft Factory',
      content: 'Discover the joy of crafting with our expert-led workshops and premium supplies',
      images: ['https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg'],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      type: 'about',
      title: 'About Craft Factory',
      content: 'We are passionate about bringing creativity to life through hands-on crafting experiences. Our expert instructors and premium materials create the perfect environment for learning and creating.',
      images: [
        'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      type: 'services',
      title: 'Our Services',
      content: 'From daily slime-making classes to advanced crafting workshops, we offer a wide range of activities designed to spark imagination and develop artistic skills.',
      images: [],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      type: 'testimonials',
      title: 'What Our Customers Say',
      content: 'Real experiences from our craft community',
      images: [
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      type: 'contact',
      title: 'Contact Us',
      content: 'Get in touch with us for any questions or bookings',
      images: [],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      type: 'gallery',
      title: 'Our Gallery',
      content: 'Explore our creative workshops and happy moments',
      images: [
        'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
        'https://images.pexels.com/photos/6941924/pexels-photo-6941924.jpeg',
        'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg',
        'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
        'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '7',
      type: 'studios',
      title: 'Our Studios',
      content: 'Visit our state-of-the-art creative spaces',
      images: [
        'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '8',
      type: 'events',
      title: 'Special Events',
      content: 'Join our exclusive workshops and special events',
      images: [
        'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
        'https://images.pexels.com/photos/6941924/pexels-photo-6941924.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      qrCode: `QR-${Date.now()}`,
      isVerified: false
    };
    setBookings(prev => [...prev, newBooking]);
    
    // Update event booked seats
    setEvents(prev => prev.map(event => 
      event.id === bookingData.eventId 
        ? { ...event, bookedSeats: event.bookedSeats + bookingData.seats }
        : event
    ));
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      trackingNumber: `TRK-${Date.now()}`
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Update product stock
    orderData.products.forEach(product => {
      setProducts(prev => prev.map(p => 
        p.id === product.productId 
          ? { ...p, stock: p.stock - product.quantity }
          : p
      ));
    });
  };

  const verifyQRCode = async (qrCode: string): Promise<boolean> => {
    const booking = bookings.find(b => b.qrCode === qrCode);
    if (booking && !booking.isVerified) {
      setBookings(prev => prev.map(b => 
        b.qrCode === qrCode ? { ...b, isVerified: true } : b
      ));
      return true;
    }
    return false;
  };

  const updateCMSContent = async (content: CMSContent) => {
    setCmsContent(prev => prev.map(c => 
      c.id === content.id ? { ...content, updatedAt: new Date().toISOString() } : c
    ));
  };

  const addCMSContent = async (contentData: Omit<CMSContent, 'id' | 'updatedAt'>) => {
    const newContent: CMSContent = {
      ...contentData,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString()
    };
    setCmsContent(prev => [...prev, newContent]);
  };
  const deleteCMSContent = async (id: string) => {
    setCmsContent(prev => prev.filter(c => c.id !== id));
  };

  const addManager = async (managerData: Omit<User, 'id' | 'createdAt'>) => {
    const newManager: User = {
      ...managerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setManagers(prev => [...prev, newManager]);
  };

  const updateManager = async (manager: User) => {
    setManagers(prev => prev.map(m => m.id === manager.id ? manager : m));
  };

  const deleteManager = async (id: string) => {
    setManagers(prev => prev.filter(m => m.id !== id));
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = async (event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, orderStatus: status as any }
        : order
    ));
  };

  const [branchesState, setBranches] = useState<Branch[]>([
    {
      id: 'pune',
      name: 'Craft Factory Pune',
      location: 'Pune',
      address: '123 MG Road, Pune, Maharashtra 411001',
      phone: '+91 98765 43210',
      email: 'pune@craftfactory.com',
      stripeAccountId: 'acct_pune123',
      managerId: '2',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'mumbai',
      name: 'Craft Factory Mumbai',
      location: 'Mumbai',
      address: '456 Marine Drive, Mumbai, Maharashtra 400001',
      phone: '+91 98765 43211',
      email: 'mumbai@craftfactory.com',
      stripeAccountId: 'acct_mumbai123',
      managerId: '3',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
    const newBranch: Branch = {
      ...branchData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setBranches(prev => [...prev, newBranch]);
  };

  const updateBranch = async (branch: Branch) => {
    setBranches(prev => prev.map(b => b.id === branch.id ? branch : b));
  };

  const deleteBranch = async (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
  };

  const addTrackingUpdate = async (orderId: string, update: Omit<TrackingUpdate, 'id'>) => {
    const newUpdate = {
      ...update,
      id: Date.now().toString()
    };
    
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            trackingUpdates: [...(order.trackingUpdates || []), newUpdate],
            orderStatus: update.status as any
          }
        : order
    ));
  };
  return (
    <DataContext.Provider value={{
      branches: branchesState,
      events,
      products,
      orders,
      bookings,
      cmsContent,
      managers,
      selectedBranch,
      setSelectedBranch,
      createBooking,
      createOrder,
      verifyQRCode,
      updateCMSContent,
      deleteCMSContent,
      addCMSContent,
      addManager,
      updateManager,
      deleteManager,
      addEvent,
      updateEvent,
      deleteEvent,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addBranch,
      updateBranch,
      deleteBranch,
      addTrackingUpdate
    }}>
      {children}
    </DataContext.Provider>
  );
};