// Étoiles animées + étoiles filantes + nébuleuses
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

let stars = [];
let shootingStars = [];
const STAR_COUNT = 350;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// --- Étoiles normales ---
function createStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.8,  // un peu plus petites
      opacity: Math.random(),
      speed: Math.random() * 0.25 + 0.05,  // plus lentes = moins lourd
      twinkleSpeed: Math.random() * 0.015 + 0.003,
      twinkleDir: Math.random() > 0.5 ? 1 : -1
    });
  }
}

function drawStars() {
  for (let star of stars) {
    
    // Déplacement horizontal au lieu de vertical
    star.x += star.speed;
    if (star.x > canvas.width) {
      star.x = 0;
      star.y = Math.random() * canvas.height;
    }

    star.opacity += star.twinkleSpeed * star.twinkleDir;
    if (star.opacity >= 1)   { star.opacity = 1;   star.twinkleDir = -1; }
    if (star.opacity <= 0.1) { star.opacity = 0.1; star.twinkleDir =  1; }

    // Forme étoile à 4 branches
    ctx.save();
    ctx.translate(star.x, star.y);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.beginPath();
    const r = star.radius;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const inner = r * 0.4;
      const outer = r * 1.8;
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.lineTo(Math.cos(angle + Math.PI / 4) * inner, Math.sin(angle + Math.PI / 4) * inner);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// --- Étoiles filantes ---
function createShootingStar() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height * 0.5;
  shootingStars.push({
    x, y,
    len: Math.random() * 120 + 60,
    speed: Math.random() * 8 + 5,
    opacity: 1,
    angle: Math.PI / 5
  });
}

function drawShootingStars() {
  shootingStars = shootingStars.filter(s => s.opacity > 0);
  for (let s of shootingStars) {
    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.opacity -= 0.015;

    const grad = ctx.createLinearGradient(
      s.x, s.y,
      s.x - Math.cos(s.angle) * s.len,
      s.y - Math.sin(s.angle) * s.len
    );
    grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
    grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(
      s.x - Math.cos(s.angle) * s.len,
      s.y - Math.sin(s.angle) * s.len
    );
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Lance une étoile filante toutes les 3-6 secondes
setInterval(createShootingStar, Math.random() * 3000 + 3000);

// --- Nébuleuses ---
const nebulae = [
  { x: 0.15, y: 0.2,  r: 280, color: '120, 60, 200'  },
  { x: 0.80, y: 0.15, r: 220, color: '60, 100, 220'  },
  { x: 0.60, y: 0.75, r: 260, color: '180, 50, 120'  },
  { x: 0.05, y: 0.70, r: 200, color: '50, 130, 200'  },
];

function drawNebulae() {
  for (let n of nebulae) {
    const grad = ctx.createRadialGradient(
      n.x * canvas.width, n.y * canvas.height, 0,
      n.x * canvas.width, n.y * canvas.height, n.r
    );
    grad.addColorStop(0,   `rgba(${n.color}, 0.18)`);
    grad.addColorStop(0.5, `rgba(${n.color}, 0.07)`);
    grad.addColorStop(1,   `rgba(${n.color}, 0)`);

    ctx.beginPath();
    ctx.arc(n.x * canvas.width, n.y * canvas.height, n.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

// --- Boucle principale ---
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNebulae();
  drawStars();
  drawShootingStars();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
  createStars();
});

resize();
createStars();
setInterval(createShootingStar, 4000);
animate();


(function () {
  function nom(chemin) {
    return chemin.split('?')[0].split('#')[0].split('/').pop().replace(/\.html$/, '');
  }
  function lire(cle) {
    try { return JSON.parse(localStorage.getItem(cle)); } catch (e) { return null; }
  }
  function ecrire(cle, valeur) {
    try { localStorage.setItem(cle, JSON.stringify(valeur)); return true; } catch (e) { return false; }
  }
  function effacer(cle) {
    try { localStorage.removeItem(cle); } catch (e) {}
  }

  var cartes = document.querySelectorAll('.arc-link');
  for (var c = 0; c < cartes.length; c++) {
    var carte = cartes[c].querySelector('.arc-card');
    if (carte && lire('marquepage:' + nom(cartes[c].getAttribute('href') || ''))) {
      var pastille = document.createElement('span');
      pastille.className = 'arc-marque';
      pastille.textContent = '⭐';
      carte.appendChild(pastille);
    }
  }

  var contenu = document.querySelector('.chapitre-content');
  if (!contenu) return;

  var CLE = 'marquepage:' + nom(location.pathname);
  var LIGNE = 140; /* distance depuis le haut de l'écran */
  var blocs = Array.prototype.slice.call(contenu.querySelectorAll('p'));
  contenu.style.position = 'relative';

  /* Éléments */
  var barre = document.createElement('div');
  barre.className = 'marquepage-bar';

  var boutonPoser = document.createElement('button');
  boutonPoser.type = 'button';
  boutonPoser.className = 'marquepage-btn';
  boutonPoser.textContent = '⭐ Poser un repère de lecture';

  var reprise = document.createElement('div');
  reprise.className = 'marquepage-reprise';

  var boutonReprendre = document.createElement('button');
  boutonReprendre.type = 'button';
  boutonReprendre.className = 'marquepage-btn';
  boutonReprendre.textContent = '↩ Reprendre ma lecture';

  var boutonEffacer = document.createElement('button');
  boutonEffacer.type = 'button';
  boutonEffacer.className = 'marquepage-btn marquepage-effacer';
  boutonEffacer.title = 'Retirer le marque-page';
  boutonEffacer.textContent = '✕';

  reprise.appendChild(boutonReprendre);
  reprise.appendChild(boutonEffacer);
  barre.appendChild(reprise);
  barre.appendChild(boutonPoser);
  document.body.appendChild(barre);

  var ruban = document.createElement('div');
  ruban.className = 'marquepage-ruban';
  ruban.textContent = '⭐';
  contenu.appendChild(ruban);

  var message = document.createElement('div');
  message.className = 'marquepage-toast';
  document.body.appendChild(message);
  var minuteur;
  function annoncer(texte) {
    message.textContent = texte;
    message.classList.add('visible');
    clearTimeout(minuteur);
    minuteur = setTimeout(function () { message.classList.remove('visible'); }, 2200);
  }

  function pointActuel() {
    for (var i = 0; i < blocs.length; i++) {
      var r = blocs[i].getBoundingClientRect();
      if (r.bottom > LIGNE) {
        var part = r.height ? Math.min(Math.max((LIGNE - r.top) / r.height, 0), 1) : 0;
        return { i: i, r: part };
      }
    }
    return { i: blocs.length - 1, r: 1 };
  }

  function positionY(point) {
    var bloc = point && blocs[point.i];
    if (!bloc) return null;
    var r = bloc.getBoundingClientRect();
    return r.top + window.pageYOffset + r.height * point.r;
  }

  function afficher() {
    var y = positionY(lire(CLE));
    if (y === null) {
      ruban.style.display = 'none';
      reprise.style.display = 'none';
      return;
    }
    var haut = contenu.getBoundingClientRect().top + window.pageYOffset;
    ruban.style.top = (y - haut) + 'px';
    ruban.style.display = 'block';
    reprise.style.display = 'flex';
  }

  boutonPoser.addEventListener('click', function () {
    if (ecrire(CLE, pointActuel())) {
      afficher();
      annoncer('Marque-page posé ! ⭐');
    } else {
      annoncer("Impossible d'enregistrer ici (navigation privée ?)");
    }
  });

  boutonReprendre.addEventListener('click', function () {
    var y = positionY(lire(CLE));
    if (y !== null) window.scrollTo({ top: Math.max(y - LIGNE, 0), behavior: 'smooth' });
  });

  boutonEffacer.addEventListener('click', function () {
    effacer(CLE);
    afficher();
    annoncer('Marque-page retiré ! ⭐');
  });

  window.addEventListener('load', afficher);
  window.addEventListener('resize', afficher);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(afficher);
  afficher();
})();
