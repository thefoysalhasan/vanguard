// script.js

/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .pillar-card, .faq-q, .zz-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px'; cursor.style.height = '20px';
    ring.style.width = '54px'; ring.style.height = '54px';
    ring.style.borderColor = 'rgba(232,52,26,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px'; cursor.style.height = '12px';
    ring.style.width = '36px'; ring.style.height = '36px';
    ring.style.borderColor = 'rgba(232,52,26,0.5)';
  });
});

/* ── SCROLL PROGRESS ── */
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const pct = (scrollY / (document.body.scrollHeight - innerHeight)) * 100;
  prog.style.width = pct + '%';
});

/* ── PARTICLES ── */
const pWrap = document.getElementById('particles');
const colors = ['rgba(232,52,26,', 'rgba(245,166,35,', 'rgba(255,80,40,'];
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random()*100}%;
    bottom:${Math.random()*20}%;
    background:${colors[Math.floor(Math.random()*3)]}${Math.random()*.6+.2});
    --dur:${Math.random()*8+6}s;
    --delay:${Math.random()*10}s;
  `;
  pWrap.appendChild(p);
}

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const dur = 1800;
  const start = performance.now();
  (function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / dur, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  })(start);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: .5 });

document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── ZIGZAG ITEMS ── */
document.querySelectorAll('.zz-item').forEach(item => {
  const activate = () => {
    document.querySelectorAll('.zz-item').forEach(s => s.classList.remove('active'));
    item.classList.add('active');
  };
  item.addEventListener('mouseenter', activate);
  item.addEventListener('click', activate);
});
// Activate first by default
document.querySelector('.zz-item')?.classList.add('active');

/* ── PILL TOGGLE ── */
document.querySelectorAll('.pill').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
  });
});

/* ── FAQ CATEGORY FILTER ── */
document.querySelectorAll('.faq-cat').forEach(cat => {
  cat.addEventListener('click', () => {
    document.querySelectorAll('.faq-cat').forEach(c => c.classList.remove('active'));
    cat.classList.add('active');
  });
});

/* ── SMOOTH PARALLAX HERO ── */
window.addEventListener('scroll', () => {
  const y = scrollY;
  const heroGrid = document.querySelector('.hero-grid');
  if (heroGrid) heroGrid.style.transform = `translateY(${y * .3}px)`;
  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((b, i) => {
    b.style.transform = `translate(${Math.sin(i) * y * .04}px, ${y * .12 * (i + 1) * .3}px)`;
  });
});

/* ── OPEN FIRST FAQ BY DEFAULT ── */
document.querySelector('.faq-item')?.classList.add('open');

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});
document.querySelectorAll('.mnav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

/* ══════════════════════════════
   HERO HEADLINE BUILDER + SCRAMBLE
══════════════════════════════ */
(function buildHeadline() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  const BASE_DELAY = 300; // ms after page load before first char
  const CHAR_STAGGER = 45; // ms between each character
  const SCRAMBLE_CYCLES = 6; // how many random chars before settling

  function makeChar(letter, delay, extraClass) {
    const s = document.createElement('span');
    s.className = 'char' + (extraClass ? ' ' + extraClass : '');
    s.dataset.final = letter === ' ' ? '\u00A0' : letter;
    s.style.animationDelay = delay + 'ms';
    s.textContent = letter === ' ' ? '\u00A0' : letter;
    return s;
  }

  function makeWord(text, baseDelay, charClass) {
    const w = document.createElement('span');
    w.className = 'word';
    [...text].forEach((ch, i) => {
      w.appendChild(makeChar(ch, baseDelay + i * CHAR_STAGGER, charClass));
    });
    return w;
  }

  // ── LINE 1: "YOUR VOICE." ──
  const line1 = document.querySelector('.line-1');
  if (line1) {
    const words1 = line1.dataset.words.split(' ');
    let delay = BASE_DELAY;
    words1.forEach((word, wi) => {
      line1.appendChild(makeWord(word + (wi < words1.length - 1 ? '' : ''), delay));
      if (wi < words1.length - 1) {
        const sp = document.createElement('span');
        sp.innerHTML = '&nbsp;';
        sp.style.display = 'inline-block';
        sp.style.width = '.25em';
        line1.appendChild(sp);
      }
      delay += word.length * CHAR_STAGGER + 60;
    });
  }

  // ── LINE 2: "THEIR" (stroke) + "FEAR." (red) ──
  const line2 = document.querySelector('.line-2');
  if (line2) {
    const strokeWord = document.createElement('span');
    strokeWord.className = 'word stroke-word';
    const strokeText = line2.dataset.stroke;
    let d2 = BASE_DELAY + 420;
    [...strokeText].forEach((ch, i) => {
      strokeWord.appendChild(makeChar(ch, d2 + i * CHAR_STAGGER));
    });
    line2.appendChild(strokeWord);

    const gap = document.createElement('span');
    gap.style.display = 'inline-block'; gap.style.width = '.25em';
    line2.appendChild(gap);

    const redWord = document.createElement('span');
    redWord.className = 'word red-word';
    const redText = line2.dataset.red;
    let d3 = d2 + strokeText.length * CHAR_STAGGER + 60;
    [...redText].forEach((ch, i) => {
      redWord.appendChild(makeChar(ch, d3 + i * CHAR_STAGGER));
    });
    line2.appendChild(redWord);
  }

  // ── LINE 3: "OUR POWER." with delayed underline ──
  const line3 = document.querySelector('.line-3');
  if (line3) {
    const words3 = line3.dataset.words.split(' ');
    let delay3 = BASE_DELAY + 900;
    words3.forEach((word, wi) => {
      line3.appendChild(makeWord(word, delay3));
      if (wi < words3.length - 1) {
        const sp = document.createElement('span');
        sp.style.display = 'inline-block'; sp.style.width = '.25em';
        line3.appendChild(sp);
      }
      delay3 += word.length * CHAR_STAGGER + 60;
    });
    // Trigger underline draw-in after last char lands
    const totalDur = delay3 + 300;
    line3.style.setProperty('--line-draw-delay', totalDur + 'ms');
    line3.style.setProperty('animation-delay', totalDur + 'ms');
    // Apply underline delay via inline style override
    const style = document.createElement('style');
    style.textContent = `.hero-headline .line-3::after { animation-delay: ${totalDur}ms, ${totalDur + 200}ms; }`;
    document.head.appendChild(style);
  }

  // ── SCRAMBLE ENGINE ──
  // After each char's drop animation resolves, briefly scramble it
  function startScramble() {
    const chars = document.querySelectorAll('.hero-headline .char');
    chars.forEach(charEl => {
      const finalChar = charEl.dataset.final;
      if (!finalChar || finalChar === '\u00A0') return;
      const animDelay = parseFloat(charEl.style.animationDelay) || 0;
      // Start scramble slightly before the char "settles"
      setTimeout(() => {
        let cycles = 0;
        const interval = setInterval(() => {
          if (cycles >= SCRAMBLE_CYCLES) {
            clearInterval(interval);
            charEl.textContent = finalChar;
            charEl.classList.remove('scrambling');
            return;
          }
          charEl.classList.add('scrambling');
          charEl.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
          cycles++;
        }, 40);
      }, animDelay + 400);
    });
  }

  // Run after a brief tick so DOM is ready
  requestAnimationFrame(() => requestAnimationFrame(startScramble));
})();