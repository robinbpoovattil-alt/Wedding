const progress=document.querySelector('.progress');
const revealEls=document.querySelectorAll('.reveal,.reveal-scale');
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
revealEls.forEach(el=>observer.observe(el));
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%'}
window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
const wedding=new Date('2026-11-28T10:30:00+05:30');
function updateCountdown(){const d=Math.max(0,wedding-new Date());const units={days:Math.floor(d/86400000),hours:Math.floor(d%86400000/3600000),minutes:Math.floor(d%3600000/60000),seconds:Math.floor(d%60000/1000)};Object.entries(units).forEach(([u,v])=>document.querySelectorAll('[data-unit="'+u+'"]').forEach(el=>el.textContent=u==='days'?v:String(v).padStart(2,'0')))}
updateCountdown();setInterval(updateCountdown,1000);
