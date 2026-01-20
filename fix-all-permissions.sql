-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Helper Function for Admin Check (prevents recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'saas-admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. USERS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Team Admins can view their team members" ON public.users;
DROP POLICY IF EXISTS "SaaS Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "SaaS Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Public can insert users" ON public.users;

-- Allow public insert (for registration/triggers) - or use service role
CREATE POLICY "Public can insert users" ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);

-- Basic: View own
CREATE POLICY "Users can view own profile" ON public.users
FOR SELECT USING (auth.uid() = id);

-- Basic: Update own
CREATE POLICY "Users can update own profile" ON public.users
FOR UPDATE USING (auth.uid() = id);

-- Team Admin: View members
CREATE POLICY "Team Admins can view their team members" ON public.users
FOR SELECT USING (invited_by = auth.uid()::text);

-- SaaS Admin: View All
CREATE POLICY "SaaS Admins can view all users" ON public.users
FOR SELECT USING (public.is_admin());

-- SaaS Admin: Update All
CREATE POLICY "SaaS Admins can update all users" ON public.users
FOR UPDATE USING (public.is_admin());

-- 2. ASSESSMENTS Policies
DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Team Admins can view team assessments" ON public.assessments;
DROP POLICY IF EXISTS "SaaS Admins can view all assessments" ON public.assessments;

CREATE POLICY "Users can view own assessments" ON public.assessments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Team Admins can view team assessments" ON public.assessments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = assessments.user_id
        AND invited_by = auth.uid()::text
    )
);

CREATE POLICY "SaaS Admins can view all assessments" ON public.assessments
FOR SELECT USING (public.is_admin());

-- 3. NOTIFICATIONS (Include from previous script)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. TRIGGER (Include from previous script)
CREATE OR REPLACE FUNCTION public.notify_saas_admin_on_invite()
RETURNS TRIGGER AS $$
DECLARE
    team_admin_email TEXT;
    saas_admin_record RECORD;
BEGIN
    IF NEW.invited_by IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT email INTO team_admin_email
    FROM public.users
    WHERE id = NEW.invited_by::uuid;

    IF team_admin_email IS NULL THEN
        RETURN NEW;
    END IF;

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
