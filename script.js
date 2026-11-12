// Marca que JavaScript está activo (permite las animaciones del CSS)
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const raiz = document.documentElement;

  /* ===== 1. Modo claro / oscuro ===== */
  const botonTema = document.getElementById('botonTema');

  function aplicarTema(tema) {
    raiz.dataset.tema = tema;
    const oscuro = tema === 'oscuro';
    botonTema.setAttribute('aria-pressed', String(oscuro));
    botonTema.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  let guardado = null;
  try { guardado = localStorage.getItem('tema'); } catch (e) { /* sin almacenamiento */ }
  const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  aplicarTema(guardado || (prefiereOscuro ? 'oscuro' : 'claro'));

  botonTema.addEventListener('click', () => {
    const nuevo = raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
    aplicarTema(nuevo);
    try { localStorage.setItem('tema', nuevo); } catch (e) { /* sin almacenamiento */ }
  });

  /* ===== 2. Frase o dato curioso aleatorio ===== */
  // Cambia estas frases por las tuyas
  const frases = [
    'Dato curioso: puedo pasar horas arreglando un error de una sola línea.',
    'Siempre tengo una playlist para cada estado de ánimo.',
    'Si me invitas a un café, ya tenemos plan.',
    'Prefiero una buena conversación a una fiesta grande.',
    'Estoy aprendiendo algo nuevo cada semana.',
    'Mi mejor idea siempre llega justo antes de dormir.'
  ];
  const datoTexto = document.getElementById('datoTexto');
  const botonDato = document.getElementById('botonDato');
  let ultima = -1;

  function mostrarFrase() {
    let i;
    do { i = Math.floor(Math.random() * frases.length); } while (i === ultima && frases.length > 1);
    ultima = i;
    datoTexto.textContent = frases[i];
  }
  mostrarFrase();
  botonDato.addEventListener('click', mostrarFrase);

  /* ===== 3. Botón "Quiero ser tu amigo" ===== */
  const modal = document.getElementById('modalAmistad');
  const formulario = document.getElementById('formAmistad');
  const gracias = document.getElementById('modalGracias');
  const graciasTitulo = document.getElementById('graciasTitulo');
  const campoNombre = document.getElementById('campoNombre');
  const campoMensaje = document.getElementById('campoMensaje');

  function abrirModal() {
    formulario.hidden = false;
    gracias.hidden = true;
    formulario.reset();
    modal.showModal();
    campoNombre.focus();
  }

  document.getElementById('botonAmistad').addEventListener('click', abrirModal);
  document.getElementById('cancelarAmistad').addEventListener('click', () => modal.close());
  document.getElementById('cerrarGracias').addEventListener('click', () => modal.close());

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nombre = campoNombre.value.trim();
    if (!nombre) { campoNombre.focus(); return; }

    // Prototipo: guarda el mensaje en el navegador (aquí iría el envío real)
    const nuevo = { nombre, mensaje: campoMensaje.value.trim(), fecha: new Date().toISOString() };
    try {
      const lista = JSON.parse(localStorage.getItem('mensajes') || '[]');
      lista.push(nuevo);
      localStorage.setItem('mensajes', JSON.stringify(lista));
    } catch (e) { /* sin almacenamiento */ }

    graciasTitulo.textContent = '¡Gracias, ' + nombre + '! Hablamos pronto.';
    formulario.hidden = true;
    gracias.hidden = false;
  });

  // Cerrar al hacer clic fuera de la ventana
  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) modal.close();
  });

  /* ===== 4. Animaciones al hacer scroll ===== */
  const bloques = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15 });
    bloques.forEach((b) => observador.observe(b));
  } else {
    bloques.forEach((b) => b.classList.add('visible'));
  }
});
