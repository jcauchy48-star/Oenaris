(function initializeOenarisAuth(global) {
  "use strict";

  const SUPABASE_CDN_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
  let supabaseClient = null;
  let clientPromise = null;

  function cleanString(value) {
    return String(value ?? "").trim();
  }

  function getCloudConfig() {
    const config = global.CAVE_CLOUD_CONFIG || {};
    const supabaseUrl = cleanString(config.supabaseUrl).replace(/\/$/, "");
    const supabaseAnonKey = cleanString(config.supabaseAnonKey);
    return {
      provider: config.provider || "supabase",
      supabaseUrl,
      supabaseAnonKey,
      enabled: Boolean(config.enabled !== false && supabaseUrl && supabaseAnonKey)
    };
  }

  function isCloudConfigured() {
    return getCloudConfig().enabled;
  }

  function createConfigurationError() {
    const error = new Error("Le service cloud Oenaris n'est pas configuré.");
    error.code = "CLOUD_NOT_CONFIGURED";
    return error;
  }

  async function loadSupabaseClient() {
    await global.CAVE_CLOUD_CONFIG_READY;
    if (!isCloudConfigured()) return null;
    if (supabaseClient) return supabaseClient;
    if (clientPromise) return clientPromise;

    clientPromise = (async () => {
      let createClient = global.supabase?.createClient;
      if (!createClient) {
        const module = await import(SUPABASE_CDN_URL);
        createClient = module.createClient;
      }

      const config = getCloudConfig();
      supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      return supabaseClient;
    })();

    try {
      return await clientPromise;
    } finally {
      clientPromise = null;
    }
  }

  function getSupabaseClient() {
    return supabaseClient;
  }

  function getEmailRedirectUrl() {
    return new URL("./index.html?tab=compte&mode=signin", global.location.href).href;
  }

  function getPasswordResetRedirectUrl() {
    return new URL("./index.html?tab=compte&mode=reset", global.location.href).href;
  }

  async function requireClient() {
    const client = await loadSupabaseClient();
    if (!client) throw createConfigurationError();
    return client;
  }

  async function signUpWithEmail(email, password, displayName = "") {
    const client = await requireClient();
    const { data, error } = await client.auth.signUp({
      email: cleanString(email).toLowerCase(),
      password,
      options: {
        data: { display_name: cleanString(displayName) },
        emailRedirectTo: getEmailRedirectUrl()
      }
    });
    if (error) throw error;
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      const existingAccountError = new Error("User already registered");
      existingAccountError.code = "USER_ALREADY_EXISTS";
      throw existingAccountError;
    }
    return data;
  }

  async function signInWithEmail(email, password) {
    const client = await requireClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: cleanString(email).toLowerCase(),
      password
    });
    if (error) throw error;
    return data;
  }

  async function resetPasswordForEmail(email) {
    const client = await requireClient();
    const { data, error } = await client.auth.resetPasswordForEmail(
      cleanString(email).toLowerCase(),
      { redirectTo: getPasswordResetRedirectUrl() }
    );
    if (error) throw error;
    return data;
  }

  async function resendConfirmationEmail(email) {
    const client = await requireClient();
    if (typeof client.auth.resend !== "function") {
      const error = new Error("Le renvoi de confirmation n'est pas disponible avec cette version du service de compte.");
      error.code = "RESEND_NOT_SUPPORTED";
      throw error;
    }
    const { data, error } = await client.auth.resend({
      type: "signup",
      email: cleanString(email).toLowerCase(),
      options: { emailRedirectTo: getEmailRedirectUrl() }
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const client = await requireClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async function getCurrentSession() {
    const client = await loadSupabaseClient();
    if (!client) return null;
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data?.session || null;
  }

  async function onAuthStateChanged(callback) {
    const client = await loadSupabaseClient();
    if (!client || typeof callback !== "function") return null;
    const subscription = client.auth.onAuthStateChange(callback);
    return subscription?.data?.subscription || subscription;
  }

  global.OenarisAuth = Object.freeze({
    getCloudConfig,
    isCloudConfigured,
    loadSupabaseClient,
    getSupabaseClient,
    signUpWithEmail,
    signInWithEmail,
    resetPasswordForEmail,
    resendConfirmationEmail,
    signOut,
    getCurrentSession,
    onAuthStateChanged
  });
  global.OenovaAuth = global.OenarisAuth;
})(window);
