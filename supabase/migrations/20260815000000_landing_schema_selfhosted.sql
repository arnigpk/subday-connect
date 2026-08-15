-- Перенос базы лендинга subday.app с Lovable Cloud на наш сервер.
--
-- Кладём в ОТДЕЛЬНУЮ схему landing, а не в public. Причина простая: у сайта свои
-- user_roles, app_role и has_role — и всё это уже занято приложением, где роли
-- совсем другие (partner, barista, moderator…). В общей схеме они бы столкнулись,
-- а слить их в одну сущность нельзя: админ сайта и админ приложения — разные люди
-- и разные права. Отдельная схема разводит их полностью, при этом сервер один.
--
-- Клиент сайта обращается к схеме через db.schema = 'landing', поэтому имена
-- таблиц в коде остаются прежними и править запросы не пришлось.

CREATE SCHEMA IF NOT EXISTS landing;

-- Доступ для API: без этого PostgREST схему не увидит.
GRANT USAGE ON SCHEMA landing TO anon, authenticated, service_role;

DO $$ BEGIN
  CREATE TYPE landing.app_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Роли администраторов сайта ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS landing.user_roles (
    id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role    landing.app_role NOT NULL DEFAULT 'admin',
    UNIQUE (user_id, role)
);
ALTER TABLE landing.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own roles" ON landing.user_roles;
CREATE POLICY "Users can read own roles" ON landing.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Проверка роли. search_path прибит гвоздями — иначе SECURITY DEFINER можно
-- обмануть подменой схемы.
CREATE OR REPLACE FUNCTION landing.has_role(_user_id uuid, _role landing.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = landing, public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM landing.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ─── Содержимое страниц ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS landing.site_pages (
    id            text PRIMARY KEY DEFAULT 'home',
    draft_ru      jsonb DEFAULT '{}'::jsonb,
    published_ru  jsonb DEFAULT '{}'::jsonb,
    draft_kz      jsonb DEFAULT '{}'::jsonb,
    published_kz  jsonb DEFAULT '{}'::jsonb,
    updated_at    timestamptz DEFAULT now()
);
ALTER TABLE landing.site_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read site pages" ON landing.site_pages;
CREATE POLICY "Anyone can read site pages" ON landing.site_pages
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update site pages" ON landing.site_pages;
CREATE POLICY "Admins can update site pages" ON landing.site_pages
FOR UPDATE TO authenticated USING (landing.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert site pages" ON landing.site_pages;
CREATE POLICY "Admins can insert site pages" ON landing.site_pages
FOR INSERT TO authenticated WITH CHECK (landing.has_role(auth.uid(), 'admin'));

-- ─── Заявки партнёров ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS landing.partner_leads (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name       text NOT NULL,
    city       text NOT NULL,
    phone      text NOT NULL,
    venue      text NOT NULL,
    comment    text DEFAULT '',
    status     text DEFAULT 'new',
    note       text DEFAULT ''
);
ALTER TABLE landing.partner_leads ENABLE ROW LEVEL SECURITY;

-- Заявку может оставить кто угодно — это форма на публичной странице.
DROP POLICY IF EXISTS "Anyone can submit a lead" ON landing.partner_leads;
CREATE POLICY "Anyone can submit a lead" ON landing.partner_leads
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read leads" ON landing.partner_leads;
CREATE POLICY "Admins can read leads" ON landing.partner_leads
FOR SELECT TO authenticated USING (landing.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update leads" ON landing.partner_leads;
CREATE POLICY "Admins can update leads" ON landing.partner_leads
FOR UPDATE TO authenticated USING (landing.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete leads" ON landing.partner_leads;
CREATE POLICY "Admins can delete leads" ON landing.partner_leads
FOR DELETE TO authenticated USING (landing.has_role(auth.uid(), 'admin'));

-- ─── Настройки сайта ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS landing.site_settings (
    id                 text PRIMARY KEY DEFAULT 'main',
    telegram_enabled   boolean DEFAULT false,
    telegram_bot_token text DEFAULT '',
    telegram_chat_id   text DEFAULT '',
    updated_at         timestamptz DEFAULT now()
);
ALTER TABLE landing.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read settings" ON landing.site_settings;
CREATE POLICY "Admins can read settings" ON landing.site_settings
FOR SELECT TO authenticated USING (landing.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update settings" ON landing.site_settings;
CREATE POLICY "Admins can update settings" ON landing.site_settings
FOR UPDATE TO authenticated USING (landing.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert settings" ON landing.site_settings;
CREATE POLICY "Admins can insert settings" ON landing.site_settings
FOR INSERT TO authenticated WITH CHECK (landing.has_role(auth.uid(), 'admin'));

-- ─── Обновление updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION landing.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = landing, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS touch_site_pages ON landing.site_pages;
CREATE TRIGGER touch_site_pages BEFORE UPDATE ON landing.site_pages
FOR EACH ROW EXECUTE FUNCTION landing.touch_updated_at();

DROP TRIGGER IF EXISTS touch_site_settings ON landing.site_settings;
CREATE TRIGGER touch_site_settings BEFORE UPDATE ON landing.site_settings
FOR EACH ROW EXECUTE FUNCTION landing.touch_updated_at();

-- ─── Хранилище для картинок админки ──────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "landing media public read" ON storage.objects;
CREATE POLICY "landing media public read" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "landing media admin insert" ON storage.objects;
CREATE POLICY "landing media admin insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND landing.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "landing media admin update" ON storage.objects;
CREATE POLICY "landing media admin update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'media' AND landing.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "landing media admin delete" ON storage.objects;
CREATE POLICY "landing media admin delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'media' AND landing.has_role(auth.uid(), 'admin'));

-- ─── Права для API ───────────────────────────────────────────────────────────
-- Чтение страниц и приём заявок доступны без входа: страницу видят все, форму
-- заполняют гости. Остальное закрыто политиками выше.
GRANT SELECT ON landing.site_pages TO anon, authenticated;
GRANT INSERT ON landing.partner_leads TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON landing.partner_leads TO authenticated;
GRANT SELECT, INSERT, UPDATE ON landing.site_pages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON landing.site_settings TO authenticated;
GRANT SELECT ON landing.user_roles TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA landing TO service_role;
