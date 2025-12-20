import { apiRequest } from './api';

interface CreateBillingResponse {
  url: string;
  success: boolean;
}

// Mock database of coupons
const VALID_COUPONS: Record<string, number> = {
  'WELCOME5': 5,
  'LEVELC20': 20,
  'DISC50': 50,
  'FULLACCESS': 100
};

export const validateCoupon = async (code: string): Promise<{ valid: boolean; discount: number; message?: string }> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));

  const normalizedCode = code.toUpperCase().trim();
  
  if (VALID_COUPONS.hasOwnProperty(normalizedCode)) {
    return { 
      valid: true, 
      discount: VALID_COUPONS[normalizedCode] 
    };
  }

  return { 
    valid: false, 
    discount: 0,
    message: "Invalid or expired coupon code." 
  };
};

export const createAbacatePaySession = async (amount: number, userEmail: string, plan: string): Promise<CreateBillingResponse> => {
  try {
      // Call backend to generate the session securely using the stored API Key
      const response = await apiRequest('/payment/create_checkout.php', 'POST', {
          amount,
          email: userEmail,
          plan
      });

      if (response && response.url) {
          return { success: true, url: response.url };
      } else {
          throw new Error("Invalid response from payment server");
      }
  } catch (error) {
      console.error("Payment creation failed:", error);
      // Fallback for dev/demo if backend fails (e.g. no key configured)
      // In prod, this should just fail.
      return {
        success: false,
        url: '' // Error handling in UI
      };
  }
};
