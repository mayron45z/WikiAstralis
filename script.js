// Étoiles animées + étoiles filantes + nébuleuses
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

let stars = [];
let shootingStars = [];
const STAR_MAX = 350;
function starCount() {
  const n = Math.round((canvas.width * canvas.height) / 4500);
  return Math.min(STAR_MAX, n);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let largeurPrecedente = window.innerWidth;
window.addEventListener('resize', () => {
  resize();
  if (window.innerWidth !== largeurPrecedente) {
    largeurPrecedente = window.innerWidth;
    createStars();
  }
});

// --- Étoiles normales ---
function createStars() {
  stars = [];
  const total = starCount();
  for (let i = 0; i < total; i++) {
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
  var PISTES = [
    { titre: 'Sous les Étoiles', fichier: 'piano.mp3' },
    { titre: 'Lettre d\'Amour', fichier: 'jazzpiano.mp3' },
    { titre: 'Red Night', fichier: 'slow.mp3' },
    { titre: 'Nap in the Sun', fichier: 'harp.mp3' },
    { titre: 'La Chute', fichier: 'violin.mp3' },
    { titre: 'My Ocean', fichier: 'guitar.mp3' }
  ];

  function lire(cle) {
    try { return localStorage.getItem(cle); } catch (e) { return null; }
  }
  function ecrire(cle, valeur) {
    try { localStorage.setItem(cle, valeur); } catch (e) {}
  }

  var barreLaterale = document.querySelector('.sidebar');
  if (!barreLaterale) return;

  /* ---------- État sauvegardé ---------- */
  var index = parseInt(lire('musique:piste'), 10);
  if (isNaN(index) || index < 0 || index >= PISTES.length) index = 0;

  var volume = parseFloat(lire('musique:volume'));
  if (isNaN(volume)) volume = 0.35;

  /* La musique est active par défaut, sauf si le lecteur l'a mise en pause */
  var actif = lire('musique:active') !== '0';
  var premiereFois = true;
  var relanceT = 0;

  /* ---------- Lecteur audio ---------- */
  var audio = new Audio();
  audio.volume = volume;
  audio.src = PISTES[index].fichier;

  audio.addEventListener('loadedmetadata', function () {
    if (!premiereFois) return;
    premiereFois = false;
    var t = parseFloat(lire('musique:temps'));
    if (t && audio.duration && t < audio.duration) audio.currentTime = t;
  });
  audio.addEventListener('timeupdate', function () {
    if (!audio.paused) ecrire('musique:temps', audio.currentTime);
  });
  window.addEventListener('pagehide', function () {
    if (!audio.paused) ecrire('musique:temps', audio.currentTime);
  });
  audio.addEventListener('ended', function () { changer(index + 1, true); });

  /* ---------- Le lecteur, rangé en bas de la barre latérale ---------- */
  var panneau = document.createElement('div');
  panneau.className = 'musique-panneau';
  panneau.innerHTML =
    '<div class="vinyle"><div class="vinyle-etiquette"></div></div>' +
    '<p class="musique-titre"></p>' +
    '<div class="musique-controles">' +
      '<button type="button" class="m-btn m-prec" aria-label="Précédent">⏮</button>' +
      '<button type="button" class="m-btn m-play" aria-label="Lecture ou pause">▶</button>' +
      '<button type="button" class="m-btn m-suiv" aria-label="Suivant">⏭</button>' +
    '</div>' +
    '<input type="range" class="musique-volume" min="0" max="100" aria-label="Volume">';
  barreLaterale.appendChild(panneau);

  var vinyle = panneau.querySelector('.vinyle');
  var titre = panneau.querySelector('.musique-titre');
  var bPrec = panneau.querySelector('.m-prec');
  var bPlay = panneau.querySelector('.m-play');
  var bSuiv = panneau.querySelector('.m-suiv');
  var barreVolume = panneau.querySelector('.musique-volume');
  
  /* Mobile : toucher le vinyle ouvre/ferme le lecteur */
  var mobile = window.matchMedia('(max-width: 768px)');
  vinyle.addEventListener('click', function () {
  if (mobile.matches) panneau.classList.toggle('ouvert');
  });
/* Toucher ailleurs le referme */
document.addEventListener('click', function (e) {
  if (!panneau.contains(e.target)) panneau.classList.remove('ouvert');
});

  function majVolumeVisuel() {
    barreVolume.style.setProperty('--v', barreVolume.value + '%');
  }
  barreVolume.value = Math.round(volume * 100);
  majVolumeVisuel();

  /* ---------- Fonctions ---------- */
  function maj() {
    var enCours = !audio.paused;
    vinyle.classList.toggle('tourne', enCours);
    bPlay.textContent = enCours ? '⏸' : '▶';
    titre.textContent = PISTES[index].titre;
  }

  function jouer() {
    var essai = audio.play();
    if (essai && essai.catch) essai.catch(function () {});
  }

  function changer(nouvelIndex, lancer) {
    index = (nouvelIndex + PISTES.length) % PISTES.length;
    ecrire('musique:piste', index);
    ecrire('musique:temps', 0);
    audio.src = PISTES[index].fichier;
    if (lancer) { actif = true; ecrire('musique:active', '1'); jouer(); }
    maj();
  }

  audio.addEventListener('play', maj);
  audio.addEventListener('pause', maj);

  bPlay.addEventListener('click', function () {
    if (Date.now() - relanceT < 500) return;
    if (audio.paused) {
      actif = true; ecrire('musique:active', '1'); jouer();
    } else {
      actif = false; ecrire('musique:active', '0'); audio.pause();
    }
  });
  bPrec.addEventListener('click', function () { changer(index - 1, true); });
  bSuiv.addEventListener('click', function () { changer(index + 1, true); });

  barreVolume.addEventListener('input', function () {
    audio.volume = barreVolume.value / 100;
    ecrire('musique:volume', audio.volume);
    majVolumeVisuel();
  });

  /* ---------- Lancement automatique ---------- */
  if (actif) {
    jouer(); /* marche si le navigateur l'autorise */

    var evenements = ['pointerdown', 'keydown', 'touchend', 'click'];
    var relance = function () {
      if (!actif) return;
      if (audio.paused) { relanceT = Date.now(); jouer(); }
      evenements.forEach(function (ev) { document.removeEventListener(ev, relance); });
    };
    evenements.forEach(function (ev) { document.addEventListener(ev, relance); });
  }

  maj();
})();

(function () {

  /* ---------- Utilitaires ---------- */
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

  /* ---------- Pastille ⭐ sur les cartes de chapitres (page Lore) ---------- */
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

  /* ---------- Page de chapitre uniquement ---------- */
  var contenu = document.querySelector('.chapitre-content');
  if (!contenu) return;

  var CLE = 'marquepage:' + nom(location.pathname);
  var LIGNE = 140; /* le texte repris s'affiche à cette distance du haut de l'écran */
  var TEXTE_PLACER = 'Placer un repère de lecture';
  var blocs = Array.prototype.slice.call(contenu.querySelectorAll('p'));
  var placement = false;
  contenu.style.position = 'relative';

  /* ---------- Éléments ---------- */
  var barre = document.createElement('div');
  barre.className = 'marquepage-bar';

  var boutonPoser = document.createElement('button');
  boutonPoser.type = 'button';
  boutonPoser.className = 'marquepage-btn';
  boutonPoser.textContent = TEXTE_PLACER;

  var reprise = document.createElement('div');
  reprise.className = 'marquepage-reprise';

  var boutonReprendre = document.createElement('button');
  boutonReprendre.type = 'button';
  boutonReprendre.className = 'reprendre-marquepage-btn reprendre-marquepage-btn:hover';
  boutonReprendre.textContent = 'Reprendre ma lecture';

  var boutonEffacer = document.createElement('button');
  boutonEffacer.type = 'button';
  boutonEffacer.className = 'delete-marquepage-btn delete-marquepage-btn:hover';
  boutonEffacer.title = 'Retirer le marque-page';
  boutonEffacer.textContent = '✕';

  reprise.appendChild(boutonReprendre);
  reprise.appendChild(boutonEffacer);
  barre.appendChild(reprise);
  barre.appendChild(boutonPoser);
  document.body.appendChild(barre);

  var retour = document.querySelector('.chapitre-retour');
  if (retour) barre.insertBefore(retour, barre.firstChild);

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

  /* ---------- Position sauvegardée -> position Y dans la page ---------- */
  function positionY(point) {
    var bloc = point && blocs[point.i];
    if (!bloc) return null;
    var r = bloc.getBoundingClientRect();
    return r.top + window.pageYOffset + r.height * point.r;
  }

  /* ---------- Affichage du ruban et du bouton "Reprendre" ---------- */
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

  /* ---------- Mode placement ---------- */
  function modePlacement(actif) {
    placement = actif;
    contenu.classList.toggle('placement-actif', actif);
    boutonPoser.textContent = actif ? '✕ Annuler' : TEXTE_PLACER;
  }

  boutonPoser.addEventListener('click', function () {
    modePlacement(!placement);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && placement) modePlacement(false);
  });

  /* Clic dans le texte : on enregistre le paragraphe + la hauteur du clic */
  contenu.addEventListener('click', function (e) {
    if (!placement) return;

    var p = e.target.closest ? e.target.closest('p') : null;
    var i = p ? blocs.indexOf(p) : -1;
    if (i === -1) return;

    var r = p.getBoundingClientRect();
    var part = r.height ? Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1) : 0;

    if (ecrire(CLE, { i: i, r: part })) {
      modePlacement(false);
      afficher();
    } else {
      annoncer("Impossible d'enregistrer ici (navigation privée ?)");
    }
  });

  /* ---------- Reprendre / effacer ---------- */
  boutonReprendre.addEventListener('click', function () {
    var y = positionY(lire(CLE));
    if (y !== null) window.scrollTo({ top: Math.max(y - LIGNE, 0), behavior: 'smooth' });
  });

  boutonEffacer.addEventListener('click', function () {
    effacer(CLE);
    afficher();
  });

  /* ---------- Recalcul si la mise en page change ---------- */
  window.addEventListener('load', afficher);
  window.addEventListener('resize', afficher);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(afficher);
  afficher();

})();
