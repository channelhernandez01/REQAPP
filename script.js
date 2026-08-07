const statusElement = document.getElementById('form-status');

async function loadDocument() {
  try {
    const response = await fetch('document.txt');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    const section = document.getElementById('content');
    const paragraphs = text.split(/\n\n+/).filter(Boolean);

    if (paragraphs.length === 0) {
      section.innerHTML = '<p>No se encontró contenido en el documento.</p>';
      return;
    }

    section.innerHTML = paragraphs
      .map((p) => `<p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
      .join('');
  } catch (error) {
    const section = document.getElementById('content');
    section.innerHTML = `<p>Error cargando el documento: ${error.message}</p>`;
  }
}

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

  const subject = encodeURIComponent('Nueva solicitud de cliente REQAPP');
  const body = encodeURIComponent(
    `Nombre: ${values.name}\nEmpresa: ${values.company}\nCorreo: ${values.email}\nTeléfono: ${values.phone}\nDirección: ${values.address || 'No indicada'}\nTipo de proyecto: ${values.projectType}\nPresupuesto: ${values.budget}\nPlazo: ${values.deadline}\n${socialLinks}\n${files}\nDescripción:\n${values.description}\nRecomendaciones u opiniones:\n${values.feedback || 'No indicadas'}\n\nNota: los archivos seleccionados deben adjuntarse manualmente al correo.`
  );

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  statusElement.textContent = 'Solicitud lista. Adjunta manualmente los archivos en el correo que se abrirá.';
  statusElement.style.color = '#a8d5c6';
}

const form = document.getElementById('client-form');
form.addEventListener('submit', handleFormSubmit);

loadDocument();
