// Подключение к нашей базе на api.subday.app.
//
// Таблицы сайта живут в отдельной схеме landing: в общей public их имена
// (user_roles, app_role, has_role) столкнулись бы с приложением, где роли
// совсем другие. Схема указана здесь один раз, поэтому в коде запросы
// остались прежними — from('site_pages') и так далее.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  db: { schema: 'landing' },
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});