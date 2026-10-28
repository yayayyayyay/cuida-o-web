/* ==========================================================================
   1. ARMAZENAMENTO RESILIENTE (SUPORTA RESTRIÇÕES DE IFRAMES NO GOOGLE SITES)
   ========================================================================== */
const localStoreMemory = {};

function getStorage(key, defaultValue) {
  try {
    const val = window.localStorage.getItem(key);
    return val !== null ? val : (localStoreMemory[key] ?? defaultValue);
  } catch (err) {
    return localStoreMemory[key] ?? defaultValue;
  }
}

function setStorage(key, val) {
  localStoreMemory[key] = String(val);
  try {
    window.localStorage.setItem(key, String(val));
  } catch (err) {
    // Fallback ativo caso iframe de terceiros bloqueie armazenamento persistente
  }
}

/* ==========================================================================
   2. CATÁLOGO OFICIAL: GUIA DE MEDICAMENTOS (RENAME / REMUME)
   ========================================================================== */
const medicamentosData = [
  {
    id: 1,
    nome: "Losartana Potássica",
    dosagem: "50 mg (Comprimido)",
    categoria: "pressao",
    padrao: "Padrão RENAME / REMUME",
    receita: "Receita Comum (1 via) — Validade: 180 dias para uso contínuo",
    docs: "Documento com foto (RG/CNH) e Cartão Nacional de Saúde (SUS)",
    locais: "Todas as UBS do município e Farmácia Central"
  },
  {
    id: 2,
    nome: "Cloridrato de Metformina",
    dosagem: "850 mg (Comprimido)",
    categoria: "diabetes",
    padrao: "Padrão RENAME / REMUME",
    receita: "Receita Comum (1 via) — Validade: 180 dias para uso contínuo",
    docs: "Documento original com foto e Cartão SUS",
    locais: "Todas as UBS do município e Farmácia Polo Vicente de Carvalho"
  },
  {
    id: 3,
    nome: "Amoxicilina",
    dosagem: "500 mg (Cápsula)",
    categoria: "antibiotico",
    padrao: "Componente Básico RENAME",
    receita: "Receita de Controle Especial em 2 vias (1 via retida) — Validade: 10 dias",
    docs: "RG/CNH do paciente e do comprador, e Receita em 2 vias dentro do prazo",
    locais: "Farmácia Básica Vila Maia e Farmácia Polo Vicente de Carvalho"
  },
  {
    id: 4,
    nome: "Dipirona Monoidratada",
    dosagem: "500 mg (Comprimido ou Gotas)",
    categoria: "dor",
    padrao: "Padrão RENAME / REMUME",
    receita: "Receita Comum (1 via) — Validade: 30 dias",
    docs: "RG e Cartão SUS",
    locais: "Todas as UBSs e Prontos Atendimentos Municipais"
  },
  {
    id: 5,
    nome: "Omeprazol",
    dosagem: "20 mg (Cápsula)",
    categoria: "dor",
    padrao: "Padrão RENAME / REMUME",
    receita: "Receita Comum (1 via) — Validade: 60 dias",
    docs: "Documento oficial com foto e Cartão SUS",
    locais: "Todas as Farmácias das Unidades Básicas de Saúde"
  },
  {
    id: 6,
    nome: "Glibenclamida",
    dosagem: "5 mg (Comprimido)",
    categoria: "diabetes",
    padrao: "Padrão RENAME / REMUME",
    receita: "Receita Comum (1 via) — Validade: 180 dias para uso contínuo",
    docs: "RG, Cartão SUS e Receita Médica do SUS",
    locais: "Todas as UBS do município"
  },
  {
    id: 7,
    nome: "Cefalexina",
    dosagem: "500 mg (Drágea / Cápsula)",
    categoria: "antibiotico",
    padrao: "Componente Básico RENAME",
    receita: "Receita de Controle Especial em 2 vias (1 via retida) — Validade: 10 dias",
    docs: "RG do paciente e do comprador, receita em 2 vias legível",
    locais: "Farmácia Polo Vicente de Carvalho e UBS Vila Maia"
  },
  {
    id: 8,
    nome: "Hidroclorotiazida",
    dosagem: "25 mg (Comprimido)",
    categoria: "pressao",
    padrao: "Padrão RENAME / REMUME",
    receita: "Receita Comum (1 via) — Validade: 180 dias",
    docs: "RG e Cartão Nacional de Saúde (SUS)",
    locais: "Todas as Farmácias das UBSs"
  }
];

let currentMedCat = 'todos';
let currentMedQuery = '';

function renderMedicamentosList() {
  const container = document.getElementById('medicamentosListContainer');
  if (!container) return;

  const filtered = medicamentosData.filter(m => {
    const catMatch = currentMedCat === 'todos' || m.categoria === currentMedCat;
    const q = currentMedQuery.toLowerCase().trim();
    const queryMatch = !q || m.nome.toLowerCase().includes(q) || m.dosagem.toLowerCase().includes(q);
    return catMatch && queryMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="app-card" style="text-align:center; padding:22px 14px;">
        <p style="font-size:calc(0.85rem * var(--font-scale)); font-weight:700; color:var(--text-secondary); margin-bottom:4px;">Nenhum medicamento encontrado para "${currentMedQuery}".</p>
        <span style="font-size:calc(0.74rem * var(--font-scale)); color:var(--text-muted);">Confira a grafia ou consulte a Farmácia Polo municipal.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(med => `
    <article class="med-card">
      <div class="med-header">
        <div>
          <h3 class="med-name">${med.nome}</h3>
          <span class="med-dose">${med.dosagem}</span>
        </div>
        <span class="badge-pill">SUS / RENAME</span>
      </div>

      <div class="med-meta-box">
        <div class="med-row">
          <strong>Tipo de Receita:</strong>
          <span>${med.receita}</span>
        </div>
        <div class="med-row">
          <strong>Documentos:</strong>
          <span>${med.docs}</span>
        </div>
        <div class="med-row">
          <strong>Onde Retirar:</strong>
          <span>${med.locais}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function searchMedicamentos(query) {
  currentMedQuery = query;
  renderMedicamentosList();
}

function filterMedByCategory(cat, btnEl) {
  currentMedCat = cat;
  document.querySelectorAll('[data-medfilter]').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderMedicamentosList();
}

/* ==========================================================================
   3. NOTÍCIAS ("SAÚDE EM FOCO") E COMUNIDADE
   ========================================================================== */
const newsData = [
  {
    id: 1,
    tag: "Campanha de Vacinação",
    title: "Mutirão de atualização vacinal nas UBS do município",
    date: "27 Out 2026",
    desc: "Horários ampliados para imunização contra gripe e vacinas de rotina em todas as unidades.",
    img: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=420&q=80",
    fullText: "A Secretaria de Saúde ampliou o atendimento das salas de vacina em todas as UBS do município. O comparecimento pode ser feito com caderneta de vacinação e Cartão SUS para atualização das doses contra a gripe, hepatite e reforço contra a dengue."
  },
  {
    id: 2,
    tag: "Prevenção de Doenças",
    title: "Combate integrado a focos do mosquito Aedes aegypti",
    date: "25 Out 2026",
    desc: "Vistoria nos bairros e orientação sobre descarte seguro de recipientes e pneus.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=420&q=80",
    fullText: "Ações conjuntas entre agentes ambientais e de saúde percorrem os bairros para eliminação de criadouros. A população pode utilizar os Ecopontos municipais para descarte gratuito de entulho e materiais inservíveis."
  },
  {
    id: 3,
    tag: "Proteção Animal",
    title: "Feira de adoção responsável e agendamento de castração",
    date: "23 Out 2026",
    desc: "Setor de Zoonoses oferece atendimento e orientações de bem-estar animal.",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=420&q=80",
    fullText: "Animais resgatados e recuperados estarão disponíveis para adoção consciente neste sábado. O setor também abre novo lote de castrações gratuitas para tutores cadastrados de baixa renda."
  }
];

let communityData = [
  {
    id: 101,
    autor: "Associação de Moradores Vila Maia",
    tema: "Ação Comunitária",
    texto: "Neste sábado às 08h realizaremos o plantio coletivo de 40 mudas nativas e limpeza da praça central. Traga sua garrafa de água!",
    curtidas: 42,
    apoiado: false
  },
  {
    id: 102,
    autor: "Rede Proteção Animal Litoral",
    tema: "Proteção Animal",
    texto: "Mutirão de castração gratuita com inscrições abertas para moradores cadastrados. Confiram os documentos na aba Farmácia.",
    curtidas: 68,
    apoiado: true
  }
];

function renderNewsCards(searchQuery = '') {
  const container = document.getElementById('homeNewsList');
  if (!container) return;

  const filtered = newsData.filter(item => {
    if (!searchQuery) return true;
    return (item.title + ' ' + item.tag + ' ' + item.desc).toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="app-card" style="text-align:center; color:var(--text-secondary); font-size:calc(0.78rem * var(--font-scale));">Nenhuma notícia correspondente.</div>`;
    return;
  }

  container.innerHTML = filtered.map(n => `
    <article class="focus-card" onclick="openNewsDetail(${n.id})">
      <img class="focus-img" src="${n.img}" alt="${n.title}" onerror="this.src='https://placehold.co/240x200/159947/ffffff?text=cuidACAO'" />
      <div class="focus-body">
        <span class="focus-tag">${n.tag}</span>
        <h3 class="focus-title">${n.title}</h3>
        <span class="focus-date">${n.date}</span>
      </div>
    </article>
  `).join('');
}

function openNewsDetail(id) {
  const n = newsData.find(item => item.id === id);
  if (!n) return;
  document.getElementById('detailNewsCat').textContent = n.tag;
  document.getElementById('detailNewsImg').src = n.img;
  document.getElementById('detailNewsTitle').textContent = n.title;
  document.getElementById('detailNewsDate').textContent = n.date;
  document.getElementById('detailNewsText').textContent = n.fullText;
  document.getElementById('newsDetailSheet').classList.add('open');
}

function closeNewsDetailSheet() {
  document.getElementById('newsDetailSheet').classList.remove('open');
}

function renderCommunityFeed() {
  const homePreview = document.getElementById('homeCommunityPreview');
  const fullList = document.getElementById('communityFeedList');

  const cardHtml = (post) => `
    <div class="app-card">
      <span class="badge-pill">${post.tema}</span>
      <h3 style="font-size:calc(0.88rem * var(--font-scale)); font-weight:800; margin-bottom:3px;">${post.autor}</h3>
      <p style="font-size:calc(0.78rem * var(--font-scale)); color:var(--text-secondary); line-height:1.4;">${post.texto}</p>
      <div style="display:flex; justify-content:flex-end; margin-top:8px;">
        <button
          type="button"
          onclick="toggleLikePost(${post.id})"
          class="pill-btn ${post.apoiado ? 'active' : ''}"
          style="padding:5px 11px;"
        >
          💚 Apoiar (${post.curtidas})
        </button>
      </div>
    </div>
  `;

  if (homePreview && communityData.length > 0) {
    homePreview.innerHTML = cardHtml(communityData[0]);
  }
  if (fullList) {
    fullList.innerHTML = communityData.map(cardHtml).join('');
  }
}

function toggleLikePost(id) {
  const p = communityData.find(item => item.id === id);
  if (!p) return;
  p.apoiado = !p.apoiado;
  p.curtidas += p.apoiado ? 1 : -1;
  renderCommunityFeed();
}

function handlePostSubmit(e) {
  e.preventDefault();
  const autor = document.getElementById('postAutor').value.trim();
  const tema = document.getElementById('postTema').value;
  const texto = document.getElementById('postTexto').value.trim();

  communityData.unshift({
    id: Date.now(),
    autor,
    tema,
    texto,
    curtidas: 1,
    apoiado: true
  });

  renderCommunityFeed();
  e.target.reset();
  showToast('Publicado com sucesso no mural!');
}

/* ==========================================================================
   4. DENÚNCIAS AMBIENTAIS E ANIMAIS (COM PROTOCOLO #DEN-XXXXXX)
   ========================================================================== */
const denunciaTypes = {
  ambiental: [
    "Descarte irregular de lixo / entulho",
    "Queimada urbana ou foco de incêndio",
    "Poluição de rios, córregos ou praias",
    "Poda predatória ou desmatamento ilegal"
  ],
  animal: [
    "Abandono de animal em via pública ou imóvel",
    "Maus-tratos físicos ou privação de água e comida",
    "Animal atropelado ou ferido precisando de socorro",
    "Confinamento irregular ou falta de abrigo"
  ]
};

let denunciasHistory = [
  {
    id: 1,
    protocolo: "DEN-482103",
    categoria: "Ambiental",
    tipo: "Descarte irregular de lixo / entulho",
    local: "R. Brg. Eduardo Gomes, próx. nº 480 — Paecara",
    status: "Equipe acionada"
  },
  {
    id: 2,
    protocolo: "DEN-319502",
    categoria: "Maus-tratos Animais",
    tipo: "Abandono de animal em via pública",
    local: "Praça central — Vila Maia",
    status: "Em triagem"
  }
];

function selectDenunciaType(type) {
  openAppScreen('denuncias');
  const catInput = document.getElementById('denunciaCatInput');
  const select = document.getElementById('denunciaSelectTipo');
  const pillAmb = document.getElementById('pillDenAmbiental');
  const pillAni = document.getElementById('pillDenAnimal');

  if (type === 'animal') {
    catInput.value = 'Proteção Animal';
    pillAni.classList.add('active');
    pillAmb.classList.remove('active');
    select.innerHTML = denunciaTypes.animal.map(opt => `<option value="${opt}">${opt}</option>`).join('');
  } else {
    catInput.value = 'Ambiental';
    pillAmb.classList.add('active');
    pillAni.classList.remove('active');
    select.innerHTML = denunciaTypes.ambiental.map(opt => `<option value="${opt}">${opt}</option>`).join('');
  }
}

function useGpsLocation() {
  const locInput = document.getElementById('denunciaLocalInput');
  if (locInput) {
    locInput.value = "Av. Presidente Vargas — Guarujá, SP (Ponto GPS)";
    showToast("Localização GPS preenchida!");
  }
}

function renderDenunciasHistory() {
  const container = document.getElementById('denunciasHistoryList');
  if (!container) return;

  container.innerHTML = denunciasHistory.map(d => `
    <div class="app-card">
      <span class="badge-pill">Protocolo #${d.protocolo}</span>
      <h3 style="font-size:calc(0.86rem * var(--font-scale)); font-weight:800;">${d.tipo}</h3>
      <p style="font-size:calc(0.76rem * var(--font-scale)); color:var(--text-secondary); margin-top:2px;">📍 ${d.local}</p>
      <p style="font-size:calc(0.73rem * var(--font-scale)); color:var(--brand-primary); font-weight:700; margin-top:4px;">Status: ${d.status}</p>
    </div>
  `).join('');
}

function handleDenunciaSubmit(e) {
  e.preventDefault();
  const cat = document.getElementById('denunciaCatInput').value;
  const tipo = document.getElementById('denunciaSelectTipo').value;
  const local = document.getElementById('denunciaLocalInput').value.trim();
  const protocoloNum = Math.floor(100000 + Math.random() * 900000);
  const protocolo = `DEN-${protocoloNum}`;

  denunciasHistory.unshift({
    id: Date.now(),
    protocolo,
    categoria: cat,
    tipo,
    local,
    status: "Protocolo Aberto"
  });

  renderDenunciasHistory();
  document.getElementById('denunciaLocalInput').value = '';
  document.getElementById('denunciaDescInput').value = '';
  showToast(`Denúncia enviada! Protocolo #${protocolo}`);
}

/* ==========================================================================
   5. MAPA INTERATIVO REAL (GUARUJÁ - SP)
   ========================================================================== */
const guarujaLocations = [
  {
    id: 1,
    name: "Hospital Santo Amaro / Farmácia Básica Vila Maia",
    type: "saude",
    badge: "Farmácia Básica / UBS",
    color: "#159947",
    coords: [-23.9944, -46.2591],
    address: "R. Quinto Bertoldi, 40 — Vila Maia, Guarujá - SP",
    hours: "Atendimento 24h / Farmácia 07h às 18h"
  },
  {
    id: 2,
    name: "Farmácia Polo Vicente de Carvalho",
    type: "saude",
    badge: "Farmácia Polo Municipal",
    color: "#159947",
    coords: [-23.9412, -46.2845],
    address: "Av. Santos Dumont — Vicente de Carvalho, Guarujá - SP",
    hours: "Seg a Sex, 08h às 17h"
  },
  {
    id: 3,
    name: "Ecoponto Guarujá (Paecara)",
    type: "ambiental",
    badge: "Ecoponto Ambiental",
    color: "#0d9488",
    coords: [-23.9385, -46.2862],
    address: "R. Brg. Eduardo Gomes, 489 — Paecara, Guarujá - SP",
    hours: "Seg a Sáb, 08h às 17h (Descarte Gratuito)"
  },
  {
    id: 4,
    name: "Bem-Estar e Proteção Animal (Zoonoses)",
    type: "animal",
    badge: "Proteção Animal / Zoonoses",
    color: "#d97706",
    coords: [-23.9765, -46.2450],
    address: "Av. Presidente Vargas — Guarujá - SP",
    hours: "Seg a Sex, 08h às 17h"
  }
];

let leafletMapInstance = null;
let leafletMarkersGroup = null;

function initMobileLeaflet() {
  if (leafletMapInstance || typeof L === 'undefined') return;
  const mapContainer = document.getElementById('mobile-map');
  if (!mapContainer) return;

  leafletMapInstance = L.map('mobile-map').setView([-23.9750, -46.2550], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(leafletMapInstance);

  leafletMarkersGroup = L.layerGroup().addTo(leafletMapInstance);
  renderMapPoints('todos');
}

function renderMapPoints(filterType) {
  const container = document.getElementById('mapLocationsContainer');
  if (!container) return;
  container.innerHTML = '';

  if (leafletMarkersGroup) leafletMarkersGroup.clearLayers();

  const filtered = filterType === 'todos'
    ? guarujaLocations
    : guarujaLocations.filter(loc => loc.type === filterType);

  filtered.forEach(loc => {
    if (leafletMarkersGroup && typeof L !== 'undefined') {
      const pin = L.divIcon({
        className: 'cuidacao-pin',
        html: `<div style="background:${loc.color};width:20px;height:20px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.45);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker(loc.coords, { icon: pin })
        .bindPopup(`<strong>${loc.name}</strong><br>${loc.address}<br><small>${loc.hours}</small>`)
        .addTo(leafletMarkersGroup);
    }

    const card = document.createElement('div');
    card.className = 'app-card';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <span class="badge-pill">${loc.badge}</span>
      <h3 style="font-size:calc(0.86rem * var(--font-scale)); font-weight:800; margin-bottom:2px;">${loc.name}</h3>
      <p style="font-size:calc(0.76rem * var(--font-scale)); color:var(--text-secondary); margin-bottom:4px;">📍 ${loc.address}</p>
      <span style="font-size:calc(0.72rem * var(--font-scale)); color:var(--brand-primary); font-weight:700;">🕒 ${loc.hours}</span>
    `;
    card.onclick = () => {
      if (leafletMapInstance) {
        leafletMapInstance.setView(loc.coords, 15, { animate: true });
      }
      showToast(`Mapa focado em: ${loc.name}`);
    };
    container.appendChild(card);
  });
}

function filterMapPoints(type, btnEl) {
  document.querySelectorAll('[data-mapfilter]').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderMapPoints(type);
}

/* ==========================================================================
   6. NAVEGAÇÃO ENTRE TELAS DO APLICATIVO
   ========================================================================== */
function openAppScreen(screenId) {
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-tab').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === screenId);
  });

  const scrollBox = document.getElementById('mainScrollArea');
  if (scrollBox) scrollBox.scrollTo({ top: 0, behavior: 'smooth' });

  if (screenId === 'mapa') {
    setTimeout(() => {
      initMobileLeaflet();
      if (leafletMapInstance) leafletMapInstance.invalidateSize();
    }, 120);
  }
}

function scrollToHomeNews() {
  openAppScreen('inicio');
  setTimeout(() => {
    const header = document.getElementById('homeNewsHeader');
    if (header) header.scrollIntoView({ behavior: 'smooth' });
  }, 60);
}

function filterHomeContent(query) {
  const q = query.toLowerCase().trim();
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.style.display = q.length > 0 ? 'inline-flex' : 'none';

  document.querySelectorAll('#homeServicesGrid .service-card').forEach(card => {
    const text = (card.innerText + ' ' + (card.getAttribute('data-keywords') || '')).toLowerCase();
    card.style.display = (!q || text.includes(q)) ? '' : 'none';
  });

  renderNewsCards(q);
}

function clearHomeSearch() {
  const input = document.getElementById('homeSearchInput');
  if (input) input.value = '';
  filterHomeContent('');
}

/* ==========================================================================
   7. MODO CLARO, MODO ESCURO E MODO AUTOMÁTICO
   ========================================================================== */
const osDarkModeMatcher = window.matchMedia('(prefers-color-scheme: dark)');

function applyAppTheme(mode) {
  const effective = mode === 'auto' ? (osDarkModeMatcher.matches ? 'dark' : 'light') : mode;
  document.documentElement.setAttribute('data-theme', effective);

  ['light', 'dark', 'auto'].forEach(m => {
    const btn = document.getElementById('themeBtn-' + m);
    if (btn) btn.classList.toggle('active', mode === m);
  });
}

function setAppTheme(mode) {
  setStorage('cuidacao_theme', mode);
  applyAppTheme(mode);
  const label = mode === 'light' ? 'Modo Claro ativado' : mode === 'dark' ? 'Modo Escuro ativado' : 'Tema Automático ativado';
  showToast(label);
}

osDarkModeMatcher.addEventListener('change', () => {
  const saved = getStorage('cuidacao_theme', 'light');
  if (saved === 'auto') applyAppTheme('auto');
});

/* ==========================================================================
   8. ACESSIBILIDADE: TAMANHO DAS LETRAS
   ========================================================================== */
const fontLevels = ['small', 'default', 'large'];
const fontNames = ['Pequeno', 'Padrão', 'Grande'];

function applyFontScaleByIndex(indexValue) {
  const idx = Math.max(0, Math.min(2, parseInt(indexValue, 10)));
  document.documentElement.setAttribute('data-font', fontLevels[idx]);

  const slider = document.getElementById('fontSlider');
  if (slider) slider.value = String(idx);

  [0, 1, 2].forEach(i => {
    const lbl = document.getElementById('fontLbl-' + i);
    if (lbl) lbl.classList.toggle('active-label', i === idx);
  });

  setStorage('cuidacao_font_idx', String(idx));
}

function stepFontSize(delta) {
  const cur = parseInt(getStorage('cuidacao_font_idx', '1'), 10);
  const next = Math.max(0, Math.min(2, cur + delta));
  applyFontScaleByIndex(next);
  showToast('Tamanho da letra: ' + fontNames[next]);
}

/* ==========================================================================
   9. NOTIFICAÇÕES E TOAST FEEDBACK
   ========================================================================== */
function openNotificationsSheet() {
  document.getElementById('notificationsSheet').classList.add('open');
  const badge = document.getElementById('notifBadge');
  if (badge) badge.style.display = 'none';
}

function closeNotificationsSheet() {
  document.getElementById('notificationsSheet').classList.remove('open');
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('appToast');
  const msgSpan = document.getElementById('appToastMsg');
  if (!toast || !msgSpan) return;
  msgSpan.textContent = message;
  toast.style.display = 'flex';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

/* ==========================================================================
   10. INICIALIZAÇÃO
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  // Carrega temas e acessibilidade salvos
  const savedTheme = getStorage('cuidacao_theme', 'light');
  applyAppTheme(savedTheme);

  const savedFont = getStorage('cuidacao_font_idx', '1');
  applyFontScaleByIndex(savedFont);

  // Renderiza dados iniciais
  renderMedicamentosList();
  renderNewsCards();
  selectDenunciaType('ambiental');
  renderDenunciasHistory();
  renderCommunityFeed();
  renderMapPoints('todos');
});