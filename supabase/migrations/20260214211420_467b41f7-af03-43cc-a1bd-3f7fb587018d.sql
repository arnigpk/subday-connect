
-- Enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin');

-- User roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Site pages table (content storage)
CREATE TABLE public.site_pages (
    id text PRIMARY KEY DEFAULT 'home',
    draft_ru jsonb DEFAULT '{}'::jsonb,
    published_ru jsonb DEFAULT '{}'::jsonb,
    draft_kz jsonb DEFAULT '{}'::jsonb,
    published_kz jsonb DEFAULT '{}'::jsonb,
    updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site pages" ON public.site_pages
FOR SELECT USING (true);

CREATE POLICY "Admins can update site pages" ON public.site_pages
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site pages" ON public.site_pages
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Partner leads table
CREATE TABLE public.partner_leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    city text NOT NULL,
    phone text NOT NULL,
    venue text NOT NULL,
    comment text DEFAULT '',
    status text DEFAULT 'new',
    note text DEFAULT ''
);
ALTER TABLE public.partner_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead" ON public.partner_leads
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read leads" ON public.partner_leads
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads" ON public.partner_leads
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads" ON public.partner_leads
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Site settings table
CREATE TABLE public.site_settings (
    id text PRIMARY KEY DEFAULT 'main',
    telegram_enabled boolean DEFAULT false,
    telegram_bot_token text DEFAULT '',
    telegram_chat_id text DEFAULT '',
    updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read settings" ON public.site_settings
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings" ON public.site_settings
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert settings" ON public.site_settings
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles RLS
CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Anyone can view media" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Seed default content
INSERT INTO public.site_pages (id) VALUES ('home') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.site_settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_pages_updated_at
BEFORE UPDATE ON public.site_pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
