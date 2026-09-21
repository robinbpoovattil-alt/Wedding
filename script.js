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
  const days = Math.floor(diff/86400000);
  const hours = Math.floor(diff%86400000/3600000);
  const minutes = Math.floor(diff%3600000/60000);
  const seconds = Math.floor(diff%60000/1000);
  document.querySelector('[data-unit="days"]').textContent=days;
  document.querySelector('[data-unit="hours"]').textContent=String(hours).padStart(2,'0');
  document.querySelector('[data-unit="minutes"]').textContent=String(minutes).padStart(2,'0');
  document.querySelector('[data-unit="seconds"]').textContent=String(seconds).padStart(2,'0');
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
  const photos = stage.querySelectorAll('img');
  let rotation = 0;
  let startX = 0;
  let dragRotation = 0;

  photos.forEach((photo, index) => photo.style.setProperty('--i', index));

  function render() {
    stage.style.transform = `rotateY(${rotation}deg)`;
  }

  function rotateBy(amount) {
    rotation += amount;
    render();
  }

  carousel.addEventListener('pointerdown', event => {
    startX = event.clientX;
    dragRotation = rotation;
    carousel.setPointerCapture(event.pointerId);
    stage.style.transition = 'none';
  });

  carousel.addEventListener('pointermove', event => {
    if (!carousel.hasPointerCapture(event.pointerId)) return;
    rotation = dragRotation + (event.clientX - startX) * .35;
    render();
  });

  function endDrag(event) {
    if (!carousel.hasPointerCapture(event.pointerId)) return;
    carousel.releasePointerCapture(event.pointerId);
    rotation = Math.round(rotation / 18) * 18;
    stage.style.transition = '';
    render();
  }

  carousel.addEventListener('pointerup', endDrag);
  carousel.addEventListener('pointercancel', endDrag);
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); rotateBy(18); }
    if (event.key === 'ArrowRight') { event.preventDefault(); rotateBy(-18); }
  });
  render();
});
