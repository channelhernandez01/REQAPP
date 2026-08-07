const statusElement = document.getElementById('form-status');

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const values = Object.fromEntries(formData.entries());
  const email = 'channelhernandez744@gmail.com';
  const logo = formData.get('companyLogo');
  const attachments = formData.getAll('attachments').filter((file) => file.name);
  const socialLinks = [
    `TikTok: ${values.tiktok || 'No indicado'}`,
    `Instagram: ${values.instagram || 'No indicado'}`,
    `X: ${values.x || 'No indicado'}`,
    `Facebook: ${values.facebook || 'No indicado'}`,
  ].join('\n');
  const files = [
    `Logo: ${logo && logo.name ? logo.name : 'No adjunto'}`,
    `Archivos: ${attachments.length ? attachments.map((file) => file.name).join(', ') : 'No adjuntos'}`,
  ].join('\n');

  const message = `Nueva solicitud de cliente REQAPP\n\nNombre: ${values.name}\nEmpresa: ${values.company}\nCorreo: ${values.email}\nTeléfono: ${values.phone}\nDirección: ${values.address || 'No indicada'}\nTipo de proyecto: ${values.projectType}\nPresupuesto: ${values.budget}\nPlazo: ${values.deadline}\n${socialLinks}\n${files}\nDescripción:\n${values.description}\nRecomendaciones u opiniones:\n${values.feedback || 'No indicadas'}\n\nNota: los archivos seleccionados deben adjuntarse manualmente.`;
  const subject = encodeURIComponent('Nueva solicitud de cliente REQAPP');
  const body = encodeURIComponent(message);
  const whatsappMessage = encodeURIComponent(message);

  // Open WhatsApp with the request while the submission click is still trusted by the browser.
  window.open(`https://wa.me/18493808685?text=${whatsappMessage}`, '_blank', 'noopener');
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  statusElement.textContent = 'Se abrió un correo para Gmail y WhatsApp con la solicitud lista para enviar.';
  statusElement.style.color = '#739d7d';
}

const form = document.getElementById('client-form');
form.addEventListener('submit', handleFormSubmit);
