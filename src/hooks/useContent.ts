import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { SiteContent } from '@/lib/types';
import { getDefaultContent } from '@/lib/defaultContent';

export function useContent(type: 'published' | 'draft' = 'published') {
  const { lang } = useLanguage();

  return useQuery({
    queryKey: ['site-content', lang, type],
    queryFn: async (): Promise<SiteContent> => {
      const { data, error } = await supabase
        .from('site_pages')
        .select('*')
        .eq('id', 'home')
        .single();

      if (error || !data) {
        return getDefaultContent(lang);
      }

      const column = `${type}_${lang}` as string;
      const content = (data as Record<string, unknown>)[column] as SiteContent | null;

      if (!content || !content.sections?.length) {
        return getDefaultContent(lang);
      }

      return content;
    },
  });
}
