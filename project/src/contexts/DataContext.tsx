// Allow exporting hooks and helpers from this file (fast-refresh rule can be noisy in dev)
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Branch, Event, Product, Order, Booking, CMSContent, User, TrackingUpdate } from '../types';

type Slot = {
  time: string;
  label: string;
  available: number;
  total: number;
  type: string;
  age: string;
  // price is determined by the customer's chosen plan; admin does not set it
  price?: number;
};

type ActivitySlots = Record<string, { slime: Slot[]; tufting: Slot[] }>;

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
  // session slots persistence (in-memory + localStorage)
  updateSlotsForDate: (branchId: string, date: string, slots: { slime: Slot[]; tufting: Slot[] }) => Promise<void>;
  getSlotsForDate: (branchId: string, date: string) => { slime: Slot[]; tufting: Slot[] } | null;
  // per-branch availability settings
  getBranchAvailability: (branchId: string) => { allowMonday: boolean } | null;
  updateBranchAvailability: (branchId: string, settings: { allowMonday: boolean }) => Promise<void>;
  // get full branch metadata (including optional razorpayKey)
  getBranchById: (id?: string) => Branch | null;
  // version/timestamp to notify consumers when slots change
  slotsVersion: number;
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
  // branches are defined below as branchesState

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Daily Slime Making Class',
      description: 'Learn to make colorful, stretchy slime with safe ingredients',
      branchId: 'hyderabad',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      duration: 60,
      maxSeats: 15,
      bookedSeats: 3,
      price: 850,
      materials: ['Glue', 'Activator', 'Colors'],
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Tufting Workshop - Intro',
      description: 'Introductory tufting for all ages',
      branchId: 'vijayawada',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      duration: 90,
      maxSeats: 8,
      bookedSeats: 1,
      price: 2000,
      materials: ['Rug Canvas', 'Yarn', 'Tufting Gun'],
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Family Slime Session',
      description: 'Fun family-friendly slime play',
      branchId: 'bangalore',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: 60,
      maxSeats: 20,
      bookedSeats: 5,
      price: 750,
      materials: ['Glue', 'Activator', 'Glitter'],
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]);

  const [products, setProducts] = useState<Product[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const [managers, setManagers] = useState<User[]>([
    {
      id: '10',
      email: 'hyderabad@craftfactory.com',
      name: 'Hyderabad Branch Manager',
      role: 'branch_manager',
      branchId: 'hyderabad',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '11',
      email: 'vijayawada@craftfactory.com',
      name: 'Vijayawada Branch Manager',
      role: 'branch_manager',
      branchId: 'vijayawada',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '12',
      email: 'bangalore@craftfactory.com',
      name: 'Bangalore Branch Manager',
      role: 'branch_manager',
      branchId: 'bangalore',
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
    // Try backend first
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${apiBase}/bookings`, { method: 'POST', headers, body: JSON.stringify(bookingData) });
      if (res.ok) {
        const saved = await res.json();
        setBookings(prev => {
          const next = [...prev, saved as Booking];
          try { localStorage.setItem('bookings', JSON.stringify(next)); } catch { }
          try { window.dispatchEvent(new Event('app_data_updated')); } catch { }
          return next;
        });
        return;
      }
    } catch (err) {
      // fallback to local
    }

    // Local fallback behavior (offline/demo)
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      qrCode: `QR-${Date.now()}`,
      isVerified: false
    };
    setBookings(prev => {
      const next = [...prev, newBooking];
      try { localStorage.setItem('bookings', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
      try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
      return next;
    });
    // Update event booked seats (local)
    setEvents(prev => prev.map(event =>
      event.id === bookingData.eventId
        ? { ...event, bookedSeats: event.bookedSeats + (bookingData.seats || 1) }
        : event
    ));
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${apiBase}/orders`, { method: 'POST', headers, body: JSON.stringify(orderData) });
      if (res.ok) {
        const saved = await res.json();
        setOrders(prev => {
          const next = [...prev, saved as Order];
          try { localStorage.setItem('orders', JSON.stringify(next)); } catch { }
          try { window.dispatchEvent(new Event('app_data_updated')); } catch { }
          return next;
        });
        return;
      }
    } catch (err) {
      // fallback to local
    }

    // Local fallback
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      trackingNumber: `TRK-${Date.now()}`
    };
    setOrders(prev => {
      const next = [...prev, newOrder];
      try { localStorage.setItem('orders', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
      try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
      return next;
    });

    // Update product stock
    (orderData.products || []).forEach((product: any) => {
      setProducts(prev => prev.map(p =>
        p.id === product.productId
          ? { ...p, stock: Math.max(0, p.stock - product.quantity) }
          : p
      ));
    });
  };

  const verifyQRCode = async (qrCode: string): Promise<boolean> => {
    const booking = bookings.find(b => b.qrCode === qrCode);
    if (booking && !booking.isVerified) {
      setBookings(prev => {
        const next = prev.map(b => b.qrCode === qrCode ? { ...b, isVerified: true } : b);
        try { localStorage.setItem('bookings', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
        try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
        return next;
      });
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
    setOrders(prev => {
      const next = prev.map(order => order.id === orderId ? { ...order, orderStatus: status as unknown as Order['orderStatus'] } : order);
      try { localStorage.setItem('orders', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
      try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
      return next;
    });
  };

  const [branchesState, setBranches] = useState<Branch[]>([]);

  const getBranchById = (id: string | undefined) => branchesState.find(b => b.id === id) || null;

  // Fetch backend data on mount
  useEffect(() => {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    const token = localStorage.getItem('token');
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    // Branches
    (async () => {
      try {
        const res = await fetch(`${apiBase}/branches`);
        if (res.ok) {
          const data = await res.json();
          const mapped: Branch[] = data.map((b: any) => ({
            id: b._id,
            name: b.name,
            location: b.location,
            address: b.address || '',
            phone: b.phone || '',
            email: b.email || '',
            razorpayKey: b.razorpayKey,
            supportsSlime: true,
            supportsTufting: (b.location || '').toLowerCase() !== 'vijayawada',
            managerId: b.managerId || '',
            isActive: true,
            createdAt: b.createdAt || new Date().toISOString()
          }));
          setBranches(mapped);
        }
      } catch { /* ignore */ }
    })();

    // Products
    (async () => {
      try {
        const res = await fetch(`${apiBase}/products?isActive=true`);
        if (res.ok) {
          const data = await res.json();
          const mapped: Product[] = data.map((p: any) => ({
            id: p._id,
            name: p.name,
            description: p.description || '',
            price: p.price,
            images: p.imageUrl ? [p.imageUrl] : [],
            category: p.category || '',
            stock: typeof p.stock === 'number' ? p.stock : (typeof p.quantity === 'number' ? p.quantity : 0),
            materials: Array.isArray(p.tags) ? p.tags : [],
            isActive: p.isActive !== false,
            createdAt: p.createdAt || new Date().toISOString()
          }));
          setProducts(mapped);
        }
      } catch { /* ignore */ }
    })();

    // Orders (auth)
    (async () => {
      try {
        const res = await fetch(`${apiBase}/orders`, { headers: { 'Content-Type': 'application/json', ...authHeaders } });
        if (res.ok) {
          const data = await res.json();
          const mapped: Order[] = data.map((o: any) => ({
            id: o._id,
            products: (o.products || []).map((it: any) => ({ productId: it.productId || it._id, name: it.name, quantity: it.quantity, price: it.price })),
            totalAmount: o.totalAmount,
            branchId: typeof o.branchId === 'object' ? o.branchId._id : o.branchId,
            customerId: typeof o.customerId === 'object' ? o.customerId._id : o.customerId,
            customerName: o.customerName,
            customerEmail: o.customerEmail,
            customerPhone: o.customerPhone,
            shippingAddress: o.shippingAddress,
            paymentStatus: o.paymentStatus,
            orderStatus: o.orderStatus,
            trackingNumber: o.trackingNumber,
            trackingUpdates: (o.trackingUpdates || []).map((u: any) => ({ id: u._id || undefined, status: u.status, location: u.location, description: u.description, createdAt: u.createdAt })),
            createdAt: o.createdAt
          }));
          setOrders(mapped);
          try { localStorage.setItem('orders', JSON.stringify(mapped)); } catch { }
        }
      } catch { /* ignore */ }
    })();

    // Bookings (auth)
    (async () => {
      try {
        const res = await fetch(`${apiBase}/bookings`, { headers: { 'Content-Type': 'application/json', ...authHeaders } });
        if (res.ok) {
          const data = await res.json();
          const mapped: Booking[] = data.map((b: any) => ({
            id: b._id,
            eventId: b.eventId,
            sessionId: typeof b.sessionId === 'object' ? b.sessionId._id : b.sessionId,
            activity: b.activity,
            branchId: typeof b.branchId === 'object' ? b.branchId._id : b.branchId,
            customerId: typeof b.customerId === 'object' ? b.customerId._id : b.customerId,
            customerName: b.customerName,
            customerEmail: b.customerEmail,
            customerPhone: b.customerPhone,
            date: b.date || b.sessionDate,
            time: b.time,
            seats: b.seats,
            totalAmount: b.totalAmount || 0,
            paymentStatus: b.paymentStatus,
            qrCode: b.qrCode || b.qrCodeData,
            isVerified: !!b.isVerified,
            verifiedAt: b.verifiedAt,
            status: b.status,
            createdAt: b.createdAt
          }));
          setBookings(mapped);
          try { localStorage.setItem('bookings', JSON.stringify(mapped)); } catch { }
        }
      } catch { /* ignore */ }
    })();
  }, []);

  // Periodically refresh orders and bookings from backend so status changes propagate
  useEffect(() => {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    let timer: number | null = null;
    const fetchOrdersAndBookings = async () => {
      const token = localStorage.getItem('token');
      const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const [oRes, bRes] = await Promise.all([
          fetch(`${apiBase}/orders`, { headers: { 'Content-Type': 'application/json', ...authHeaders } }),
          fetch(`${apiBase}/bookings`, { headers: { 'Content-Type': 'application/json', ...authHeaders } })
        ]);
        if (oRes.ok) {
          const data = await oRes.json();
          const mapped: Order[] = data.map((o: any) => ({
            id: o._id,
            products: (o.products || []).map((it: any) => ({ productId: it.productId || it._id, name: it.name, quantity: it.quantity, price: it.price })),
            totalAmount: o.totalAmount,
            branchId: typeof o.branchId === 'object' ? o.branchId._id : o.branchId,
            customerId: typeof o.customerId === 'object' ? o.customerId._id : o.customerId,
            customerName: o.customerName,
            customerEmail: o.customerEmail,
            customerPhone: o.customerPhone,
            shippingAddress: o.shippingAddress,
            paymentStatus: o.paymentStatus,
            orderStatus: o.orderStatus,
            trackingNumber: o.trackingNumber,
            trackingUpdates: (o.trackingUpdates || []).map((u: any) => ({ id: u._id || undefined, status: u.status, location: u.location, description: u.description, createdAt: u.createdAt })),
            createdAt: o.createdAt
          }));
          setOrders(mapped);
          try { localStorage.setItem('orders', JSON.stringify(mapped)); } catch { }
        }
        if (bRes.ok) {
          const data = await bRes.json();
          const mapped: Booking[] = data.map((b: any) => ({
            id: b._id,
            eventId: b.eventId,
            sessionId: typeof b.sessionId === 'object' ? b.sessionId._id : b.sessionId,
            activity: b.activity,
            branchId: typeof b.branchId === 'object' ? b.branchId._id : b.branchId,
            customerId: typeof b.customerId === 'object' ? b.customerId._id : b.customerId,
            customerName: b.customerName,
            customerEmail: b.customerEmail,
            customerPhone: b.customerPhone,
            date: b.date || b.sessionDate,
            time: b.time,
            seats: b.seats,
            totalAmount: b.totalAmount || 0,
            paymentStatus: b.paymentStatus,
            qrCode: b.qrCode || b.qrCodeData,
            isVerified: !!b.isVerified,
            verifiedAt: b.verifiedAt,
            status: b.status,
            createdAt: b.createdAt
          }));
          setBookings(mapped);
          try { localStorage.setItem('bookings', JSON.stringify(mapped)); } catch { }
        }
      } catch {
        // ignore network errors for polling
      }
    };
    // Start polling if logged in
    if (localStorage.getItem('token')) {
      fetchOrdersAndBookings();
      timer = window.setInterval(fetchOrdersAndBookings, 15000);
    }
    return () => { if (timer) window.clearInterval(timer); };
  }, []);

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
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${apiBase}/orders/${orderId}/tracking`, { method: 'POST', headers, body: JSON.stringify(update) });
      if (res.ok) {
        const saved = await res.json();
        setOrders(prev => {
          const next = prev.map(o => o.id === saved._id || o.id === saved.id ? (saved as any) : o);
          try { localStorage.setItem('orders', JSON.stringify(next)); } catch { }
          try { window.dispatchEvent(new Event('app_data_updated')); } catch { }
          return next;
        });
        return;
      }
    } catch (err) {
      // fallback to local
    }

    const newUpdate = {
      ...update,
      id: Date.now().toString()
    };
    setOrders(prev => {
      const next = prev.map(order => order.id === orderId ? { ...order, trackingUpdates: [...(order.trackingUpdates || []), newUpdate], orderStatus: update.status as unknown as Order['orderStatus'] } : order);
      try { localStorage.setItem('orders', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
      try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
      return next;
    });
  };

  // Session slots stored per branch in localStorage key 'sessionSlots'
  const [sessionSlots, setSessionSlots] = useState<Record<string, ActivitySlots>>(() => {
    try {
      const raw = localStorage.getItem('sessionSlots');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return {};
  });

  // Keep bookings/orders/sessionSlots in sync across tabs and when custom updates are emitted
  useEffect(() => {
    const reload = () => {
      try {
        const rawB = localStorage.getItem('bookings');
        if (rawB) setBookings(JSON.parse(rawB));
      } catch { /* ignore */ }
      try {
        const rawO = localStorage.getItem('orders');
        if (rawO) setOrders(JSON.parse(rawO));
      } catch { /* ignore */ }
      try {
        const rawS = localStorage.getItem('sessionSlots');
        if (rawS) setSessionSlots(JSON.parse(rawS));
      } catch { /* ignore */ }
    };

    const storageHandler = (e: StorageEvent) => {
      if (!e.key || ['bookings', 'orders', 'sessionSlots'].includes(e.key)) reload();
    };
    const customHandler = () => reload();

    window.addEventListener('storage', storageHandler);
    window.addEventListener('app_data_updated', customHandler as EventListener);
    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('app_data_updated', customHandler as EventListener);
    };
  }, []);

  // version/timestamp to notify consumers of slot changes
  const [slotsVersion, setSlotsVersion] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('sessionSlotsVersion');
      if (raw) return Number(raw);
    } catch {
      /* ignore parse errors */
    }
    return Date.now();
  });

  const persistSlotsVersion = (v: number) => {
    try { localStorage.setItem('sessionSlotsVersion', String(v)); } catch { /* ignore */ }
  };

  const persistSlots = (slotsState: Record<string, ActivitySlots>) => {
    try {
      localStorage.setItem('sessionSlots', JSON.stringify(slotsState));
    } catch {
      // ignore
    }
  };

  // Per-branch availability settings (e.g., allowMonday)
  const [branchAvailability, setBranchAvailability] = useState<Record<string, { allowMonday: boolean }>>(() => {
    try {
      const raw = localStorage.getItem('branchAvailability');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    // default: allowMonday false except Vijayawada true as requested
    return {
      hyderabad: { allowMonday: false },
      vijayawada: { allowMonday: true },
      bangalore: { allowMonday: false }
    };
  });

  const persistBranchAvailability = (state: Record<string, { allowMonday: boolean }>) => {
    try {
      localStorage.setItem('branchAvailability', JSON.stringify(state));
    } catch {
      // ignore
    }
  };

  const getBranchAvailability = (branchId: string) => {
    return branchAvailability[branchId] || null;
  };

  const updateBranchAvailability = async (branchId: string, settings: { allowMonday: boolean }) => {
    setBranchAvailability(prev => {
      const next = { ...prev, [branchId]: settings };
      persistBranchAvailability(next);
      return next;
    });
  };

  const updateSlotsForDate = async (branchId: string, date: string, slots: { slime: Slot[]; tufting: Slot[] }) => {
    const key = branchId || 'global';
    setSessionSlots(prev => {
      const next = { ...prev };
      if (!next[key]) next[key] = {};
      next[key][date] = { ...slots };
      persistSlots(next);
      // bump version so consumers reload
      const v = Date.now();
      setSlotsVersion(v);
      persistSlotsVersion(v);
      return next;
    });
  };

  const getSlotsForDate = (branchId: string, date: string) => {
    const key = branchId || 'global';
    return (sessionSlots[key] && sessionSlots[key][date]) ? sessionSlots[key][date] : null;
  };
  return (
    <DataContext.Provider value={{
      branches: branchesState,
      // utility to get full branch metadata including razorpayKey
      getBranchById,
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
      ,
      updateSlotsForDate,
      getSlotsForDate
      ,
      getBranchAvailability,
      updateBranchAvailability
      ,
      slotsVersion
    }}>
      {children}
    </DataContext.Provider>
  );
};