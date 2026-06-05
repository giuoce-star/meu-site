// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Scroll reveal
const reveals = document.querySelectorAll('section > *, .card, .projeto-card, .stat');
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Counter animation
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const duration = 1600;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// Holographic buttons — mouse tracking
document.querySelectorAll('.btn-primary, .btn-ghost, .btn-nav').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const angle = Math.atan2(e.clientY - (rect.top + rect.height / 2),
                             e.clientX - (rect.left + rect.width / 2)) * (180 / Math.PI) + 90;
    btn.style.setProperty('--mx', `${x}%`);
    btn.style.setProperty('--my', `${y}%`);
    btn.style.setProperty('--holo-angle', `${angle}deg`);
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.setProperty('--mx', '50%');
    btn.style.setProperty('--my', '50%');
    btn.style.setProperty('--holo-angle', '135deg');
  });
});

// ===== CURSOR PERSONALIZADO =====
const cursor = document.createElement('div');
cursor.id = 'cursor-custom';
document.body.appendChild(cursor);

// Conchas que alternam no rastro
const shells = [
  'cursor/conch shell.png',
  'cursor/download (10).png',
  'cursor/download (11).png',
  'cursor/download (12).png',
  'cursor/download (13).png',
  'cursor/download (14).png',
  'cursor/Shell Of A Time.png',
  'cursor/detalhado fechar-se do uma Vieira Concha com natural laranja matizes contra uma transparente fundo.png'
];
let shellIndex = 0;
let lastTrail = 0;

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  const now = Date.now();
  if (now - lastTrail < 120) return; // uma concha a cada 120ms
  lastTrail = now;

  const shell = document.createElement('img');
  shell.src = shells[shellIndex % shells.length];
  shellIndex++;
  shell.className = 'cursor-shell';
  const size = Math.random() * 28 + 28; // 28–56px
  const rotation = Math.round(Math.random() * 60 - 30);
  shell.style.width = size + 'px';
  shell.style.left = mouseX + 'px';
  shell.style.top = mouseY + 'px';
  shell.style.setProperty('--r', rotation + 'deg');
  document.body.appendChild(shell);
  setTimeout(() => shell.remove(), 900);
});

// Cursor segue com suavidade
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Efeito hover em links e botões
document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// Contact form
// ===== PROTEÇÃO DE CONTEÚDO =====
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && ['u','U','s','S','a','A','c','C'].includes(e.key)) ||
    (e.ctrlKey && e.shiftKey && ['i','I','j','J','c','C'].includes(e.key))
  ) e.preventDefault();
});

// ===== CASCATA DE FLORES (seção nichos) =====
(function() {
  const canvas = document.getElementById('flores-canvas');
  if (!canvas) return;

  const floreSrcs = [
    'flores/flor_1.png','flores/flor_2.png','flores/flor_3.png',
    'flores/flor_4.png','flores/flor_5.png','flores/flor_6.png',
    'flores/flor_7.png','flores/flor_8.png','flores/flor_9.png','flores/flor_10.png'
  ];

  const NUM = 16;
  const flores = [];
  const section = document.getElementById('nichos');

  function randX() {
    return Math.random() * (section.offsetWidth + 80) - 40;
  }

  for (let i = 0; i < NUM; i++) {
    const img = document.createElement('img');
    img.src = floreSrcs[i % floreSrcs.length];
    img.className = 'flor-item';
    const size = Math.random() * 55 + 35;
    img.style.cssText = `width:${size}px; position:absolute; top:0; left:0;`;
    canvas.appendChild(img);

    flores.push({
      el: img,
      x: randX(),
      y: Math.random() * -section.offsetHeight,
      speed: Math.random() * 0.03 + 0.015,       // queda mais lenta
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 0.03,    // rotação suave
      op: Math.random() * 0.15 + 0.85,
      size,
      // balanço lateral natural
      swayAmp: Math.random() * 28 + 12,           // amplitude do balanço (px)
      swayFreq: Math.random() * 0.0012 + 0.0006,  // frequência do balanço
      swayOffset: Math.random() * Math.PI * 2,    // fase inicial aleatória
      t: Math.random() * 10000,                   // tempo acumulado
    });
  }

  let last = null;

  function tick(ts) {
    if (!last) last = ts;
    const dt = Math.min(ts - last, 50);
    last = ts;
    const h = section.offsetHeight;

    flores.forEach(f => {
      f.t += dt;
      f.y += f.speed * dt;
      f.rot += f.rotSpeed * dt;

      // balanço lateral suave com seno
      const sway = Math.sin(f.t * f.swayFreq + f.swayOffset) * f.swayAmp;

      if (f.y > h + 80) {
        f.y = -f.size - 10;
        f.x = randX();
      }

      f.el.style.transform = `translate(${f.x + sway}px, ${f.y}px) rotate(${f.rot}deg)`;
      f.el.style.opacity = f.op;
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

// ===== CARROSSEL DE VÍDEOS (drag to scroll + setas) =====
const videosGrid = document.querySelector('.videos-grid');
if (videosGrid) {
  // Drag to scroll
  let isDown = false, startX, scrollLeft;
  videosGrid.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - videosGrid.offsetLeft;
    scrollLeft = videosGrid.scrollLeft;
  });
  videosGrid.addEventListener('mouseleave', () => isDown = false);
  videosGrid.addEventListener('mouseup', () => isDown = false);
  videosGrid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - videosGrid.offsetLeft;
    videosGrid.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });

  // Setas
  const scrollAmount = 240;
  document.querySelector('.carousel-prev')?.addEventListener('click', () => {
    videosGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  document.querySelector('.carousel-next')?.addEventListener('click', () => {
    videosGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

document.getElementById('contato-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const success = document.getElementById('form-success');
  success.style.display = 'block';
  e.target.reset();
  setTimeout(() => { success.style.display = 'none'; }, 5000);
});
