"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { isConfigured, supabase } from "./supabase";

// undefined = still loading, null = signed out
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(
    isConfigured ? undefined : null,
  );

  useEffect(() => {
    if (!isConfigured) return;
    const auth = supabase().auth;
    auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return session;
}
