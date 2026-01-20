-- Função para marcar convite como usado (SECURITY DEFINER para permitir que usuários comuns atualizem)
CREATE OR REPLACE FUNCTION public.redeem_invite(invite_token TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.invitations
  SET used = true, used_at = NOW()
  WHERE token = invite_token AND used = false;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Convite inválido ou já utilizado';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
