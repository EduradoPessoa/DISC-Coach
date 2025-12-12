// In a real application, these calls would go to your backend, not directly to AbacatePay from the client.

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

export const createAbacatePaySession = async (amount: number, userEmail: string): Promise<CreateBillingResponse> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`Creating AbacatePay session for ${userEmail} amount ${amount}`);

  // In a real scenario, the backend would return a URL like: https://abacatepay.com/checkout/sess_123
  // Here we return our internal route to simulate the redirect back from the gateway.
  return {
    success: true,
    url: `/checkout/success?session_id=mock_abacate_${Date.now()}`
  };
};
