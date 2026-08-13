window.ACHB_SUPABASE_CONFIG = {
  url: "https://tfcawfxeaivykpdvprkz.supabase.co",
  // Publishable/anon key — safe to ship in client-side code. All access is
  // gated by Row Level Security policies on the database side, never by
  // keeping this key secret.
  anonKey: "sb_publishable_HAayfFc3I7ErdZ4hlX638Q_rEJC6Jru",
};

window.ACHB_SUPABASE = window.supabase
  ? window.supabase.createClient(window.ACHB_SUPABASE_CONFIG.url, window.ACHB_SUPABASE_CONFIG.anonKey)
  : null;
