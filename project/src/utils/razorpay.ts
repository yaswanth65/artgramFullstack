export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    // Keep typing flexible; we'll cast to any when invoking
    Razorpay: unknown;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  // In a real application, this would be an API call to your backend
  // For demo purposes, we'll simulate the order creation
  return {
    id: `order_${Date.now()}`,
    amount: amount * 100, // Razorpay expects amount in paise
    currency,
    status: 'created'
  };
};
export const initiatePayment = async (options: Omit<RazorpayOptions, 'key'> & { key?: string }) => {
  const isLoaded = await loadRazorpayScript();
  
  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load');
  }
  const razorpayOptions: RazorpayOptions = {
    key: options.key || 'rzp_test_1234567890', // fallback test key
    ...options
  };

  // If you need to pass merchant account id or notes for server-side transfers,
  // create the order on the server using the branch's Razorpay account and include
  // the appropriate account id/transfer instructions. Client-side we can only
  // switch publishable keys to simulate directing payments to different accounts.
  type RazorpayCtorType = new (opts: Record<string, unknown>) => { open: () => void };
  const RazorpayCtor = (window.Razorpay as unknown) as RazorpayCtorType;
  const razorpay = new RazorpayCtor(razorpayOptions as unknown as Record<string, unknown>);
  razorpay.open();
};