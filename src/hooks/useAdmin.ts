import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const checkedRef = useRef(false);

  const checkRole = async (uid: string) => {
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', uid);
    const hasAdmin = roles?.some((r: { role: string }) => r.role === 'admin');
    setUserId(uid);
    setIsAdmin(!!hasAdmin);
    setLoading(false);
  };

  useEffect(() => {
    // Immediately check existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkedRef.current = true;
        checkRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setIsAdmin(false);
        setUserId(null);
        setLoading(false);
        return;
      }
      // Skip if already checked on mount
      if (checkedRef.current) {
        checkedRef.current = false;
        return;
      }
      checkRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { isAdmin, loading, userId, signOut };
}
