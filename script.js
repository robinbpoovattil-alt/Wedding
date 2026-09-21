const progress = document.querySelector('.scroll-progress');
const reveals = document.querySelectorAll('.reveal,.reveal-scale');
const parallaxEls = document.querySelectorAll('[data-speed]');
const petals = document.querySelector('.petals');

window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if(progress) progress.style.width = `${Math.min(100, Math.max(0, window.scrollY / Math.max(1, max) * 100))}%`;

  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.speed || 0);
    const rect = el.getBoundingClientRect();
    const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
}, {passive:true});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.14, rootMargin:'0px 0px -5% 0px'});
reveals.forEach(el => observer.observe(el));

function makePetals(){
  if(!petals) return;
  const count = window.innerWidth < 700 ? 10 : 18;
  for(let i=0;i<count;i++){
    const p=document.createElement('span');
    p.textContent='✦';
    p.style.left=`${Math.random()*100}%`;
    p.style.top=`${Math.random()*100}%`;
    p.style.animationDelay=`${Math.random()*8}s`;
    p.style.animationDuration=`${9+Math.random()*9}s`;
    p.style.setProperty('--drift', `${-35+Math.random()*70}px`);
    petals.appendChild(p);
  }
}
makePetals();

const wedding = new Date('2026-11-28T10:30:00+05:30');
function updateCountdown(){
  const diff = Math.max(0, wedding - new Date());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  // Update every countdown on the page (hero + Save the Date).
  document.querySelectorAll('[data-unit="days"]').forEach(el => el.textContent = days);
  document.querySelectorAll('[data-unit="hours"]').forEach(el => el.textContent = String(hours).padStart(2,'0'));
  document.querySelectorAll('[data-unit="minutes"]').forEach(el => el.textContent = String(minutes).padStart(2,'0'));
  document.querySelectorAll('[data-unit="seconds"]').forEach(el => el.textContent = String(seconds).padStart(2,'0'));
}
updateCountdown(); setInterval(updateCountdown,1000);

// Milestone accordions remain independent so each chapter can be explored at will.
document.querySelectorAll('[data-milestone]').forEach(milestone => {
  const toggle = milestone.querySelector('.milestone-toggle');
  toggle.addEventListener('click', () => {
    const isOpen = milestone.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
});

document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const stage = carousel.querySelector('.carousel-stage');
  const photos = [...stage.querySelectorAll('img')];
  const prev = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const count = carousel.querySelector('.carousel-count');
  let index = 0;
  let startX = 0;
  let dragging = false;

  function wrap(value) {
    return (value + photos.length) % photos.length;
  }

  function render() {
    const n = photos.length;
    photos.forEach((photo, i) => {
      photo.className = '';
      const d = (i - index + n) % n;
      if (d === 0) photo.classList.add('is-center');
      else if (d === 1) photo.classList.add('is-next');
      else if (d === n - 1) photo.classList.add('is-prev');
      else if (d === 2) photo.classList.add('is-far-next');
      else if (d === n - 2) photo.classList.add('is-far-prev');
    });
    if(count) count.textContent = String(index + 1).padStart(2,'0') + ' / ' + String(n).padStart(2,'0');
  }

  function go(step) {
    index = wrap(index + step);
    render();
  }

  prev?.addEventListener('click', e => { e.stopPropagation(); go(-1); });
  next?.addEventListener('click', e => { e.stopPropagation(); go(1); });

  carousel.addEventListener('pointerdown', event => {
    if(event.target.closest('.carousel-arrow')) return;
    dragging = true;
    startX = event.clientX;
    carousel.setPointerCapture(event.pointerId);
  });

  carousel.addEventListener('pointerup', event => {
    if(!dragging) return;
    dragging = false;
    const dx = event.clientX - startX;
    if(Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
  });

  carousel.addEventListener('pointercancel', () => { dragging = false; });

  carousel.addEventListener('keydown', event => {
    if(event.key === 'ArrowLeft'){ event.preventDefault(); go(-1); }
    if(event.key === 'ArrowRight'){ event.preventDefault(); go(1); }
    if(event.key === 'Home'){ event.preventDefault(); index=0; render(); }
    if(event.key === 'End'){ event.preventDefault(); index=photos.length-1; render(); }
  });

  render();
});
