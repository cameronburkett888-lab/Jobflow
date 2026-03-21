import { useState, useRef, useEffect } from "react";

// ── ICONS ─────────────────────────────────────────────────────────────────────
const BellIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>;
const WrenchIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>;
const UsersIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
const MicIcon = ({c="currentColor",s=24}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8"/></svg>;
const CheckIcon = ({c="currentColor",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>;
const XIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const PhoneIcon = ({c="currentColor",s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;
const AlertIcon = ({c="#ef4444",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>;
const ClockIcon = ({c="#eab308",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>;
const InfoIcon = ({c="#3b82f6",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>;
const ZapIcon = ({c="#f5a623",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const ChevronIcon = ({c="#6b7280",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>;
const PlusIcon = ({c="#0f1117",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>;
const FilterIcon = ({c="currentColor",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M4 6h16M7 12h10M10 18h4"/></svg>;
const SearchIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const FileIcon = ({c="currentColor",s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>;
const MenuIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
const UserCircleIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662"/></svg>;
const CreditCardIcon = ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const GlobeIcon = ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const LogOutIcon = ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
const TrashIcon = ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>;
const ChevronRightIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>;
const DollarIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const EyeIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg>;

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const LANG = {
  en: {
    jobs:"Jobs", alerts:"Alerts", contacts:"Contacts",
    addJob:"Add Job", voiceAdd:"Voice Add",
    moneyOwed:"Money Owed", collected:"Collected", openQuotes:"Open Quotes", upcoming:"Upcoming",
    paidJobs:"paid jobs", awaiting:"awaiting", scheduled:"scheduled",
    tapFilter:"tap to filter", allJobs:"All Jobs", aiAlerts:"AI Alerts",
    searchPlaceholder:"Search jobs or contacts...",
    noJobsMatch: q=>`No jobs matching "${q}"`,
    noAlerts:"All caught up — no active alerts.",
    noContacts: q=>`No contacts matching "${q}"`,
    noJobsYet:"No jobs yet. Tap + Add Job to get started.",
    status:"Status", call:"Call", remind:"Remind", invoice:"Invoice",
    statusOptions:["unpaid","quoted","scheduled","paid","overdue"],
    statusLabels:{unpaid:"Unpaid",quoted:"Quoted",scheduled:"Scheduled",paid:"Paid",overdue:"Overdue"},
    doneTalking:"Done Talking", cancel:"Cancel", saveJob:"Save Job", close:"Close",
    clientName:"Client Name", jobType:"Job Type", amountDollar:"Amount ($)", date:"Date",
    phone:"Phone (optional)", fillManually:"Fill in the details manually",
    newJob:"New Job", confirmJob:"Confirm Job Entry",
    aiPulled:"AI pulled these details. Edit anything before saving.",
    sayLike:'Say something like:', exampleVoice:'"Dave Martinez owes $1,200 for electrical panel, call scheduled for Friday"',
    aiProcessing:"AI Processing...", pullingDetails:"Pulling job details from what you said...",
    micError:"Mic Error", gotIt:"Got It", downloadSend:"Download / Send Invoice",
    alertDismissed:"Alert dismissed", undo:"Undo", results: q=>`Results for "${q}"`,
    clearFilter:"Clear ×",
    edit:"Edit", editJob:"Edit Job", saveChanges:"Save Changes", editJobSub:"Update any details below.",
    settings:"Settings",
    account:"Account",
    businessName:"Business Name", emailAddress:"Email Address",
    editProfile:"Edit Profile",
    signOut:"Sign Out", deleteAccount:"Delete Account",
    subscription:"Subscription",
    currentPlan:"Current Plan", proPlan:"Pro Plan – $29/mo",
    cancelSubscription:"Cancel Subscription",
    cancelQ:"Cancel subscription?",
    cancelMsg:"You'll lose access to JobFlow at the end of your current billing period. This cannot be undone.",
    keepPlan:"Keep My Plan", yesCancelSub:"Yes, Cancel",
    accessibility:"Accessibility & Language",
    language:"Language", english:"English", spanish:"Español",
    appVersion:"JobFlow v9.0",
    signOutQ:"Sign out of JobFlow?",
    signOutMsg:"You'll need to log back in to access your jobs and data.",
    signOutYes:"Sign Out",
    deleteAccountQ:"Delete your account?",
    deleteAccountMsg:"This will permanently delete your account and ALL your job data. This cannot be undone.",
    deleteYes:"Permanently Delete",
    subCancelled:"Subscription Cancelled",
    subCancelledMsg:"Your Pro plan will remain active until the end of your billing period. You won't be charged again.",
    signedOut:"Signed Out",
    signedOutMsg:"You've been signed out. See you next time!",
    // Payment tracking
    addPayment:"Add Payment",
    paymentAmount:"Payment Amount ($)",
    collected2:"Collected",
    remaining:"Remaining",
    paymentHistory:"Payment History",
    logPayment:"Log Payment",
    fullPayment:"Mark Fully Paid",
    partialPayment:"Partial Payment",
    // Login
    welcomeBack:"Welcome Back",
    loginSub:"Sign in to your JobFlow account",
    emailLabel:"Email",
    passwordLabel:"Password",
    signIn:"Sign In",
    noAccount:"Don't have an account?",
    signUp:"Sign up free",
    forgotPassword:"Forgot password?",
    createAccount:"Create Account",
    createSub:"Start tracking jobs and getting paid",
    fullName:"Full Name",
    businessNameLabel:"Business Name",
    alreadyHave:"Already have an account?",
    demoMode:"Try Demo (no sign-in required)",
  },
  es: {
    jobs:"Trabajos", alerts:"Alertas", contacts:"Contactos",
    addJob:"Agregar Trabajo", voiceAdd:"Voz",
    moneyOwed:"Dinero Adeudado", collected:"Cobrado", openQuotes:"Cotizaciones", upcoming:"Próximos",
    paidJobs:"trabajos pagados", awaiting:"en espera", scheduled:"programados",
    tapFilter:"toca para filtrar", allJobs:"Todos", aiAlerts:"Alertas de IA",
    searchPlaceholder:"Buscar trabajos o contactos...",
    noJobsMatch: q=>`Sin trabajos que coincidan con "${q}"`,
    noAlerts:"Todo al día — sin alertas activas.",
    noContacts: q=>`Sin contactos que coincidan con "${q}"`,
    noJobsYet:"Sin trabajos. Toca + Agregar Trabajo para empezar.",
    status:"Estado", call:"Llamar", remind:"Recordar", invoice:"Factura",
    statusOptions:["unpaid","quoted","scheduled","paid","overdue"],
    statusLabels:{unpaid:"Sin Pagar",quoted:"Cotizado",scheduled:"Programado",paid:"Pagado",overdue:"Vencido"},
    doneTalking:"Listo", cancel:"Cancelar", saveJob:"Guardar Trabajo", close:"Cerrar",
    clientName:"Nombre del Cliente", jobType:"Tipo de Trabajo", amountDollar:"Monto ($)", date:"Fecha",
    phone:"Teléfono (opcional)", fillManually:"Llena los detalles manualmente",
    newJob:"Nuevo Trabajo", confirmJob:"Confirmar Trabajo",
    aiPulled:"IA extrajo estos detalles. Edita antes de guardar.",
    sayLike:'Di algo como:', exampleVoice:'"Dave Martinez debe $1,200 por panel eléctrico"',
    aiProcessing:"Procesando con IA...", pullingDetails:"Extrayendo detalles del trabajo...",
    micError:"Error de Micrófono", gotIt:"Entendido", downloadSend:"Descargar / Enviar Factura",
    alertDismissed:"Alerta descartada", undo:"Deshacer", results: q=>`Resultados para "${q}"`,
    clearFilter:"Limpiar ×",
    edit:"Editar", editJob:"Editar Trabajo", saveChanges:"Guardar Cambios", editJobSub:"Actualiza los detalles.",
    settings:"Configuración",
    account:"Cuenta",
    businessName:"Nombre del Negocio", emailAddress:"Correo Electrónico",
    editProfile:"Editar Perfil",
    signOut:"Cerrar Sesión", deleteAccount:"Eliminar Cuenta",
    subscription:"Suscripción",
    currentPlan:"Plan Actual", proPlan:"Plan Pro – $29/mes",
    cancelSubscription:"Cancelar Suscripción",
    cancelQ:"¿Cancelar suscripción?",
    cancelMsg:"Perderás acceso a JobFlow al final de tu período de facturación actual.",
    keepPlan:"Mantener Mi Plan", yesCancelSub:"Sí, Cancelar",
    accessibility:"Accesibilidad e Idioma",
    language:"Idioma", english:"English", spanish:"Español",
    appVersion:"JobFlow v9.0",
    signOutQ:"¿Cerrar sesión de JobFlow?",
    signOutMsg:"Necesitarás iniciar sesión para acceder a tus trabajos y datos.",
    signOutYes:"Cerrar Sesión",
    deleteAccountQ:"¿Eliminar tu cuenta?",
    deleteAccountMsg:"Esto eliminará permanentemente tu cuenta y TODOS tus datos.",
    deleteYes:"Eliminar Permanentemente",
    subCancelled:"Suscripción Cancelada",
    subCancelledMsg:"Tu plan Pro permanecerá activo hasta el final de tu período de facturación.",
    signedOut:"Sesión Cerrada",
    signedOutMsg:"Has cerrado sesión. ¡Hasta la próxima!",
    addPayment:"Agregar Pago",
    paymentAmount:"Monto del Pago ($)",
    collected2:"Cobrado",
    remaining:"Restante",
    paymentHistory:"Historial de Pagos",
    logPayment:"Registrar Pago",
    fullPayment:"Marcar como Pagado",
    partialPayment:"Pago Parcial",
    welcomeBack:"Bienvenido",
    loginSub:"Inicia sesión en tu cuenta JobFlow",
    emailLabel:"Correo",
    passwordLabel:"Contraseña",
    signIn:"Iniciar Sesión",
    noAccount:"¿No tienes cuenta?",
    signUp:"Regístrate gratis",
    forgotPassword:"¿Olvidaste tu contraseña?",
    createAccount:"Crear Cuenta",
    createSub:"Empieza a rastrear trabajos y cobrar",
    fullName:"Nombre Completo",
    businessNameLabel:"Nombre del Negocio",
    alreadyHave:"¿Ya tienes cuenta?",
    demoMode:"Probar Demo (sin registro)",
  }
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0f1117;--surface:#181c26;--card:#1e2333;--border:#2a3045;--accent:#f5a623;--blue:#3b82f6;--green:#22c55e;--red:#ef4444;--yellow:#eab308;--text:#e8eaf0;--muted:#6b7280;--r:12px}
body{background:var(--bg);font-family:'Barlow',sans-serif;color:var(--text)}
.app{min-height:100vh;background:var(--bg);background-image:radial-gradient(ellipse at 20% 0%,rgba(245,166,35,.07) 0%,transparent 60%),radial-gradient(ellipse at 80% 100%,rgba(59,130,246,.05) 0%,transparent 60%);padding-bottom:80px}
.hdr{padding:20px 20px 0;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;letter-spacing:-0.5px;color:var(--text)}
.logo span{color:var(--accent)}
.hdr-right{display:flex;align-items:center;gap:10px}
.bell-btn{position:relative;background:var(--card);border:1px solid var(--border);border-radius:10px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text)}
.bell-btn:hover{border-color:var(--accent)}
.menu-btn{background:var(--card);border:1px solid var(--border);border-radius:10px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted)}
.menu-btn:hover{border-color:var(--accent);color:var(--accent)}
.nbadge{position:absolute;top:-4px;right:-4px;background:var(--red);color:#fff;font-size:10px;font-weight:700;border-radius:20px;padding:1px 5px;min-width:18px;text-align:center}
.search-wrap{padding:14px 20px 0;position:relative}
.search-input{width:100%;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 36px;font-size:13px;color:var(--text);outline:none}
.search-input:focus{border-color:var(--accent)}
.search-input::placeholder{color:var(--muted)}
.search-icon{position:absolute;left:32px;top:50%;transform:translateY(-50%);pointer-events:none}
.search-clear{position:absolute;right:32px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);display:flex}
.stats{padding:16px 20px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:14px;cursor:pointer;transition:all .2s}
.stat:hover{border-color:#3a4060;transform:translateY(-1px)}
.stat.af-red{border-color:var(--red);box-shadow:0 0 0 1px var(--red);transform:translateY(-1px)}
.stat.af-green{border-color:var(--green);box-shadow:0 0 0 1px var(--green);transform:translateY(-1px)}
.stat.af-yellow{border-color:var(--yellow);box-shadow:0 0 0 1px var(--yellow);transform:translateY(-1px)}
.stat.af-blue{border-color:var(--blue);box-shadow:0 0 0 1px var(--blue);transform:translateY(-1px)}
.stat-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px}
.stat-val{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:700}
.stat-sub{font-size:11px;color:var(--muted);margin-top:3px}
.stat-tap{font-size:10px;margin-top:4px;opacity:.5;display:flex;align-items:center;gap:3px}
.c-green{color:var(--green)}.c-red{color:var(--red)}.c-yellow{color:var(--yellow)}.c-blue{color:var(--blue)}
.sec{padding:20px 20px 0}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.sec-title{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;letter-spacing:.3px}
.add-btn{background:var(--accent);border:none;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px;color:#0f1117}
.filter-bar{display:flex;gap:6px;margin-bottom:14px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}
.filter-bar::-webkit-scrollbar{display:none}
.fpill{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;white-space:nowrap}
.fpill.fp-all.on{background:rgba(245,166,35,.15);border-color:var(--accent);color:var(--accent)}
.fpill.fp-owed.on{background:rgba(239,68,68,.15);border-color:var(--red);color:var(--red)}
.fpill.fp-paid.on{background:rgba(34,197,94,.15);border-color:var(--green);color:var(--green)}
.fpill.fp-quoted.on{background:rgba(234,179,8,.15);border-color:var(--yellow);color:var(--yellow)}
.fpill.fp-scheduled.on{background:rgba(59,130,246,.15);border-color:var(--blue);color:var(--blue)}
.filter-banner{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 12px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between}
.filter-banner-left{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600}
.filter-clear{font-size:11px;color:var(--muted);cursor:pointer;text-decoration:underline;background:none;border:none}
.jcard{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:14px;margin-bottom:10px;cursor:pointer;transition:all .2s}
.jcard:hover{border-color:#3a4060}.jcard.open{border-color:var(--accent)}
.jcard-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px}
.jname{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700}
.jtype{font-size:11px;color:var(--muted);margin-top:2px}
.jcard-bot{display:flex;align-items:center;justify-content:space-between}
.jamt{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;color:var(--accent)}
.jdate{font-size:11px;color:var(--muted)}
.badge{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:.5px}
.b-paid{background:rgba(34,197,94,.15);color:var(--green);border:1px solid rgba(34,197,94,.3)}
.b-unpaid{background:rgba(239,68,68,.15);color:var(--red);border:1px solid rgba(239,68,68,.3)}
.b-quoted{background:rgba(234,179,8,.15);color:var(--yellow);border:1px solid rgba(234,179,8,.3)}
.b-scheduled{background:rgba(59,130,246,.15);color:var(--blue);border:1px solid rgba(59,130,246,.3)}
.b-overdue{background:rgba(239,68,68,.2);color:var(--red);border:1px solid rgba(239,68,68,.4)}
.pbar{height:3px;background:var(--border);border-radius:2px;margin-top:10px;overflow:hidden}
.pbar-fill{height:100%;border-radius:2px;transition:width .3s}
.drawer{background:var(--surface);border-top:1px solid var(--border);margin:12px -14px -14px;padding:12px 14px;border-radius:0 0 var(--r) var(--r)}
.drawer-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
.drawer-status{display:flex;align-items:center;gap:8px}
.status-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
.status-select{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:5px 8px;font-size:12px;font-weight:600;color:var(--text);outline:none;cursor:pointer}
.status-select:focus{border-color:var(--accent)}
.daction{display:flex;align-items:center;gap:5px;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid;transition:opacity .15s}
.daction:hover{opacity:.8}
.da-remind{background:rgba(245,166,35,.1);color:var(--accent);border-color:rgba(245,166,35,.3)}
.da-call{background:rgba(59,130,246,.1);color:var(--blue);border-color:rgba(59,130,246,.3)}
.da-pdf{background:rgba(34,197,94,.1);color:var(--green);border-color:rgba(34,197,94,.3)}
.da-edit{background:rgba(168,85,247,.1);color:#a855f7;border-color:rgba(168,85,247,.3)}
.da-pay{background:rgba(245,166,35,.1);color:var(--accent);border-color:rgba(245,166,35,.3)}
/* Payment tracker */
.pay-tracker{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 12px;margin-bottom:10px}
.pay-tracker-row{display:flex;justify-content:space-between;margin-bottom:6px}
.pay-tracker-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
.pay-tracker-val{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700}
.pay-bar{height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:8px}
.pay-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--green),#16a34a);transition:width .4s}
.pay-history{font-size:11px;color:var(--muted);border-top:1px solid var(--border);padding-top:8px;margin-top:4px}
.pay-history-item{display:flex;justify-content:space-between;padding:3px 0;color:var(--text);font-size:11px}
.acard{background:var(--card);border-radius:var(--r);padding:14px;margin-bottom:10px;display:flex;gap:10px;border-left:3px solid var(--border)}
.acard.urgent{border-left-color:var(--red)}.acard.warning{border-left-color:var(--yellow)}.acard.info{border-left-color:var(--blue)}
.atitle{font-size:14px;font-weight:600;margin-bottom:3px}
.adesc{font-size:12px;color:var(--muted);line-height:1.5}
.aact{margin-top:8px;background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:5px 12px;font-size:12px;font-weight:600;cursor:pointer;color:var(--text)}
.aact:hover{border-color:var(--accent);color:var(--accent)}
.ccard{background:var(--card);border:1px solid var(--border);border-radius:var(--r);margin-bottom:10px;cursor:pointer;transition:border-color .2s}
.ccard:hover{border-color:#3a4060}.ccard.open{border-color:var(--accent)}
.cmain{padding:14px;display:flex;gap:12px;align-items:center}
.cavatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;flex-shrink:0}
.cname{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700}
.cdetail{font-size:11px;color:var(--muted);margin-top:2px}
.cdrawer{background:var(--surface);border-top:1px solid var(--border);padding:12px 14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.fab-wrap{position:fixed;bottom:82px;right:20px;display:flex;flex-direction:column;align-items:center;gap:6px;z-index:50}
@media(min-width:480px){.fab-wrap{right:calc(50% - 220px)}}
.fab{width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#f5a623,#e08800);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(245,166,35,.4);transition:all .2s}
.fab:hover{box-shadow:0 6px 28px rgba(245,166,35,.6)}
.fab.listening{animation:pulse 1.2s infinite;background:linear-gradient(135deg,#ef4444,#c00)}
.fab-label{font-size:10px;font-weight:700;color:#f5a623;font-family:'Barlow Condensed',sans-serif;background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.2);border-radius:20px;padding:3px 8px;white-space:nowrap}
.fab-label.listening{color:#ef4444;border-color:rgba(239,68,68,.3)}
@keyframes pulse{0%,100%{box-shadow:0 4px 20px rgba(239,68,68,.5)}50%{box-shadow:0 4px 32px rgba(239,68,68,.8)}}
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--surface);border-top:1px solid var(--border);display:flex;padding:8px 0 12px;z-index:100}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:4px;background:none;border:none;color:var(--muted);font-size:10px;font-weight:600;font-family:'Barlow',sans-serif;position:relative;transition:color .2s}
.ni.active{color:var(--accent)}
.nav-badge{position:absolute;top:0;right:calc(50% - 22px);background:var(--red);color:#fff;font-size:9px;font-weight:700;border-radius:10px;padding:1px 4px}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:flex-end;justify-content:center}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:20px 20px 0 0;padding:20px;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;animation:slideUp .25s ease}
@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
.mhandle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 20px}
.mtitle{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px;display:flex;align-items:center;gap:8px}
.msub{font-size:13px;color:var(--muted);margin-bottom:20px}
.flabel{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;margin-top:14px;display:block}
.finput{width:100%;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:14px;color:var(--text);outline:none;font-family:'Barlow',sans-serif}
.finput:focus{border-color:var(--accent)}
select.finput{cursor:pointer}
.frow{display:flex;gap:10px}
.frow>div{flex:1}
.fbtn{width:100%;background:linear-gradient(135deg,var(--accent),#e08800);border:none;border-radius:var(--r);padding:14px;font-size:14px;font-weight:700;cursor:pointer;color:#0f1117;margin-top:14px;font-family:'Barlow',sans-serif}
.fbtn:hover{opacity:.9}
.fbtn-sec{width:100%;background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:12px;font-size:13px;font-weight:600;cursor:pointer;color:var(--muted);margin-top:8px;font-family:'Barlow',sans-serif}
.fbtn-danger{width:100%;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.4);border-radius:var(--r);padding:12px;font-size:13px;font-weight:700;cursor:pointer;color:var(--red);margin-top:8px;font-family:'Barlow',sans-serif}
.fbtn-danger:hover{background:rgba(239,68,68,.2)}
.vbars{display:flex;align-items:center;justify-content:center;gap:5px;height:40px;margin:16px 0}
.vbar{width:4px;background:var(--accent);border-radius:2px;animation:vibe .6s ease-in-out infinite alternate}
@keyframes vibe{from{height:6px}to{height:32px}}
.toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 16px;display:flex;align-items:center;gap:12px;font-size:13px;font-weight:600;z-index:300;animation:fadeIn .2s ease;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.4)}
.toast-undo{background:var(--accent);border:none;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer;color:#0f1117}
@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.confirm-popup{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px}
.confirm-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;width:100%;max-width:320px;text-align:center}
.confirm-icon{font-size:36px;margin-bottom:12px}
.confirm-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;margin-bottom:8px}
.confirm-msg{font-size:13px;color:var(--muted);line-height:1.5;margin-bottom:20px;white-space:pre-line}
.confirm-ok{width:100%;background:linear-gradient(135deg,var(--accent),#e08800);border:none;border-radius:10px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;color:#0f1117;font-family:'Barlow',sans-serif}
.pdf-preview{background:#fff;color:#111;border-radius:12px;padding:28px;margin-bottom:16px;font-family:'Barlow',sans-serif}
.pdf-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}
.pdf-logo{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#0f1117}
.pdf-logo span{color:#f5a623}
.pdf-inv-num{font-size:12px;color:#888;text-align:right}
.pdf-inv-title{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:#0f1117}
.pdf-section{margin-bottom:16px}
.pdf-label{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#999;margin-bottom:4px}
.pdf-value{font-size:14px;font-weight:600;color:#111}
.pdf-row{display:flex;gap:32px}
.pdf-line{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;font-size:13px}
.pdf-total{display:flex;justify-content:space-between;padding:12px 0;font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700}
.pdf-status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
.pdf-footer{text-align:center;font-size:11px;color:#bbb;margin-top:16px;padding-top:16px;border-top:1px solid #eee}
.empty{text-align:center;padding:40px 20px;color:var(--muted);font-size:14px}
/* SETTINGS */
.settings-screen{padding:0 20px 20px}
.settings-section{margin-bottom:8px}
.settings-section-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;padding:16px 4px 8px}
.settings-group{background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border);cursor:pointer}
.settings-row:last-child{border-bottom:none}
.settings-row:hover{background:rgba(255,255,255,.03)}
.settings-row-left{display:flex;align-items:center;gap:12px}
.settings-row-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center}
.settings-row-label{font-size:14px;font-weight:600}
.settings-row-sub{font-size:12px;color:var(--muted);margin-top:1px}
.settings-row.danger .settings-row-label{color:var(--red)}
.settings-profile{display:flex;align-items:center;gap:14px;padding:20px 16px;border-bottom:1px solid var(--border)}
.settings-avatar{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#e08800);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#0f1117}
.settings-name{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700}
.settings-email{font-size:12px;color:var(--muted);margin-top:2px}
.lang-toggle{display:flex;background:var(--surface);border:1px solid var(--border);border-radius:6px;overflow:hidden}
.lang-opt{padding:6px 16px;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;font-family:'Barlow',sans-serif;border:none;background:transparent;color:var(--muted)}
.lang-opt.active{background:var(--accent);color:#0f1117}
.plan-badge{font-size:11px;font-weight:700;background:rgba(245,166,35,.15);color:var(--accent);border:1px solid rgba(245,166,35,.3);border-radius:20px;padding:3px 10px}
.version-text{text-align:center;font-size:11px;color:var(--muted);padding:20px 0 4px}
.settings-panel{position:fixed;inset:0;z-index:150;display:flex;align-items:flex-end}
.settings-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px)}
.settings-sheet{position:relative;background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;margin:0 auto;max-height:88vh;overflow-y:auto}
.settings-hdr{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 0}
.settings-title{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800}
.settings-close{background:var(--card);border:1px solid var(--border);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted)}
.settings-close:hover{color:var(--text);border-color:var(--text)}
.dest-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:400;display:flex;align-items:center;justify-content:center;padding:20px}
.dest-box{background:var(--surface);border:1px solid rgba(239,68,68,.4);border-radius:16px;padding:24px;width:100%;max-width:320px;text-align:center}
/* LOGIN SCREEN */
.login-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--bg);background-image:radial-gradient(ellipse at 50% 0%,rgba(245,166,35,.1) 0%,transparent 60%)}
.login-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:32px 28px;width:100%;max-width:380px}
.login-logo{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;text-align:center;margin-bottom:6px}
.login-logo span{color:var(--accent)}
.login-tagline{text-align:center;font-size:13px;color:var(--muted);margin-bottom:28px}
.login-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;margin-bottom:4px}
.login-sub{font-size:13px;color:var(--muted);margin-bottom:20px}
.login-input-wrap{position:relative;margin-bottom:2px}
.login-input{width:100%;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:11px 40px 11px 12px;font-size:14px;color:var(--text);outline:none;font-family:'Barlow',sans-serif}
.login-input:focus{border-color:var(--accent)}
.login-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);display:flex}
.login-btn{width:100%;background:linear-gradient(135deg,var(--accent),#e08800);border:none;border-radius:10px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;color:#0f1117;margin-top:16px;font-family:'Barlow',sans-serif;transition:opacity .2s}
.login-btn:hover{opacity:.9}
.login-link{text-align:center;font-size:13px;color:var(--muted);margin-top:16px}
.login-link button{background:none;border:none;cursor:pointer;color:var(--accent);font-weight:700;font-family:'Barlow',sans-serif;font-size:13px}
.login-demo{width:100%;background:transparent;border:1px solid var(--border);border-radius:10px;padding:12px;font-size:13px;font-weight:600;cursor:pointer;color:var(--muted);margin-top:8px;font-family:'Barlow',sans-serif}
.login-demo:hover{border-color:var(--accent);color:var(--accent)}
.login-divider{display:flex;align-items:center;gap:12px;margin:16px 0;color:var(--muted);font-size:12px}
.login-divider::before,.login-divider::after{content:'';flex:1;height:1px;background:var(--border)}
`;

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const SEED = [
  {id:1,client:"Dave Martinez",type:"HVAC Install",amount:3200,collected:0,status:"unpaid",date:"Mar 10",phone:"(555) 201-4433",payments:[]},
  {id:2,client:"Brian Kowalski",type:"Panel Upgrade",amount:1850,collected:1850,status:"paid",date:"Mar 5",phone:"(555) 887-2210",payments:[{date:"Mar 5",amount:1850,note:"Full payment"}]},
  {id:3,client:"Greenway Plumbing",type:"Water Heater",amount:740,collected:0,status:"quoted",date:"Mar 18",phone:"",payments:[]},
  {id:4,client:"Apex Construction",type:"Rough-In Wiring",amount:5400,collected:2700,status:"scheduled",date:"Mar 25",phone:"(555) 340-9912",payments:[{date:"Mar 12",amount:2700,note:"Deposit 50%"}]},
  {id:5,client:"Ray Tanner",type:"AC Service",amount:320,collected:0,status:"overdue",date:"Feb 28",phone:"(555) 119-6640",payments:[]},
];

const SEED_ALERTS = [
  {id:1,type:"urgent",title:"Overdue: Ray Tanner",desc:"$320 AC Service invoice is 20 days past due. Follow up now.",action:"Send Reminder",client:"Ray Tanner"},
  {id:2,type:"urgent",title:"Unpaid: Dave Martinez",desc:"$3,200 HVAC Install — payment not received. Invoice sent 8 days ago.",action:"Send Reminder",client:"Dave Martinez"},
  {id:3,type:"warning",title:"Quote Unanswered",desc:"Greenway Plumbing hasn't responded to your $740 Water Heater quote in 5 days.",action:"Follow Up",client:"Greenway Plumbing"},
  {id:4,type:"info",title:"Upcoming: Apex Construction",desc:"Rough-in wiring job on Mar 25 — confirm materials and access with client.",action:"Mark Ready",client:"Apex Construction"},
];

const COLORS = ["#f5a623","#3b82f6","#22c55e","#ef4444","#a855f7","#06b6d4"];
const STATUSES = ["unpaid","quoted","scheduled","paid","overdue"];
const getInitials = n => n.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const fmt = n => "$"+Number(n).toLocaleString();
const badgeClass = s => ({paid:"b-paid",unpaid:"b-unpaid",quoted:"b-quoted",scheduled:"b-scheduled",overdue:"b-overdue"}[s]||"b-unpaid");
const todayStr = () => new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"});

// ── INVOICE NUMBER (auto-increment from localStorage) ─────────────────────────
const getNextInvNum = () => {
  const last = parseInt(localStorage.getItem("jf_inv_counter")||"0");
  const next = last + 1;
  localStorage.setItem("jf_inv_counter", String(next));
  return "INV-" + String(next).padStart(4,"0");
};
const invNum = (job) => job.invoiceNum || ("INV-" + String(job.id).slice(-4).padStart(4,"0"));

// ── LOCAL STORAGE HELPERS ─────────────────────────────────────────────────────
const LS_JOBS = "jf_jobs";
const LS_DISMISSED = "jf_dismissed";
const LS_LANG = "jf_lang";
const LS_AUTH = "jf_authed";

const loadJobs = () => {
  try { const s = localStorage.getItem(LS_JOBS); return s ? JSON.parse(s) : null; } catch{ return null; }
};
const saveJobs = (jobs) => {
  try { localStorage.setItem(LS_JOBS, JSON.stringify(jobs)); } catch{}
};
const loadDismissed = () => {
  try { const s = localStorage.getItem(LS_DISMISSED); return s ? JSON.parse(s) : []; } catch{ return []; }
};
const saveDismissed = (d) => {
  try { localStorage.setItem(LS_DISMISSED, JSON.stringify(d)); } catch{}
};

// ── AI PARSE ──────────────────────────────────────────────────────────────────
async function parseJobWithAI(text) {
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,
      messages:[{role:"user",content:`Extract job details from this voice note. Return ONLY raw JSON with keys: client (string), type (string), amount (number), date (string), phone (string), status (unpaid/quoted/scheduled/paid/overdue). Voice note: "${text}"`}]
    })
  });
  const d = await r.json();
  const raw = d.content?.find(b=>b.type==="text")?.text||"{}";
  return JSON.parse(raw.replace(/```json|```/g,"").trim());
}

// ── INVOICE PREVIEW ───────────────────────────────────────────────────────────
function InvoicePreview({job}) {
  const sc = {paid:"#22c55e",unpaid:"#ef4444",overdue:"#ef4444",quoted:"#eab308",scheduled:"#3b82f6"};
  const c = sc[job.status]||"#6b7280";
  const remaining = job.amount - (job.collected||0);
  return (
    <div className="pdf-preview">
      <div className="pdf-header">
        <div><div className="pdf-logo">Job<span>Flow</span></div><div style={{fontSize:11,color:"#999",marginTop:2}}>Professional Invoice</div></div>
        <div className="pdf-inv-num"><div className="pdf-inv-title">{invNum(job)}</div><div style={{marginTop:4}}>{todayStr()}</div></div>
      </div>
      <div className="pdf-row" style={{marginBottom:20}}>
        <div className="pdf-section"><div className="pdf-label">Bill To</div><div className="pdf-value">{job.client}</div>{job.phone&&<div style={{fontSize:12,color:"#888",marginTop:2}}>{job.phone}</div>}</div>
        <div className="pdf-section"><div className="pdf-label">Status</div><span className="pdf-status-badge" style={{background:`${c}20`,color:c,border:`1px solid ${c}40`}}>{job.status.toUpperCase()}</span></div>
      </div>
      <div className="pdf-line"><span style={{fontWeight:600}}>{job.type}</span><span>{fmt(job.amount)}</span></div>
      {(job.collected||0) > 0 && (
        <div className="pdf-line" style={{color:"#22c55e"}}><span>Collected</span><span>-{fmt(job.collected)}</span></div>
      )}
      <div className="pdf-total"><span>Total {remaining < job.amount ? "Remaining" : "Due"}</span><span style={{color: remaining===0?"#22c55e":"#111"}}>{fmt(remaining < job.amount ? remaining : job.amount)}</span></div>
      {job.date&&<div style={{fontSize:11,color:"#bbb",marginTop:8}}>Job Date: {job.date}</div>}
      <div className="pdf-footer">Generated by JobFlow · Thank you for your business!</div>
    </div>
  );
}

// ── PAYMENT TRACKER MODAL ─────────────────────────────────────────────────────
function PaymentModal({job, onClose, onSave, t}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const remaining = job.amount - (job.collected||0);

  const handlePay = (full=false) => {
    const val = full ? remaining : parseFloat(amount);
    if(!full && (!val || val <= 0 || val > remaining)) return;
    const payment = {date: todayStr(), amount: val, note: note||"Payment received"};
    const newCollected = (job.collected||0) + val;
    const newStatus = newCollected >= job.amount ? "paid" : job.status;
    onSave(job.id, newCollected, [...(job.payments||[]), payment], newStatus);
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mhandle"/>
        <div className="mtitle"><DollarIcon c="var(--green)" s={20}/> {t.addPayment}</div>
        <div className="msub">{job.client} · {fmt(job.amount)} total</div>

        {/* Progress */}
        <div className="pay-tracker" style={{marginBottom:16}}>
          <div className="pay-tracker-row">
            <div><div className="pay-tracker-label">{t.collected2}</div><div className="pay-tracker-val" style={{color:"var(--green)"}}>{fmt(job.collected||0)}</div></div>
            <div style={{textAlign:"right"}}><div className="pay-tracker-label">{t.remaining}</div><div className="pay-tracker-val" style={{color:"var(--red)"}}>{fmt(remaining)}</div></div>
          </div>
          <div className="pay-bar"><div className="pay-bar-fill" style={{width:`${Math.min(100,((job.collected||0)/job.amount)*100)}%`}}/></div>
          {(job.payments||[]).length > 0 && (
            <div className="pay-history">
              <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",marginBottom:4,color:"var(--muted)"}}>{t.paymentHistory}</div>
              {job.payments.map((p,i)=>(
                <div key={i} className="pay-history-item"><span>{p.date} — {p.note}</span><span style={{color:"var(--green)",fontWeight:700}}>{fmt(p.amount)}</span></div>
              ))}
            </div>
          )}
        </div>

        <label className="flabel">{t.paymentAmount}</label>
        <input className="finput" type="number" placeholder={`Max: ${fmt(remaining)}`} value={amount} onChange={e=>setAmount(e.target.value)}/>
        <label className="flabel">Note (optional)</label>
        <input className="finput" placeholder="e.g. Check #1042" value={note} onChange={e=>setNote(e.target.value)}/>

        <button className="fbtn" onClick={()=>handlePay(false)}>{t.logPayment}</button>
        {remaining > 0 && <button className="fbtn-sec" style={{color:"var(--green)",borderColor:"rgba(34,197,94,.3)"}} onClick={()=>handlePay(true)}>{t.fullPayment} ({fmt(remaining)})</button>}
        <button className="fbtn-sec" onClick={onClose}>{t.cancel}</button>
      </div>
    </div>
  );
}

// ── LOGIN SCREEN ──────────────────────────────────────────────────────────────
function LoginScreen({onLogin, t}) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [biz, setBiz] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    if(!email.trim()) { setErr("Email is required"); return; }
    if(!password.trim() || password.length < 6) { setErr("Password must be at least 6 characters"); return; }
    if(mode==="signup" && !name.trim()) { setErr("Name is required"); return; }
    setErr("");
    // Store in localStorage (real auth comes with Firebase in step 5)
    localStorage.setItem(LS_AUTH, JSON.stringify({email, name: name||email.split("@")[0], biz: biz||"My Business"}));
    onLogin();
  };

  return (
    <div className="login-screen">
      <style>{CSS}</style>
      <div className="login-card">
        <div className="login-logo">Job<span>Flow</span></div>
        <div className="login-tagline">Job tracking for the trades</div>

        <div className="login-title">{mode==="login" ? t.welcomeBack : t.createAccount}</div>
        <div className="login-sub">{mode==="login" ? t.loginSub : t.createSub}</div>

        {mode==="signup" && <>
          <label className="flabel">{t.fullName}</label>
          <input className="login-input" placeholder="John Smith" value={name} onChange={e=>setName(e.target.value)}/>
          <label className="flabel">{t.businessNameLabel}</label>
          <input className="login-input" placeholder="Smith Electric" value={biz} onChange={e=>setBiz(e.target.value)}/>
        </>}

        <label className="flabel">{t.emailLabel}</label>
        <input className="login-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>

        <label className="flabel">{t.passwordLabel}</label>
        <div className="login-input-wrap">
          <input className="login-input" type={showPass?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          <button className="login-eye" onClick={()=>setShowPass(p=>!p)}>{showPass ? <EyeOffIcon s={16}/> : <EyeIcon s={16}/>}</button>
        </div>

        {err && <div style={{fontSize:12,color:"var(--red)",marginTop:8,fontWeight:600}}>{err}</div>}

        <button className="login-btn" onClick={handleSubmit}>{mode==="login" ? t.signIn : t.createAccount}</button>

        {mode==="login" && <div style={{textAlign:"center",marginTop:10}}><button style={{background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:12,fontFamily:"'Barlow',sans-serif"}} onClick={()=>{}}>{t.forgotPassword}</button></div>}

        <div className="login-divider">or</div>
        <button className="login-demo" onClick={()=>{ localStorage.setItem(LS_AUTH, JSON.stringify({email:"demo@jobflow.app",name:"Demo User",biz:"Demo Business"})); onLogin(); }}>{t.demoMode}</button>

        <div className="login-link">
          {mode==="login" ? <>{t.noAccount} <button onClick={()=>{setMode("signup");setErr("")}}>{t.signUp}</button></> : <>{t.alreadyHave} <button onClick={()=>{setMode("login");setErr("")}}>{t.signIn}</button></>}
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS PANEL ────────────────────────────────────────────────────────────
function SettingsPanel({onClose, lang, setLang, t, userInfo}) {
  const [destConfirm, setDestConfirm] = useState(null);
  const handleSignOut = () => setDestConfirm({type:"signout"});
  const handleDelete = () => setDestConfirm({type:"delete"});
  const handleCancel = () => setDestConfirm({type:"cancel"});
  const execDest = () => {
    if(destConfirm.type==="cancel") { setDestConfirm(null); setTimeout(()=>onClose({action:"cancelled"}),100); }
    else if(destConfirm.type==="signout") { setDestConfirm(null); setTimeout(()=>onClose({action:"signout"}),100); }
    else if(destConfirm.type==="delete") { setDestConfirm(null); setTimeout(()=>onClose({action:"delete"}),100); }
  };
  const destCopy = destConfirm ? {
    signout:{icon:"👋",q:t.signOutQ,msg:t.signOutMsg,yes:t.signOutYes,btnClass:"fbtn-sec"},
    delete:{icon:"🗑️",q:t.deleteAccountQ,msg:t.deleteAccountMsg,yes:t.deleteYes,btnClass:"fbtn-danger"},
    cancel:{icon:"⚠️",q:t.cancelQ,msg:t.cancelMsg,yes:t.yesCancelSub,btnClass:"fbtn-danger"},
  }[destConfirm.type] : null;

  return (
    <div className="settings-panel">
      <div className="settings-backdrop" onClick={onClose}/>
      <div className="settings-sheet">
        <div className="settings-hdr">
          <div className="settings-title">{t.settings}</div>
          <button className="settings-close" onClick={onClose}><XIcon s={16}/></button>
        </div>
        <div style={{height:16}}/>
        <div className="settings-screen">
          <div className="settings-section">
            <div className="settings-group">
              <div className="settings-profile">
                <div className="settings-avatar">{getInitials(userInfo?.name||"JD")}</div>
                <div>
                  <div className="settings-name">{userInfo?.biz||"My Business"}</div>
                  <div className="settings-email">{userInfo?.email||"user@jobflow.app"}</div>
                </div>
              </div>
              <div className="settings-row" onClick={()=>{}}>
                <div className="settings-row-left">
                  <div className="settings-row-icon" style={{background:"rgba(245,166,35,.1)"}}><UserCircleIcon c="var(--accent)" s={18}/></div>
                  <div><div className="settings-row-label">{t.editProfile}</div><div className="settings-row-sub">{t.businessName} · {t.emailAddress}</div></div>
                </div>
                <ChevronRightIcon c="var(--muted)"/>
              </div>
            </div>
          </div>
          <div className="settings-section">
            <div className="settings-section-label">{t.subscription}</div>
            <div className="settings-group">
              <div className="settings-row" style={{cursor:"default"}}>
                <div className="settings-row-left">
                  <div className="settings-row-icon" style={{background:"rgba(245,166,35,.1)"}}><CreditCardIcon c="var(--accent)" s={18}/></div>
                  <div><div className="settings-row-label">{t.currentPlan}</div><div className="settings-row-sub">{t.proPlan}</div></div>
                </div>
                <span className="plan-badge">PRO</span>
              </div>
              <div className="settings-row danger" onClick={handleCancel}>
                <div className="settings-row-left">
                  <div className="settings-row-icon" style={{background:"rgba(239,68,68,.1)"}}><XIcon c="var(--red)" s={16}/></div>
                  <div><div className="settings-row-label">{t.cancelSubscription}</div></div>
                </div>
                <ChevronRightIcon c="var(--red)"/>
              </div>
            </div>
          </div>
          <div className="settings-section">
            <div className="settings-section-label">{t.accessibility}</div>
            <div className="settings-group">
              <div className="settings-row" style={{cursor:"default"}}>
                <div className="settings-row-left">
                  <div className="settings-row-icon" style={{background:"rgba(59,130,246,.1)"}}><GlobeIcon c="var(--blue)" s={18}/></div>
                  <div><div className="settings-row-label">{t.language}</div><div className="settings-row-sub">English / Español</div></div>
                </div>
                <div className="lang-toggle">
                  <button className={`lang-opt ${lang==="en"?"active":""}`} onClick={()=>setLang("en")}>{t.english}</button>
                  <button className={`lang-opt ${lang==="es"?"active":""}`} onClick={()=>setLang("es")}>{t.spanish}</button>
                </div>
              </div>
            </div>
          </div>
          <div className="settings-section">
            <div className="settings-section-label">{t.account}</div>
            <div className="settings-group">
              <div className="settings-row" onClick={handleSignOut}>
                <div className="settings-row-left">
                  <div className="settings-row-icon" style={{background:"rgba(107,114,128,.1)"}}><LogOutIcon c="var(--muted)" s={18}/></div>
                  <div className="settings-row-label">{t.signOut}</div>
                </div>
                <ChevronRightIcon c="var(--muted)"/>
              </div>
              <div className="settings-row danger" onClick={handleDelete}>
                <div className="settings-row-left">
                  <div className="settings-row-icon" style={{background:"rgba(239,68,68,.1)"}}><TrashIcon c="var(--red)" s={18}/></div>
                  <div><div className="settings-row-label">{t.deleteAccount}</div></div>
                </div>
                <ChevronRightIcon c="var(--red)"/>
              </div>
            </div>
          </div>
          <div className="version-text">{t.appVersion}</div>
        </div>
        {destConfirm && destCopy && (
          <div className="dest-overlay" onClick={()=>setDestConfirm(null)}>
            <div className="dest-box" onClick={e=>e.stopPropagation()}>
              <div className="confirm-icon">{destCopy.icon}</div>
              <div className="confirm-title">{destCopy.q}</div>
              <div className="confirm-msg">{destCopy.msg}</div>
              <button className={destCopy.btnClass} onClick={execDest}>{destCopy.yes}</button>
              <button className="fbtn-sec" onClick={()=>setDestConfirm(null)}>{destConfirm.type==="cancel"?t.keepPlan:t.cancel}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  // Auth
  const [authed, setAuthed] = useState(() => !!localStorage.getItem(LS_AUTH));
  const [userInfo, setUserInfo] = useState(() => { try { return JSON.parse(localStorage.getItem(LS_AUTH)||"null"); } catch{ return null; }});

  // Core state — loaded from localStorage
  const [tab, setTab] = useState("Jobs");
  const [lang, setLang] = useState(() => localStorage.getItem(LS_LANG)||"en");
  const [showSettings, setShowSettings] = useState(false);
  const [jobs, setJobs] = useState(() => loadJobs() || SEED);
  const [dismissed, setDismissed] = useState(() => loadDismissed());
  const [expanded, setExpanded] = useState(null);
  const [jobFilter, setJobFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [pdfJob, setPdfJob] = useState(null);
  const [payJob, setPayJob] = useState(null);
  const alertsRef = useRef(null);

  // Voice
  const [stage, setStage] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [parsed, setParsed] = useState(null);
  const [voiceErr, setVoiceErr] = useState("");
  const recogRef = useRef(null);

  // Forms
  const emptyForm = {client:"",type:"",amount:"",date:"",status:"unpaid",phone:""};
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editJob, setEditJob] = useState(null);

  // UI
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [confirm, setConfirm] = useState(null);

  const t = LANG[lang];

  // ── PERSIST to localStorage on change ──
  useEffect(() => { saveJobs(jobs); }, [jobs]);
  useEffect(() => { saveDismissed(dismissed); }, [dismissed]);
  useEffect(() => { localStorage.setItem(LS_LANG, lang); }, [lang]);

  useEffect(() => {
    if(tab==="Alerts") setTimeout(()=>alertsRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
  },[tab]);

  if(!authed) {
    return <LoginScreen t={t} onLogin={()=>{ const info=JSON.parse(localStorage.getItem(LS_AUTH)||"{}"); setUserInfo(info); setAuthed(true); }}/>;
  }

  const FILTERS = [
    {key:"all",      label:t.allJobs,   pill:t.allJobs,    pillClass:"fp-all",       match:()=>true},
    {key:"owed",     label:"Money Owed",pill:t.moneyOwed,  pillClass:"fp-owed",      match:j=>j.status==="unpaid"||j.status==="overdue"},
    {key:"paid",     label:"Collected", pill:t.collected,  pillClass:"fp-paid",      match:j=>j.status==="paid"},
    {key:"quoted",   label:"Quoted",    pill:t.openQuotes, pillClass:"fp-quoted",    match:j=>j.status==="quoted"},
    {key:"scheduled",label:"Upcoming",  pill:t.upcoming,   pillClass:"fp-scheduled", match:j=>j.status==="scheduled"},
  ];

  const activeAlerts = SEED_ALERTS.filter(a=>!dismissed.includes(a.id));
  const owed      = jobs.filter(j=>j.status==="unpaid"||j.status==="overdue").reduce((s,j)=>s+(j.amount-(j.collected||0)),0);
  const collected = jobs.filter(j=>j.status==="paid").reduce((s,j)=>s+j.amount,0);
  const quoted    = jobs.filter(j=>j.status==="quoted").reduce((s,j)=>s+j.amount,0);
  const upcoming  = jobs.filter(j=>j.status==="scheduled").reduce((s,j)=>s+j.amount,0);

  const filterCfg = FILTERS.find(f=>f.key===jobFilter);
  const filteredJobs = jobs.filter(filterCfg.match).filter(j=>!search||j.client.toLowerCase().includes(search.toLowerCase())||j.type.toLowerCase().includes(search.toLowerCase()));
  const contacts = jobs.map((j,i)=>({id:j.id,name:j.client,initials:getInitials(j.client),color:COLORS[i%COLORS.length],detail:j.type,phone:j.phone,status:j.status,amount:j.amount}));
  const filteredContacts = contacts.filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase()));

  const goToFilter = key => { setJobFilter(key); setTab("Jobs"); setExpanded(null); };

  const dismissAlert = (id) => {
    setDismissed(d=>[...d,id]);
    if(toastTimer.current) clearTimeout(toastTimer.current);
    setToast({id});
    toastTimer.current = setTimeout(()=>setToast(null),4000);
  };
  const undoDismiss = () => { if(!toast) return; setDismissed(d=>d.filter(x=>x!==toast.id)); setToast(null); };

  const handleAlertAction = a => {
    if(a.action==="Send Reminder") setConfirm({icon:"📨",title:"Reminder Sent!",msg:`Payment reminder sent to ${a.client}.`});
    else if(a.action==="Follow Up") setConfirm({icon:"📞",title:"Follow-Up Queued",msg:`Follow-up call queued for ${a.client}.`});
    else if(a.action==="Mark Ready") setConfirm({icon:"✅",title:"Marked Ready",msg:`${a.client} job marked ready.`});
  };
  const handleRemind = (client,e) => { e.stopPropagation(); setConfirm({icon:"📨",title:"Reminder Sent!",msg:`Payment reminder sent to ${client}.`}); };
  const changeStatus = (id,status,e) => { e.stopPropagation(); setJobs(prev=>prev.map(j=>j.id===id?{...j,status}:j)); };

  // Payment save
  const savePayment = (id, newCollected, newPayments, newStatus) => {
    setJobs(prev=>prev.map(j=>j.id===id?{...j,collected:newCollected,payments:newPayments,status:newStatus}:j));
  };

  // Voice
  const startVoice = () => {
    setVoiceErr("");
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setVoiceErr("Voice input isn't supported here. It will work in the real deployed app (Vercel/Chrome)."); setStage("error"); return;}
    const r = new SR(); r.lang=lang==="es"?"es-US":"en-US"; r.interimResults=false; recogRef.current=r;
    r.onresult=e=>{ const tx=e.results[0][0].transcript; setTranscript(tx); setStage("processing");
      parseJobWithAI(tx).then(p=>{ setParsed({...emptyForm,...p,amount:String(p.amount||""),date:p.date||todayStr(),status:p.status||"unpaid"}); setStage("confirm"); }).catch(()=>{ setVoiceErr("AI parsing failed. Try again."); setStage(null); }); };
    r.onerror=e=>{setVoiceErr("Mic error: "+e.error+". This will work in the real app."); setStage(null);};
    r.start(); setStage("listening");
  };
  const stopVoice = () => recogRef.current?.stop();

  const confirmSave = () => {
    const invN = getNextInvNum();
    setJobs(prev=>[{id:Date.now(),invoiceNum:invN,client:parsed.client||"Unknown Client",type:parsed.type||"General Job",amount:parseFloat(parsed.amount)||0,collected:0,payments:[],status:parsed.status||"unpaid",date:parsed.date||todayStr(),phone:parsed.phone||""},...prev]);
    setStage(null); setTranscript(""); setParsed(null); setTab("Jobs");
  };

  const saveForm = () => {
    if(!form.client.trim()) return;
    const invN = getNextInvNum();
    setJobs(prev=>[{id:Date.now(),invoiceNum:invN,client:form.client,type:form.type||"General Job",amount:parseFloat(form.amount)||0,collected:0,payments:[],status:form.status||"unpaid",date:form.date||todayStr(),phone:form.phone||""},...prev]);
    setForm(emptyForm); setShowForm(false);
  };

  const openEdit = (j,e) => { e.stopPropagation(); setEditJob({...j}); };
  const saveEdit = () => {
    if(!editJob.client.trim()) return;
    setJobs(prev=>prev.map(j=>j.id===editJob.id?{...editJob,amount:parseFloat(editJob.amount)||0}:j));
    setEditJob(null);
  };

  const toggle = key => setExpanded(expanded===key?null:key);

  const handleSettingsClose = (result) => {
    setShowSettings(false);
    if(!result) return;
    if(result.action==="cancelled") setConfirm({icon:"✅",title:t.subCancelled,msg:t.subCancelledMsg});
    if(result.action==="signout") {
      localStorage.removeItem(LS_AUTH);
      setAuthed(false); setUserInfo(null);
    }
    if(result.action==="delete") {
      localStorage.clear();
      setAuthed(false); setUserInfo(null); setJobs(SEED);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* HEADER */}
        <div className="hdr">
          <div className="logo">Job<span>Flow</span></div>
          <div className="hdr-right">
            <button className="bell-btn" onClick={()=>setTab("Alerts")}>
              <BellIcon/>
              {activeAlerts.length>0&&<span className="nbadge">{activeAlerts.length}</span>}
            </button>
            <button className="menu-btn" onClick={()=>setShowSettings(true)}><MenuIcon s={18}/></button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-wrap">
          <span className="search-icon"><SearchIcon c="#6b7280" s={16}/></span>
          <input className="search-input" placeholder={t.searchPlaceholder} value={search} onChange={e=>setSearch(e.target.value)}/>
          {search&&<button className="search-clear" onClick={()=>setSearch("")}><XIcon c="#6b7280" s={14}/></button>}
        </div>

        {/* STATS */}
        <div className="stats">
          <div className={`stat ${jobFilter==="owed"?"af-red":""}`} onClick={()=>goToFilter("owed")}>
            <div className="stat-lbl">{t.moneyOwed}</div><div className="stat-val c-red">{fmt(owed)}</div>
            <div className="stat-sub">{jobs.filter(j=>j.status==="unpaid"||j.status==="overdue").length} {t.awaiting}</div>
            <div className="stat-tap"><FilterIcon c="#6b7280" s={10}/> {t.tapFilter}</div>
          </div>
          <div className={`stat ${jobFilter==="paid"?"af-green":""}`} onClick={()=>goToFilter("paid")}>
            <div className="stat-lbl">{t.collected}</div><div className="stat-val c-green">{fmt(collected)}</div>
            <div className="stat-sub">{jobs.filter(j=>j.status==="paid").length} {t.paidJobs}</div>
            <div className="stat-tap"><FilterIcon c="#6b7280" s={10}/> {t.tapFilter}</div>
          </div>
          <div className={`stat ${jobFilter==="quoted"?"af-yellow":""}`} onClick={()=>goToFilter("quoted")}>
            <div className="stat-lbl">{t.openQuotes}</div><div className="stat-val c-yellow">{fmt(quoted)}</div>
            <div className="stat-sub">{jobs.filter(j=>j.status==="quoted").length} {t.awaiting}</div>
            <div className="stat-tap"><FilterIcon c="#6b7280" s={10}/> {t.tapFilter}</div>
          </div>
          <div className={`stat ${jobFilter==="scheduled"?"af-blue":""}`} onClick={()=>goToFilter("scheduled")}>
            <div className="stat-lbl">{t.upcoming}</div><div className="stat-val c-blue">{fmt(upcoming)}</div>
            <div className="stat-sub">{jobs.filter(j=>j.status==="scheduled").length} {t.scheduled}</div>
            <div className="stat-tap"><FilterIcon c="#6b7280" s={10}/> {t.tapFilter}</div>
          </div>
        </div>

        {/* JOBS TAB */}
        {tab==="Jobs"&&(
          <div className="sec">
            <div className="sec-hdr">
              <div className="sec-title">{search?t.results(search):jobFilter==="all"?t.allJobs:filterCfg.label}</div>
              <button className="add-btn" onClick={()=>setShowForm(true)}><PlusIcon/> {t.addJob}</button>
            </div>
            <div className="filter-bar">
              {FILTERS.map(f=><button key={f.key} className={`fpill ${f.pillClass} ${jobFilter===f.key?"on":""}`} onClick={()=>setJobFilter(f.key)}>{f.pill}</button>)}
            </div>
            {jobFilter!=="all"&&!search&&(
              <div className="filter-banner">
                <div className="filter-banner-left"><FilterIcon c={jobFilter==="owed"?"#ef4444":jobFilter==="paid"?"#22c55e":jobFilter==="quoted"?"#eab308":"#3b82f6"} s={12}/><span style={{color:jobFilter==="owed"?"#ef4444":jobFilter==="paid"?"#22c55e":jobFilter==="quoted"?"#eab308":"#3b82f6"}}>{filterCfg.pill}</span><span style={{color:"#6b7280"}}>({filteredJobs.length})</span></div>
                <button className="filter-clear" onClick={()=>setJobFilter("all")}>{t.clearFilter}</button>
              </div>
            )}
            {filteredJobs.length===0&&<div className="empty">{search?t.noJobsMatch(search):t.noJobsYet}</div>}
            {filteredJobs.map(j=>(
              <div key={j.id} className={`jcard ${expanded===j.id?"open":""}`} onClick={()=>toggle(j.id)}>
                <div className="jcard-top">
                  <div><div className="jname">{j.client}</div><div className="jtype">{j.type}</div></div>
                  <span className={`badge ${badgeClass(j.status)}`}>{t.statusLabels[j.status]||j.status}</span>
                </div>
                <div className="jcard-bot">
                  <div>
                    <div className="jamt">{fmt(j.amount)}</div>
                    {(j.collected||0)>0&&j.status!=="paid"&&<div style={{fontSize:11,color:"var(--green)",marginTop:2}}>{fmt(j.collected)} {t.collected2} · {fmt(j.amount-(j.collected||0))} {t.remaining}</div>}
                  </div>
                  <div className="jdate">{j.date}</div>
                </div>
                <div className="pbar"><div className="pbar-fill" style={{width:j.status==="paid"?"100%":(j.collected&&j.amount)?`${Math.min(100,(j.collected/j.amount)*100)}%`:"0%",background:j.status==="paid"?"var(--green)":"var(--accent)"}}/></div>
                {expanded===j.id&&(
                  <div className="drawer" onClick={e=>e.stopPropagation()}>
                    {/* Payment mini-tracker */}
                    {(j.collected||0)>0&&(
                      <div className="pay-tracker" style={{marginBottom:10}}>
                        <div className="pay-tracker-row">
                          <div><div className="pay-tracker-label">{t.collected2}</div><div className="pay-tracker-val" style={{color:"var(--green)"}}>{fmt(j.collected||0)}</div></div>
                          <div style={{textAlign:"right"}}><div className="pay-tracker-label">{t.remaining}</div><div className="pay-tracker-val" style={{color:j.amount-(j.collected||0)===0?"var(--green)":"var(--red)"}}>{fmt(j.amount-(j.collected||0))}</div></div>
                        </div>
                        <div className="pay-bar"><div className="pay-bar-fill" style={{width:`${Math.min(100,((j.collected||0)/j.amount)*100)}%`}}/></div>
                      </div>
                    )}
                    <div className="drawer-actions">
                      {j.phone&&<button className="daction da-call"><PhoneIcon c="#3b82f6"/> {t.call}</button>}
                      {(j.status==="unpaid"||j.status==="overdue")&&<button className="daction da-remind" onClick={e=>handleRemind(j.client,e)}>⏰ {t.remind}</button>}
                      <button className="daction da-pay" onClick={e=>{e.stopPropagation();setPayJob(j)}}><DollarIcon c="var(--accent)" s={12}/> {t.addPayment}</button>
                      <button className="daction da-pdf" onClick={e=>{e.stopPropagation();setPdfJob(j)}}><FileIcon c="#22c55e"/> {t.invoice}</button>
                      <button className="daction da-edit" onClick={e=>openEdit(j,e)}> ✏️ {t.edit}</button>
                    </div>
                    <div className="drawer-status">
                      <span className="status-lbl">{t.status}:</span>
                      <select className="status-select" value={j.status} onChange={e=>changeStatus(j.id,e.target.value,e)}>
                        {STATUSES.map(s=><option key={s} value={s}>{t.statusLabels[s]||s}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ALERTS TAB */}
        {tab==="Alerts"&&(
          <div className="sec" ref={alertsRef}>
            <div className="sec-hdr">
              <div className="sec-title">{t.aiAlerts}</div>
              {activeAlerts.length>0&&<span style={{fontSize:12,color:"#ef4444",fontWeight:600}}>{activeAlerts.length} active</span>}
            </div>
            {activeAlerts.length===0&&<div className="empty">{t.noAlerts}</div>}
            {activeAlerts.map(a=>(
              <div key={a.id} className={`acard ${a.type}`}>
                <div style={{marginTop:2,flexShrink:0}}>{a.type==="urgent"&&<AlertIcon/>}{a.type==="warning"&&<ClockIcon/>}{a.type==="info"&&<InfoIcon/>}</div>
                <div style={{flex:1}}>
                  <div className="atitle">{a.title}</div>
                  <div className="adesc">{a.desc}</div>
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <button className="aact" onClick={()=>handleAlertAction(a)}>{a.action}</button>
                    <button className="aact" style={{color:"#6b7280"}} onClick={()=>dismissAlert(a.id)}>Dismiss</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTACTS TAB */}
        {tab==="Contacts"&&(
          <div className="sec">
            <div className="sec-hdr">
              <div className="sec-title">{search?t.results(search):"Contacts"}</div>
            </div>
            {filteredContacts.length===0&&<div className="empty">{search?t.noContacts(search):"No contacts yet."}</div>}
            {filteredContacts.map(c=>(
              <div key={c.id} className={`ccard ${expanded===("c"+c.id)?"open":""}`} onClick={()=>toggle("c"+c.id)}>
                <div className="cmain">
                  <div className="cavatar" style={{background:`${c.color}22`,border:`1.5px solid ${c.color}44`,color:c.color}}>{c.initials}</div>
                  <div style={{flex:1}}><div className="cname">{c.name}</div><div className="cdetail">{c.detail}</div></div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"var(--accent)"}}>{fmt(c.amount)}</div>
                    <ChevronIcon/>
                  </div>
                </div>
                {expanded===("c"+c.id)&&(
                  <div className="cdrawer" onClick={e=>e.stopPropagation()}>
                    <span style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"var(--muted)",width:"100%",marginBottom:4}}><span className={`badge ${badgeClass(c.status)}`}>{t.statusLabels[c.status]||c.status}</span>{c.phone&&<span>{c.phone}</span>}</span>
                    <button className="daction da-call"><PhoneIcon c="#3b82f6"/> {t.call}</button>
                    <button className="daction da-remind" onClick={e=>handleRemind(c.name,e)}>⏰ {t.remind}</button>
                    <button className="daction da-edit" onClick={e=>{ const job=jobs.find(j=>j.id===c.id); if(job) openEdit(job,e); }}>✏️ {t.edit}</button>
                    <div style={{width:"100%",display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                      <span className="status-lbl">{t.status}:</span>
                      <select className="status-select" value={jobs.find(j=>j.id===c.id)?.status||"unpaid"} onChange={e=>changeStatus(c.id,e.target.value,e)}>
                        {STATUSES.map(s=><option key={s} value={s}>{t.statusLabels[s]||s}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FAB */}
        <div className="fab-wrap">
          <button className={`fab ${stage==="listening"?"listening":""}`} onClick={stage==="listening"?stopVoice:startVoice}>
            <MicIcon c="#0f1117" s={24}/>
          </button>
          <span className={`fab-label ${stage==="listening"?"listening":""}`}>{stage==="listening"?"Listening...":t.voiceAdd}</span>
        </div>

        {/* NAV */}
        <nav className="nav">
          {[{name:"Jobs",icon:<WrenchIcon/>},{name:"Alerts",icon:<BellIcon/>},{name:"Contacts",icon:<UsersIcon/>}].map(nt=>(
            <button key={nt.name} className={`ni ${tab===nt.name?"active":""}`} onClick={()=>{setTab(nt.name);setExpanded(null);}}>
              {nt.icon}
              {t[nt.name.toLowerCase()]||nt.name}
              {nt.name==="Alerts"&&activeAlerts.length>0&&<span className="nav-badge">{activeAlerts.length}</span>}
            </button>
          ))}
        </nav>

        {/* TOAST */}
        {toast&&<div className="toast"><span style={{fontSize:13,fontWeight:600}}>{t.alertDismissed}</span><button className="toast-undo" onClick={undoDismiss}>{t.undo}</button></div>}

        {/* CONFIRM POPUP */}
        {confirm&&(
          <div className="confirm-popup" onClick={()=>setConfirm(null)}>
            <div className="confirm-box" onClick={e=>e.stopPropagation()}>
              <div className="confirm-icon">{confirm.icon}</div>
              <div className="confirm-title">{confirm.title}</div>
              <div className="confirm-msg">{confirm.msg}</div>
              <button className="confirm-ok" onClick={()=>setConfirm(null)}>{t.gotIt}</button>
            </div>
          </div>
        )}

        {/* PDF INVOICE MODAL */}
        {pdfJob&&(
          <div className="overlay" onClick={()=>setPdfJob(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhandle"/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="mtitle" style={{marginBottom:0}}><FileIcon c="#22c55e" s={20}/> Invoice</div>
                <button style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280"}} onClick={()=>setPdfJob(null)}><XIcon s={20}/></button>
              </div>
              <InvoicePreview job={pdfJob}/>
              <button className="fbtn" onClick={()=>{setConfirm({icon:"🖨️",title:"PDF Ready!",msg:"In the deployed app this will download or email the invoice directly."});setPdfJob(null);}}>{t.downloadSend}</button>
              <button className="fbtn-sec" onClick={()=>setPdfJob(null)}>{t.close}</button>
            </div>
          </div>
        )}

        {/* PAYMENT MODAL */}
        {payJob&&<PaymentModal job={payJob} onClose={()=>setPayJob(null)} onSave={savePayment} t={t}/>}

        {/* VOICE MODALS */}
        {stage==="listening"&&(
          <div className="overlay"><div className="modal">
            <div className="mhandle"/>
            <div className="mtitle" style={{color:"#ef4444"}}><MicIcon c="#ef4444" s={20}/> {t.voiceAdd}</div>
            <div className="msub">{t.sayLike}<br/><em style={{color:"#e8eaf0"}}>{t.exampleVoice}</em></div>
            <div className="vbars">{[0,1,2,3,4,5].map(i=><div key={i} className="vbar" style={{animationDelay:`${i*.1}s`}}/>)}</div>
            <button className="fbtn-sec" onClick={stopVoice}>{t.doneTalking}</button>
          </div></div>
        )}
        {stage==="processing"&&(
          <div className="overlay"><div className="modal">
            <div className="mhandle"/>
            <div className="mtitle"><ZapIcon/> {t.aiProcessing}</div>
            <div className="msub">{t.pullingDetails}</div>
            <div style={{textAlign:"center",padding:"20px 0",color:"#6b7280",fontSize:13,fontStyle:"italic"}}>"{transcript}"</div>
          </div></div>
        )}
        {stage==="confirm"&&parsed&&(
          <div className="overlay"><div className="modal">
            <div className="mhandle"/>
            <div className="mtitle" style={{color:"#22c55e"}}><CheckIcon c="#22c55e" s={20}/> {t.confirmJob}</div>
            <div className="msub">{t.aiPulled}</div>
            {[{k:"client",l:t.clientName},{k:"type",l:t.jobType},{k:"amount",l:t.amountDollar},{k:"date",l:t.date},{k:"phone",l:t.phone}].map(f=>(
              <div key={f.k}><label className="flabel">{f.l}</label><input className="finput" value={parsed[f.k]||""} onChange={e=>setParsed(p=>({...p,[f.k]:e.target.value}))}/></div>
            ))}
            <button className="fbtn" onClick={confirmSave}>{t.saveJob}</button>
            <button className="fbtn-sec" onClick={()=>{setStage(null);setParsed(null);}}>{t.cancel}</button>
          </div></div>
        )}
        {voiceErr&&(
          <div className="overlay" onClick={()=>setVoiceErr("")}><div className="modal">
            <div className="mhandle"/>
            <div className="mtitle" style={{color:"#ef4444"}}><AlertIcon/> {t.micError}</div>
            <p style={{fontSize:14,color:"#6b7280",marginBottom:20,lineHeight:1.6}}>{voiceErr}</p>
            <button className="fbtn-sec" onClick={()=>setVoiceErr("")}>{t.close}</button>
          </div></div>
        )}

        {/* ADD JOB FORM */}
        {showForm&&(
          <div className="overlay" onClick={()=>setShowForm(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhandle"/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div className="mtitle"><ZapIcon/> {t.newJob}</div>
                <button style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280"}} onClick={()=>setShowForm(false)}><XIcon s={20}/></button>
              </div>
              <div className="msub">{t.fillManually}</div>
              <label className="flabel">{t.clientName} *</label>
              <input className="finput" placeholder="e.g. John Smith" value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))}/>
              <label className="flabel">{t.jobType}</label>
              <input className="finput" placeholder="e.g. HVAC Install" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/>
              <div className="frow">
                <div><label className="flabel">{t.amountDollar}</label><input className="finput" type="number" placeholder="0" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))}/></div>
                <div><label className="flabel">{t.date}</label><input className="finput" placeholder="Mar 20" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div>
              </div>
              <label className="flabel">{t.phone}</label>
              <input className="finput" placeholder="(555) 000-0000" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
              <label className="flabel">{t.status}</label>
              <select className="finput" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s} value={s}>{t.statusLabels[s]||s}</option>)}
              </select>
              <button className="fbtn" onClick={saveForm}>{t.saveJob}</button>
              <button className="fbtn-sec" onClick={()=>setShowForm(false)}>{t.cancel}</button>
            </div>
          </div>
        )}

        {/* EDIT JOB MODAL */}
        {editJob&&(
          <div className="overlay" onClick={()=>setEditJob(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhandle"/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div className="mtitle">✏️ {t.editJob}</div>
                <button style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280"}} onClick={()=>setEditJob(null)}><XIcon s={20}/></button>
              </div>
              <div className="msub">{t.editJobSub}</div>
              <label className="flabel">{t.clientName} *</label>
              <input className="finput" value={editJob.client} onChange={e=>setEditJob(p=>({...p,client:e.target.value}))}/>
              <label className="flabel">{t.jobType}</label>
              <input className="finput" value={editJob.type} onChange={e=>setEditJob(p=>({...p,type:e.target.value}))}/>
              <div className="frow">
                <div><label className="flabel">{t.amountDollar}</label><input className="finput" type="number" value={editJob.amount} onChange={e=>setEditJob(p=>({...p,amount:e.target.value}))}/></div>
                <div><label className="flabel">{t.date}</label><input className="finput" value={editJob.date||""} onChange={e=>setEditJob(p=>({...p,date:e.target.value}))}/></div>
              </div>
              <label className="flabel">{t.phone}</label>
              <input className="finput" placeholder="(555) 000-0000" value={editJob.phone||""} onChange={e=>setEditJob(p=>({...p,phone:e.target.value}))}/>
              <label className="flabel">{t.status}</label>
              <select className="finput" value={editJob.status} onChange={e=>setEditJob(p=>({...p,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s} value={s}>{t.statusLabels[s]||s}</option>)}
              </select>
              <button className="fbtn" onClick={saveEdit}>{t.saveChanges}</button>
              <button className="fbtn-sec" onClick={()=>setEditJob(null)}>{t.cancel}</button>
            </div>
          </div>
        )}

        {/* SETTINGS PANEL */}
        {showSettings&&(
          <SettingsPanel onClose={handleSettingsClose} lang={lang} setLang={setLang} t={t} userInfo={userInfo}/>
        )}
      </div>
    </>
  );
}
