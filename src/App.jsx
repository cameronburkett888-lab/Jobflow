import { useState, useRef, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser
} from "firebase/auth";
import {
  collection, doc, getDocs, setDoc, deleteDoc, onSnapshot, writeBatch
} from "firebase/firestore";
// ── ICONS ─────────────────────────────────────────────────────────────────────
const BellIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const WrenchIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const UsersIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const MicIcon = ({c="currentColor",s=24}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>;
const CheckIcon = ({c="currentColor",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const PhoneIcon = ({c="currentColor",s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const AlertIcon = ({c="#ef4444",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13" stroke="#fff" strokeWidth="2"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#fff" strokeWidth="2"/></svg>;
const ClockIcon = ({c="#eab308",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const InfoIcon = ({c="#3b82f6",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="#fff" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#fff" strokeWidth="2"/></svg>;
const ZapIcon = ({c="#f5a623",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const ChevronIcon = ({c="#6b7280",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const PlusIcon = ({c="#0f1117",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const FilterIcon = ({c="currentColor",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const SearchIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const FileIcon = ({c="currentColor",s=13}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const MenuIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const UserCircleIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const CreditCardIcon = ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const LogOutIcon = ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const TrashIcon = ({c="currentColor",s=18}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const ChevronRightIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const HistoryIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>;
const RestoreIcon = ({c="currentColor",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>;
const RepeatIcon = ({c="currentColor",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
const CalendarIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const SortIcon = ({c="currentColor",s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>;
const ArrowDownIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
const BuildingIcon = ({c="currentColor",s=20}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const MapPinIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const BadgeIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const SaveIcon = ({c="currentColor",s=16}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;

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
    noJobsYet:"No jobs yet.",
    status:"Status", call:"Call", remind:"Remind", invoice:"Invoice",
    statusOptions:["unpaid","quoted","scheduled","paid","overdue"],
    statusLabels:{unpaid:"Unpaid",quoted:"Quoted",scheduled:"Scheduled",paid:"Paid",overdue:"Overdue"},
    doneTalking:"Done Talking", cancel:"Cancel", saveJob:"Save Job", close:"Close",
    clientName:"Client Name", jobType:"Job Type", amountDollar:"Amount ($)", date:"Date",
    phone:"Phone (optional)", fillManually:"Fill in the details manually",
    newJob:"New Job", confirmJob:"Confirm Job Entry",
    aiPulled:"AI pulled these details. Edit anything before saving.",
    sayLike:'Say something like:', exampleVoice:'"Dave Martinez owes $1,200 for electrical panel, scheduled for next Friday"',
    aiProcessing:"AI Processing...", pullingDetails:"Pulling job details from what you said...",
    micError:"Mic Error", gotIt:"Got It", downloadSend:"Download / Send Invoice",
    alertDismissed:"Alert dismissed", undo:"Undo", results: q=>`Results for "${q}"`,
    clearFilter:"Clear ×",
    edit:"Edit", editJob:"Edit Job", saveChanges:"Save Changes", editJobSub:"Update any details below.",
    deleteJob:"Delete Job", moveToHistory:"Move to History", viewHistory:"View History",
    history:"History", historyEmpty:"No archived jobs yet.", restore:"Restore",
    confirmDelete:"Delete this job?", confirmDeleteMsg:"This will permanently remove the job. This cannot be undone.",
    confirmHistory:"Archive this job?", confirmHistoryMsg:"The job will be moved to History. You can restore it anytime.",
    yesDelete:"Yes, Delete", yesArchive:"Yes, Archive",
    voiceNotSupported:"Voice input isn't supported in this browser. Please use Chrome or type manually below.",
    settings:"Settings",
    account:"Account",
    businessName:"Business Name", emailAddress:"Email Address",
    editProfile:"Edit Profile",
    signOut:"Sign Out", deleteAccount:"Delete Account",
    subscription:"Subscription",
    currentPlan:"Current Plan", proPlan:"Pro Plan – $29/mo",
    cancelSubscription:"Cancel Subscription",
    cancelQ:"Cancel subscription?",
    cancelMsg:"You'll lose access to Tracket at the end of your current billing period.",
    keepPlan:"Keep My Plan", yesCancelSub:"Yes, Cancel",
    accessibility:"Accessibility & Language",
    language:"Language", english:"English", spanish:"Español",
    appVersion:"Tracket v11.1",
    signOutQ:"Sign out?",
    signOutMsg:"You'll need to log back in to access your jobs and data.",
    signOutYes:"Sign Out",
    deleteAccountQ:"Delete your account?",
    deleteAccountMsg:"This will permanently delete your account and ALL your job data. This cannot be undone.",
    deleteYes:"Permanently Delete",
    subCancelled:"Subscription Cancelled",
    subCancelledMsg:"Your Pro plan will remain active until the end of your billing period.",
    signedOut:"Signed Out",
    signedOutMsg:"You've been signed out. See you next time!",
    recurringInterval:"Recurring Interval",
    noRecurring:"None (one-time job)",
    weekly:"Weekly", biweekly:"Bi-Weekly", monthly:"Monthly",
    recurringBadge:"Recurring",
    recurringDay:"Recurring Day", recurringTime:"Recurring Time",
    dayOfMonth:"Day of Month (1–31)", dayOfWeek:"Day of Week",
    days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    deleteJobTitle:"Remove Job", deletePermTitle:"Delete Permanently",deletePermMsg:"This will permanently remove the job. Cannot be undone.",
    moveHistTitle:"Move to History", moveHistMsg:"Job will be archived. You can restore it anytime.",
    deleteOrArchive:"What would you like to do with this job?",
    paymentDueDate:"Payment Due Date (optional)",
    editProfileTitle:"Edit Profile", saveProfile:"Save Profile",
    yourName:"Your Name", bizPhone:"Business Phone", cityState:"City / State", licenseNum:"License # (optional)",
    profileSaved:"Profile Saved!", profileSavedMsg:"Your business info has been updated.",
    onboardingWelcome:"Welcome to Tracket 👋",
    onboardingSubtitle:"Set up your business profile so your invoices look professional from day one.",
    onboardingSkip:"Skip for now",
    onboardingFinish:"Let's Go →",
    // Sort bar
    sortDefault:"Default", sortNewest:"Newest", sortOldest:"Oldest", sortHigh:"$ High", sortLow:"$ Low", sortAZ:"A–Z",
    // Filter button
    filter:"Filter",
    // Onboarding empty state hints
    addByVoice:"Add by Voice (Fastest)", addByVoiceSub:'Tap the mic below and say something like "Dave owes $1,200 for electrical panel"',
    addManually:"Add Manually", addManuallySub:'Tap "+ Add Job" in the top right to fill out a quick form',
    onboardingGuide:"Once you add your first job, this guide disappears and your dashboard takes over.",
    // Auth screen
    signIn:"Sign In", createAccount:"Create Account", signInBtn:"Sign In →", createAccountBtn:"Create Account →",
    pleaseWait:"Please wait...", noAccount:"Don't have an account?", alreadyAccount:"Already have an account?",
    signUpFree:"Sign up free",
    // Onboarding flow
    continueBtn:"Continue →", nextBtn:"Next →", backBtn:"← Back", skipSetup:"Skip setup",
    // Calendar
    noJobsDay:"no jobs",
    // Contacts
    noContactsYet:"No contacts yet.",
    // Alerts dismiss
    dismiss:"Dismiss",
    // active alerts count
    activeAlerts: n=>`${n} active`,
    // Appointment time
    appointmentTime:"Appointment Time (optional)",
    // City/State in settings
    city:"City", state:"State", selectState:"-- Select State --",
    // Hardcoded strings
    tapClear:"tap to clear",
    historySubtitle: n=>`${n} archived · tap to restore`,
    recurringCreatedTitle:"Recurring Job Created",
    recurringCreatedMsg: (interval,client,date)=>`Next ${interval} job for ${client} has been scheduled for ${date}.`,
    reminderSentTitle:"Reminder Sent!", reminderSentMsg: c=>`Payment reminder sent to ${c}.`,
    followUpTitle:"Follow-Up Queued", followUpMsg: c=>`Follow-up scheduled for ${c}.`,
    pdfReadyTitle:"PDF Ready!", pdfReadyMsg:"Invoice has been prepared for download/send.",
    listeningTitle:"Listening...",
    // Free tier cap
    freeTierTitle:"Job Limit Reached",
    freeTierMsg:"Free accounts can have up to 5 active jobs. Delete or archive a job to add a new one, or upgrade to Pro for unlimited jobs.",
    freeTierUpgrade:"Upgrade to Pro",
    freeTierDismiss:"Got It",
  },
  es: {
    jobs:"Trabajos", alerts:"Alertas", contacts:"Contactos",
    addJob:"Agregar Trabajo", voiceAdd:"Voz",
    moneyOwed:"Dinero Adeudado", collected:"Cobrado", openQuotes:"Cotizaciones", upcoming:"Próximo",
    paidJobs:"trabajos pagados", awaiting:"en espera", scheduled:"programados",
    tapFilter:"toca para filtrar", allJobs:"Todos", aiAlerts:"Alertas de IA",
    searchPlaceholder:"Buscar trabajos o contactos...",
    noJobsMatch: q=>`Sin trabajos que coincidan con "${q}"`,
    noAlerts:"Todo al día — sin alertas activas.",
    noContacts: q=>`Sin contactos que coincidan con "${q}"`,
    noJobsYet:"Sin trabajos.",
    status:"Estado", call:"Llamar", remind:"Recordar", invoice:"Factura",
    statusOptions:["unpaid","quoted","scheduled","paid","overdue"],
    statusLabels:{unpaid:"Sin Pagar",quoted:"Cotizado",scheduled:"Programado",paid:"Pagado",overdue:"Vencido"},
    doneTalking:"Listo", cancel:"Cancelar", saveJob:"Guardar Trabajo", close:"Cerrar",
    clientName:"Nombre del Cliente", jobType:"Tipo de Trabajo", amountDollar:"Monto ($)", date:"Fecha",
    phone:"Teléfono (opcional)", fillManually:"Llena los detalles manualmente",
    newJob:"Nuevo Trabajo", confirmJob:"Confirmar Trabajo",
    aiPulled:"IA extrajo estos detalles. Edita antes de guardar.",
    sayLike:'Di algo como:', exampleVoice:'"Dave Martinez debe $1,200 por panel eléctrico, programado para el viernes"',
    aiProcessing:"Procesando con IA...", pullingDetails:"Extrayendo detalles del trabajo...",
    micError:"Error de Micrófono", gotIt:"Entendido", downloadSend:"Descargar / Enviar Factura",
    alertDismissed:"Alerta descartada", undo:"Deshacer", results: q=>`Resultados para "${q}"`,
    clearFilter:"Limpiar ×",
    edit:"Editar", editJob:"Editar Trabajo", saveChanges:"Guardar Cambios", editJobSub:"Actualiza los detalles abajo.",
    deleteJob:"Eliminar Trabajo", moveToHistory:"Mover al Historial", viewHistory:"Ver Historial",
    history:"Historial", historyEmpty:"Sin trabajos archivados.", restore:"Restaurar",
    confirmDelete:"¿Eliminar este trabajo?", confirmDeleteMsg:"Esto eliminará el trabajo permanentemente.",
    confirmHistory:"¿Archivar este trabajo?", confirmHistoryMsg:"El trabajo se moverá al Historial.",
    yesDelete:"Sí, Eliminar", yesArchive:"Sí, Archivar",
    voiceNotSupported:"La voz no es compatible con este navegador. Usa Chrome o escribe manualmente.",
    settings:"Configuración",
    account:"Cuenta",
    businessName:"Nombre del Negocio", emailAddress:"Correo Electrónico",
    editProfile:"Editar Perfil",
    signOut:"Cerrar Sesión", deleteAccount:"Eliminar Cuenta",
    subscription:"Suscripción",
    currentPlan:"Plan Actual", proPlan:"Plan Pro – $29/mes",
    cancelSubscription:"Cancelar Suscripción",
    cancelQ:"¿Cancelar suscripción?",
    cancelMsg:"Perderás acceso al final de tu período de facturación.",
    keepPlan:"Mantener Mi Plan", yesCancelSub:"Sí, Cancelar",
    accessibility:"Accesibilidad e Idioma",
    language:"Idioma", english:"English", spanish:"Español",
    appVersion:"Tracket v11.1",
    signOutQ:"¿Cerrar sesión?",
    signOutMsg:"Necesitarás iniciar sesión nuevamente.",
    signOutYes:"Cerrar Sesión",
    deleteAccountQ:"¿Eliminar tu cuenta?",
    deleteAccountMsg:"Esto eliminará permanentemente tu cuenta y TODOS tus datos.",
    deleteYes:"Eliminar Permanentemente",
    subCancelled:"Suscripción Cancelada",
    subCancelledMsg:"Tu plan Pro permanecerá activo hasta el final de tu período.",
    signedOut:"Sesión Cerrada",
    signedOutMsg:"Has cerrado sesión. ¡Hasta la próxima!",
    recurringInterval:"Intervalo Recurrente",
    noRecurring:"Ninguno (trabajo único)",
    weekly:"Semanal", biweekly:"Quincenal", monthly:"Mensual",
    recurringBadge:"Recurrente",
    recurringDay:"Día Recurrente", recurringTime:"Hora Recurrente",
    dayOfMonth:"Día del Mes (1–31)", dayOfWeek:"Día de la Semana",
    days:["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
    deleteJobTitle:"Eliminar Trabajo", deletePermTitle:"Eliminar Permanentemente", deletePermMsg:"Esto eliminará el trabajo para siempre.",
    moveHistTitle:"Mover al Historial", moveHistMsg:"El trabajo se archivará. Puedes restaurarlo cuando quieras.",
    deleteOrArchive:"¿Qué quieres hacer con este trabajo?",
    paymentDueDate:"Fecha Límite de Pago (opcional)",
    editProfileTitle:"Editar Perfil", saveProfile:"Guardar Perfil",
    yourName:"Tu Nombre", bizPhone:"Teléfono del Negocio", cityState:"Ciudad / Estado", licenseNum:"Licencia # (opcional)",
    profileSaved:"¡Perfil Guardado!", profileSavedMsg:"Tu información de negocio ha sido actualizada.",
    onboardingWelcome:"¡Bienvenido a Tracket 👋",
    onboardingSubtitle:"Configura tu perfil de negocio para que tus facturas se vean profesionales.",
    onboardingSkip:"Omitir por ahora",
    onboardingFinish:"¡Vamos →",
    // Sort bar
    sortDefault:"Predeterminado", sortNewest:"Más Reciente", sortOldest:"Más Antiguo", sortHigh:"$ Mayor", sortLow:"$ Menor", sortAZ:"A–Z",
    // Filter button
    filter:"Filtrar",
    // Onboarding empty state hints
    addByVoice:"Agregar por Voz (Más Rápido)", addByVoiceSub:'Toca el micrófono y di algo como "Dave debe $1,200 por panel eléctrico"',
    addManually:"Agregar Manualmente", addManuallySub:'Toca "+ Agregar Trabajo" arriba a la derecha',
    onboardingGuide:"Cuando agregues tu primer trabajo, esta guía desaparece y tu panel toma el control.",
    // Auth screen
    signIn:"Iniciar Sesión", createAccount:"Crear Cuenta", signInBtn:"Iniciar Sesión →", createAccountBtn:"Crear Cuenta →",
    pleaseWait:"Por favor espera...", noAccount:"¿No tienes cuenta?", alreadyAccount:"¿Ya tienes cuenta?",
    signUpFree:"Regístrate gratis",
    // Onboarding flow
    continueBtn:"Continuar →", nextBtn:"Siguiente →", backBtn:"← Atrás", skipSetup:"Omitir configuración",
    // Calendar
    noJobsDay:"sin trabajos",
    // Contacts
    noContactsYet:"Sin contactos aún.",
    // Alerts dismiss
    dismiss:"Descartar",
    // active alerts count
    activeAlerts: n=>`${n} activas`,
    // Appointment time
    appointmentTime:"Hora de Cita (opcional)",
    // City/State in settings
    city:"Ciudad", state:"Estado", selectState:"-- Seleccionar Estado --",
    // Hardcoded strings
    tapClear:"toca para limpiar",
    historySubtitle: n=>`${n} archivados · toca para restaurar`,
    recurringCreatedTitle:"Trabajo Recurrente Creado",
    recurringCreatedMsg: (interval,client,date)=>`El próximo trabajo ${interval} para ${client} ha sido programado para ${date}.`,
    reminderSentTitle:"¡Recordatorio Enviado!", reminderSentMsg: c=>`Recordatorio de pago enviado a ${c}.`,
    followUpTitle:"Seguimiento Programado", followUpMsg: c=>`Seguimiento programado para ${c}.`,
    pdfReadyTitle:"¡PDF Listo!", pdfReadyMsg:"La factura ha sido preparada para descargar/enviar.",
    listeningTitle:"Escuchando...",
    // Free tier cap
    freeTierTitle:"Límite de Trabajos Alcanzado",
    freeTierMsg:"Las cuentas gratuitas pueden tener hasta 5 trabajos activos. Elimina o archiva un trabajo para agregar uno nuevo, o actualiza a Pro para trabajos ilimitados.",
    freeTierUpgrade:"Actualizar a Pro",
    freeTierDismiss:"Entendido",
  }
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0f1117;--surface:#181c26;--card:#1e2333;--border:#2a3045;--accent:#f5a623;--blue:#3b82f6;--green:#22c55e;--red:#ef4444;--yellow:#eab308;--text:#e8eaf0;--muted:#6b7280;--r:14px}
body{background:var(--bg);font-family:'Barlow',sans-serif;color:var(--text)}
.app{min-height:100vh;background:var(--bg);background-image:radial-gradient(ellipse at 20% 0%,rgba(245,166,35,.06) 0%,transparent 60%);padding-bottom:140px}
.hdr{padding:14px 20px 0;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;letter-spacing:-.5px}
.logo span{color:var(--accent)}
.hdr-center{display:flex;flex-direction:column;align-items:center;gap:1px}
.hdr-time{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:var(--text)}
.hdr-date{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;font-weight:600}
.hdr-right{display:flex;align-items:center;gap:10px}
.bell-btn{position:relative;background:var(--card);border:1px solid var(--border);border-radius:10px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text)}
.bell-btn:hover{border-color:var(--accent)}
.menu-btn{background:var(--card);border:1px solid var(--border);border-radius:10px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted)}
.menu-btn:hover{border-color:var(--accent);color:var(--accent)}
.nbadge{position:absolute;top:-4px;right:-4px;background:var(--red);color:#fff;font-size:10px;font-weight:800;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.search-wrap{padding:14px 20px 0;position:relative}
.search-input{width:100%;background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:10px 36px;font-size:14px;color:var(--text);font-family:'Barlow',sans-serif}
.search-input:focus{border-color:var(--accent);outline:none}
.search-input::placeholder{color:var(--muted)}
.search-icon{position:absolute;left:32px;top:50%;transform:translateY(-50%);pointer-events:none}
.search-clear{position:absolute;right:32px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted)}
.stats{padding:16px 20px 0;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:14px;cursor:pointer;transition:all .15s}
.stat:hover{border-color:#3a4060;transform:translateY(-1px)}
.stat.af-red{border-color:var(--red);box-shadow:0 0 0 1px var(--red);transform:translateY(-1px)}
.stat.af-green{border-color:var(--green);box-shadow:0 0 0 1px var(--green);transform:translateY(-1px)}
.stat.af-yellow{border-color:var(--yellow);box-shadow:0 0 0 1px var(--yellow);transform:translateY(-1px)}
.stat.af-blue{border-color:var(--blue);box-shadow:0 0 0 1px var(--blue);transform:translateY(-1px)}
.stat-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;font-weight:600}
.stat-val{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:700}
.stat-sub{font-size:11px;color:var(--muted);margin-top:3px}
.stat-tap{font-size:10px;margin-top:4px;opacity:.5;display:flex;align-items:center;gap:3px}
.c-green{color:var(--green)}.c-red{color:var(--red)}.c-yellow{color:var(--yellow)}.c-blue{color:var(--blue)}
.sec{padding:20px 20px 0}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.sec-title{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;letter-spacing:.3px}
.sec-hdr-right{display:flex;align-items:center;gap:8px}
.add-btn{background:var(--accent);border:none;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px;font-family:'Barlow',sans-serif;color:#0f1117}
.history-btn{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;color:var(--muted);display:flex;align-items:center;gap:5px;position:relative;font-family:'Barlow',sans-serif}
.history-btn:hover{border-color:var(--accent);color:var(--accent)}
.history-badge{position:absolute;top:-5px;right:-5px;background:var(--accent);color:#0f1117;font-size:9px;font-weight:800;width:15px;height:15px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.filter-bar{display:flex;gap:6px;margin-bottom:14px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}
.filter-bar::-webkit-scrollbar{display:none}
.fpill{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;white-space:nowrap;font-family:'Barlow',sans-serif;transition:all .15s}
.fpill.fp-all.on{background:rgba(245,166,35,.15);border-color:var(--accent);color:var(--accent)}
.fpill.fp-owed.on{background:rgba(239,68,68,.15);border-color:var(--red);color:var(--red)}
.fpill.fp-paid.on{background:rgba(34,197,94,.15);border-color:var(--green);color:var(--green)}
.fpill.fp-quoted.on{background:rgba(234,179,8,.15);border-color:var(--yellow);color:var(--yellow)}
.fpill.fp-scheduled.on{background:rgba(59,130,246,.15);border-color:var(--blue);color:var(--blue)}
.filter-banner{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.filter-banner-left{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600}
.filter-clear{font-size:11px;color:var(--muted);cursor:pointer;text-decoration:underline;background:none;border:none;font-family:'Barlow',sans-serif}
.jcard{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:14px;margin-bottom:10px;cursor:pointer;transition:border-color .15s}
.jcard:hover{border-color:#3a4060}.jcard.open{border-color:var(--accent)}
.jcard.history-card{border-style:dashed;opacity:.8}
.jcard-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px}
.jname{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700}
.jtype{font-size:11px;color:var(--muted);margin-top:2px}
.jcard-bot{display:flex;align-items:center;justify-content:space-between}
.jamt{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;color:var(--accent)}
.jdate{font-size:11px;color:var(--muted)}
.badge{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:.4px}
.b-paid{background:rgba(34,197,94,.15);color:var(--green);border:1px solid rgba(34,197,94,.3)}
.b-unpaid{background:rgba(239,68,68,.15);color:var(--red);border:1px solid rgba(239,68,68,.3)}
.b-quoted{background:rgba(234,179,8,.15);color:var(--yellow);border:1px solid rgba(234,179,8,.3)}
.b-scheduled{background:rgba(59,130,246,.15);color:var(--blue);border:1px solid rgba(59,130,246,.3)}
.b-overdue{background:rgba(239,68,68,.2);color:var(--red);border:1px solid rgba(239,68,68,.4)}
.b-archived{background:rgba(107,114,128,.15);color:var(--muted);border:1px solid rgba(107,114,128,.3)}
.b-recurring{background:rgba(168,85,247,.15);color:#a855f7;border:1px solid rgba(168,85,247,.3)}
.pbar{height:3px;background:var(--border);border-radius:2px;margin-top:10px;overflow:hidden}
.pbar-fill{height:100%;border-radius:2px;transition:width .3s}
.drawer{background:var(--surface);border-top:1px solid var(--border);margin:12px -14px -14px;padding:12px 14px;border-radius:0 0 var(--r) var(--r)}
.drawer-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
.drawer-status{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.drawer-danger{display:flex;gap:8px;padding-top:8px;border-top:1px solid var(--border)}
.status-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
.status-select{background:var(--card);border:1px solid var(--border);border-radius:6px;padding:5px 8px;font-size:12px;color:var(--text);font-family:'Barlow',sans-serif;cursor:pointer}
.status-select:focus{border-color:var(--accent);outline:none}
.daction{display:flex;align-items:center;gap:5px;padding:7px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid;font-family:'Barlow',sans-serif;transition:opacity .15s}
.daction:hover{opacity:.8}
.da-remind{background:rgba(245,166,35,.1);color:var(--accent);border-color:rgba(245,166,35,.3)}
.da-call{background:rgba(59,130,246,.1);color:var(--blue);border-color:rgba(59,130,246,.3)}
.da-pdf{background:rgba(34,197,94,.1);color:var(--green);border-color:rgba(34,197,94,.3)}
.da-edit{background:rgba(168,85,247,.1);color:#a855f7;border-color:rgba(168,85,247,.3)}
.da-archive{background:rgba(107,114,128,.1);color:var(--muted);border-color:rgba(107,114,128,.3)}
.da-delete{background:rgba(239,68,68,.08);color:var(--red);border-color:rgba(239,68,68,.25)}
.da-restore{background:rgba(34,197,94,.1);color:var(--green);border-color:rgba(34,197,94,.3)}
.acard{background:var(--card);border-radius:var(--r);padding:14px;margin-bottom:10px;display:flex;gap:12px;border-left:3px solid var(--border)}
.acard.urgent{border-left-color:var(--red)}.acard.warning{border-left-color:var(--yellow)}.acard.info{border-left-color:var(--blue)}
.atitle{font-size:14px;font-weight:600;margin-bottom:3px}
.adesc{font-size:12px;color:var(--muted);line-height:1.5}
.aact{margin-top:8px;background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:5px 12px;font-size:12px;font-weight:600;cursor:pointer;color:var(--text);font-family:'Barlow',sans-serif}
.aact:hover{border-color:var(--accent);color:var(--accent)}
.ccard{background:var(--card);border:1px solid var(--border);border-radius:var(--r);margin-bottom:10px;cursor:pointer;transition:border-color .15s}
.ccard:hover{border-color:#3a4060}.ccard.open{border-color:var(--accent)}
.cmain{padding:14px;display:flex;gap:12px;align-items:center}
.cavatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;flex-shrink:0}
.cname{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700}
.cdetail{font-size:11px;color:var(--muted);margin-top:2px}
.cdrawer{background:var(--surface);border-top:1px solid var(--border);padding:12px 14px;display:flex;gap:8px;flex-wrap:wrap}
.fab-wrap{position:fixed;bottom:82px;right:20px;display:flex;flex-direction:column;align-items:center;gap:6px;z-index:50}
@media(min-width:480px){.fab-wrap{right:calc(50% - 220px)}}
.fab{width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#f5a623,#e08800);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(245,166,35,.4);transition:all .2s}
.fab:hover{box-shadow:0 6px 28px rgba(245,166,35,.6)}
.fab.listening{animation:pulse 1.2s infinite;background:linear-gradient(135deg,#ef4444,#c00)}
.fab-label{font-size:10px;font-weight:700;color:#f5a623;font-family:'Barlow Condensed',sans-serif;background:var(--card);border:1px solid rgba(245,166,35,.2);padding:2px 8px;border-radius:10px}
.fab-label.listening{color:#ef4444;border-color:rgba(239,68,68,.3)}
@keyframes pulse{0%,100%{box-shadow:0 4px 20px rgba(239,68,68,.5)}50%{box-shadow:0 4px 32px rgba(239,68,68,.8)}}
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--surface);border-top:1px solid var(--border);display:flex;padding:8px 0 20px;z-index:100}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:4px;color:var(--muted);font-size:10px;font-weight:600;position:relative;background:none;border:none;font-family:'Barlow',sans-serif}
.ni.active{color:var(--accent)}
.nav-badge{position:absolute;top:0;right:calc(50% - 22px);background:var(--red);color:#fff;font-size:9px;font-weight:800;width:14px;height:14px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:flex-end;justify-content:center}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(6px);z-index:300;display:flex;align-items:center;justify-content:center;padding:24px}
.modal-box{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px 24px 24px;width:100%;max-width:400px;text-align:center;animation:slideUp .2s ease}
.modal{background:var(--surface);border:1px solid var(--border);border-radius:20px 20px 0 0;padding:20px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal{animation:slideUp .2s ease}
.mhandle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 20px}
.mtitle{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.msub{font-size:13px;color:var(--muted);margin-bottom:20px}
.flabel{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;margin-bottom:6px;margin-top:14px;display:block;font-weight:600}
.finput{width:100%;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:14px;color:var(--text);font-family:'Barlow',sans-serif}
.finput:focus{border-color:var(--accent);outline:none}
select.finput{cursor:pointer}
.frow{display:flex;gap:10px}.frow>div{flex:1}
.fbtn{width:100%;background:linear-gradient(135deg,var(--accent),#e08800);border:none;border-radius:var(--r);padding:14px;font-size:15px;font-weight:700;cursor:pointer;margin-top:12px;font-family:'Barlow',sans-serif;color:#0f1117}
.fbtn:hover{opacity:.9}
.fbtn-sec{width:100%;background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:12px;font-size:14px;font-weight:600;cursor:pointer;margin-top:8px;color:var(--muted);font-family:'Barlow',sans-serif}
.fbtn-danger{width:100%;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.4);border-radius:var(--r);padding:12px;font-size:14px;font-weight:700;cursor:pointer;margin-top:8px;color:var(--red);font-family:'Barlow',sans-serif}
.fbtn-danger:hover{background:rgba(239,68,68,.2)}
.vbars{display:flex;align-items:center;justify-content:center;gap:5px;height:40px;margin:16px 0}
.vbar{width:4px;background:var(--accent);border-radius:2px;animation:vibe .6s ease-in-out infinite alternate}
@keyframes vibe{from{height:6px}to{height:32px}}
.toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 16px;display:flex;align-items:center;gap:12px;z-index:300;white-space:nowrap;animation:fadeIn .2s ease}
.toast-undo{background:var(--accent);border:none;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;cursor:pointer;color:#0f1117;font-family:'Barlow',sans-serif}
@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.confirm-popup{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px}
.confirm-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;width:100%;max-width:320px;text-align:center}
.confirm-icon{font-size:36px;margin-bottom:12px}
.confirm-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;margin-bottom:8px}
.confirm-msg{font-size:13px;color:var(--muted);line-height:1.5;margin-bottom:20px;white-space:pre-line}
.confirm-ok{width:100%;background:linear-gradient(135deg,var(--accent),#e08800);border:none;border-radius:10px;padding:12px;font-size:15px;font-weight:700;cursor:pointer;margin-bottom:8px;font-family:'Barlow',sans-serif;color:#0f1117}
.pdf-preview{background:#fff;color:#111;border-radius:12px;padding:28px;margin-bottom:16px;font-family:'Barlow',sans-serif}
.pdf-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px}
.pdf-logo{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:#0f1117}
.pdf-logo span{color:#f5a623}
.pdf-inv-num{font-size:12px;color:#888;text-align:right}
.pdf-inv-title{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:#0f1117}
.pdf-section{margin-bottom:16px}
.pdf-label{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#999;margin-bottom:4px}
.pdf-value{font-size:14px;font-weight:600;color:#111}
.pdf-row{display:flex;gap:32px}
.pdf-line{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee}
.pdf-total{display:flex;justify-content:space-between;padding:12px 0;font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:700}
.pdf-status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
.pdf-footer{text-align:center;font-size:11px;color:#bbb;margin-top:16px;padding-top:16px;border-top:1px solid #eee}
.empty{text-align:center;padding:40px 20px;color:var(--muted);font-size:14px}
.history-section-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;font-weight:600}
.voice-unsupported{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.25);border-radius:10px;padding:14px;font-size:13px;color:var(--blue);line-height:1.6;margin-bottom:16px}
/* SETTINGS */
.settings-screen{padding:0 20px 20px}
.settings-section{margin-bottom:8px}
.settings-section-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin:16px 0 6px;font-weight:600}
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
.lang-toggle{display:flex;background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden}
.lang-opt{padding:6px 16px;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;font-family:'Barlow',sans-serif;border:none;background:none;color:var(--muted)}
.lang-opt.active{background:var(--accent);color:#0f1117}
.plan-badge{font-size:11px;font-weight:700;background:rgba(245,166,35,.15);color:var(--accent);padding:3px 10px;border-radius:20px;border:1px solid rgba(245,166,35,.3)}
.version-text{text-align:center;font-size:11px;color:var(--muted);padding:20px 0 4px}
.settings-panel{position:fixed;inset:0;z-index:150;display:flex;align-items:flex-end}
.settings-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px)}
.settings-sheet{position:relative;background:var(--surface);border-radius:20px 20px 0 0;width:100%;max-width:480px;margin:0 auto;max-height:90vh;overflow-y:auto}
.settings-hdr{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 0}
.settings-title{font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800}
.settings-close{background:var(--card);border:1px solid var(--border);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted)}
.settings-close:hover{color:var(--text);border-color:var(--text)}
.dest-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:400;display:flex;align-items:center;justify-content:center;padding:20px}
.dest-box{background:var(--surface);border:1px solid rgba(239,68,68,.4);border-radius:16px;padding:24px;width:100%;max-width:320px;text-align:center}

/* ── ONBOARDING EMPTY STATE ── */
.onboarding-empty{display:flex;flex-direction:column;align-items:center;padding:32px 20px 20px;position:relative}
.onboarding-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:var(--text);margin-bottom:6px;text-align:center}
.onboarding-sub{font-size:13px;color:var(--muted);text-align:center;line-height:1.6;margin-bottom:32px}
.onboarding-hint{display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:24px;width:100%}
.onboarding-hint-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px 16px;width:100%;display:flex;align-items:center;gap:12px;position:relative}
.onboarding-hint-card.highlighted{border-color:var(--accent);background:rgba(245,166,35,.05)}
.onboarding-hint-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.onboarding-hint-text{flex:1}
.onboarding-hint-label{font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px}
.onboarding-hint-sub{font-size:11px;color:var(--muted)}
.onboarding-arrow{display:flex;flex-direction:column;align-items:center;gap:4px}
.onboarding-arrow-line{width:2px;height:20px;background:linear-gradient(to bottom,var(--accent),transparent);border-radius:2px}
.onboarding-divider{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin:4px 0}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
.onboarding-bounce{animation:bounce 1.5s ease-in-out infinite}

/* RECURRING BADGE */
.recurring-tag{display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;color:#a855f7;background:rgba(168,85,247,.12);border:1px solid rgba(168,85,247,.25);border-radius:10px;padding:2px 7px;margin-top:4px}

/* AUTH SCREEN */
.auth-screen{min-height:100vh;background:var(--bg);background-image:radial-gradient(ellipse at 20% 0%,rgba(245,166,35,.08) 0%,transparent 60%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}
.auth-logo{font-family:'Barlow Condensed',sans-serif;font-size:42px;font-weight:800;letter-spacing:-1px;margin-bottom:4px;text-align:center}
.auth-logo span{color:var(--accent)}
.auth-tagline{font-size:13px;color:var(--muted);text-align:center;margin-bottom:36px;letter-spacing:.3px}
.auth-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px 24px;width:100%;max-width:400px}
.auth-tabs{display:flex;background:var(--card);border-radius:10px;padding:3px;margin-bottom:24px;gap:3px}
.auth-tab{flex:1;padding:8px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Barlow',sans-serif;background:none;color:var(--muted);transition:all .2s}
.auth-tab.active{background:var(--accent);color:#0f1117}
.auth-field{margin-bottom:16px}
.auth-field label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;font-weight:600;display:block;margin-bottom:6px}
.auth-input{width:100%;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px 14px;font-size:14px;color:var(--text);font-family:'Barlow',sans-serif}
.auth-input:focus{border-color:var(--accent);outline:none}
.auth-input::placeholder{color:var(--muted)}
.auth-btn{width:100%;background:linear-gradient(135deg,#f5a623,#e08800);border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Barlow',sans-serif;color:#0f1117;margin-top:8px;transition:opacity .2s}
.auth-btn:hover{opacity:.9}
.auth-btn:disabled{opacity:.5;cursor:not-allowed}
.auth-error{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:12px;line-height:1.5}
.auth-footer{text-align:center;font-size:11px;color:var(--muted);margin-top:20px}

/* ONBOARDING FLOW */
.ob-overlay{position:fixed;inset:0;z-index:200;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;overflow-y:auto}
.ob-logo{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;letter-spacing:-.5px;margin-bottom:4px}
.ob-logo span{color:var(--accent)}
.ob-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px 24px;width:100%;max-width:420px}
.ob-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;margin-bottom:6px}
.ob-sub{font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:24px}
.ob-progress{display:flex;gap:6px;margin-bottom:24px}
.ob-dot{height:4px;border-radius:2px;flex:1;background:var(--border);transition:background .3s}
.ob-dot.done{background:var(--accent)}
.ob-field{margin-bottom:16px}
.ob-field label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;font-weight:600;display:block;margin-bottom:6px}
.ob-input{width:100%;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:11px 14px;font-size:14px;color:var(--text);font-family:'Barlow',sans-serif}
.ob-input:focus{border-color:var(--accent);outline:none}
.ob-input::placeholder{color:var(--muted)}
.ob-logo-upload{display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer}
.ob-logo-preview{width:44px;height:44px;border-radius:10px;background:var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0}
.ob-logo-preview img{width:100%;height:100%;object-fit:cover}
.ob-logo-text{font-size:13px;font-weight:600;color:var(--muted)}
.ob-logo-sub{font-size:11px;color:var(--muted);opacity:.7;margin-top:1px}
.ob-btns{display:flex;flex-direction:column;gap:8px;margin-top:24px}
.ob-skip{background:none;border:none;font-size:12px;color:var(--muted);cursor:pointer;text-align:center;padding:4px;font-family:'Barlow',sans-serif;text-decoration:underline}
.ob-skip:hover{color:var(--text)}

/* SETTINGS EDIT PROFILE SCREEN */
.profile-edit-screen{padding:0 20px 20px}

/* SORT BAR */
.sort-bar{display:flex;align-items:center;gap:6px;padding:0 16px 10px;overflow-x:auto;scrollbar-width:none}
.sort-bar::-webkit-scrollbar{display:none}
.sort-pill{display:flex;align-items:center;gap:4px;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid var(--border);background:var(--card);color:var(--muted);white-space:nowrap;font-family:'Barlow',sans-serif;transition:all .15s}
.sort-pill.active{background:var(--surface);border-color:var(--accent);color:var(--accent)}

/* CALENDAR TAB */
.cal-wrap{padding:0 16px 100px}
.cal-nav{display:flex;align-items:center;justify-content:space-between;padding:12px 0 16px}
.cal-month{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:var(--text)}
.cal-arrow{background:var(--card);border:1px solid var(--border);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text);font-size:16px}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.cal-day-hdr{text-align:center;font-size:10px;font-weight:700;color:var(--muted);padding:4px 0;text-transform:uppercase;letter-spacing:.5px}
.cal-cell{min-height:46px;border-radius:8px;padding:4px;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;transition:background .15s;position:relative}
.cal-cell:hover{background:rgba(255,255,255,.05)}
.cal-cell.today .cal-num{background:var(--accent);color:#0f1117;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center}
.cal-cell.selected{background:rgba(245,166,35,.1);border:1px solid rgba(245,166,35,.3)}
.cal-cell.other-month .cal-num{color:var(--muted);opacity:.4}
.cal-num{font-size:13px;font-weight:600;color:var(--text);width:22px;height:22px;display:flex;align-items:center;justify-content:center}
.cal-dots{display:flex;gap:2px;flex-wrap:wrap;justify-content:center;max-width:36px}
.cal-dot{width:5px;height:5px;border-radius:50%}
.cal-bars{display:flex;flex-direction:column;gap:2px;width:100%;padding:0 2px}
.cal-bar{height:3px;border-radius:2px;width:100%}
.cal-jobs-panel{margin-top:16px;background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.cal-jobs-hdr{padding:12px 14px;border-bottom:1px solid var(--border);font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700}
.cal-job-row{padding:11px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.cal-job-row:last-child{border-bottom:none}
.cal-job-name{font-size:13px;font-weight:700;color:var(--text)}
.cal-job-type{font-size:11px;color:var(--muted);margin-top:1px}
.cal-job-amt{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:var(--accent)}
.profile-edit-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#e08800);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;color:#0f1117;margin:0 auto 16px;cursor:pointer;position:relative;overflow:hidden}
.profile-edit-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.profile-edit-avatar-hint{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,.5);font-size:9px;color:#fff;text-align:center;padding:3px 0;font-weight:600}
.profile-edit-back{display:flex;align-items:center;gap:6px;background:none;border:none;color:var(--muted);font-size:13px;font-weight:600;cursor:pointer;font-family:'Barlow',sans-serif;padding:0;margin-bottom:16px}
.profile-edit-back:hover{color:var(--text)}
`;

const fmtPhone = (v) => {
  const d = v.replace(/\D/g,"").slice(0,10);
  if(d.length<4) return d;
  if(d.length<7) return `(${d.slice(0,3)}) ${d.slice(3)}`;
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
};

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];
const US_STATES_FULL = {AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",DC:"Washington DC"};

const SEED = [
  {id:1,client:"Dave Martinez",  type:"HVAC Install",    amount:3200, status:"unpaid",    date:"Mar 12", phone:"(555) 210-1234", recurring:null},
  {id:2,client:"Brian Kowalski", type:"Panel Upgrade",   amount:1850, status:"paid",      date:"Mar 5",  phone:"",               recurring:null},
  {id:3,client:"Greenway Plumbing",type:"Water Heater",  amount:740,  status:"quoted",    date:"Mar 18", phone:"(555) 330-9988", recurring:"monthly"},
  {id:4,client:"Apex Construction",type:"Rough-In Wiring",amount:5400,status:"scheduled", date:"Mar 25", phone:"(555) 447-2211", recurring:"weekly"},
  {id:5,client:"Ray Tanner",     type:"AC Service",      amount:320,  status:"overdue",   date:"Feb 28", phone:"(555) 512-7766", recurring:null},
];

const COLORS = ["#f5a623","#3b82f6","#22c55e","#ef4444","#a855f7","#06b6d4"];
const STATUSES = ["unpaid","quoted","scheduled","paid","overdue"];
const RECURRING_OPTIONS = ["none","weekly","biweekly","monthly"];

const getInitials = n => n.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const fmt = n => "$"+Number(n).toLocaleString();
const badgeClass = s => ({paid:"b-paid",unpaid:"b-unpaid",quoted:"b-quoted",scheduled:"b-scheduled",overdue:"b-overdue"}[s]||"b-unpaid");
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => { if(!d) return ""; if(d.includes("-")) { const [,m,day] = d.split("-"); const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${months[parseInt(m)-1]} ${parseInt(day)}`; } return d; };
const invNum = id => "INV-"+String(id).slice(-4).padStart(4,"0");
const voiceSupported = () => !!(window.SpeechRecognition || window.webkitSpeechRecognition);
const formatTime = (t) => { if(!t) return ""; const [h,m]=t.split(":"); const hr=parseInt(h); return `${hr>12?hr-12:hr||12}:${m} ${hr>=12?"PM":"AM"}`; };

// ── RECURRING: compute next job date ─────────────────────────────────────────
const addInterval = (dateStr, interval) => {
  const d = new Date();
  if(interval === "weekly")   d.setDate(d.getDate() + 7);
  if(interval === "biweekly") d.setDate(d.getDate() + 14);
  if(interval === "monthly")  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
};

// Calculate the correct first occurrence date for a recurring job added today
const firstOccurrenceDate = (recurring, recurringDay) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const todayNum = today.getDate();
  const todayDow = today.getDay();

  if(recurring === "monthly") {
    const day = Number(recurringDay);
    if(!day) return today.toLocaleDateString("en-US",{month:"short",day:"numeric"});
    // If day already passed this month, use next month
    const targetMonth = todayNum >= day ? today.getMonth() + 1 : today.getMonth();
    const targetYear  = targetMonth > 11 ? today.getFullYear() + 1 : today.getFullYear();
    const daysInTarget = new Date(targetYear, (targetMonth % 12) + 1, 0).getDate();
    const snapped = Math.min(day, daysInTarget);
    return new Date(targetYear, targetMonth % 12, snapped).toLocaleDateString("en-US",{month:"short",day:"numeric"});
  }

  if(recurring === "weekly" || recurring === "biweekly") {
    const targetDow = Number(recurringDay);
    let daysUntil = (targetDow - todayDow + 7) % 7;
    if(daysUntil === 0) daysUntil = 7; // if today is the day, schedule for next week
    const next = new Date(today);
    next.setDate(today.getDate() + daysUntil);
    return next.toLocaleDateString("en-US",{month:"short",day:"numeric"});
  }

  return today.toLocaleDateString("en-US",{month:"short",day:"numeric"});
};

// ── DYNAMIC ALERTS FROM REAL JOB DATA ────────────────────────────────────────
const buildDynamicAlerts = (jobs) => {
  const alerts = [];
  const today = new Date(); today.setHours(0,0,0,0);
  const todayNum = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  jobs.forEach(j => {
    // Overdue payments — with smarter message for recurring jobs
    if(j.status === "overdue") {
      const isRecurring = j.recurring && j.recurring !== "none";
      const recurringLabel = {weekly:"weekly",biweekly:"bi-weekly",monthly:"monthly"}[j.recurring]||"";
      alerts.push({
        id:`overdue-${j.id}`, type:"urgent",
        title:`Overdue: ${j.client}`,
        desc: isRecurring
          ? `${j.client}'s ${recurringLabel} ${j.type} payment of ${fmt(j.amount)} hasn't come in. Send a reminder.`
          : `${fmt(j.amount)} ${j.type} invoice is overdue. Consider sending a final notice.`,
        action:"Send Reminder", client:j.client,
      });
      return; // don't also add an unpaid alert for overdue jobs
    }

    // Unpaid jobs
    if(j.status === "unpaid") {
      // Check how many days since the job date
      let daysSince = 0;
      if(j.date) {
        const jobDate = j.date.includes("-") ? new Date(j.date + "T00:00:00") : new Date(j.date.includes(",") ? j.date : `${j.date}, ${todayYear}`);
        if(!isNaN(jobDate)) {
          jobDate.setHours(0,0,0,0);
          daysSince = Math.floor((today - jobDate) / (1000*60*60*24));
        }
      }
      alerts.push({
        id:`unpaid-${j.id}`, type:"urgent",
        title:`Unpaid: ${j.client}`,
        desc:`${fmt(j.amount)} ${j.type} — unpaid for ${daysSince > 0 ? `${daysSince} days` : "less than a day"}. Follow up now.`,
        action:"Send Reminder", client:j.client,
      });
    }

    // Unanswered quotes
    if(j.status === "quoted") {
      alerts.push({
        id:`quote-${j.id}`, type:"warning",
        title:`Quote Unanswered: ${j.client}`,
        desc:`${j.client} hasn't responded to your ${fmt(j.amount)} ${j.type} quote.`,
        action:"Follow Up", client:j.client,
      });
    }

    // Upcoming scheduled jobs (non-recurring only to avoid spam)
    if(j.status === "scheduled" && (!j.recurring || j.recurring === "none")) {
      alerts.push({
        id:`scheduled-${j.id}`, type:"info",
        title:`Upcoming: ${j.client}`,
        desc:`${j.type} job scheduled for ${fmtDate(j.date)}. Tap to view.`,
        action:"View", client:j.client,
      });
    }

    // Recurring jobs: only alert if coming up within 3 days
    if(j.recurring && j.recurring !== "none" && j.status !== "overdue" && j.status !== "paid") {
      const today = new Date(); today.setHours(0,0,0,0);
      const nextDateStr = firstOccurrenceDate(j.recurring, j.recurringDay);
      const nextDate = new Date(nextDateStr + ", " + today.getFullYear());
      const daysUntil = Math.ceil((nextDate - today) / (1000*60*60*24));
      if(daysUntil <= 3 && daysUntil >= 0) {
        const label = {weekly:"Weekly",biweekly:"Bi-weekly",monthly:"Monthly"}[j.recurring]||"";
        alerts.push({
          id:`rec-${j.id}`, type:"warning",
          title:`${label} Job in ${daysUntil === 0 ? "today" : `${daysUntil} day${daysUntil===1?"":"s"}`}: ${j.client}`,
          desc:`${j.type} — ${fmt(j.amount)} due ${daysUntil === 0 ? "today" : `in ${daysUntil} days`}. Make sure you're prepped.`,
          action:"Dismiss", client:j.client,
          isRecurring:true,
        });
      }
    }
  });
  return alerts;
};

// ── SMART DATE RESOLVER ──────────────────────────────────────────────────────
function localToday() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function resolveRelativeDate(text) {
  const t = text.toLowerCase();
  const today = localToday();
  const dow = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];

  // "today"
  if(/\btoday\b/.test(t)) return toISO(today);

  // "tomorrow"
  if(/\btomorrow\b/.test(t)) {
    const d = new Date(today); d.setDate(d.getDate()+1); return toISO(d);
  }

  // "in X days"
  const inDays = t.match(/\bin (\d+) days?\b/);
  if(inDays) {
    const d = new Date(today); d.setDate(d.getDate()+parseInt(inDays[1])); return toISO(d);
  }

  // "next week"
  if(/\bnext week\b/.test(t)) {
    const d = new Date(today); d.setDate(d.getDate()+7); return toISO(d);
  }

  // "this friday" / "this monday" etc — the coming occurrence of that day this week
  const thisDay = t.match(/\bthis (sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
  if(thisDay) {
    const target = dow.indexOf(thisDay[1]);
    const d = new Date(today);
    let diff = target - d.getDay();
    if(diff <= 0) diff += 7; // if today or past, go to next week
    d.setDate(d.getDate()+diff);
    return toISO(d);
  }

  // "next friday" / "next monday" etc — always at least 7 days out
  const nextDay = t.match(/\bnext (sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/);
  if(nextDay) {
    const target = dow.indexOf(nextDay[1]);
    const d = new Date(today);
    let diff = target - d.getDay();
    if(diff <= 0) diff += 7;  // get to the upcoming occurrence
    diff += 7;                 // then add another week for "next"
    d.setDate(d.getDate()+diff);
    return toISO(d);
  }

  // bare day name e.g. "friday" — treat as "this friday" (next occurrence)
  for(let i=0;i<dow.length;i++) {
    const re = new RegExp(`\\b${dow[i]}\\b`);
    if(re.test(t)) {
      const d = new Date(today);
      let diff = i - d.getDay();
      if(diff <= 0) diff += 7;
      d.setDate(d.getDate()+diff);
      return toISO(d);
    }
  }

  return null; // no relative date found — let AI handle explicit dates
}

async function parseJobWithAI(text) {
  const _d = new Date();
  const today = toISO(localToday());
  // Pre-resolve relative dates so AI doesn't have to do calendar math
  const resolvedDate = resolveRelativeDate(text);
  const dateInstruction = resolvedDate
    ? `date (use exactly "${resolvedDate}" — the relative date in the voice note has already been resolved)`
    : `date (YYYY-MM-DD if an explicit date is mentioned, else empty string)`;

  const r = await fetch("/api/chat",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,
      messages:[{role:"user",content:`Today's date is ${today}. Extract job details from this voice note. Return ONLY raw JSON with these exact keys: client (name), type (job type), amount (number only no $ sign), ${dateInstruction}, status (one of: unpaid/quoted/scheduled/paid/overdue), phone (phone number or empty string), recurring (one of: none/weekly/biweekly/monthly), recurringDay (if monthly: day number 1-31 as string, if weekly/biweekly: day of week 0-6 as string 0=Sunday, else empty string), recurringTime (24hr time like 17:00 if mentioned else empty string), paymentDue (YYYY-MM-DD if payment due date mentioned else empty string), appointmentTime (24hr time like 09:00 if appointment time mentioned and not recurring else empty string). Voice note: "${text}"`}]
    })
  });
  const d = await r.json();
  const raw = d.content?.find(b=>b.type==="text")?.text||"{}";
  return JSON.parse(raw.replace(/```json|```/g,"").trim());
}

// ── PDF INVOICE ───────────────────────────────────────────────────────────────
function InvoicePreview({job, profile}) {
  const sc = {paid:"#22c55e",unpaid:"#ef4444",overdue:"#ef4444",quoted:"#eab308",scheduled:"#3b82f6"};
  const c = sc[job.status]||"#6b7280";
  const bizName = profile?.businessName || "Tracket Pro";
  const ownerName = profile?.ownerName || "";
  const bizPhone = profile?.phone || "";
  const bizEmail = profile?.email || "";
  const bizLocation = profile?.city && profile?.state ? `${profile.city}, ${profile.state}` : (profile?.city || profile?.state || "");
  const bizLicense = profile?.license || "";
  return (
    <div className="pdf-preview">
      <div className="pdf-header">
        <div>
          {profile?.logo
            ? <img src={profile.logo} alt="logo" style={{height:44,maxWidth:120,objectFit:"contain",borderRadius:6,marginBottom:4}}/>
            : <div className="pdf-logo">Trac<span style={{color:"#f5a623"}}>ket</span></div>
          }
          <div style={{fontSize:12,fontWeight:700,color:"#111",marginTop:2}}>{bizName}</div>
          {ownerName && <div style={{fontSize:11,color:"#888"}}>{ownerName}</div>}
          {bizPhone && <div style={{fontSize:11,color:"#888"}}>{bizPhone}</div>}
          {bizEmail && <div style={{fontSize:11,color:"#888"}}>{bizEmail}</div>}
          {bizLocation && <div style={{fontSize:11,color:"#888"}}>{bizLocation}</div>}
          {bizLicense && <div style={{fontSize:11,color:"#888"}}>Lic# {bizLicense}</div>}
        </div>
        <div className="pdf-inv-num"><div className="pdf-inv-title">{invNum(job.id)}</div><div style={{marginTop:4}}>Date: {fmtDate(job.date)||fmtDate(todayStr())}</div></div>
      </div>
      <div className="pdf-row" style={{marginBottom:20}}>
        <div className="pdf-section"><div className="pdf-label">Bill To</div><div className="pdf-value">{job.client}</div></div>
        <div className="pdf-section"><div className="pdf-label">Status</div><span className="pdf-status-badge" style={{background:`${c}18`,color:c,border:`1px solid ${c}44`}}>{job.status}</span></div>
      </div>
      <div className="pdf-line"><span style={{fontWeight:600}}>{job.type}</span><span>{fmt(job.amount)}</span></div>
      {job.paymentDue&&<div style={{fontSize:11,color:"#888",padding:"6px 0"}}>Payment Due: {job.paymentDue}</div>}
      <div className="pdf-total"><span>Total Due</span><span>{fmt(job.amount)}</span></div>
      <div className="pdf-footer">Generated by Tracket · Thank you for your business!</div>
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────────────────────
function AuthScreen() {
  const [authTab, setAuthTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const friendlyError = (code) => {
    if(code==="auth/invalid-credential"||code==="auth/wrong-password"||code==="auth/user-not-found") return "Incorrect email or password. Please try again.";
    if(code==="auth/email-already-in-use") return "An account with this email already exists.";
    if(code==="auth/weak-password") return "Password must be at least 6 characters.";
    if(code==="auth/invalid-email") return "Please enter a valid email address.";
    return "Something went wrong. Please try again.";
  };

  const handleSignIn = async () => {
    setError(""); setLoading(true);
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch(e) { setError(friendlyError(e.code)); }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setError("");
    if(password !== confirmPassword) { setError("Passwords don't match."); return; }
    if(password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try { await createUserWithEmailAndPassword(auth, email, password); }
    catch(e) { setError(friendlyError(e.code)); }
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <style>{CSS}</style>
      <div className="auth-logo">Trac<span>ket</span></div>
      <div className="auth-tagline">Job management built for the trades</div>
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab ${authTab==="signin"?"active":""}`} onClick={()=>{setAuthTab("signin");setError("");}}>Sign In</button>
          <button className={`auth-tab ${authTab==="signup"?"active":""}`} onClick={()=>{setAuthTab("signup");setError("");}}>Create Account</button>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-field">
          <label>Email Address</label>
          <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
        </div>
        <div className="auth-field">
          <label>Password</label>
          <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}/>
        </div>
        {authTab==="signup" && (
          <div className="auth-field">
            <label>Confirm Password</label>
            <input className="auth-input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/>
          </div>
        )}
        <button className="auth-btn" disabled={loading||!email||!password} onClick={authTab==="signin"?handleSignIn:handleSignUp}>
          {loading ? "Please wait..." : authTab==="signin" ? "Sign In →" : "Create Account →"}
        </button>
        <div className="auth-footer">
          {authTab==="signin" ? "Don't have an account? " : "Already have an account? "}
          <span style={{color:"var(--accent)",cursor:"pointer",fontWeight:700}} onClick={()=>{setAuthTab(authTab==="signin"?"signup":"signin");setError("");}}>
            {authTab==="signin"?"Sign up free":"Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── ONBOARDING FLOW ───────────────────────────────────────────────────────────
function OnboardingFlow({onComplete, t}) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ownerName:"",businessName:"",phone:"",email:"",city:"",state:"",license:"",logo:""});
  const logoRef = useRef(null);

  const steps = [
    {
      icon:"👤", title:"What's your name?", subtitle:"We'll use this on your invoices.",
      field:"ownerName", placeholder:"e.g. John Smith", label:"Your Name",
    },
    {
      icon:"🏢", title:"Your business name?", subtitle:"This appears at the top of every invoice.",
      field:"businessName", placeholder:"e.g. Smith Electric LLC", label:"Business Name",
    },
    {
      icon:"📞", title:"Best phone number?", subtitle:"Clients see this on invoices.",
      field:"phone", placeholder:"(919) 000-0000", label:"Phone Number", type:"tel",
    },
    {
      icon:"📧", title:"Your email address?", subtitle:"Used for sending invoices.",
      field:"email", placeholder:"you@example.com", label:"Email Address", type:"email",
    },
    { icon:"📍", title:"Where are you based?", subtitle:"Shows your location on invoices.", field:"__citystate__" },
    {
      icon:"🪪", title:"License number?", subtitle:"Optional — builds trust with clients.",
      field:"license", placeholder:"e.g. EC-12345 (optional)", label:"License #",
    },
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setProfile(p=>({...p, logo:ev.target.result}));
    reader.readAsDataURL(file);
  };

  const isLast = step === steps.length;
  const cur = steps[step];
  const totalSteps = steps.length + 1;

  const handleChange = (field, value) => {
    if(field === "phone") {
      setProfile(p=>({...p, phone: fmtPhone(value)}));
    } else {
      setProfile(p=>({...p, [field]: value}));
    }
  };

  return (
    <div className="ob-overlay">
      <div style={{marginBottom:20,textAlign:"center"}}>
        <div className="ob-logo">Trac<span>ket</span></div>
      </div>
      <div className="ob-card">
        <div className="ob-progress">
          {Array.from({length:totalSteps},(_,i)=>(
            <div key={i} className={`ob-dot ${i<=step?"done":""}`}/>
          ))}
        </div>

        {!isLast ? (
          <>
            <div style={{fontSize:28,marginBottom:8}}>{cur.icon}</div>
            <div className="ob-title">{cur.title}</div>
            <div className="ob-sub">{cur.subtitle}</div>

            {cur.field === "__citystate__" ? (
              <div>
                <div className="ob-field">
                  <label>{t.city}</label>
                  <input className="ob-input" type="text" placeholder="e.g. Bear Creek" value={profile.city} onChange={e=>handleChange("city",e.target.value)} autoFocus/>
                </div>
                <div className="ob-field" style={{marginTop:10}}>
                  <label>{t.state}</label>
                  <select className="ob-input" value={profile.state} onChange={e=>handleChange("state",e.target.value)} style={{cursor:"pointer"}}>
                    <option value="">{t.selectState}</option>
                    {US_STATES.map(s=><option key={s} value={s}>{US_STATES_FULL[s]||s}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <div className="ob-field">
                <label>{cur.label}</label>
                <input
                  className="ob-input"
                  type={cur.type||"text"}
                  placeholder={cur.placeholder}
                  value={profile[cur.field]}
                  onChange={e=>handleChange(cur.field, e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <div className="ob-btns">
              <button className="fbtn" onClick={()=>setStep(s=>s+1)}>
                {step<steps.length-1?t.continueBtn:t.nextBtn}
              </button>
              {step>0&&<button className="fbtn-sec" onClick={()=>setStep(s=>s-1)}>{t.backBtn}</button>}
              <button className="ob-skip" onClick={()=>onComplete(profile)}>{t.skipSetup}</button>
            </div>
          </>
        ) : (
          <>
            <div style={{fontSize:28,marginBottom:8}}>🖼️</div>
            <div className="ob-title">Add a logo? (Optional)</div>
            <div className="ob-sub">Upload your business logo to appear on invoices. You can always add it later in Settings.</div>
            <input type="file" ref={logoRef} accept="image/*" style={{display:"none"}} onChange={handleLogoUpload}/>
            <div className="ob-logo-upload" onClick={()=>logoRef.current?.click()}>
              <div className="ob-logo-preview">
                {profile.logo
                  ? <img src={profile.logo} alt="logo"/>
                  : <span style={{fontSize:20}}>📷</span>
                }
              </div>
              <div>
                <div className="ob-logo-text">{profile.logo?"Logo uploaded ✓":"Tap to upload logo"}</div>
                <div className="ob-logo-sub">PNG, JPG or SVG recommended</div>
              </div>
            </div>
            <div className="ob-btns">
              <button className="fbtn" onClick={()=>onComplete(profile)}>{t.onboardingFinish}</button>
              <button className="fbtn-sec" onClick={()=>setStep(s=>s-1)}>{t.backBtn}</button>
              <button className="ob-skip" onClick={()=>onComplete(profile)}>{t.onboardingSkip}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── SETTINGS PANEL ────────────────────────────────────────────────────────────
function SettingsPanel({onClose, lang, setLang, t, profile, onSaveProfile}) {
  const [destConfirm, setDestConfirm] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [draft, setDraft] = useState({...profile});
  const logoRef = useRef(null);

  const handleSignOut = () => setDestConfirm({type:"signout"});
  const handleDelete  = () => setDestConfirm({type:"delete"});
  const handleCancel  = () => setDestConfirm({type:"cancel"});
  const execDest = () => {
    if(destConfirm.type==="cancel")  { setDestConfirm(null); setTimeout(()=>onClose({action:"cancelled"}),100); }
    else if(destConfirm.type==="signout") { setDestConfirm(null); setTimeout(()=>onClose({action:"signout"}),100); }
    else if(destConfirm.type==="delete")  { setDestConfirm(null); setTimeout(()=>onClose({action:"delete"}),100); }
  };
  const destCopy = destConfirm ? {
    signout:{icon:"👋",q:t.signOutQ,     msg:t.signOutMsg,      yes:t.signOutYes,  btnClass:"confirm-ok"},
    delete: {icon:"🗑️",q:t.deleteAccountQ,msg:t.deleteAccountMsg,yes:t.deleteYes,   btnClass:"fbtn-danger"},
    cancel: {icon:"⚠️",q:t.cancelQ,      msg:t.cancelMsg,       yes:t.yesCancelSub,btnClass:"fbtn-danger"},
  }[destConfirm.type] : null;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setDraft(p=>({...p, logo:ev.target.result}));
    reader.readAsDataURL(file);
  };

  const avatarInitials = profile.businessName
    ? profile.businessName.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()
    : profile.ownerName
    ? profile.ownerName.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()
    : "ME";

  return (
    <div className="settings-panel">
      <div className="settings-backdrop" onClick={onClose}/>
      <div className="settings-sheet">
        <div className="settings-hdr">
          <div className="settings-title">{editingProfile ? t.editProfileTitle : t.settings}</div>
          <button className="settings-close" onClick={editingProfile?()=>setEditingProfile(false):onClose}><XIcon s={16}/></button>
        </div>
        <div style={{height:16}}/>

        {editingProfile ? (
          /* ── EDIT PROFILE SCREEN ── */
          <div className="profile-edit-screen">
            <input type="file" ref={logoRef} accept="image/*" style={{display:"none"}} onChange={handleLogoUpload}/>
            <div className="profile-edit-avatar" onClick={()=>logoRef.current?.click()}>
              {draft.logo
                ? <img src={draft.logo} alt="logo"/>
                : avatarInitials
              }
              <div className="profile-edit-avatar-hint">📷 change</div>
            </div>
            {[
              {key:"ownerName",   label:t.yourName,     placeholder:"Your full name",        type:"text"},
              {key:"businessName",label:t.businessName, placeholder:"Your business name",     type:"text"},
              {key:"phone",       label:t.bizPhone,     placeholder:"(555) 000-0000",         type:"tel"},
              {key:"email",       label:t.emailAddress, placeholder:"you@example.com",        type:"email"},
              {key:"license",     label:t.licenseNum,   placeholder:"e.g. EC-12345",          type:"text"},
            ].map(({key,label,placeholder,type})=>(
              <div key={key} style={{marginBottom:14}}>
                <label className="flabel">{label}</label>
                <input className="finput" type={type} placeholder={placeholder} value={draft[key]||""}
                  onChange={e=>setDraft(p=>({...p,[key]: key==="phone" ? fmtPhone(e.target.value) : e.target.value}))}/>
              </div>
            ))}
            <div style={{marginBottom:14}}>
              <label className="flabel">{t.city}</label>
              <input className="finput" type="text" placeholder="e.g. Bear Creek" value={draft.city||""} onChange={e=>setDraft(p=>({...p,city:e.target.value}))}/>
            </div>
            <div style={{marginBottom:14}}>
              <label className="flabel">{t.state}</label>
              <select className="finput" value={draft.state||""} onChange={e=>setDraft(p=>({...p,state:e.target.value}))} style={{cursor:"pointer"}}>
                <option value="">{t.selectState}</option>
                {US_STATES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="fbtn" style={{marginTop:8}} onClick={()=>{onSaveProfile(draft);setEditingProfile(false);}}>
              <SaveIcon c="#0f1117" s={15}/> {t.saveProfile}
            </button>
            <button className="fbtn-sec" onClick={()=>{setDraft({...profile});setEditingProfile(false);}}>{t.cancel}</button>
          </div>
        ) : (
          /* ── MAIN SETTINGS SCREEN ── */
          <div className="settings-screen">
            <div className="settings-section">
              <div className="settings-group">
                <div className="settings-profile">
                  <div className="settings-avatar">
                    {profile.logo
                      ? <img src={profile.logo} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                      : avatarInitials
                    }
                  </div>
                  <div>
                    <div className="settings-name">{profile.businessName||"Your Business"}</div>
                    <div className="settings-email">{profile.email||"Tap Edit Profile to set up"}</div>
                  </div>
                </div>
                <div className="settings-row" onClick={()=>{setDraft({...profile});setEditingProfile(true);}}>
                  <div className="settings-row-left">
                    <div className="settings-row-icon" style={{background:"rgba(245,166,35,.1)"}}><UserCircleIcon c="var(--accent)" s={16}/></div>
                    <div><div className="settings-row-label">{t.editProfile}</div><div className="settings-row-sub">{t.businessName}, {t.emailAddress}</div></div>
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
                    <div className="settings-row-icon" style={{background:"rgba(245,166,35,.1)"}}><CreditCardIcon c="var(--accent)" s={16}/></div>
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
                    <div className="settings-row-icon" style={{background:"rgba(59,130,246,.1)"}}><span style={{fontSize:14}}>🌐</span></div>
                    <div><div className="settings-row-label">{t.language}</div></div>
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
                    <div className="settings-row-icon" style={{background:"rgba(107,114,128,.1)"}}><LogOutIcon c="var(--muted)" s={16}/></div>
                    <div className="settings-row-label">{t.signOut}</div>
                  </div>
                  <ChevronRightIcon c="var(--muted)"/>
                </div>
                <div className="settings-row danger" onClick={handleDelete}>
                  <div className="settings-row-left">
                    <div className="settings-row-icon" style={{background:"rgba(239,68,68,.1)"}}><TrashIcon c="var(--red)" s={16}/></div>
                    <div><div className="settings-row-label">{t.deleteAccount}</div></div>
                  </div>
                  <ChevronRightIcon c="var(--red)"/>
                </div>
              </div>
            </div>

            <div className="version-text">{t.appVersion}</div>
          </div>
        )}

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

// ── ONBOARDING EMPTY STATE ────────────────────────────────────────────────────
function OnboardingEmpty({onAddJob, t}) {
  return (
    <div className="onboarding-empty">
      <div className="onboarding-title">Welcome to Tracket 👋</div>
      <div className="onboarding-sub">You don't have any jobs yet.<br/>Here's how to add your first one:</div>

      <div className="onboarding-hint" style={{width:"100%"}}>
        {/* Voice hint */}
        <div className="onboarding-hint-card highlighted">
          <div className="onboarding-hint-icon" style={{background:"rgba(245,166,35,.15)"}}>
            <MicIcon c="var(--accent)" s={18}/>
          </div>
          <div className="onboarding-hint-text">
            <div className="onboarding-hint-label">{t.addByVoice}</div>
            <div className="onboarding-hint-sub">{t.addByVoiceSub}</div>
          </div>
        </div>

        {/* Arrow */}
        <div className="onboarding-arrow onboarding-bounce">
          <div className="onboarding-arrow-line"/>
          <ArrowDownIcon c="var(--accent)" s={18}/>
        </div>

        <div className="onboarding-divider">— or —</div>

        {/* Manual hint */}
        <div className="onboarding-hint-card" style={{cursor:"pointer"}} onClick={onAddJob}>
          <div className="onboarding-hint-icon" style={{background:"rgba(59,130,246,.15)"}}>
            <PlusIcon c="var(--blue)" s={18}/>
          </div>
          <div className="onboarding-hint-text">
            <div className="onboarding-hint-label">{t.addManually}</div>
            <div className="onboarding-hint-sub">{t.addManuallySub}</div>
          </div>
        </div>
      </div>

      <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:8,lineHeight:1.6}}>
        Once you add your first job, this guide disappears<br/>and your dashboard takes over.
      </div>
    </div>
  );
}

// ── CALENDAR TAB ──────────────────────────────────────────────────────────────
function CalendarTab({jobs, t}) {
  const today = new Date();
  const todayYear  = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay   = today.getDate();

  const [viewDate, setViewDate] = useState(new Date(todayYear, todayMonth, 1));
  const [selectedDay, setSelectedDay] = useState(null);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName   = viewDate.toLocaleDateString("en-US",{month:"long",year:"numeric"});
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();
  const prevDays    = new Date(year, month, 0).getDate();

  const statusColor = s => ({paid:"#22c55e",unpaid:"#f5a623",overdue:"#ef4444",quoted:"#eab308",scheduled:"#3b82f6"}[s]||"#6b7280");
  const snapDay = (day, yr, mo) => Math.min(Number(day), new Date(yr, mo+1, 0).getDate());

  const isPastMonth = year < todayYear || (year === todayYear && month < todayMonth);
  const isNewYear   = year > todayYear;

  const jobsByDay = {};
  const addToDay = (dayNum, jobEntry) => {
    if(dayNum < 1 || dayNum > daysInMonth) return;
    if(!jobsByDay[dayNum]) jobsByDay[dayNum] = [];
    if(!jobsByDay[dayNum].find(x => x.id === jobEntry.id)) jobsByDay[dayNum].push(jobEntry);
  };

  // Step 1: plot real job records that fall in this month (skip recurring jobs - they use rules only)
  jobs.forEach(j => {
    if(!j.date) return;
    if(j.recurring && j.recurring !== "none") return; // recurring jobs handled by rules only
    const parsed = j.date.includes("-") ? new Date(j.date + "T00:00:00") : new Date(j.date.includes(",") ? j.date : `${j.date}, ${year}`);
    if(isNaN(parsed)) return;
    if(parsed.getMonth() === month && parsed.getFullYear() === year) {
      addToDay(parsed.getDate(), {...j, _projected:false});
    }
  });

  // Step 2: project recurring jobs into current/future months only
  if(!isPastMonth) {
    jobs.forEach(j => {
      if(!j.recurring || j.recurring === "none") return;
      if(j.recurringDay === "" || j.recurringDay === undefined) return;

      if(j.recurring === "monthly") {
        const d = snapDay(j.recurringDay, year, month);
        // Only project if no real record for this client on this day
        const alreadyReal = (jobsByDay[d]||[]).some(x => x.client === j.client && !x._projected);
        if(!alreadyReal) {
          addToDay(d, {...j, status: isNewYear ? "scheduled" : (j.status==="paid"?"scheduled":j.status), _projected:true, id:`proj-${j.id}-${year}-${month}`});
        }
      } else if(j.recurring === "weekly" || j.recurring === "biweekly") {
        const targetDow = Number(j.recurringDay);
        const step = j.recurring === "biweekly" ? 14 : 7;
        for(let d = 1; d <= daysInMonth; d++) {
          if(new Date(year, month, d).getDay() === targetDow) {
            for(let x = d; x <= daysInMonth; x += step) {
              const alreadyReal = (jobsByDay[x]||[]).some(r => r.client === j.client && !r._projected);
              if(!alreadyReal) addToDay(x, {...j, status: isNewYear ? "scheduled" : (j.status==="paid"?"scheduled":j.status), _projected:true, id:`proj-${j.id}-${year}-${month}-${x}`});
            }
            break;
          }
        }
      }
    });
  }

  const jobTime = j => {
    const raw = j.appointmentTime || j.recurringTime || "";
    if(!raw) return null;
    const [h, m] = raw.split(":");
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
  };

  const cells = [];
  for(let i = firstDay-1; i >= 0; i--) cells.push({day:prevDays-i, type:"prev"});
  for(let d = 1; d <= daysInMonth; d++) cells.push({day:d, type:"cur"});
  const remaining = 42 - cells.length;
  for(let d = 1; d <= remaining; d++) cells.push({day:d, type:"next"});

  const isToday = cell => cell.type==="cur" && todayDay===cell.day && todayMonth===month && todayYear===year;

  const selectedJobs = selectedDay
    ? ([...(jobsByDay[selectedDay]||[])].sort((a,b)=>{
        const ta = a.appointmentTime||a.recurringTime||"99:99";
        const tb = b.appointmentTime||b.recurringTime||"99:99";
        return ta.localeCompare(tb);
      }))
    : [];

  return (
    <div className="cal-wrap">
      <div className="cal-nav">
        <button className="cal-arrow" onClick={()=>{setViewDate(new Date(year,month-1,1));setSelectedDay(null);}}>‹</button>
        <div className="cal-month">{monthName}</div>
        <button className="cal-arrow" onClick={()=>{setViewDate(new Date(year,month+1,1));setSelectedDay(null);}}>›</button>
      </div>
      <div className="cal-grid">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} className="cal-day-hdr">{d}</div>)}
        {cells.map((cell,i)=>(
          <div
            key={i}
            className={`cal-cell ${isToday(cell)?"today":""} ${cell.type!=="cur"?"other-month":""} ${selectedDay===cell.day&&cell.type==="cur"?"selected":""}`}
            onClick={()=>cell.type==="cur"&&setSelectedDay(selectedDay===cell.day?null:cell.day)}
          >
            <div className="cal-num">{cell.day}</div>
            {cell.type==="cur" && jobsByDay[cell.day] && (
              <div className="cal-bars">
                {jobsByDay[cell.day].slice(0,3).map((j,k)=>(
                  <div key={k} className="cal-bar" style={{background:statusColor(j.status)}}/>
                ))}
                {jobsByDay[cell.day].length > 3 && (
                  <div style={{fontSize:8,color:"var(--muted)",fontWeight:700,lineHeight:1}}>+{jobsByDay[cell.day].length-3}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="cal-jobs-panel">
          <div className="cal-jobs-hdr">
            {viewDate.toLocaleDateString("en-US",{month:"long"})} {selectedDay}
            {selectedJobs.length===0 && <span style={{fontWeight:400,fontSize:13,color:"var(--muted)",marginLeft:8}}>— {t.noJobsDay}</span>}
          </div>
          {selectedJobs.map((j,idx)=>{
            const time = jobTime(j);
            return (
              <div key={idx} className="cal-job-row">
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:3,borderRadius:2,alignSelf:"stretch",minHeight:32,background:statusColor(j.status),flexShrink:0}}/>
                  <div>
                    <div className="cal-job-name">{j.client}</div>
                    <div className="cal-job-type">{j.type}{time&&<span style={{color:"var(--accent)",fontWeight:700,marginLeft:6}}>@ {time}</span>}</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <div className="cal-job-amt">{fmt(j.amount)}</div>
                  <span className={`badge ${badgeClass(j.status)}`} style={{fontSize:9}}>{t.statusLabels[j.status]||j.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{marginTop:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:"12px 14px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".7px",marginBottom:10}}>Legend</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"8px 16px"}}>
          {[["#ef4444","Overdue"],["#f5a623","Unpaid"],["#eab308","Quoted"],["#3b82f6","Scheduled"],["#22c55e","Paid"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--muted)"}}>
              <div style={{width:12,height:4,borderRadius:2,background:c}}/>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("Jobs");
  const [lang, setLang] = useState("en");
  const [showSettings, setShowSettings] = useState(false);

  // ── FIREBASE AUTH STATE ───────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => { setUser(u); setAuthLoading(false); });
    return unsub;
  }, []);

  // ── STRIPE REDIRECT HANDLER ───────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if(!sessionId || !user) return;
    fetch("/api/verify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if(data.success) {
          setIsPro(true);
          setConfirm({ icon: "🎉", title: "Welcome to Pro!", msg: "Your subscription is active. No more job limits — go get that money." });
          window.history.replaceState({}, "", "/");
        }
      })
      .catch(console.error);
  }, [user]);

  const [jobs, setJobs] = useState([]);
  const [jobHistory, setJobHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dismissed, setDismissed] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [jobFilter, setJobFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [pdfJob, setPdfJob] = useState(null);
  const [jobSort, setJobSort] = useState("none"); // "none"|"date-asc"|"date-desc"|"amount-asc"|"amount-desc"|"name-asc"
  const [showFilters, setShowFilters] = useState(false);

  const defaultProfile = {ownerName:"",businessName:"",phone:"",email:"",city:"",state:"",license:"",logo:""};
  const [businessProfile, setBusinessProfile] = useState(defaultProfile);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load profile and onboarding status from Firestore when user logs in
  useEffect(() => {
    if(!user) { setProfileLoading(false); return; }
    const loadProfile = async () => {
      try {
        const { getDoc } = await import("firebase/firestore");
        const [profileSnap, userSnap] = await Promise.all([
          getDoc(doc(db, "users", user.uid, "meta", "profile")),
          getDoc(doc(db, "users", user.uid)),
        ]);
        if(profileSnap.exists()) {
          setBusinessProfile(profileSnap.data());
          setShowOnboarding(false);
        } else {
          setBusinessProfile(defaultProfile);
          setShowOnboarding(true);
        }
        if(userSnap.exists() && userSnap.data().isPro) setIsPro(true);
      } catch(e) {
        setShowOnboarding(false);
      }
      setProfileLoading(false);
    };
    loadProfile();
  }, [user]);

  // Persist jobs to localStorage
  useEffect(() => {
    try { localStorage.setItem("tracket_jobs", JSON.stringify(jobs)); } catch {}
  }, [jobs]);
  useEffect(() => {
    try { localStorage.setItem("tracket_history", JSON.stringify(jobHistory)); } catch {}
  }, [jobHistory]);

  // ── FIRESTORE SYNC ────────────────────────────────────────────────────────
  useEffect(() => {
    if(!user) return;
    const unsub = onSnapshot(collection(db, "users", user.uid, "jobs"), snap => {
      const data = snap.docs.map(d => ({id: d.id, ...d.data()}));
      if(data.length > 0) setJobs(data);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if(!user) return;
    const unsub = onSnapshot(collection(db, "users", user.uid, "history"), snap => {
      const data = snap.docs.map(d => ({id: d.id, ...d.data()}));
      setJobHistory(data);
    });
    return unsub;
  }, [user]);

  const saveJobToFirestore = async (job) => {
    if(!user) return;
    try { await setDoc(doc(db, "users", user.uid, "jobs", String(job.id)), job); } catch(e) { console.error(e); }
  };

  const deleteJobFromFirestore = async (jobId) => {
    if(!user) return;
    try { await deleteDoc(doc(db, "users", user.uid, "jobs", String(jobId))); } catch(e) { console.error(e); }
  };

  const saveHistoryToFirestore = async (job) => {
    if(!user) return;
    try { await setDoc(doc(db, "users", user.uid, "history", String(job.id)), job); } catch(e) { console.error(e); }
  };

  const deleteHistoryFromFirestore = async (jobId) => {
    if(!user) return;
    try { await deleteDoc(doc(db, "users", user.uid, "history", String(jobId))); } catch(e) { console.error(e); }
  };
  const alertsRef = useRef(null);
  const [stage, setStage] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [parsed, setParsed] = useState(null);
  const [voiceErr, setVoiceErr] = useState("");
  const recogRef = useRef(null);
  const emptyForm = {client:"",type:"",amount:"",date:"",status:"unpaid",phone:"",recurring:"none",recurringDay:"",recurringTime:"",paymentDue:"",appointmentTime:""};
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editJob, setEditJob] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [confirm, setConfirm] = useState(null);
  const [jobActionConfirm, setJobActionConfirm] = useState(null);
  const [showFreeTierModal, setShowFreeTierModal] = useState(false);

  const FREE_TIER_LIMIT = 5;
  const [isPro, setIsPro] = useState(false);
  const isAtFreeTierCap = () => !isPro && jobs.length >= FREE_TIER_LIMIT;

  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, email: user.email }),
      });
      const data = await res.json();
      if(data.url) window.location.href = data.url;
    } catch(err) {
      console.error("Checkout error:", err);
    }
  };

  // Live clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // ── OVERDUE AUTO-DETECTION on load ────────────────────────────────────────
  useEffect(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const todayNum = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    setJobs(prev => prev.map(j => {
      // Already overdue — leave it
      if(j.status === "overdue") return j;

      // ── 1. Payment due date passed (manual) ──
      if((j.status === "unpaid" || j.status === "quoted") && j.paymentDue) {
        const due = new Date(j.paymentDue); due.setHours(0,0,0,0);
        if(due < today) return {...j, status:"overdue"};
      }

      // ── 2. Recurring job: the scheduled day has passed and still unpaid/scheduled ──
      if(j.recurring && j.recurring !== "none" && j.recurringDay !== "" && j.recurringDay !== undefined) {
        if(j.status === "unpaid" || j.status === "scheduled") {
          if(j.recurring === "monthly") {
            // Snap day to this month (e.g. 31 → 28 in Feb)
            const daysInThisMonth = new Date(todayYear, todayMonth + 1, 0).getDate();
            const scheduledDay = Math.min(Number(j.recurringDay), daysInThisMonth);
            // If the scheduled day has already passed this month → overdue
            if(todayNum > scheduledDay) return {...j, status:"overdue"};
          } else if(j.recurring === "weekly" || j.recurring === "biweekly") {
            // Check if the most recent occurrence of that weekday has passed
            const targetDow = Number(j.recurringDay);
            const todayDow = today.getDay();
            // Days since the last occurrence of targetDow
            const daysSince = (todayDow - targetDow + 7) % 7;
            const step = j.recurring === "biweekly" ? 14 : 7;
            // If we're past that day and within the same cycle window → overdue
            if(daysSince > 0 && daysSince < step) return {...j, status:"overdue"};
          }
        }
      }

      // ── 3. One-time unpaid job older than 14 days with no paymentDue set ──
      if(j.status === "unpaid" && !j.paymentDue && j.date) {
        const jobDate = new Date(j.date.includes(",") ? j.date : `${j.date}, ${todayYear}`);
        if(!isNaN(jobDate)) {
          jobDate.setHours(0,0,0,0);
          const daysDiff = Math.floor((today - jobDate) / (1000 * 60 * 60 * 24));
          if(daysDiff > 14) return {...j, status:"overdue"};
        }
      }

      return j;
    }));
  }, []);
  const timeStr = now.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true});
  const dateStr = now.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});

  const t = LANG[lang];

  useEffect(()=>{
    if(tab==="Alerts") setTimeout(()=>alertsRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
  },[tab]);

  const FILTERS = [
    {key:"all",       label:t.allJobs,    pill:t.allJobs,    pillClass:"fp-all",       match:()=>true},
    {key:"owed",      label:"Money Owed", pill:t.moneyOwed,  pillClass:"fp-owed",      match:j=>j.status==="unpaid"||j.status==="overdue"},
    {key:"paid",      label:"Collected",  pill:t.collected,  pillClass:"fp-paid",      match:j=>j.status==="paid"},
    {key:"quoted",    label:"Quoted",     pill:t.openQuotes, pillClass:"fp-quoted",    match:j=>j.status==="quoted"},
    {key:"scheduled", label:"Upcoming",   pill:t.upcoming,   pillClass:"fp-scheduled", match:j=>j.status==="scheduled"},
  ];

  // ── STAT CARD TOGGLE: clicking active filter returns to "all" ──────────────
  const goToFilter = key => {
    if(jobFilter === key) {
      setJobFilter("all");
    } else {
      setJobFilter(key);
    }
    setTab("Jobs");
    setExpanded(null);
  };

  const allAlerts = buildDynamicAlerts(jobs).filter(a=>!dismissed.includes(a.id));
  const activeAlerts = allAlerts;

  const owed     = jobs.filter(j=>j.status==="unpaid"||j.status==="overdue").reduce((s,j)=>s+j.amount,0);
  const collected= jobs.filter(j=>j.status==="paid").reduce((s,j)=>s+j.amount,0);
  const quoted   = jobs.filter(j=>j.status==="quoted").reduce((s,j)=>s+j.amount,0);
  const upcoming = jobs.filter(j=>j.status==="scheduled").reduce((s,j)=>s+j.amount,0);

  const filterCfg      = FILTERS.find(f=>f.key===jobFilter);
  const baseFiltered   = jobs.filter(filterCfg.match).filter(j=>!search||j.client.toLowerCase().includes(search.toLowerCase())||j.type.toLowerCase().includes(search.toLowerCase()));
  const parseJobDate = (j) => {
    if(j.paymentDue) return new Date(j.paymentDue + "T00:00:00");
    if(j.date) {
      if(j.date.includes("-")) return new Date(j.date + "T00:00:00");
      const yr = new Date().getFullYear();
      const raw = j.date.includes(",") ? j.date : `${j.date}, ${yr}`;
      const parsed = new Date(raw);
      if(!isNaN(parsed)) return parsed;
    }
    return new Date(8640000000000000);
  };
  const filteredJobs   = [...baseFiltered].sort((a,b)=>{
    if(jobSort==="name-asc")      return a.client.localeCompare(b.client);
    if(jobSort==="amount-desc")   return b.amount - a.amount;
    if(jobSort==="amount-asc")    return a.amount - b.amount;
    if(jobSort==="date-asc")      return parseJobDate(a) - parseJobDate(b);
    if(jobSort==="date-desc")     return parseJobDate(b) - parseJobDate(a);
    return 0;
  });
  const contacts       = jobs.map((j,i)=>({id:j.id,name:j.client,initials:getInitials(j.client),color:COLORS[i%COLORS.length],jobType:j.type,amount:j.amount,status:j.status,phone:j.phone}));
  const filteredContacts = contacts.filter(c=>!search||c.name.toLowerCase().includes(search.toLowerCase()));

  const dismissAlert = (id,title) => {
    setDismissed(d=>[...d,id]);
    if(toastTimer.current) clearTimeout(toastTimer.current);
    setToast({id,title});
    toastTimer.current = setTimeout(()=>setToast(null),4000);
  };
  const undoDismiss = () => { if(!toast) return; setDismissed(d=>d.filter(x=>x!==toast.id)); setToast(null); };

  const handleAlertAction = a => {
    if(a.action==="Send Reminder") setConfirm({icon:"📨",title:t.reminderSentTitle,msg:t.reminderSentMsg(a.client)});
    else if(a.action==="Follow Up") setConfirm({icon:"📞",title:t.followUpTitle,msg:t.followUpMsg(a.client)});
    else if(a.action==="Mark Ready") {
      // Find the job and open it for editing so user can update status
      const job = jobs.find(j=>j.client===a.client);
      if(job) { setTab("Jobs"); setExpanded(job.id); }
    }
    else if(a.action==="View") { setTab("Jobs"); setSearch(a.client); }
    else if(a.action==="Dismiss") dismissAlert(a.id, a.title);
  };

  const handleRemind = (client,e) => { e.stopPropagation(); setConfirm({icon:"📨",title:t.reminderSentTitle,msg:t.reminderSentMsg(client)}); };
  const changeStatus = (id,status,e) => { e.stopPropagation(); setJobs(prev=>prev.map(j=>j.id===id?{...j,status}:j)); };

  // ── RECURRING: when job is marked paid, auto-create next job ─────────────
  const handleStatusChange = (id, newStatus, e) => {
    e.stopPropagation();
    const job = jobs.find(j=>j.id===id);
    const updated = {...job, status:newStatus};
    setJobs(prev=>prev.map(j=>j.id===id?updated:j));
    saveJobToFirestore(updated);
    if(newStatus === "paid" && job?.recurring && job.recurring !== "none") {
      const nextDate = addInterval(job.date, job.recurring);
      const nextJob = {
        id: Date.now(),
        client: job.client,
        type: job.type,
        amount: job.amount,
        status: "scheduled",
        date: nextDate,
        phone: job.phone,
        recurring: job.recurring,
      };
      setTimeout(()=>{
        if(isAtFreeTierCap()) { setShowFreeTierModal(true); return; }
        setJobs(prev=>[nextJob,...prev]);
        saveJobToFirestore(nextJob);
        setConfirm({icon:"🔁",title:t.recurringCreatedTitle,msg:t.recurringCreatedMsg(job.recurring,job.client,nextDate)});
      },300);
    }
  };

  // ── DELETE / ARCHIVE ──────────────────────────────────────────────────────
  const promptDelete  = (job,e) => { e.stopPropagation(); setJobActionConfirm({job}); };
  const execJobAction = () => {
    if(!jobActionConfirm) return;
    const {type, job} = jobActionConfirm;
    if(type==="delete") {
      setJobs(prev=>prev.filter(j=>j.id!==job.id));
      deleteJobFromFirestore(job.id);
    } else {
      setJobs(prev=>prev.filter(j=>j.id!==job.id));
      deleteJobFromFirestore(job.id);
      const archived = {...job, archivedDate:todayStr()};
      setJobHistory(prev=>[archived, ...prev]);
      saveHistoryToFirestore(archived);
    }
    setExpanded(null);
    setJobActionConfirm(null);
  };

  const restoreJob = (job) => {
    setJobHistory(prev=>prev.filter(j=>j.id!==job.id));
    deleteHistoryFromFirestore(job.id);
    const restored = {...job, archivedDate:undefined};
    setJobs(prev=>[restored, ...prev]);
    saveJobToFirestore(restored);
  };

  // ── VOICE ─────────────────────────────────────────────────────────────────
  const liveTranscriptRef = useRef("");
  const startVoice = () => {
    setVoiceErr("");
    if(!voiceSupported()) { setVoiceErr(t.voiceNotSupported); setStage("voiceUnsupported"); return; }
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = lang==="es"?"es-US":"en-US";
    r.interimResults = true;
    r.continuous = true;
    liveTranscriptRef.current = "";
    recogRef.current = r;
    r.onresult = e => {
      let full = "";
      for(let i=0;i<e.results.length;i++) full += e.results[i][0].transcript + " ";
      liveTranscriptRef.current = full.trim();
      setTranscript(full.trim());
    };
    r.onerror = e => { setVoiceErr("Mic error: "+e.error+". Please try again."); setStage(null); };
    r.start();
    setStage("listening");
  };
  const stopVoice = () => {
    recogRef.current?.stop();
    const tx = liveTranscriptRef.current;
    if(!tx) { setStage(null); return; }
    setStage("processing");
    parseJobWithAI(tx).then(p=>{ setParsed(p); setStage("confirm"); }).catch(()=>setStage(null));
  };

  const confirmSave = () => {
    if(isAtFreeTierCap()) { setShowFreeTierModal(true); return; }
    const isRecurring = parsed.recurring && parsed.recurring !== "none";
    const jobDate = isRecurring && parsed.recurringDay
      ? firstOccurrenceDate(parsed.recurring, parsed.recurringDay)
      : (parsed.date || todayStr());
    const jobStatus = isRecurring ? "scheduled" : (parsed.status || "unpaid");
    const newJob = {id:Date.now(),client:parsed.client||"Unknown Client",type:parsed.type||"General Job",amount:parseFloat(parsed.amount)||0,date:jobDate,status:jobStatus,phone:parsed.phone||"",recurring:parsed.recurring||"none",recurringDay:parsed.recurringDay||"",recurringTime:parsed.recurringTime||"",paymentDue:parsed.paymentDue||"",appointmentTime:parsed.appointmentTime||""};
    setJobs(prev=>[newJob, ...prev]);
    saveJobToFirestore(newJob);
    setStage(null); setTranscript(""); setParsed(null); setTab("Jobs");
  };

  const saveForm = () => {
    if(!form.client.trim()) return;
    if(isAtFreeTierCap()) { setShowFreeTierModal(true); return; }
    const isRecurring = form.recurring && form.recurring !== "none";
    const jobDate = isRecurring && form.recurringDay
      ? firstOccurrenceDate(form.recurring, form.recurringDay)
      : (form.date || todayStr());
    const jobStatus = isRecurring ? "scheduled" : (form.status || "unpaid");
    const newJob = {id:Date.now(),client:form.client,type:form.type||"General Job",amount:parseFloat(form.amount)||0,date:jobDate,status:jobStatus,phone:form.phone||"",recurring:form.recurring||"none",recurringDay:form.recurringDay||"",recurringTime:form.recurringTime||"",paymentDue:form.paymentDue||"",appointmentTime:form.appointmentTime||""};
    setJobs(prev=>[newJob,...prev]);
    saveJobToFirestore(newJob);
    setForm(emptyForm); setShowForm(false);
  };

  const openEdit = (j,e) => { e.stopPropagation(); setEditJob({...j, recurring: j.recurring||"none"}); };
  const saveEdit = () => {
    if(!editJob.client.trim()) return;
    const updated = {...editJob, amount:parseFloat(editJob.amount)||0};
    setJobs(prev=>prev.map(j=>j.id===editJob.id?updated:j));
    saveJobToFirestore(updated);
    setEditJob(null);
  };

  const toggle = key => setExpanded(expanded===key?null:key);

  const handleSettingsClose = async (result) => {
    setShowSettings(false);
    if(!result) return;
    if(result.action==="cancelled") setConfirm({icon:"✅",title:t.subCancelled,msg:t.subCancelledMsg});
    if(result.action==="signout") { try { await signOut(auth); } catch(e){} }
    if(result.action==="delete") {
      try {
        if(user) {
          const { getDocs, deleteDoc: firestoreDelete } = await import("firebase/firestore");
          const jobsSnap = await getDocs(collection(db, "users", user.uid, "jobs"));
          for(const d of jobsSnap.docs) await firestoreDelete(d.ref);
          const histSnap = await getDocs(collection(db, "users", user.uid, "history"));
          for(const d of histSnap.docs) await firestoreDelete(d.ref);
          await firestoreDelete(doc(db, "users", user.uid, "meta", "profile")).catch(()=>{});
          await deleteUser(user);
        }
      } catch(e) {
        try { await signOut(auth); } catch(_) {}
      }
    }
  };

  const handleOnboardingComplete = async (profile) => {
    setBusinessProfile(profile);
    setShowOnboarding(false);
    if(user) {
      try { await setDoc(doc(db, "users", user.uid, "meta", "profile"), profile); } catch(e) { console.error(e); }
    }
  };

  const handleSaveProfile = async (profile) => {
    setBusinessProfile(profile);
    if(user) {
      try { await setDoc(doc(db, "users", user.uid, "meta", "profile"), profile); } catch(e) { console.error(e); }
    }
    setConfirm({icon:"✅", title:t.profileSaved, msg:t.profileSavedMsg});
  };

  const recurringLabel = (job) => {
    const base = {weekly:t.weekly,biweekly:t.biweekly,monthly:t.monthly}[job.recurring]||"";
    if(!base) return "";
    const dayLabel = job.recurring==="monthly"
      ? (job.recurringDay ? ` · ${job.recurringDay}${["th","st","nd","rd"][Math.min(job.recurringDay%10,3)]||"th"}` : "")
      : (job.recurringDay!=="" && job.recurringDay!==undefined ? ` · ${t.days[job.recurringDay]}` : "");
    const timeLabel = job.recurringTime ? ` @ ${formatTime(job.recurringTime)}` : "";
    return base + dayLabel + timeLabel;
  };

  return (
    <>
      <style>{CSS}</style>
      {authLoading && (
        <div style={{minHeight:"100vh",background:"#0f1117",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:800,color:"#e8eaf0"}}>Trac<span style={{color:"#f5a623"}}>ket</span></div>
        </div>
      )}
      {!authLoading && !user && <AuthScreen/>}
      {!authLoading && user && (authLoading || profileLoading) && (
        <div style={{minHeight:"100vh",background:"#0f1117",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:800,color:"#e8eaf0"}}>Trac<span style={{color:"#f5a623"}}>ket</span></div>
        </div>
      )}
      {!authLoading && user && !profileLoading && showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} t={t}/>
      )}
      {!authLoading && user && !profileLoading && !showOnboarding && (
      <div className="app">

        {/* ── HEADER ── */}
        <div className="hdr">
        <div className="logo">Trac<span>ket</span></div>
          <div className="hdr-center">
            <div className="hdr-time">{timeStr}</div>
            <div className="hdr-date">{dateStr}</div>
          </div>
          <div className="hdr-right">
            <button className="bell-btn" onClick={()=>setTab("Alerts")}>
              <BellIcon/>
              {activeAlerts.length>0&&<span className="nbadge">{activeAlerts.length}</span>}
            </button>
            <button className="menu-btn" onClick={()=>setShowSettings(true)}>
              <MenuIcon s={18}/>
            </button>
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
            <div className="stat-lbl">{t.moneyOwed}</div>
            <div className="stat-val c-red">{fmt(owed)}</div>
            <div className="stat-sub">{jobs.filter(j=>j.status==="unpaid"||j.status==="overdue").length} {t.awaiting}</div>
            <div className="stat-tap"><FilterIcon c="#6b7280" s={10}/> {jobFilter==="owed"?t.tapClear:t.tapFilter}</div>
          </div>
          <div className={`stat ${jobFilter==="paid"?"af-green":""}`} onClick={()=>goToFilter("paid")}>
            <div className="stat-lbl">{t.collected}</div>
            <div className="stat-val c-green">{fmt(collected)}</div>
            <div className="stat-sub">{jobs.filter(j=>j.status==="paid").length} {t.paidJobs}</div>
            <div className="stat-tap"><FilterIcon c="#6b7280" s={10}/> {jobFilter==="paid"?t.tapClear:t.tapFilter}</div>
          </div>
          <div className={`stat ${jobFilter==="quoted"?"af-yellow":""}`} onClick={()=>goToFilter("quoted")}>
            <div className="stat-lbl">{t.openQuotes}</div>
            <div className="stat-val c-yellow">{fmt(quoted)}</div>
            <div className="stat-sub">{jobs.filter(j=>j.status==="quoted").length} {t.awaiting}</div>
            <div className="stat-tap"><FilterIcon c="#6b7280" s={10}/> {jobFilter==="quoted"?t.tapClear:t.tapFilter}</div>
          </div>
          <div className={`stat ${jobFilter==="scheduled"?"af-blue":""}`} onClick={()=>goToFilter("scheduled")}>
            <div className="stat-lbl">{t.upcoming}</div>
            <div className="stat-val c-blue">{fmt(upcoming)}</div>
            <div className="stat-sub">{jobs.filter(j=>j.status==="scheduled").length} {t.scheduled}</div>
            <div className="stat-tap"><FilterIcon c="#6b7280" s={10}/> {jobFilter==="scheduled"?t.tapClear:t.tapFilter}</div>
          </div>
        </div>

        {/* ── JOBS TAB ── */}
        {tab==="Jobs"&&(
          <div className="sec">
            <div className="sec-hdr">
              <div className="sec-title">{search?t.results(search):jobFilter==="all"?t.allJobs:filterCfg.label}</div>
              <div className="sec-hdr-right">
                <button className="history-btn" onClick={()=>setShowHistory(true)}>
                  <HistoryIcon c="currentColor" s={13}/>
                  {t.history}
                  {jobHistory.length>0&&<span className="history-badge">{jobHistory.length}</span>}
                </button>
                <button className="add-btn" onClick={()=>setShowForm(true)}><PlusIcon/> {t.addJob}</button>
              </div>
            </div>

            {/* FREE TIER COUNTER */}
            {!isPro && jobs.length >= 4 && jobs.length < FREE_TIER_LIMIT && (
              <div style={{fontSize:11,color:"var(--yellow)",fontWeight:600,textAlign:"right",marginBottom:6,paddingRight:2}}>
                {FREE_TIER_LIMIT - jobs.length} free slot{FREE_TIER_LIMIT - jobs.length === 1 ? "" : "s"} remaining
              </div>
            )}
            {!isPro && jobs.length >= FREE_TIER_LIMIT && (
              <div style={{fontSize:11,color:"var(--red)",fontWeight:600,textAlign:"right",marginBottom:6,paddingRight:2,cursor:"pointer"}} onClick={()=>setShowFreeTierModal(true)}>
                Free limit reached · <span style={{textDecoration:"underline"}}>Upgrade to Pro</span>
              </div>
            )}

            <div className="filter-bar">
              {FILTERS.map(f=>(
                <button key={f.key} className={`fpill ${f.pillClass} ${jobFilter===f.key?"on":""}`} onClick={()=>goToFilter(f.key)}>{f.pill}</button>
              ))}
            </div>

            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:showFilters?8:14}}>
              <button
                className={`sort-pill ${showFilters||jobSort!=="none"?"active":""}`}
                style={{display:"flex",alignItems:"center",gap:5}}
                onClick={()=>setShowFilters(v=>!v)}
              >
                <FilterIcon c={showFilters||jobSort!=="none"?"var(--accent)":"var(--muted)"} s={11}/>
                {t.filter}{jobSort!=="none"?` · ${[
                  {key:"date-desc",label:t.sortNewest},{key:"date-asc",label:t.sortOldest},
                  {key:"amount-desc",label:t.sortHigh},{key:"amount-asc",label:t.sortLow},{key:"name-asc",label:t.sortAZ}
                ].find(s=>s.key===jobSort)?.label||""}` : ""}
              </button>
              {jobSort!=="none"&&(
                <button className="filter-clear" style={{fontSize:12}} onClick={()=>{setJobSort("none");setShowFilters(false);}}>{t.clearFilter}</button>
              )}
            </div>

            {showFilters&&(
              <div className="sort-bar">
                <SortIcon c="var(--muted)" s={13}/>
                {[
                  {key:"none",       label:t.sortDefault},
                  {key:"date-desc",  label:t.sortNewest},
                  {key:"date-asc",   label:t.sortOldest},
                  {key:"amount-desc",label:t.sortHigh},
                  {key:"amount-asc", label:t.sortLow},
                  {key:"name-asc",   label:t.sortAZ},
                ].map(s=>(
                  <button key={s.key} className={`sort-pill ${jobSort===s.key?"active":""}`} onClick={()=>{setJobSort(s.key);setShowFilters(false);}}>{s.label}</button>
                ))}
              </div>
            )}

            {/* ── ONBOARDING EMPTY STATE ── */}
            {jobs.length===0 && !search ? (
              <OnboardingEmpty onAddJob={()=>setShowForm(true)} t={t}/>
            ) : (
              <>
                {filteredJobs.length===0&&<div className="empty">{search?t.noJobsMatch(search):t.noJobsYet}</div>}
                {filteredJobs.map(j=>(
                  <div key={j.id} className={`jcard ${expanded===j.id?"open":""}`} onClick={()=>toggle(j.id)}>
                    <div className="jcard-top">
                      <div>
                        <div className="jname">{j.client}</div>
                        <div className="jtype">{j.type}</div>
                        {j.recurring && j.recurring!=="none" && (
                          <div className="recurring-tag"><RepeatIcon c="#a855f7" s={10}/> {recurringLabel(j)}</div>
                        )}
                      </div>
                      <span className={`badge ${badgeClass(j.status)}`}>{t.statusLabels[j.status]||j.status}</span>
                    </div>
                    <div className="jcard-bot">
                      <div className="jamt">{fmt(j.amount)}</div>
                      <div className="jdate">{fmtDate(j.date)}</div>
                    </div>
                    <div className="pbar"><div className="pbar-fill" style={{width:j.status==="paid"?"100%":j.status==="overdue"?"100%":"40%",background:j.status==="paid"?"var(--green)":j.status==="overdue"?"var(--red)":"var(--accent)"}}/></div>
                    {expanded===j.id&&(
                      <div className="drawer" onClick={e=>e.stopPropagation()}>
                        <div className="drawer-actions">
                          {j.phone&&<a href={`tel:${j.phone.replace(/\D/g,"")}`} className="daction da-call" style={{textDecoration:"none"}} onClick={e=>e.stopPropagation()}><PhoneIcon c="#3b82f6"/> {t.call}</a>}
                          {(j.status==="unpaid"||j.status==="overdue")&&<button className="daction da-remind" onClick={e=>handleRemind(j.client,e)}><BellIcon c="var(--accent)" s={13}/> {t.remind}</button>}
                          <button className="daction da-pdf" onClick={e=>{e.stopPropagation();setPdfJob(j);}}><FileIcon c="var(--green)"/> {t.invoice}</button>
                          <button className="daction da-edit" onClick={e=>openEdit(j,e)}><ZapIcon c="#a855f7" s={13}/> {t.edit}</button>
                        </div>
                        <div className="drawer-status">
                          <span className="status-lbl">{t.status}:</span>
                          <select className="status-select" value={j.status} onChange={e=>handleStatusChange(j.id,e.target.value,e)}>
                            {STATUSES.map(s=><option key={s} value={s}>{t.statusLabels[s]||s}</option>)}
                          </select>
                        </div>
                        <div className="drawer-danger">
                          <button className="daction da-delete" onClick={e=>promptDelete(j,e)}><TrashIcon c="var(--red)" s={13}/> {t.deleteJobTitle}</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── ALERTS TAB ── */}
        {tab==="Alerts"&&(
          <div className="sec" ref={alertsRef}>
            <div className="sec-hdr">
              <div className="sec-title">{t.aiAlerts}</div>
              {activeAlerts.length>0&&<span style={{fontSize:12,color:"#ef4444",fontWeight:600}}>{t.activeAlerts(activeAlerts.length)}</span>}
            </div>
            {activeAlerts.length===0&&<div className="empty">{t.noAlerts}</div>}
            {activeAlerts.map(a=>(
              <div key={a.id} className={`acard ${a.type}`}>
                <div style={{marginTop:2,flexShrink:0}}>
                  {a.type==="urgent"&&<AlertIcon/>}
                  {a.type==="warning"&&<ClockIcon/>}
                  {a.type==="info"&&<InfoIcon/>}
                </div>
                <div style={{flex:1}}>
                  <div className="atitle">{a.title}</div>
                  <div className="adesc">{a.desc}</div>
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <button className="aact" onClick={()=>handleAlertAction(a)}>{a.action}</button>
                    <button className="aact" style={{color:"#6b7280"}} onClick={()=>dismissAlert(a.id,a.title)}>{t.dismiss}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CALENDAR TAB ── */}
        {tab==="Calendar"&&(
          <CalendarTab jobs={jobs} t={t}/>
        )}

        {/* ── CONTACTS TAB ── */}
        {tab==="Contacts"&&(
          <div className="sec">
            <div className="sec-hdr">
              <div className="sec-title">{search?t.results(search):t.contacts}</div>
            </div>
            {filteredContacts.length===0&&<div className="empty">{search?t.noContacts(search):t.noContactsYet}</div>}
            {filteredContacts.map(c=>(
              <div key={c.id} className={`ccard ${expanded===("c"+c.id)?"open":""}`} onClick={()=>toggle("c"+c.id)}>
                <div className="cmain">
                  <div className="cavatar" style={{background:`${c.color}22`,border:`1.5px solid ${c.color}44`,color:c.color}}>{c.initials}</div>
                  <div style={{flex:1}}>
                    <div className="cname">{c.name}</div>
                    <div className="cdetail">{c.jobType} · <span className={`badge ${badgeClass(c.status)}`} style={{fontSize:9}}>{t.statusLabels[c.status]||c.status}</span></div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:"var(--accent)"}}>{fmt(c.amount)}</div>
                    <ChevronIcon/>
                  </div>
                </div>
                {expanded===("c"+c.id)&&(
                  <div className="cdrawer" onClick={e=>e.stopPropagation()}>
                    {c.phone&&<span style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"var(--muted)"}}><PhoneIcon c="var(--muted)"/>{c.phone}</span>}
                    {c.phone&&<a href={`tel:${c.phone.replace(/\D/g,"")}`} className="daction da-call" style={{textDecoration:"none"}}><PhoneIcon c="#3b82f6"/> {t.call}</a>}
                    <button className="daction da-remind" onClick={e=>handleRemind(c.name,e)}><BellIcon c="var(--accent)" s={13}/> {t.remind}</button>
                    <button className="daction da-edit" onClick={e=>{ const job=jobs.find(j=>j.id===c.id); if(job) openEdit(job,e); }}><ZapIcon c="#a855f7" s={13}/> {t.edit}</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FAB */}
        <div className="fab-wrap">
          {stage==="listening" ? (
            <>
              <button className="fab listening" onClick={stopVoice}>
                <CheckIcon c="#fff" s={22}/>
              </button>
              <span className="fab-label listening">{t.doneTalking}</span>
            </>
          ) : (
            <>
              <button className="fab" onClick={startVoice}>
                <MicIcon c="#0f1117" s={24}/>
              </button>
              <span className="fab-label">{t.voiceAdd}</span>
            </>
          )}
        </div>

        {/* NAV */}
        <nav className="nav">
          {[
            {name:"Jobs",     icon:<WrenchIcon/>},
            {name:"Calendar", icon:<CalendarIcon/>},
            {name:"Contacts", icon:<UsersIcon/>},
            {name:"Alerts",   icon:<BellIcon/>},
          ].map(nt=>(
            <button key={nt.name} className={`ni ${tab===nt.name?"active":""}`} onClick={()=>{setTab(nt.name);setExpanded(null);}}>
              {nt.icon}
              {nt.name==="Calendar"?"Calendar":t[nt.name.toLowerCase()]||nt.name}
              {nt.name==="Alerts"&&activeAlerts.length>0&&<span className="nav-badge">{activeAlerts.length}</span>}
            </button>
          ))}
        </nav>

        {/* TOAST */}
        {toast&&(
          <div className="toast">
            <span style={{fontSize:13,fontWeight:600}}>{t.alertDismissed}</span>
            <button className="toast-undo" onClick={undoDismiss}>{t.undo}</button>
          </div>
        )}

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

        {/* JOB DELETE / ARCHIVE CONFIRM */}
        {jobActionConfirm&&(
          <div className="confirm-popup" onClick={()=>setJobActionConfirm(null)}>
            <div className="confirm-box" onClick={e=>e.stopPropagation()}>
              <div className="confirm-icon" style={{display:"flex",justifyContent:"center",marginBottom:12}}><TrashIcon c="var(--red)" s={28}/></div>
              <div className="confirm-title">{t.deleteJobTitle}</div>
              <div className="confirm-msg" style={{marginBottom:16}}>{t.deleteOrArchive}</div>
              <button className="fbtn-danger" onClick={()=>{ setJobs(prev=>prev.filter(j=>j.id!==jobActionConfirm.job.id)); setExpanded(null); setJobActionConfirm(null); }}>
                {t.deletePermTitle}
              </button>
              <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",margin:"6px 0 2px"}}>{t.deletePermMsg}</div>
              <button className="daction da-archive" style={{width:"100%",justifyContent:"center",marginTop:10}} onClick={()=>{ setJobs(prev=>prev.filter(j=>j.id!==jobActionConfirm.job.id)); setJobHistory(prev=>[{...jobActionConfirm.job,archivedDate:todayStr()},...prev]); setExpanded(null); setJobActionConfirm(null); }}>
                <HistoryIcon c="var(--muted)" s={13}/> {t.moveHistTitle}
              </button>
              <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",margin:"6px 0 2px"}}>{t.moveHistMsg}</div>
              <button className="fbtn-sec" style={{marginTop:10}} onClick={()=>setJobActionConfirm(null)}>{t.cancel}</button>
            </div>
          </div>
        )}

        {/* HISTORY MODAL */}
        {showHistory&&(
          <div className="overlay" onClick={()=>setShowHistory(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhandle"/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="mtitle"><HistoryIcon c="var(--accent)" s={20}/> {t.history}</div>
                <button style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280"}} onClick={()=>setShowHistory(false)}><XIcon/></button>
              </div>
              <div className="msub">{t.historySubtitle(jobHistory.length)}</div>
              {jobHistory.length===0&&<div className="empty">{t.historyEmpty}</div>}
              {jobHistory.map(j=>(
                <div key={j.id} className="jcard history-card">
                  <div className="jcard-top">
                    <div><div className="jname">{j.client}</div><div className="jtype">{j.type}</div></div>
                    <span className="badge b-archived">Archived</span>
                  </div>
                  <div className="jcard-bot">
                    <div className="jamt">{fmt(j.amount)}</div>
                    <div className="jdate">Archived {j.archivedDate}</div>
                  </div>
                  <div style={{marginTop:10}}>
                    <button className="daction da-restore" onClick={()=>restoreJob(j)} style={{width:"100%",justifyContent:"center"}}>
                      <RestoreIcon c="var(--green)" s={14}/> {t.restore}
                    </button>
                  </div>
                </div>
              ))}
              <button className="fbtn-sec" onClick={()=>setShowHistory(false)} style={{marginTop:12}}>{t.close}</button>
            </div>
          </div>
        )}

        {/* PDF INVOICE MODAL */}
        {pdfJob&&(
          <div className="overlay" onClick={()=>setPdfJob(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhandle"/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div className="mtitle" style={{marginBottom:0}}><FileIcon c="#22c55e" s={20}/> {t.invoice}</div>
                <button style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280"}} onClick={()=>setPdfJob(null)}><XIcon/></button>
              </div>
              <InvoicePreview job={pdfJob} profile={businessProfile}/>
              <button className="fbtn" onClick={()=>{setConfirm({icon:"📄",title:t.pdfReadyTitle,msg:t.pdfReadyMsg});setPdfJob(null);}}>{t.downloadSend}</button>
              <button className="fbtn-sec" onClick={()=>setPdfJob(null)}>{t.close}</button>
            </div>
          </div>
        )}

        {/* VOICE: Safari unsupported */}
        {stage==="voiceUnsupported"&&(
          <div className="overlay" onClick={()=>setStage(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mhandle"/>
              <div className="mtitle" style={{color:"var(--blue)"}}>🎙️ Voice Not Available</div>
              <div className="voice-unsupported">{t.voiceNotSupported}</div>
              <div className="msub">{t.fillManually}</div>
              <label className="flabel">{t.clientName} *</label>
              <input className="finput" placeholder="e.g. John Smith" value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))}/>
              <label className="flabel">{t.jobType}</label>
              <input className="finput" placeholder="e.g. HVAC Install" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/>
              <div className="frow">
                <div><label className="flabel">{t.amountDollar}</label><input className="finput" type="number" placeholder="0" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))}/></div>
                <div><label className="flabel">{t.date}</label><input className="finput" type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div>
              </div>
              <label className="flabel">{t.status}</label>
              <select className="finput" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s} value={s}>{t.statusLabels[s]||s}</option>)}
              </select>
              <button className="fbtn" onClick={()=>{saveForm();setStage(null);}}>{t.saveJob}</button>
              <button className="fbtn-sec" onClick={()=>setStage(null)}>{t.cancel}</button>
            </div>
          </div>
        )}

        {/* VOICE MODALS */}
        {stage==="listening"&&(
          <div className="overlay" style={{top:70,backdropFilter:"none",background:"rgba(0,0,0,.6)"}}>
            <div className="modal">
              <div className="mhandle"/>
              <div className="mtitle" style={{color:"#ef4444"}}><MicIcon c="#ef4444" s={20}/> {t.listeningTitle}</div>
              <div className="msub">{t.sayLike}<br/><em style={{color:"#e8eaf0"}}>{t.exampleVoice}</em></div>
              {transcript&&<div style={{fontSize:13,color:"var(--muted)",fontStyle:"italic",margin:"8px 0",lineHeight:1.5}}>"{transcript}"</div>}
              <div className="vbars">{[0,1,2,3,4,5].map(i=><div key={i} className="vbar" style={{animationDelay:`${i*.1}s`}}/>)}</div>
              <button className="fbtn" onClick={stopVoice} style={{background:"linear-gradient(135deg,#22c55e,#16a34a)"}}><CheckIcon c="#fff" s={16}/> {t.doneTalking}</button>
            </div>
          </div>
        )}
        {stage==="processing"&&(
          <div className="overlay" style={{top:70,backdropFilter:"none",background:"rgba(0,0,0,.6)"}}>
            <div className="modal">
              <div className="mhandle"/>
              <div className="mtitle"><ZapIcon/> {t.aiProcessing}</div>
              <div className="msub">{t.pullingDetails}</div>
              <div style={{textAlign:"center",padding:"20px 0",color:"#6b7280",fontSize:13,fontStyle:"italic"}}>"{transcript}"</div>
            </div>
          </div>
        )}
        {stage==="confirm"&&parsed&&(
          <div className="overlay"><div className="modal">
            <div className="mhandle"/>
            <div className="mtitle" style={{color:"#22c55e"}}><CheckIcon c="#22c55e" s={20}/> {t.confirmJob}</div>
            <div className="msub">{t.aiPulled}</div>
            <label className="flabel">{t.clientName}</label>
            <input className="finput" value={parsed.client||""} onChange={e=>setParsed(p=>({...p,client:e.target.value}))}/>
            <label className="flabel">{t.jobType}</label>
            <input className="finput" value={parsed.type||""} onChange={e=>setParsed(p=>({...p,type:e.target.value}))}/>
            <div className="frow">
              <div><label className="flabel">{t.amountDollar}</label><input className="finput" type="number" value={parsed.amount||""} onChange={e=>setParsed(p=>({...p,amount:e.target.value}))}/></div>
              <div><label className="flabel">{t.date}</label><input className="finput" type="date" value={parsed.date||""} onChange={e=>setParsed(p=>({...p,date:e.target.value}))}/></div>
            </div>
            <label className="flabel">{t.phone}</label>
            <input className="finput" placeholder="(555) 000-0000" value={parsed.phone||""} onChange={e=>setParsed(p=>({...p,phone:fmtPhone(e.target.value)}))}/>
            <label className="flabel">{t.status}</label>
            <select className="finput" value={parsed.status||"unpaid"} onChange={e=>setParsed(p=>({...p,status:e.target.value}))}>
              {STATUSES.map(s=><option key={s} value={s}>{t.statusLabels[s]||s}</option>)}
            </select>
            <label className="flabel">{t.recurringInterval}</label>
            <select className="finput" value={parsed.recurring||"none"} onChange={e=>setParsed(p=>({...p,recurring:e.target.value,recurringDay:"",recurringTime:""}))}>
              <option value="none">{t.noRecurring}</option>
              <option value="weekly">{t.weekly}</option>
              <option value="biweekly">{t.biweekly}</option>
              <option value="monthly">{t.monthly}</option>
            </select>
            {parsed.recurring&&parsed.recurring!=="none"&&(
              <div className="frow">
                <div>
                  <label className="flabel">{parsed.recurring==="monthly"?t.dayOfMonth:t.dayOfWeek}</label>
                  {parsed.recurring==="monthly"?(
                    <select className="finput" value={parsed.recurringDay||""} onChange={e=>setParsed(p=>({...p,recurringDay:e.target.value}))}>
                      <option value="">-- Day --</option>
                      {Array.from({length:31},(_,i)=>{ const d=i+1; const lbl=d>=29?`${d} (snaps to last day in short months)`:String(d); return <option key={d} value={d}>{lbl}</option>; })}
                    </select>
                  ):(
                    <select className="finput" value={parsed.recurringDay||""} onChange={e=>setParsed(p=>({...p,recurringDay:e.target.value}))}>
                      <option value="">-- Day --</option>
                      {t.days.map((d,i)=><option key={i} value={i}>{d}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label className="flabel">{t.recurringTime}</label>
                  <input className="finput" type="time" value={parsed.recurringTime||""} onChange={e=>setParsed(p=>({...p,recurringTime:e.target.value}))}/>
                </div>
              </div>
            )}
            {(!parsed.recurring||parsed.recurring==="none")&&(
              <>
                <label className="flabel">{t.appointmentTime}</label>
                <input className="finput" type="time" value={parsed.appointmentTime||""} onChange={e=>setParsed(p=>({...p,appointmentTime:e.target.value}))}/>
              </>
            )}
            <label className="flabel">{t.paymentDueDate}</label>
            <input className="finput" type="date" value={parsed.paymentDue||""} onChange={e=>setParsed(p=>({...p,paymentDue:e.target.value}))}/>
            <button className="fbtn" onClick={confirmSave}>{t.saveJob}</button>
            <button className="fbtn-sec" onClick={()=>{setStage(null);setParsed(null);}}>{t.cancel}</button>
          </div></div>
        )}
        {voiceErr&&stage!=="voiceUnsupported"&&(
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
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div className="mtitle"><ZapIcon/> {t.newJob}</div>
                <button style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280"}} onClick={()=>setShowForm(false)}><XIcon/></button>
              </div>
              <div className="msub">{t.fillManually}</div>
              <label className="flabel">{t.clientName} *</label>
              <input className="finput" placeholder="e.g. John Smith" value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))}/>
              <label className="flabel">{t.jobType}</label>
              <input className="finput" placeholder="e.g. HVAC Install" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/>
              <div className="frow">
                <div><label className="flabel">{t.amountDollar}</label><input className="finput" type="number" placeholder="0" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))}/></div>
                <div><label className="flabel">{t.date}</label><input className="finput" type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div>
              </div>
              <label className="flabel">{t.phone}</label>
              <input className="finput" placeholder="(555) 000-0000" value={form.phone} onChange={e=>setForm(p=>({...p,phone:fmtPhone(e.target.value)}))}/>
              <label className="flabel">{t.status}</label>
              <select className="finput" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s} value={s}>{t.statusLabels[s]||s}</option>)}
              </select>
              <label className="flabel">{t.recurringInterval}</label>
              <select className="finput" value={form.recurring} onChange={e=>setForm(p=>({...p,recurring:e.target.value,recurringDay:"",recurringTime:""}))}>
                <option value="none">{t.noRecurring}</option>
                <option value="weekly">{t.weekly}</option>
                <option value="biweekly">{t.biweekly}</option>
                <option value="monthly">{t.monthly}</option>
              </select>
              {form.recurring!=="none"&&(
                <div className="frow">
                  <div>
                    <label className="flabel">{form.recurring==="monthly"?t.dayOfMonth:t.dayOfWeek}</label>
                    {form.recurring==="monthly"?(
                      <select className="finput" value={form.recurringDay||""} onChange={e=>setForm(p=>({...p,recurringDay:e.target.value}))}>
                        <option value="">-- Day --</option>
                        {Array.from({length:31},(_,i)=>{ const d=i+1; const lbl=d>=29?`${d} (snaps to last day in short months)`:String(d); return <option key={d} value={d}>{lbl}</option>; })}
                      </select>
                    ):(
                      <select className="finput" value={form.recurringDay||""} onChange={e=>setForm(p=>({...p,recurringDay:e.target.value}))}>
                        <option value="">-- Day --</option>
                        {t.days.map((d,i)=><option key={i} value={i}>{d}</option>)}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="flabel">{t.recurringTime}</label>
                    <input className="finput" type="time" value={form.recurringTime||""} onChange={e=>setForm(p=>({...p,recurringTime:e.target.value}))}/>
                  </div>
                </div>
              )}
              {form.recurring==="none"&&(
                <>
                  <label className="flabel">{t.appointmentTime}</label>
                  <input className="finput" type="time" value={form.appointmentTime||""} onChange={e=>setForm(p=>({...p,appointmentTime:e.target.value}))}/>
                </>
              )}
              <label className="flabel">{t.paymentDueDate}</label>
              <input className="finput" type="date" value={form.paymentDue||""} onChange={e=>setForm(p=>({...p,paymentDue:e.target.value}))}/>
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
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div className="mtitle">✏️ {t.editJob}</div>
                <button style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280"}} onClick={()=>setEditJob(null)}><XIcon/></button>
              </div>
              <div className="msub">{t.editJobSub}</div>
              <label className="flabel">{t.clientName} *</label>
              <input className="finput" value={editJob.client} onChange={e=>setEditJob(p=>({...p,client:e.target.value}))}/>
              <label className="flabel">{t.jobType}</label>
              <input className="finput" value={editJob.type} onChange={e=>setEditJob(p=>({...p,type:e.target.value}))}/>
              <div className="frow">
                <div><label className="flabel">{t.amountDollar}</label><input className="finput" type="number" value={editJob.amount} onChange={e=>setEditJob(p=>({...p,amount:e.target.value}))}/></div>
                <div><label className="flabel">{t.date}</label><input className="finput" type="date" value={editJob.date||""} onChange={e=>setEditJob(p=>({...p,date:e.target.value}))}/></div>
              </div>
              <label className="flabel">{t.phone}</label>
              <input className="finput" placeholder="(555) 000-0000" value={editJob.phone||""} onChange={e=>setEditJob(p=>({...p,phone:fmtPhone(e.target.value)}))}/>
              <label className="flabel">{t.status}</label>
              <select className="finput" value={editJob.status} onChange={e=>setEditJob(p=>({...p,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s} value={s}>{t.statusLabels[s]||s}</option>)}
              </select>
              <label className="flabel">{t.recurringInterval}</label>
              <select className="finput" value={editJob.recurring||"none"} onChange={e=>setEditJob(p=>({...p,recurring:e.target.value,recurringDay:"",recurringTime:""}))}>
                <option value="none">{t.noRecurring}</option>
                <option value="weekly">{t.weekly}</option>
                <option value="biweekly">{t.biweekly}</option>
                <option value="monthly">{t.monthly}</option>
              </select>
              {editJob.recurring&&editJob.recurring!=="none"&&(
                <div className="frow">
                  <div>
                    <label className="flabel">{editJob.recurring==="monthly"?t.dayOfMonth:t.dayOfWeek}</label>
                    {editJob.recurring==="monthly"?(
                      <select className="finput" value={editJob.recurringDay||""} onChange={e=>setEditJob(p=>({...p,recurringDay:e.target.value}))}>
                        <option value="">-- Day --</option>
                        {Array.from({length:31},(_,i)=>{ const d=i+1; const lbl=d>=29?`${d} (snaps to last day in short months)`:String(d); return <option key={d} value={d}>{lbl}</option>; })}
                      </select>
                    ):(
                      <select className="finput" value={editJob.recurringDay||""} onChange={e=>setEditJob(p=>({...p,recurringDay:e.target.value}))}>
                        <option value="">-- Day --</option>
                        {t.days.map((d,i)=><option key={i} value={i}>{d}</option>)}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="flabel">{t.recurringTime}</label>
                    <input className="finput" type="time" value={editJob.recurringTime||""} onChange={e=>setEditJob(p=>({...p,recurringTime:e.target.value}))}/>
                  </div>
                </div>
              )}
              {(!editJob.recurring||editJob.recurring==="none")&&(
                <>
                  <label className="flabel">{t.appointmentTime}</label>
                  <input className="finput" type="time" value={editJob.appointmentTime||""} onChange={e=>setEditJob(p=>({...p,appointmentTime:e.target.value}))}/>
                </>
              )}
              <label className="flabel">{t.paymentDueDate}</label>
              <input className="finput" type="date" value={editJob.paymentDue||""} onChange={e=>setEditJob(p=>({...p,paymentDue:e.target.value}))}/>
              <button className="fbtn" onClick={saveEdit}>{t.saveChanges}</button>
              <button className="fbtn-sec" onClick={()=>setEditJob(null)}>{t.cancel}</button>
            </div>
          </div>
        )}

        {/* SETTINGS PANEL */}
        {showSettings&&(
          <SettingsPanel onClose={handleSettingsClose} lang={lang} setLang={setLang} t={t} profile={businessProfile} onSaveProfile={handleSaveProfile}/>
        )}
      </div>
      )}

      {/* FREE TIER CAP MODAL — outside .app so fixed positioning is never clipped */}
      {!authLoading && user && !profileLoading && !showOnboarding && showFreeTierModal&&(
        <div className="modal-overlay" onClick={()=>setShowFreeTierModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:40,marginBottom:14}}>🔒</div>
            <div className="mtitle" style={{justifyContent:"center"}}>{t.freeTierTitle}</div>
            <div className="msub" style={{marginTop:8,marginBottom:20,lineHeight:1.6}}>{t.freeTierMsg}</div>
            <button className="fbtn" style={{background:"var(--accent)",color:"#0f1117",marginBottom:10}} onClick={handleUpgrade}>{t.freeTierUpgrade}</button>
            <button className="fbtn-sec" onClick={()=>setShowFreeTierModal(false)}>{t.freeTierDismiss}</button>
          </div>
        </div>
      )}
    </>
  );
}
