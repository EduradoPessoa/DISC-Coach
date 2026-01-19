// Stripe Service Management
// NOTA: Em um ambiente de produção real, as chaves secretas (sk_live) 
// ficam apenas no servidor. O frontend usa apenas a chave pública (pk_live).

export const STRIPE_CONFIG = {
  publishableKey: 'pk_live_configura_sua_chave_publica_aqui',
  isMock: true // Define se usa simulação ou integração real
};

interface StripeSessionResponse {
  url: string;
  success: boolean;
  sessionId?: string;
}

/**
 * Inicia uma sessão de checkout.
 * No frontend, isso geralmente redireciona para o Stripe Hosted Checkout.
 */
export const createStripeCheckoutSession = async (amount: number, userEmail: string): Promise<StripeSessionResponse> => {
  console.log(`[Stripe Service] Solicitando checkout: R$ ${amount} para ${userEmail}`);
  
  // Simula o tempo de resposta do servidor
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulação de sucesso com redirecionamento para rota interna de sucesso
  // Em produção, isso seria a URL retornada pelo Stripe API (stripe.checkout.sessions.create)
  return {
    success: true,
    url: `#/checkout/success?session_id=mock_stripe_${Date.now()}`,
    sessionId: `cs_test_${Math.random().toString(36).substring(7)}`
  };
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
