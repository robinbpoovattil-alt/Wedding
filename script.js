const progress=document.querySelector('.progress');
const revealEls=document.querySelectorAll('.reveal,.reveal-scale');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
revealEls.forEach(el=>observer.observe(el));

function updateProgress(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
}
window.addEventListener('scroll',updateProgress,{passive:true});
updateProgress();

const wedding=new Date('2026-11-28T10:30:00+05:30');
function updateCountdown(){
  const d=Math.max(0,wedding-new Date());
  const units={
    days:Math.floor(d/86400000),
    hours:Math.floor(d%86400000/3600000),
    minutes:Math.floor(d%3600000/60000),
    seconds:Math.floor(d%60000/1000)
  };
  Object.entries(units).forEach(([u,v])=>{
    document.querySelectorAll('[data-unit="'+u+'"]').forEach(el=>{
      el.textContent=u==='days'?v:String(v).padStart(2,'0');
    });
  });
}
updateCountdown();
setInterval(updateCountdown,1000);

/* Word-by-word invitation typography */
function wrapWords(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node=>{
    if(!node.nodeValue.trim()) return;
    const frag=document.createDocumentFragment();
    node.nodeValue.split(/(\s+)/).forEach(part=>{
      if(/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
      else{
        const span=document.createElement('span');
        span.className='word-reveal';
        span.textContent=part;
        frag.appendChild(span);
      }
    });
    node.parentNode.replaceChild(frag,node);
  });
}
document.querySelectorAll('[data-reveal-words]').forEach(wrapWords);

const wordObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.querySelectorAll('.word-reveal').forEach((word,index)=>{
        setTimeout(()=>word.classList.add('is-word-visible'),index*85);
      });
      wordObserver.unobserve(entry.target);
    }
  });
},{threshold:.25});
document.querySelectorAll('[data-reveal-words]').forEach(el=>wordObserver.observe(el));

/* Hero title arrives like an invitation being opened */
const heroTitle=document.querySelector('.hero-title');
if(heroTitle && !reducedMotion){
  const walker=document.createTreeWalker(heroTitle,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()) nodes.push(walker.currentNode);
  let delay=120;
  nodes.forEach(node=>{
    const frag=document.createDocumentFragment();
    [...node.nodeValue].forEach(char=>{
      if(char===' ') frag.appendChild(document.createTextNode(' '));
      else{
        const span=document.createElement('span');
        span.className='letter';
        span.textContent=char;
        span.style.animationDelay=delay+'ms';
        delay+=34;
        frag.appendChild(span);
      }
    });
    node.parentNode.replaceChild(frag,node);
  });
}else if(heroTitle){
  heroTitle.querySelectorAll('*').forEach(el=>el.style.opacity='1');
}

/* The quiet "then" transition draws itself as it enters view. */
const thenMark=document.querySelector('.then');
if(thenMark){
  const thenObserver=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      thenMark.classList.add('is-active');
      thenObserver.disconnect();
    }
  },{threshold:.7});
  thenObserver.observe(thenMark);
}

/* Scroll-linked cinematic depth: photographs move a little slower than the page. */
const parallaxItems=[...document.querySelectorAll('[data-parallax]')];
let ticking=false;
function updateParallax(){
  if(reducedMotion){
    parallaxItems.forEach(el=>el.style.transform='');
    ticking=false;
    return;
  }
  const vh=window.innerHeight;
  parallaxItems.forEach(el=>{
    const rect=el.getBoundingClientRect();
    const amount=Number(el.dataset.parallax||0);
    if(rect.bottom>0 && rect.top<vh){
      const center=rect.top+rect.height/2;
      const offset=(center-vh/2)*amount*-1;
      el.style.transform='translate3d(0,'+offset.toFixed(2)+'px,0)';
    }
  });
  ticking=false;
}
function requestParallax(){
  if(!ticking){
    ticking=true;
    requestAnimationFrame(updateParallax);
  }
}
window.addEventListener('scroll',requestParallax,{passive:true});
window.addEventListener('resize',requestParallax,{passive:true});
requestParallax();

/* Stagger the two detail photographs so they feel physically placed on the page. */
const photoStacks=document.querySelectorAll('.detail-photos');
const stackObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.querySelectorAll('.detail-photo').forEach((photo,index)=>{
        photo.style.transitionDelay=(index*180)+'ms';
        photo.classList.add('photo-arrived');
      });
      stackObserver.unobserve(entry.target);
    }
  });
},{threshold:.2});
photoStacks.forEach(stack=>stackObserver.observe(stack));

/* Give the wedding-day heading and closing moment a gentle depth cue. */
document.querySelectorAll('.day-intro,.rsvp-copy').forEach(el=>{
  el.addEventListener('pointermove',event=>{
    if(reducedMotion) return;
    const r=el.getBoundingClientRect();
    const x=(event.clientX-r.left)/r.width-.5;
    const y=(event.clientY-r.top)/r.height-.5;
    el.style.transform='translate3d('+(x*5).toFixed(2)+'px,'+(y*4).toFixed(2)+'px,0)';
  });
  el.addEventListener('pointerleave',()=>{el.style.transform=''});
});
