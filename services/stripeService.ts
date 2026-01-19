// Stripe Service Management (Professional Frontend Integration)
// AVISO: NUNCA coloque sua Secret Key (sk_...) aqui.
// Use apenas sua Publishable Key (pk_...). A Secret Key deve ser gerenciada
// via KMS no backend para garantir a conformidade PCI/DSS.

export const STRIPE_CONFIG = {
  // Use sua Publishable Key do Dashboard do Stripe
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_6p36nNoQG2mCWp6Z59DxSjWv', 
  isMock: true // Modo mokado para desenvolvimento
};

// Singleton para o Stripe Instance
let stripePromise: any = null;

const getStripe = () => {
  if (!stripePromise && (window as any).Stripe) {
    stripePromise = (window as any).Stripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

interface StripeSessionResponse {
  url?: string;
  success: boolean;
  error?: string;
  sessionId?: string;
}

/**
 * Inicia o fluxo de pagamento do Stripe Checkout (Hosted).
 * Implementação Frontend profissional: o ID da sessão deve vir do seu backend.
 * Versão mokada para desenvolvimento - simula pagamento bem-sucedido
 */
export const createStripeCheckoutSession = async (amount: number, userEmail: string): Promise<StripeSessionResponse> => {
  console.log(`[Stripe Mock] Iniciando checkout para ${userEmail} - Valor: R$ ${amount}`);
  
  try {
    if (!STRIPE_CONFIG.isMock) {
      const stripe = getStripe();
      if (!stripe) {
        throw new Error("Stripe SDK não carregado. Verifique se o script js.stripe.com/v3/ está no seu index.html.");
      }
    }

    // Simula processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simula sucesso do pagamento (90% de chance)
    const success = Math.random() > 0.1;
    
    if (success) {
      console.log(`[Stripe Mock] Pagamento simulado com sucesso para ${userEmail}`);
      return {
        success: true,
        url: `#/checkout/success?session_id=mock_stripe_${Date.now()}&email=${encodeURIComponent(userEmail)}`
      };
    } else {
      console.log(`[Stripe Mock] Pagamento simulado falhou para ${userEmail}`);
      return {
        success: false,
        error: "Pagamento recusado. Tente outro método de pagamento."
      };
    }
    
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return {
      success: false,
      error: err.message || "Erro ao conectar com o provedor de pagamentos."
    };
  }
};

/**
 * Validação de cupons promocionais
 */
export const validatePromoCode = async (code: string): Promise<{ valid: boolean; discount: number }> => {
  const promoCodes: Record<string, number> = {
    'LEVELC100': 100,
    'STRIPE20': 20,
    'EXECUTIVE': 50,
    'VIP2024': 15,
    'DISC2024': 25,
    'COACH50': 50
  };

  await new Promise(resolve => setTimeout(resolve, 400));
  const normalized = code.toUpperCase().trim();
  
  if (promoCodes[normalized]) {
    return { valid: true, discount: promoCodes[normalized] };
  }
  
  return { valid: false, discount: 0 };
};

/**
 * Simula o processamento de um pagamento com cartão de crédito
 * Usado para testes e desenvolvimento
 */
export const processMockPayment = async (paymentData: {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  email: string;
}): Promise<{
  success: boolean;
  transactionId?: string;
  error?: string;
}> => {
  console.log(`[Stripe Mock] Processando pagamento mokado para ${paymentData.email}`);
  
  // Validações básicas
  if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
    return { success: false, error: "Número do cartão inválido" };
  }
  
  if (!paymentData.cvv || paymentData.cvv.length < 3) {
    return { success: false, error: "CVV inválido" };
  }
  
  // Simula processamento
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simula sucesso (85% de chance)
  const success = Math.random() > 0.15;
  
  if (success) {
    const transactionId = `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[Stripe Mock] Pagamento aprovado - Transação: ${transactionId}`);
    return {
      success: true,
      transactionId
    };
  } else {
    console.log(`[Stripe Mock] Pagamento recusado`);
    return {
      success: false,
      error: "Cartão recusado. Tente outro cartão ou método de pagamento."
    };
  }
};