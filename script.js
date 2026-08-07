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

  const subject = encodeURIComponent('Nueva solicitud de cliente REQAPP');
  const body = encodeURIComponent(
    `Nombre: ${values.name}\nEmpresa: ${values.company}\nCorreo: ${values.email}\nTeléfono: ${values.phone}\nTipo de proyecto: ${values.projectType}\nPresupuesto: ${values.budget}\nPlazo: ${values.deadline}\nDescripción:\n${values.description}`
  );

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  statusElement.textContent = 'Solicitud lista para enviar a canalhernandez744@gmail.com.';
  statusElement.style.color = '#a8d5c6';
}

const form = document.getElementById('client-form');
form.addEventListener('submit', handleFormSubmit);

loadDocument();
