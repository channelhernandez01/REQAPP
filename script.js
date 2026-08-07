const statusElement = document.getElementById('form-status');

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
  const files = [
    `Logo: ${logo && logo.name ? logo.name : 'No adjunto'}`,
    `Archivos: ${attachments.length ? attachments.map((file) => file.name).join(', ') : 'No adjuntos'}`,
  ].join('\n');

  const message = `Nueva solicitud de cliente REQAPP\n\nNombre: ${values.name}\nEmpresa: ${values.company}\nCorreo: ${values.email}\nTeléfono: ${values.phone}\nDirección: ${values.address || 'No indicada'}\nTipo de proyecto: ${values.projectType}\nPresupuesto: ${values.budget}\nPlazo: ${values.deadline}\n${socialLinks}\n${files}\nDescripción:\n${values.description}\nRecomendaciones u opiniones:\n${values.feedback || 'No indicadas'}\n\nNota: los archivos seleccionados deben adjuntarse manualmente.`;
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
