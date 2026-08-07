const statusElement = document.getElementById('form-status');
const adminLogin = document.getElementById('admin-login');
const adminSettings = document.getElementById('admin-settings');
const adminLogout = document.getElementById('admin-logout');
const adminPanel = document.getElementById('admin-panel');
const adminSettingsPanel = document.getElementById('admin-settings-panel');
const adminLoad = document.getElementById('admin-load');
const adminPassword = document.getElementById('admin-password');
const adminStatus = document.getElementById('admin-status');
const adminRequests = document.getElementById('admin-requests');
const authLogin = document.getElementById('auth-login');
const authPanel = document.getElementById('auth-panel');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authPhone = document.getElementById('auth-phone');
const authPhoneToken = document.getElementById('auth-phone-token');
const authStatus = document.getElementById('auth-status');
const authUserStatus = document.getElementById('auth-user-status');
const authLogout = document.getElementById('auth-logout');
let authClient;

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const values = Object.fromEntries(formData.entries());
  const logo = formData.get('companyLogo');
  const attachments = formData.getAll('attachments').filter((file) => file.name);
  const socialLinks = [
    `TikTok: ${values.tiktok || 'No indicado'}`,
    `Instagram: ${values.instagram || 'No indicado'}`,
    `X: ${values.x || 'No indicado'}`,
    `Facebook: ${values.facebook || 'No indicado'}`,
  ].join('\n');
  const fileSummary = [
    `Logo: ${logo && logo.name ? logo.name : 'No adjunto'}`,
    `Archivos: ${attachments.length ? attachments.map((file) => file.name).join(', ') : 'No adjuntos'}`,
  ].join('\n');

  const message = `Nueva solicitud de cliente REQAPP\n\nNombre: ${values.name}\nEmpresa: ${values.company}\nCorreo: ${values.email}\nTeléfono: ${values.phone}\nDirección: ${values.address || 'No indicada'}\nTipo de proyecto: ${values.projectType}\nPresupuesto: ${values.budget}\nPlazo: ${values.deadline}\n${socialLinks}\n${fileSummary}\nDescripción:\n${values.description}\nRecomendaciones u opiniones:\n${values.feedback || 'No indicadas'}\n\nNota: los archivos seleccionados deben adjuntarse manualmente.`;
  const whatsappMessage = encodeURIComponent(message);

  const files = [logo, ...attachments].filter((file) => file && file.name);
  const readFiles = files.map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      filename: file.name,
      content: reader.result.split(',')[1],
    });
    reader.onerror = () => reject(new Error(`No se pudo leer ${file.name}.`));
    reader.readAsDataURL(file);
  }));

  statusElement.textContent = 'Enviando la solicitud...';
  statusElement.style.color = '#817a74';

  Promise.all(readFiles)
    .then((encodedFiles) => fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, attachments: encodedFiles }),
    }))
    .then(async (response) => {
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'No se pudo enviar la solicitud.');
      }
      window.open(`https://wa.me/18493808685?text=${whatsappMessage}`, '_blank', 'noopener');
      statusElement.textContent = 'Solicitud enviada a tu Gmail. También se abrió WhatsApp.';
      statusElement.style.color = '#739d7d';
    })
    .catch((error) => {
      statusElement.textContent = `No se pudo enviar: ${error.message}`;
      statusElement.style.color = '#b75f52';
    });
}

const form = document.getElementById('client-form');
form.addEventListener('submit', handleFormSubmit);

adminLogin.addEventListener('click', () => {
  adminSettingsPanel.hidden = true;
  adminPanel.hidden = !adminPanel.hidden;
  if (!adminPanel.hidden) adminPassword.focus();
});

adminSettings.addEventListener('click', () => {
  adminPanel.hidden = true;
  adminSettingsPanel.hidden = !adminSettingsPanel.hidden;
});

adminLogout.addEventListener('click', () => {
  adminPassword.value = '';
  adminRequests.replaceChildren();
  adminStatus.textContent = 'Sesión cerrada.';
  adminLogout.disabled = true;
  adminPanel.hidden = true;
});

async function initializeAuth() {
  const response = await fetch('/api/config');
  const config = await response.json();
  if (!response.ok) throw new Error(config.error || 'No se pudo cargar Auth.');
  authClient = window.supabase.createClient(config.url, config.anonKey);
  const { data } = await authClient.auth.getUser();
  updateAuthStatus(data.user);
  authClient.auth.onAuthStateChange((_event, session) => updateAuthStatus(session && session.user));
}

function updateAuthStatus(user) {
  authUserStatus.textContent = user
    ? `Sesión iniciada: ${user.email || user.phone || 'usuario'}`
    : 'Regístrate o inicia sesión para continuar.';
  authLogout.disabled = !user;
}

authLogin.addEventListener('click', () => {
  adminPanel.hidden = true;
  adminSettingsPanel.hidden = true;
  authPanel.hidden = !authPanel.hidden;
});

document.getElementById('auth-signup').addEventListener('click', async () => {
  authStatus.textContent = 'Creando cuenta...';
  const { error } = await authClient.auth.signUp({ email: authEmail.value, password: authPassword.value });
  authStatus.textContent = error ? error.message : 'Revisa tu correo para confirmar la cuenta.';
});

document.getElementById('auth-signin').addEventListener('click', async () => {
  authStatus.textContent = 'Iniciando sesión...';
  const { error } = await authClient.auth.signInWithPassword({ email: authEmail.value, password: authPassword.value });
  authStatus.textContent = error ? error.message : 'Sesión iniciada correctamente.';
});

document.getElementById('auth-google').addEventListener('click', async () => {
  const { error } = await authClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  if (error) authStatus.textContent = error.message;
});

document.getElementById('auth-facebook').addEventListener('click', async () => {
  const { error } = await authClient.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: window.location.origin } });
  if (error) authStatus.textContent = error.message;
});

document.getElementById('auth-phone-button').addEventListener('click', async () => {
  authStatus.textContent = 'Enviando código SMS...';
  const { error } = await authClient.auth.signInWithOtp({ phone: authPhone.value });
  authStatus.textContent = error ? error.message : 'Código enviado por SMS.';
});

document.getElementById('auth-phone-verify').addEventListener('click', async () => {
  authStatus.textContent = 'Verificando teléfono...';
  const { error } = await authClient.auth.verifyOtp({
    phone: authPhone.value,
    token: authPhoneToken.value,
    type: 'sms',
  });
  authStatus.textContent = error ? error.message : 'Teléfono verificado correctamente.';
});

authLogout.addEventListener('click', async () => {
  const { error } = await authClient.auth.signOut();
  authStatus.textContent = error ? error.message : 'Sesión cerrada.';
});

initializeAuth().catch((error) => {
  authStatus.textContent = error.message;
});

adminLoad.addEventListener('click', async () => {
  adminStatus.textContent = 'Cargando solicitudes...';
  adminRequests.replaceChildren();
  try {
    const response = await fetch('/api/admin', {
      headers: { 'x-admin-password': adminPassword.value },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'No autorizado.');
    adminLogout.disabled = false;
    result.forEach((request) => {
      const card = document.createElement('article');
      card.className = 'admin-request';
      const date = request.created_at ? new Date(request.created_at).toLocaleString('es-DO') : '';
      card.textContent = `${date}\n\n${request.message}`;
      adminRequests.appendChild(card);
    });
    adminStatus.textContent = result.length ? 'Solicitudes cargadas.' : 'No hay solicitudes todavía.';
  } catch (error) {
    adminStatus.textContent = error.message;
  }
});
