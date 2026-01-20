-- 1. Corrigir Políticas de Acesso para Team Admins (Garantir visualização do time)
DROP POLICY IF EXISTS "Team Admins can view their team members" ON public.users;
CREATE POLICY "Team Admins can view their team members" ON public.users
    FOR SELECT USING (invited_by = auth.uid()::text OR id = auth.uid());

DROP POLICY IF EXISTS "Team Admins can view team assessments" ON public.assessments;
CREATE POLICY "Team Admins can view team assessments" ON public.assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = assessments.user_id
            AND invited_by = auth.uid()::text
        )
    );

DROP POLICY IF EXISTS "Team Admins can view team focus areas" ON public.focus_areas;
CREATE POLICY "Team Admins can view team focus areas" ON public.focus_areas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = focus_areas.user_id
            AND invited_by = auth.uid()::text
        )
    );

-- 2. Sistema de Notificações
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para Notificações
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 3. Trigger para Notificar SaaS Admin sobre novos convites
CREATE OR REPLACE FUNCTION public.notify_saas_admin_on_invite()
RETURNS TRIGGER AS $$
DECLARE
    team_admin_email TEXT;
    saas_admin_record RECORD;
BEGIN
    -- Busca o email do Admin de Time que criou o convite
    -- Assume que invited_by contém o ID do usuário
    IF NEW.invited_by IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT email INTO team_admin_email
    FROM public.users
    WHERE id = NEW.invited_by::uuid;

    -- Se não encontrar (ex: convite criado pelo próprio sistema ou erro), ignora
    IF team_admin_email IS NULL THEN
        RETURN NEW;
    END IF;

    -- Notifica todos os SaaS Admins
    FOR saas_admin_record IN 
        SELECT id FROM public.users WHERE role = 'saas-admin'
    LOOP
        INSERT INTO public.notifications (user_id, title, message)
        VALUES (
            saas_admin_record.id,
            'Novo Convite de Time',
            'O Admin de Time ' || team_admin_email || ' gerou um novo link de convite.'
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_invite_created ON public.invitations;
CREATE TRIGGER on_invite_created
    AFTER INSERT ON public.invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_saas_admin_on_invite();
