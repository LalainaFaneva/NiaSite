// app.js

// 1. SYSTEME DE NAVIGATION DE LA PLATEFORME (SPA)
function naviguer(ciblePageId) {
  // Masquer toutes les sections
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
  
  // Afficher la section demandée
  const sectionCible = document.getElementById('sec-' + ciblePageId);
  if (sectionCible) {
    sectionCible.classList.remove('hidden');
    // Gérer le comportement spécifique de la carte
    if(ciblePageId === 'recherche') {
      setTimeout(() => { carte.invalidateSize(); }, 200); 
    }
  }
  // Remonter en haut de page automatiquement
  window.scrollTo(0, 0);
}

// Affichage initial de la page d'accueil au chargement
window.onload = function() {
  naviguer('accueil');
};

// 2. CONFIGURATION DE LA CARTE LEAFLET
const carte = L.map('ma-carte').setView([-18.9137, 47.5256], 13); // Centré sur Antananarivo
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(carte);

let marqueursGroup = L.layerGroup().addTo(carte);

// Base de données fictive intégrée pour la démo en ligne
const baseDeDonneesLogements = [
  { id: 1, titre: "Belle maison avec cour", quartier: "ankadifotsy", prix: 150000, pieces: 3, superficie: 60, lat: -18.9103, lng: 47.5360 },
  { id: 2, titre: "Appartement moderne", quartier: "analakely", prix: 250000, pieces: 4, superficie: 90, lat: -18.9175, lng: 47.5306 },
  { id: 3, titre: "Studio calme", quartier: "isotry", prix: 80000, pieces: 1, superficie: 25, lat: -18.9250, lng: 47.5200 }
];

// 3. LOGIQUE RECHERCHE INTELLIGENTE SIMULÉE
function simulerRechercheIA() {
  const input = document.getElementById('ia-input').value.trim().toLowerCase();
  const reponseText = document.getElementById('ia-reponse');
  const listeHtml = document.getElementById('liste-logements');

  if (!input) return;

  reponseText.textContent = "⏳ NiaSite analyse votre message avec Gemini et interroge la base de données...";
  listeHtml.innerHTML = "";
  marqueursGroup.clearLayers();

  // Filtrage par mots-clés (quartiers ou prix)
  let resultats = baseDeDonneesLogements.filter(logement => {
    let matchQuartier = input.includes(logement.quartier);
    let matchPrix = true;
    
    if (input.includes("100 000") || input.includes("100000")) {
      matchPrix = logement.prix <= 100000;
    } else if (input.includes("200 000") || input.includes("200000")) {
      matchPrix = logement.prix <= 200000;
    }
    return matchQuartier || input.includes("tous") || (input.includes("maison") && logement.id === 1);
  });

  if (resultats.length === 0) {
    resultats = baseDeDonneesLogements; // Par défaut, afficher tout si aucun mot-clé
  }

  // Simulation d'un temps de réponse réseau de 800ms
  setTimeout(() => {
    reponseText.textContent = `🤖 [Mode Démo] J'ai trouvé ${resultats.length} logement(s) correspondant à vos critères à Madagascar.`;
    
    resultats.forEach(l => {
      // Ajouter marqueur sur la carte
      L.marker([l.lat, l.lng])
        .addTo(marqueursGroup)
        .bindPopup(`<b>${l.titre}</b><br>${l.prix.toLocaleString()} Ar/mois`);

      // Ajouter l'élément visuel à la liste
      const item = document.createElement('div');
      item.className = "p-3 border border-gray-100 bg-blue-50/50 rounded-xl flex justify-between items-center";
      item.innerHTML = `
        <div>
          <h4 class="font-semibold text-gray-800 text-sm">${l.titre}</h4>
          <p class="text-gray-500 text-xs uppercase">${l.quartier} • ${l.pieces} pièces • ${l.superficie}m²</p>
        </div>
        <span class="text-primary font-bold text-sm">${l.prix.toLocaleString()} Ar</span>
      `;
      listeHtml.appendChild(item);
    });

    if(resultats.length > 0) {
      carte.setView([resultats[0].lat, resultats[0].lng], 13);
    }
  }, 800);

  document.getElementById('ia-input').value = "";
}
<script src="app.js"></script>