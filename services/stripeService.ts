// Stripe Service Management (Professional Frontend Integration)
// AVISO: NUNCA coloque sua Secret Key (sk_...) aqui.
// Use apenas sua Publishable Key (pk_...). A Secret Key deve ser gerenciada
// via KMS no backend para garantir a conformidade PCI/DSS.

export const STRIPE_CONFIG = {
  // Use sua Publishable Key do Dashboard do Stripe
  publishableKey: 'pk_test_6p36nNoQG2mCWp6Z59DxSjWv', 
  isMock: false
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
 */
export const createStripeCheckoutSession = async (amount: number, userEmail: string): Promise<StripeSessionResponse> => {
  console.log(`[Stripe] Iniciando checkout seguro para ${userEmail}`);
  
  try {
    const stripe = getStripe();
    if (!stripe) {
      throw new Error("Stripe SDK não carregado. Verifique se o script js.stripe.com/v3/ está no seu index.html.");
    }

    // SIMULAÇÃO DE CHAMADA AO BACKEND (Ponto de Integração com KMS)
    // Em produção: 
    // const response = await fetch('https://api.seubackend.com/v1/stripe/checkout', {
    //   method: 'POST',
    //   body: JSON.stringify({ amount, email: userEmail })
    // });
    // const { sessionId } = await response.json();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Para esta demonstração frontend-only, simulamos o redirecionamento.
    // await stripe.redirectToCheckout({ sessionId });
    
    return {
      success: true,
      url: `#/checkout/success?session_id=mock_stripe_safe_${Date.now()}`
    };
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
    'VIP2024': 15
  };

  await new Promise(resolve => setTimeout(resolve, 400));
  const normalized = code.toUpperCase().trim();
  
  if (promoCodes[normalized]) {
    return { valid: true, discount: promoCodes[normalized] };
  }
  
  return { valid: false, discount: 0 };
};
