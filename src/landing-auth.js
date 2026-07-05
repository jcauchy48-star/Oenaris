(function initializeLandingAuth(global) {
  "use strict";

  const auth = global.OenovaAuth;
  const elements = {
    panel: document.querySelector("#landingAuthPanel"),
    tabsContainer: document.querySelector(".landing-auth-tabs"),
    formsContainer: document.querySelector(".landing-auth-forms"),
    tabs: document.querySelectorAll("[data-landing-auth-tab]"),
    forms: document.querySelectorAll("[data-landing-auth-form]"),
    signUpForm: document.querySelector("#landingSignUpForm"),
    signInForm: document.querySelector("#landingSignInForm"),
    signUpName: document.querySelector("#landingSignUpName"),
    signUpEmail: document.querySelector("#landingSignUpEmail"),
    signUpPassword: document.querySelector("#landingSignUpPassword"),
    signUpConfirmation: document.querySelector("#landingSignUpConfirmation"),
    signInEmail: document.querySelector("#landingSignInEmail"),
    signInPassword: document.querySelector("#landingSignInPassword"),
    status: document.querySelector("#landingAuthStatus"),
    sessionPanel: document.querySelector("#landingSessionPanel"),
    sessionEmail: document.querySelector("#landingSessionEmail"),
    signOutButton: document.querySelector("#landingSignOutButton"),
    entryPoints: document.querySelectorAll("[data-landing-auth-open]"),
    sessionOnly: document.querySelectorAll("[data-auth-session-only]"),
    anonymousOnly: document.querySelectorAll("[data-auth-anonymous-only]"),
    sessionEmails: document.querySelectorAll("[data-session-email]")
  };

  if (!auth || !elements.panel) return;

  function setStatus(message = "", type = "info") {
    elements.status.textContent = message;
    elements.status.dataset.status = type;
  }

  function setBusy(isBusy) {
    elements.panel.classList.toggle("is-busy", isBusy);
    elements.panel.querySelectorAll("button, input").forEach((control) => {
      control.disabled = isBusy;
    });
  }

  function setActiveMode(mode) {
    const nextMode = mode === "signin" ? "signin" : "signup";
    elements.tabs.forEach((tab) => {
      const isActive = tab.dataset.landingAuthTab === nextMode;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    elements.forms.forEach((form) => {
      form.hidden = form.dataset.landingAuthForm !== nextMode;
    });
    setStatus("");
  }

  function getFriendlyError(error) {
    const raw = String(error?.message || error || "").toLowerCase();
    if (error?.code === "CLOUD_NOT_CONFIGURED") return "Le service de compte Oenaris n'est pas configuré. L'accès à l'application est temporairement indisponible.";
    if (raw.includes("invalid login credentials")) return "Email ou mot de passe incorrect.";
    if (raw.includes("email not confirmed") || raw.includes("not confirmed")) return "Votre adresse email doit être confirmée avant la connexion.";
    if (raw.includes("already registered") || raw.includes("user already exists")) return "Un compte existe déjà avec cette adresse. Utilisez l'onglet Se connecter.";
    if (raw.includes("valid email") || raw.includes("invalid email")) return "Saisissez une adresse email valide.";
    if (raw.includes("password") && (raw.includes("short") || raw.includes("least"))) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (raw.includes("failed to fetch") || raw.includes("network") || raw.includes("load failed")) return "Le service est momentanément inaccessible. Vérifiez votre connexion puis réessayez.";
    if (raw.includes("rate limit") || raw.includes("too many")) return "Trop de tentatives rapprochées. Patientez quelques instants avant de réessayer.";
    return "L'opération n'a pas abouti. Réessayez dans quelques instants.";
  }

  function showSignedInSession(session) {
    const isSignedIn = Boolean(
      session?.user?.id
      && session?.access_token
      && (!session.expires_at || Number(session.expires_at) > Math.floor(Date.now() / 1000))
    );
    const email = session?.user?.email || "Compte Oenaris connecté";
    elements.sessionPanel.hidden = !isSignedIn;
    elements.tabsContainer.hidden = isSignedIn;
    elements.formsContainer.hidden = isSignedIn;
    elements.sessionOnly.forEach((element) => { element.hidden = !isSignedIn; });
    elements.anonymousOnly.forEach((element) => { element.hidden = isSignedIn; });
    elements.sessionEmails.forEach((element) => { element.textContent = isSignedIn ? email : ""; });
    if (isSignedIn) {
      elements.sessionEmail.textContent = email;
      setStatus("Votre compte est connecté. Passez à l'onglet Installer pour installer ou ouvrir Oenaris.", "success");
    }
  }

  async function handleSignUp(event) {
    event.preventDefault();
    const displayName = elements.signUpName.value.trim();
    const email = elements.signUpEmail.value.trim().toLowerCase();
    const password = elements.signUpPassword.value;
    const confirmation = elements.signUpConfirmation.value;

    if (!displayName) return setStatus("Indiquez le nom à afficher sur votre compte.", "error");
    if (!elements.signUpEmail.validity.valid) return setStatus("Saisissez une adresse email valide.", "error");
    if (password.length < 8) return setStatus("Le mot de passe doit contenir au moins 8 caractères.", "error");
    if (password !== confirmation) return setStatus("Les deux mots de passe sont différents.", "error");

    setBusy(true);
    setStatus("Création de votre compte…", "info");
    try {
      const data = await auth.signUpWithEmail(email, password, displayName);
      if (data?.session) {
        elements.signUpForm.reset();
        showSignedInSession(data.session);
        return;
      }
      elements.signUpForm.reset();
      setActiveMode("signin");
      elements.signInEmail.value = email;
      setStatus("Compte créé. Vérifiez votre email pour confirmer votre adresse, puis connectez-vous.", "success");
    } catch (error) {
      setStatus(getFriendlyError(error), "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignIn(event) {
    event.preventDefault();
    const email = elements.signInEmail.value.trim().toLowerCase();
    const password = elements.signInPassword.value;
    if (!elements.signInEmail.validity.valid) return setStatus("Saisissez une adresse email valide.", "error");
    if (!password) return setStatus("Saisissez votre mot de passe.", "error");

    setBusy(true);
    setStatus("Connexion à votre espace…", "info");
    try {
      const data = await auth.signInWithEmail(email, password);
      elements.signInForm.reset();
      showSignedInSession(data?.session || data);
    } catch (error) {
      setStatus(getFriendlyError(error), "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await auth.signOut();
      sessionStorage.removeItem(global.OenovaLandingTabs?.INSTALL_FLOW_KEY || "oenova-install-flow-confirmed");
      showSignedInSession(null);
      setActiveMode("signin");
      setStatus("Vous êtes déconnecté.", "success");
    } catch (error) {
      setStatus(getFriendlyError(error), "error");
    } finally {
      setBusy(false);
    }
  }

  async function start() {
    elements.tabs.forEach((tab) => {
      tab.addEventListener("click", () => setActiveMode(tab.dataset.landingAuthTab));
    });
    elements.entryPoints.forEach((entryPoint) => {
      entryPoint.addEventListener("click", () => setActiveMode(entryPoint.dataset.landingAuthOpen));
    });
    elements.signUpForm.addEventListener("submit", handleSignUp);
    elements.signInForm.addEventListener("submit", handleSignIn);
    elements.signOutButton.addEventListener("click", handleSignOut);
    const requestedMode = new URLSearchParams(global.location.search).get("mode");
    setActiveMode(requestedMode === "signin" ? "signin" : "signup");

    await global.CAVE_CLOUD_CONFIG_READY;
    if (!auth.isCloudConfigured()) {
      showSignedInSession(null);
      setStatus("Le service de compte Oenaris n'est pas configuré. L'accès à l'application est temporairement indisponible.", "error");
      return;
    }

    try {
      const session = await auth.getCurrentSession();
      showSignedInSession(session);
      await auth.onAuthStateChanged((_event, nextSession) => showSignedInSession(nextSession));
    } catch (error) {
      setStatus(getFriendlyError(error), "error");
    }
  }

  start();
})(window);
