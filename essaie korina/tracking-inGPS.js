/* =============================================
   MOTEUR DE NAVIGATION ET ÉTATS
   ============================================= */
const TOTAL = 11;
let current = 1;

/**
 * Gère le passage entre les sections (pages)
 * @param {number} n - Le numéro de la page cible
 */
function goTo(n) {
  // Masquer la page actuelle
  const currentPage = document.getElementById('p' + current);
  if (currentPage) currentPage.classList.remove('active');
  
  // Mettre à jour l'index
  current = n;
  
  // Afficher la nouvelle page
  const targetPage = document.getElementById('p' + current);
  if (targetPage) targetPage.classList.add('active');
  
  // Mettre à jour l'interface (barre de progression, points, compteurs)
  updateUI();
  
  // Retour en haut de page pour une lecture fluide
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Met à jour les indicateurs visuels de progression
 */
function updateUI() {
  // 1. Mise à jour de la barre de progression linéaire
  const pct = ((current - 1) / (TOTAL - 1)) * 100;
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) progressFill.style.width = pct + '%';
  
  // 2. Mise à jour du tag texte (ex: 01 / 11)
  const stepTag = document.getElementById('step-tag');
  if (stepTag) {
    stepTag.textContent = String(current).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');
  }
  
  // 3. Mise à jour des indicateurs à points (dots) par page
  for (let i = 1; i <= TOTAL; i++) {
    const el = document.getElementById('d' + i);
    if (!el) continue;
    
    el.innerHTML = '';
    for (let d = 1; d <= TOTAL; d++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (d === current ? ' on' : '');
      // Rendre les points cliquables pour une navigation directe
      dot.onclick = (function(n) { 
        return function() { goTo(n); }; 
      })(d);
      el.appendChild(dot);
    }
  }
}

/* =============================================
   LOGIQUE DU FORMULAIRE (PAGE 10)
   ============================================= */

/**
 * Gère la sélection visuelle des boutons radio et met à jour l'input caché associé
 * @param {HTMLElement} el - L'élément cliqué
 * @param {string} groupId - L'ID du conteneur de groupe
 * @param {string} hiddenInputId - L'ID du champ masqué à remplir pour Netlify
 */
function pick(el, groupId, hiddenInputId) {
  const container = document.getElementById(groupId);
  if (container) {
    const options = container.querySelectorAll('.r-opt');
    options.forEach(o => o.classList.remove('sel'));
    el.classList.add('sel');
    
    // Assigner la valeur textuelle au champ masqué pour l'envoi
    const hiddenInput = document.getElementById(hiddenInputId);
    if (hiddenInput) {
      hiddenInput.value = el.textContent.trim();
    }
  }
}
/**
 * Gère l'ouverture et la fermeture du descriptif d'un programme
 * lorsqu'on clique sur la ligne ou sur "DÉTAILS"
 */
/**
 * Gère l'ouverture et la fermeture du descriptif d'un programme
 * lorsqu'on clique sur la ligne ou sur "DÉTAILS"
 */
function toggleProgramDirect(element) {
  const accordionNode = element.closest('.program-accordion');
  if (!accordionNode) return;

  const contentNode = accordionNode.querySelector('.content');
  const arrowNode = accordionNode.querySelector('.arrow');
  
  if (contentNode.style.display === 'block') {
    contentNode.style.display = 'none';
    if (arrowNode) arrowNode.textContent = 'DÉTAILS ▼';
    accordionNode.style.borderColor = 'rgba(255,255,255,0.08)';
  } else {
    contentNode.style.display = 'block';
    if (arrowNode) arrowNode.textContent = 'MASQUER ▲';
    accordionNode.style.borderColor = 'var(--red)';
  }
}

/**
 * Soumet les données à Formspree de manière asynchrone (AJAX)
 * et passe à la page 11
 */
function submitForm() {
  const textFields = [
    document.getElementById('f1'),
    document.getElementById('f_email'),
    document.getElementById('f_tel'),
    document.getElementById('f2'),
    document.getElementById('f3'),
    document.getElementById('f5'),
    document.getElementById('f6'),
    document.getElementById('f_objectifs')
  ];

  let isInvalid = false;

  // Nettoyage des erreurs visuelles précédentes
  textFields.forEach(f => f && f.classList.remove('input-error'));

  // Vérification des champs de saisie texte et select
  textFields.forEach(f => {
    if (!f || f.value.trim() === '') {
      if (f) f.classList.add('input-error');
      isInvalid = true;
    }
  });

  // Vérification de la question 08 (Investissement)
  const investissementCoche = document.querySelector('input[name="pret_investir"]:checked');
  if (!investissementCoche) {
    alert("Merci de répondre à la question 08 (Investissement financier).");
    isInvalid = true;
  }

  // Vérification de la question 09 (Formule choisie)
  const formuleCochee = document.querySelector('input[name="formule_choisie"]:checked');
  if (!formuleCochee) {
    alert("Merci de cocher une formule d'accompagnement à la question 09.");
    isInvalid = true;
  }

  // Vérification de la question 10 (Engagement)
  const engagementCoche = document.querySelector('input[name="engagement_total"]:checked');
  if (!engagementCoche) {
    alert("Merci de répondre à la question 10 (Engagement total).");
    isInvalid = true;
  }

  if (isInvalid) {
    alert("Merci de remplir tous les champs obligatoires marqués d'une étoile (*)");
    return;
  }

  // Envoi asynchrone sécurisé vers ton Formspree
  const formElement = document.getElementById('qual-form');
  const formData = new FormData(formElement);

  // Cherche le bloc fetch à la fin de ta fonction submitForm() et mets à jour l'URL :
  fetch("https://formspree.io/f/mgobqvev", {
    method: "POST",
    body: formData,
    headers: { 'Accept': 'application/json' }
  })
  .then(() => { 
    goTo(11); // Bascule sur le Calendly à la page 11
  })
  .catch(() => { 
    goTo(11); // Sécurité réseau
  });
}
/* =============================================
   GESTION DU COMPTEUR D'URGENCE
   ============================================= */

/**
 * Démarre le compte à rebours de la barre d'urgence
 * @param {number} duration - Durée en secondes (ex: 900 pour 15 min)
 * @param {HTMLElement} display - L'élément où afficher le temps
 */
function startTimer(duration, display) {
  let timer = duration, minutes, seconds;
  
  const interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = 0;
      clearInterval(interval);
    }
  }, 1000);
}

/* =============================================
   INITIALISATION AU CHARGEMENT
   ============================================= */
window.addEventListener('load', function() {
  // Initialisation du compteur à 15 minutes (900 secondes)
  const countdownEl = document.querySelector('#countdown');
  if (countdownEl) {
    startTimer(900, countdownEl);
  }
  
  // Initialisation de l'UI
  updateUI();
});