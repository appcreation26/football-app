const MODO_DADOS = "demo"; // "demo" ou "api"

let dataSelecionada = new Date();
let todosOsJogos = [];
let filtroLigaSelecionada = null;
let jogoSelecionadoId = null;
let tabSelecionada = "all";

let ligasFechadas = JSON.parse(localStorage.getItem("ligasFechadas") || "[]");
let jogosFavoritos = JSON.parse(localStorage.getItem("jogosFavoritos") || "[]");
let jogosComAlerta = JSON.parse(localStorage.getItem("jogosComAlerta") || "[]");
let snapshotJogos = JSON.parse(localStorage.getItem("snapshotJogos") || "{}");

const cacheJogosPorData = {};
const CACHE_TTL_MS = 10 * 60 * 1000;

const MENU_LIGAS = [
  {
    grupo: "Portugal",
    apiCountry: "Portugal",
    flag: "https://media.api-sports.io/flags/pt.svg",
    ligas: [
      { display: "Primeira Liga", apiNames: ["Primeira Liga"] },
      { display: "Liga Portugal 2", apiNames: ["Liga Portugal 2", "Segunda Liga"] }
    ]
  },
  {
    grupo: "Espanha",
    apiCountry: "Spain",
    flag: "https://media.api-sports.io/flags/es.svg",
    ligas: [
      { display: "La Liga", apiNames: ["La Liga"] },
      { display: "La Liga 2", apiNames: ["La Liga 2", "Segunda Division"] }
    ]
  },
  {
    grupo: "Inglaterra",
    apiCountry: "England",
    flag: "https://media.api-sports.io/flags/gb.svg",
    ligas: [
      { display: "Premier League", apiNames: ["Premier League"] },
      { display: "Championship", apiNames: ["Championship"] },
      { display: "League One", apiNames: ["League One"] }
    ]
  },
  {
    grupo: "França",
    apiCountry: "France",
    flag: "https://media.api-sports.io/flags/fr.svg",
    ligas: [{ display: "Ligue 1", apiNames: ["Ligue 1"] }]
  },
  {
    grupo: "Alemanha",
    apiCountry: "Germany",
    flag: "https://media.api-sports.io/flags/de.svg",
    ligas: [
      { display: "Bundesliga", apiNames: ["Bundesliga"] },
      { display: "2. Bundesliga", apiNames: ["2. Bundesliga"] }
    ]
  },
  {
    grupo: "Itália",
    apiCountry: "Italy",
    flag: "https://media.api-sports.io/flags/it.svg",
    ligas: [{ display: "Serie A", apiNames: ["Serie A"] }]
  },
  {
    grupo: "Países Baixos",
    apiCountry: "Netherlands",
    flag: "https://media.api-sports.io/flags/nl.svg",
    ligas: [
      { display: "Eredivisie", apiNames: ["Eredivisie"] },
      { display: "Eerste Divisie", apiNames: ["Eerste Divisie"] }
    ]
  },
  {
    grupo: "Bélgica",
    apiCountry: "Belgium",
    flag: "https://media.api-sports.io/flags/be.svg",
    ligas: [{ display: "Pro League", apiNames: ["Jupiler Pro League", "Pro League"] }]
  },
  {
    grupo: "Escócia",
    apiCountry: "Scotland",
    flag: "https://media.api-sports.io/flags/gb.svg",
    ligas: [{ display: "Premiership", apiNames: ["Premiership"] }]
  },
  {
    grupo: "Turquia",
    apiCountry: "Turkey",
    flag: "https://media.api-sports.io/flags/tr.svg",
    ligas: [
      { display: "Süper Lig", apiNames: ["Süper Lig"] },
      { display: "1. Lig", apiNames: ["1. Lig"] }
    ]
  },
  {
    grupo: "Grécia",
    apiCountry: "Greece",
    flag: "https://media.api-sports.io/flags/gr.svg",
    ligas: [{ display: "Super League", apiNames: ["Super League 1", "Super League"] }]
  },
  {
    grupo: "Áustria",
    apiCountry: "Austria",
    flag: "https://media.api-sports.io/flags/at.svg",
    ligas: [
      { display: "Bundesliga Austríaca", apiNames: ["Bundesliga", "Austrian Bundesliga"] },
      { display: "Liga 2", apiNames: ["2. Liga"] }
    ]
  },
  {
    grupo: "Suíça",
    apiCountry: "Switzerland",
    flag: "https://media.api-sports.io/flags/ch.svg",
    ligas: [{ display: "Super League", apiNames: ["Super League"] }]
  },
  {
    grupo: "Dinamarca",
    apiCountry: "Denmark",
    flag: "https://media.api-sports.io/flags/dk.svg",
    ligas: [{ display: "Superliga", apiNames: ["Superliga"] }]
  },
  {
    grupo: "Suécia",
    apiCountry: "Sweden",
    flag: "https://media.api-sports.io/flags/se.svg",
    ligas: [{ display: "Allsvenskan", apiNames: ["Allsvenskan"] }]
  },
  {
    grupo: "Noruega",
    apiCountry: "Norway",
    flag: "https://media.api-sports.io/flags/no.svg",
    ligas: [{ display: "Eliteserien", apiNames: ["Eliteserien"] }]
  },
  {
    grupo: "República Checa",
    apiCountry: "Czech-Republic",
    flag: "https://media.api-sports.io/flags/cz.svg",
    ligas: [{ display: "Czech Liga", apiNames: ["Czech Liga"] }]
  },
  {
    grupo: "Sérvia",
    apiCountry: "Serbia",
    flag: "https://media.api-sports.io/flags/rs.svg",
    ligas: [{ display: "Super Liga", apiNames: ["Super Liga"] }]
  },
  {
    grupo: "Roménia",
    apiCountry: "Romania",
    flag: "https://media.api-sports.io/flags/ro.svg",
    ligas: [{ display: "Liga I", apiNames: ["Liga I"] }]
  },
  {
    grupo: "Hungria",
    apiCountry: "Hungary",
    flag: "https://media.api-sports.io/flags/hu.svg",
    ligas: [{ display: "NB I", apiNames: ["NB I"] }]
  },
  {
    grupo: "Bulgária",
    apiCountry: "Bulgaria",
    flag: "https://media.api-sports.io/flags/bg.svg",
    ligas: [{ display: "First League", apiNames: ["First League"] }]
  },
  {
    grupo: "Eslováquia",
    apiCountry: "Slovakia",
    flag: "https://media.api-sports.io/flags/sk.svg",
    ligas: [{ display: "Super Liga", apiNames: ["Super Liga"] }]
  },
  {
    grupo: "Eslovénia",
    apiCountry: "Slovenia",
    flag: "https://media.api-sports.io/flags/si.svg",
    ligas: [{ display: "PrvaLiga", apiNames: ["PrvaLiga", "1. SNL"] }]
  },
  {
    grupo: "Europa",
    apiCountry: "World",
    flag: "",
    ligas: [
      { display: "Liga dos Campeões", apiNames: ["UEFA Champions League"] },
      { display: "Liga Europa", apiNames: ["UEFA Europa League"] },
      { display: "Liga Conferência", apiNames: ["UEFA Europa Conference League"] }
    ]
  }
];

const gamesContainer = document.getElementById("games");
const leagueList = document.getElementById("leagueList");
const matchDetails = document.getElementById("matchDetails");
const loadBtn = document.getElementById("loadBtn");
const currentDateLabel = document.getElementById("currentDateLabel");

if (loadBtn) {
  loadBtn.addEventListener("click", () => mostrarJogos(true));
}

criarToastContainer();
renderSidebar();
atualizarLabelData();
mostrarJogos();

/* STORAGE */

function guardarLigasFechadas() {
  localStorage.setItem("ligasFechadas", JSON.stringify(ligasFechadas));
}

function guardarJogosFavoritos() {
  localStorage.setItem("jogosFavoritos", JSON.stringify(jogosFavoritos));
}

function guardarJogosComAlerta() {
  localStorage.setItem("jogosComAlerta", JSON.stringify(jogosComAlerta));
}

function guardarSnapshotJogos() {
  localStorage.setItem("snapshotJogos", JSON.stringify(snapshotJogos));
}

/* CACHE */

function cacheValido(entry) {
  return entry && Date.now() - entry.timestamp < CACHE_TTL_MS;
}

/* DATE */

function formatarDataAPI(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarHora(dataIso) {
  const data = new Date(dataIso);
  return data.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarDataHora(dataIso) {
  const data = new Date(dataIso);
  return data.toLocaleString("pt-PT");
}

function atualizarLabelData() {
  if (!currentDateLabel) return;

  const hoje = new Date();
  const hojeStr = formatarDataAPI(hoje);
  const selecionadaStr = formatarDataAPI(dataSelecionada);

  if (hojeStr === selecionadaStr) {
    currentDateLabel.textContent = "Hoje";
  } else {
    currentDateLabel.textContent = dataSelecionada.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit"
    });
  }
}

function diaAnterior() {
  dataSelecionada.setDate(dataSelecionada.getDate() - 1);
  filtroLigaSelecionada = null;
  jogoSelecionadoId = null;
  tabSelecionada = "all";
  atualizarLabelData();
  renderSidebar();
  mostrarJogos(true);
}

function diaSeguinte() {
  dataSelecionada.setDate(dataSelecionada.getDate() + 1);
  filtroLigaSelecionada = null;
  jogoSelecionadoId = null;
  tabSelecionada = "all";
  atualizarLabelData();
  renderSidebar();
  mostrarJogos(true);
}

function irHoje() {
  dataSelecionada = new Date();
  filtroLigaSelecionada = null;
  jogoSelecionadoId = null;
  tabSelecionada = "all";
  atualizarLabelData();
  renderSidebar();
  mostrarJogos(true);
}

/* FAVORITAS */

function getLeagueKey(country, display) {
  return `${country}|||${display}`;
}

function parseLeagueKey(key) {
  const [country, display] = key.split("|||");
  return { country, display };
}

function getFavoritas() {
  const guardadas = localStorage.getItem("ligasFavoritas");
  return guardadas ? JSON.parse(guardadas) : [];
}

function guardarFavoritas(lista) {
  localStorage.setItem("ligasFavoritas", JSON.stringify(lista));
}

function toggleFavorita(country, display) {
  const key = getLeagueKey(country, display);
  let favoritas = getFavoritas();

  if (favoritas.includes(key)) {
    favoritas = favoritas.filter((item) => item !== key);
  } else {
    favoritas.push(key);
  }

  guardarFavoritas(favoritas);
  renderSidebar();
  renderJogos();
}

function toggleJogoFavorito(idJogo) {
  if (jogosFavoritos.includes(idJogo)) {
    jogosFavoritos = jogosFavoritos.filter((id) => id !== idJogo);
  } else {
    jogosFavoritos.push(idJogo);
  }
  guardarJogosFavoritos();
  renderJogos();
}

/* ALERTAS MANUAIS */

function criarSnapshotJogo(jogo) {
  return {
    id: jogo.fixture.id,
    statusShort: jogo.fixture.status.short || "",
    homeGoals: Number(jogo.goals.home ?? 0),
    awayGoals: Number(jogo.goals.away ?? 0),
    homeName: jogo.teams.home.name,
    awayName: jogo.teams.away.name
  };
}

function isJogoLive(jogo) {
  const status = jogo.fixture.status.short || "";
  return ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status);
}

function isJogoFinished(jogo) {
  const status = jogo.fixture.status.short || "";
  return ["FT", "AET", "PEN"].includes(status);
}

function processarAlertasManuais(jogosNovos) {
  if (!Array.isArray(jogosNovos) || jogosNovos.length === 0) return;

  jogosNovos.forEach((jogo) => {
    if (!jogosComAlerta.includes(jogo.fixture.id)) return;

    const novo = criarSnapshotJogo(jogo);
    const anterior = snapshotJogos[jogo.fixture.id];

    if (!anterior) {
      snapshotJogos[jogo.fixture.id] = novo;
      return;
    }

    if (["NS", "TBD"].includes(anterior.statusShort) && isJogoLive(jogo)) {
      mostrarToast("Início do jogo", `${novo.homeName} x ${novo.awayName}`);
    }

    if (anterior.statusShort !== "HT" && novo.statusShort === "HT") {
      mostrarToast("Intervalo", `${novo.homeName} ${novo.homeGoals} - ${novo.awayGoals} ${novo.awayName}`);
    }

    if (!["FT", "AET", "PEN"].includes(anterior.statusShort) && isJogoFinished(jogo)) {
      mostrarToast("Fim do jogo", `${novo.homeName} ${novo.homeGoals} - ${novo.awayGoals} ${novo.awayName}`);
      jogosComAlerta = jogosComAlerta.filter((id) => id !== jogo.fixture.id);
      guardarJogosComAlerta();
    }

    const totalAnterior = Number(anterior.homeGoals) + Number(anterior.awayGoals);
    const totalNovo = Number(novo.homeGoals) + Number(novo.awayGoals);

    if (totalNovo > totalAnterior) {
      mostrarToast("Golo", `${novo.homeName} ${novo.homeGoals} - ${novo.awayGoals} ${novo.awayName}`);
    }

    snapshotJogos[jogo.fixture.id] = novo;
  });

  guardarSnapshotJogos();
}

async function toggleAlertaJogo(jogo) {
  const id = jogo.fixture.id;

  if (jogosComAlerta.includes(id)) {
    jogosComAlerta = jogosComAlerta.filter((item) => item !== id);
    delete snapshotJogos[id];
    guardarJogosComAlerta();
    guardarSnapshotJogos();
    mostrarToast("Alertas desativados", `${jogo.teams.home.name} x ${jogo.teams.away.name}`);
  } else {
    jogosComAlerta.push(id);
    snapshotJogos[id] = criarSnapshotJogo(jogo);
    guardarJogosComAlerta();
    guardarSnapshotJogos();
    mostrarToast("Alertas ativados", `${jogo.teams.home.name} x ${jogo.teams.away.name}`);
  }

  renderJogos();
}

/* LEAGUES */

function toggleLigaFechada(key) {
  if (ligasFechadas.includes(key)) {
    ligasFechadas = ligasFechadas.filter((item) => item !== key);
  } else {
    ligasFechadas.push(key);
  }
  guardarLigasFechadas();
  renderJogos();
}

function encontrarLigaConfig(country, display) {
  for (const grupo of MENU_LIGAS) {
    if (grupo.apiCountry !== country) continue;
    for (const liga of grupo.ligas) {
      if (liga.display === display) return liga;
    }
  }
  return null;
}

function getDisplayLeagueFromGame(jogo) {
  for (const grupo of MENU_LIGAS) {
    if (grupo.apiCountry !== jogo.league.country) continue;
    for (const liga of grupo.ligas) {
      if (liga.apiNames.includes(jogo.league.name)) {
        return {
          grupo: grupo.grupo,
          country: grupo.apiCountry,
          display: liga.display
        };
      }
    }
  }

  return {
    grupo: jogo.league.country,
    country: jogo.league.country,
    display: jogo.league.name
  };
}

function jogoPertenceLiga(jogo, country, apiNames) {
  return jogo.league.country === country && apiNames.includes(jogo.league.name);
}

function getJogosPermitidos() {
  let jogos = todosOsJogos.filter((jogo) => {
    return MENU_LIGAS.some((grupo) =>
      grupo.ligas.some((liga) =>
        jogoPertenceLiga(jogo, grupo.apiCountry, liga.apiNames)
      )
    );
  });

  if (filtroLigaSelecionada) {
    const { country, display } = parseLeagueKey(filtroLigaSelecionada);
    const ligaConfig = encontrarLigaConfig(country, display);
    if (!ligaConfig) return [];
    jogos = jogos.filter((jogo) => jogoPertenceLiga(jogo, country, ligaConfig.apiNames));
  }

  return jogos;
}

function filtrarPorTab(jogos) {
  if (tabSelecionada === "live") {
    return jogos.filter((jogo) =>
      ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(jogo.fixture.status.short)
    );
  }

  if (tabSelecionada === "finished") {
    return jogos.filter((jogo) =>
      ["FT", "AET", "PEN"].includes(jogo.fixture.status.short)
    );
  }

  if (tabSelecionada === "favorites") {
    return jogos.filter((jogo) => jogosFavoritos.includes(jogo.fixture.id));
  }

  return jogos;
}

/* DADOS */

async function obterJogosDemo() {
  const modulo = await import("./demo/matches.js");
  const lista = Array.isArray(modulo.demoMatches) ? modulo.demoMatches : [];
  return JSON.parse(JSON.stringify(lista));
}

function aplicarDataDemo(lista) {
  const dataBase = formatarDataAPI(dataSelecionada);

  return lista.map((jogo, index) => {
    const horaOriginal = new Date(jogo.fixture.date);
    const hora = String(horaOriginal.getUTCHours()).padStart(2, "0");
    const minuto = String(horaOriginal.getUTCMinutes()).padStart(2, "0");

    return {
      ...jogo,
      fixture: {
        ...jogo.fixture,
        id: Number(`${dataBase.replaceAll("-", "")}${index + 1}`),
        date: `${dataBase}T${hora}:${minuto}:00+00:00`
      }
    };
  });
}

async function mostrarJogos(force = false) {
  if (gamesContainer) {
    gamesContainer.innerHTML = `<p class="muted">🔄 A carregar jogos...</p>`;
  }
  if (matchDetails && !jogoSelecionadoId) {
    matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
  }

  try {
    const dataAPI = formatarDataAPI(dataSelecionada);

    if (!force && cacheValido(cacheJogosPorData[dataAPI])) {
      todosOsJogos = cacheJogosPorData[dataAPI].data;
      renderJogos();
      return;
    }

    let jogosRecebidos = [];

    if (MODO_DADOS === "demo") {
      const demoBase = await obterJogosDemo();
      jogosRecebidos = aplicarDataDemo(demoBase);
    } else {
      const resposta = await fetch(`/api/games?date=${dataAPI}`);
      const dados = await resposta.json();
      jogosRecebidos = Array.isArray(dados.response) ? dados.response : [];
    }

    if (!jogosRecebidos.length) {
      todosOsJogos = [];
      cacheJogosPorData[dataAPI] = {
        timestamp: Date.now(),
        data: []
      };
      renderJogos();
      return;
    }

    todosOsJogos = jogosRecebidos;
    cacheJogosPorData[dataAPI] = {
      timestamp: Date.now(),
      data: todosOsJogos
    };

    processarAlertasManuais(todosOsJogos);
    renderJogos();
  } catch (erro) {
    console.error("Erro ao carregar jogos:", erro);
    if (gamesContainer) {
      gamesContainer.innerHTML = `<p class="muted">Erro ao carregar jogos.</p>`;
    }
  }
}

/* SIDEBAR */

function renderSidebar() {
  if (!leagueList) return;

  leagueList.innerHTML = "";
  const favoritas = getFavoritas();

  if (favoritas.length > 0) {
    const favGroup = document.createElement("div");
    favGroup.className = "country-group";

    const favHeader = document.createElement("div");
    favHeader.className = "country-header";
    favHeader.innerHTML = `
      <div class="country-header-left">
        <span class="country-name">⭐ Favoritas</span>
      </div>
      <span class="country-arrow">▼</span>
    `;

    const favLeagues = document.createElement("div");
    favLeagues.className = "country-leagues";
    favLeagues.style.display = "flex";

    favoritas.forEach((key) => {
      const { country, display } = parseLeagueKey(key);
      const ligaConfig = encontrarLigaConfig(country, display);

      if (ligaConfig) {
        favLeagues.appendChild(criarLeagueItem(country, display));
      }
    });

    favHeader.addEventListener("click", () => {
      const estaVisivel = favLeagues.style.display !== "none";
      favLeagues.style.display = estaVisivel ? "none" : "flex";
      favHeader.querySelector(".country-arrow").textContent = estaVisivel ? "▶" : "▼";
    });

    favGroup.appendChild(favHeader);
    favGroup.appendChild(favLeagues);
    leagueList.appendChild(favGroup);
  }

  MENU_LIGAS.forEach((grupo) => {
    const countryGroup = document.createElement("div");
    countryGroup.className = "country-group";

    const countryHeader = document.createElement("div");
    countryHeader.className = "country-header";
    countryHeader.innerHTML = `
      <div class="country-header-left">
        ${grupo.flag ? `<img src="${grupo.flag}" class="country-flag" alt="${grupo.grupo}">` : ""}
        <span class="country-name">${grupo.grupo}</span>
      </div>
      <span class="country-arrow">▶</span>
    `;

    const countryLeagues = document.createElement("div");
    countryLeagues.className = "country-leagues";
    countryLeagues.style.display = "none";

    let grupoTemLigaSelecionada = false;

    grupo.ligas.forEach((liga) => {
      countryLeagues.appendChild(criarLeagueItem(grupo.apiCountry, liga.display));
      if (filtroLigaSelecionada === getLeagueKey(grupo.apiCountry, liga.display)) {
        grupoTemLigaSelecionada = true;
      }
    });

    if (grupoTemLigaSelecionada) {
      countryLeagues.style.display = "flex";
      countryHeader.querySelector(".country-arrow").textContent = "▼";
    }

    countryHeader.addEventListener("click", () => {
      const estaVisivel = countryLeagues.style.display !== "none";
      countryLeagues.style.display = estaVisivel ? "none" : "flex";
      countryHeader.querySelector(".country-arrow").textContent = estaVisivel ? "▶" : "▼";
    });

    countryGroup.appendChild(countryHeader);
    countryGroup.appendChild(countryLeagues);
    leagueList.appendChild(countryGroup);
  });
}

function criarLeagueItem(country, display) {
  const favoritas = getFavoritas();
  const item = document.createElement("div");
  item.className = "league-item";

  const key = getLeagueKey(country, display);
  if (filtroLigaSelecionada === key) {
    item.classList.add("active");
  }

  const estrela = favoritas.includes(key) ? "★" : "☆";

  item.innerHTML = `
    <div class="league-item-content">
      <span>${display}</span>
    </div>
    <button class="favorite-btn" type="button">${estrela}</button>
  `;

  item.addEventListener("click", () => {
    filtroLigaSelecionada = key;
    jogoSelecionadoId = null;
    tabSelecionada = "all";
    renderSidebar();
    renderJogos();
    if (matchDetails) {
      matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
    }
  });

  item.querySelector(".favorite-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorita(country, display);
  });

  return item;
}

/* STATUS */

function traduzirEstado(statusShort, statusLong) {
  const mapa = {
    NS: "Por começar",
    TBD: "Por definir",
    FT: "Terminado",
    AET: "Após prolongamento",
    PEN: "Penáltis",
    PST: "Adiado",
    CANC: "Cancelado",
    ABD: "Abandonado",
    AWD: "Atribuído",
    WO: "Falta de comparência",
    INT: "Interrompido",
    SUSP: "Suspenso",
    LIVE: "Ao vivo",
    HT: "Intervalo",
    ET: "Prolongamento",
    BT: "Intervalo",
    P: "Penáltis"
  };

  if (mapa[statusShort]) return mapa[statusShort];
  return statusLong || statusShort || "-";
}

function getTextoEstadoLinhaHtml(jogo) {
  const status = jogo.fixture.status.short || "";
  const statusLong = jogo.fixture.status.long || "";
  const minuto = jogo.fixture.status.elapsed;

  if (isJogoLive(jogo)) {
    return minuto ? `${minuto}'` : traduzirEstado(status, statusLong);
  }

  if (["NS", "TBD"].includes(status)) {
    return formatarHora(jogo.fixture.date);
  }

  if (status === "AET") {
    return `Após<br>prolongamento`;
  }

  if (["FT", "PEN", "PST", "CANC", "ABD", "AWD", "WO", "INT", "SUSP"].includes(status)) {
    return traduzirEstado(status, statusLong);
  }

  if (minuto && Number(minuto) > 0) {
    return `${minuto}'`;
  }

  return traduzirEstado(status, statusLong);
}

function renderLiveIcon(jogo) {
  if (!isJogoLive(jogo)) return "";
  return `<span class="fixture-live-icon" title="Jogo em direto" aria-hidden="true"></span>`;
}

/* ODDS LOCAIS */

function renderOddCell(value) {
  return `
    <div class="odd-box">
      <span class="odd-value">${value}</span>
    </div>
  `;
}

function renderOdds() {
  return `
    <div class="fixture-odds">
      ${renderOddCell("-")}
      ${renderOddCell("-")}
      ${renderOddCell("-")}
    </div>
  `;
}

function renderBellButton(jogo) {
  const ativo = jogosComAlerta.includes(jogo.fixture.id);

  return `
    <button
      class="fixture-bell-btn ${ativo ? "active" : ""}"
      type="button"
      aria-label="Ativar alertas do jogo"
      title="${ativo ? "Alertas ativos" : "Ativar alertas"}"
    >
      <span class="fixture-bell-icon"></span>
    </button>
  `;
}

function renderOddsHeader() {
  return `
    <div class="odds-header-row">
      <div></div>
      <div></div>
      <div></div>
      <div class="odds-header-labels">
        <span>1</span>
        <span>X</span>
        <span>2</span>
      </div>
      <div></div>
    </div>
  `;
}

/* GAMES */

function agruparJogosPorLiga(jogos) {
  const grupos = {};

  jogos.forEach((jogo) => {
    const ligaInfo = getDisplayLeagueFromGame(jogo);
    const chave = `${ligaInfo.grupo}|||${ligaInfo.display}`;

    if (!grupos[chave]) {
      grupos[chave] = {
        grupo: ligaInfo.grupo,
        country: ligaInfo.country,
        liga: ligaInfo.display,
        logo: jogo.league.logo,
        jogos: []
      };
    }

    grupos[chave].jogos.push(jogo);
  });

  return Object.values(grupos).sort((a, b) => {
    const textoA = `${a.grupo}: ${a.liga}`;
    const textoB = `${b.grupo}: ${b.liga}`;
    return textoA.localeCompare(textoB, "pt");
  });
}

function renderJogos() {
  if (!gamesContainer) return;

  const jogosBase = getJogosPermitidos();
  const jogosFiltrados = filtrarPorTab(jogosBase);

  gamesContainer.innerHTML = "";
  renderTabs();

  if (jogosFiltrados.length === 0) {
    gamesContainer.innerHTML += `<p class="muted">Sem jogos nesta categoria.</p>`;
    return;
  }

  const favoritas = getFavoritas();
  const ligasAgrupadas = agruparJogosPorLiga(jogosFiltrados);

  ligasAgrupadas.forEach((bloco) => {
    bloco.jogos.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

    const section = document.createElement("div");
    section.className = "league-section";

    const header = document.createElement("div");
    header.className = "league-section-header";

    const headerKey = getLeagueKey(bloco.country, bloco.liga);
    const headerFavorita = favoritas.includes(headerKey) ? "★" : "☆";
    const estaFechada = ligasFechadas.includes(headerKey);

    header.innerHTML = `
      <div class="league-section-left">
        <button class="league-header-favorite" type="button">${headerFavorita}</button>
        ${bloco.logo ? `<img src="${bloco.logo}" class="league-section-logo" alt="${bloco.liga}">` : ""}
        <span class="league-section-title">${bloco.grupo} ${bloco.liga}</span>
      </div>
      <button class="league-toggle-btn ${estaFechada ? "is-closed" : "is-open"}" type="button" aria-label="Abrir ou fechar jogos"></button>
    `;

    header.addEventListener("click", () => {
      toggleLigaFechada(headerKey);
    });

    header.querySelector(".league-header-favorite").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorita(bloco.country, bloco.liga);
    });

    header.querySelector(".league-toggle-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLigaFechada(headerKey);
    });

    section.appendChild(header);

    if (!estaFechada) {
      section.insertAdjacentHTML("beforeend", renderOddsHeader());

      bloco.jogos.forEach((jogo) => {
        const row = document.createElement("div");
        row.className = "fixture-row";

        if (jogoSelecionadoId === jogo.fixture.id) {
          row.classList.add("selected");
        }

        const jogoFavorito = jogosFavoritos.includes(jogo.fixture.id) ? "★" : "☆";

        row.innerHTML = `
          <div class="fixture-left">
            <button class="fixture-favorite-btn" type="button">${jogoFavorito}</button>
            ${renderLiveIcon(jogo)}
            <div class="fixture-status">${getTextoEstadoLinhaHtml(jogo)}</div>
          </div>

          <div class="fixture-teams">
            <div class="fixture-team-line">
              <img src="${jogo.teams.home.logo}" class="fixture-team-logo" alt="${jogo.teams.home.name}">
              <span class="fixture-team-name">${jogo.teams.home.name}</span>
            </div>
            <div class="fixture-team-line">
              <img src="${jogo.teams.away.logo}" class="fixture-team-logo" alt="${jogo.teams.away.name}">
              <span class="fixture-team-name">${jogo.teams.away.name}</span>
            </div>
          </div>

          <div class="fixture-scores">
            <div>${jogo.goals.home ?? "-"}</div>
            <div>${jogo.goals.away ?? "-"}</div>
          </div>

          ${renderOdds()}
          ${renderBellButton(jogo)}
        `;

        row.addEventListener("click", () => {
          jogoSelecionadoId = jogo.fixture.id;
          renderJogos();
          renderDetalhes(jogo);
        });

        row.querySelector(".fixture-favorite-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          toggleJogoFavorito(jogo.fixture.id);
        });

        row.querySelector(".fixture-bell-btn").addEventListener("click", async (e) => {
          e.stopPropagation();
          await toggleAlertaJogo(jogo);
        });

        section.appendChild(row);
      });
    }

    gamesContainer.appendChild(section);
  });
}

function renderTabs() {
  if (!gamesContainer) return;

  const tabs = document.createElement("div");
  tabs.className = "games-tabs";

  tabs.innerHTML = `
    <button class="games-tab ${tabSelecionada === "all" ? "active" : ""}" data-tab="all">Todos</button>
    <button class="games-tab ${tabSelecionada === "live" ? "active" : ""}" data-tab="live">Direto</button>
    <button class="games-tab ${tabSelecionada === "finished" ? "active" : ""}" data-tab="finished">Terminado</button>
    <button class="games-tab ${tabSelecionada === "favorites" ? "active" : ""}" data-tab="favorites">Favoritos</button>
  `;

  tabs.querySelectorAll(".games-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const novaTab = btn.dataset.tab;

      if (novaTab === "all" || novaTab === "favorites") {
        tabSelecionada = novaTab;
        filtroLigaSelecionada = null;
        jogoSelecionadoId = null;
        renderSidebar();
        renderJogos();
        if (matchDetails) {
          matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
        }
        return;
      }

      if (tabSelecionada === novaTab) {
        tabSelecionada = "all";
        filtroLigaSelecionada = null;
        jogoSelecionadoId = null;
        renderSidebar();
        renderJogos();
        if (matchDetails) {
          matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
        }
        return;
      }

      tabSelecionada = novaTab;
      jogoSelecionadoId = null;
      renderJogos();
      if (matchDetails) {
        matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
      }
    });
  });

  gamesContainer.appendChild(tabs);
}

/* DETAILS - SEM API EXTRA */

function renderDetalhes(jogo) {
  if (!matchDetails) return;

  const statusCurto = jogo.fixture.status.short || "";
  const statusLongo = jogo.fixture.status.long || "";
  const minuto = jogo.fixture.status.elapsed || 0;
  const estadio = jogo.fixture.venue?.name || "Sem estádio disponível";
  const cidade = jogo.fixture.venue?.city || "Sem cidade disponível";
  const arbitro = jogo.fixture.referee || "Sem informação";

  matchDetails.innerHTML = `
    <div class="details-card">
      <div class="details-title">Resumo do jogo</div>
      <div class="details-teams">
        <div class="details-team">
          <img src="${jogo.teams.home.logo}" alt="${jogo.teams.home.name}">
          <div>${jogo.teams.home.name}</div>
        </div>
        <div class="details-score">${jogo.goals.home ?? 0} - ${jogo.goals.away ?? 0}</div>
        <div class="details-team">
          <img src="${jogo.teams.away.logo}" alt="${jogo.teams.away.name}">
          <div>${jogo.teams.away.name}</div>
        </div>
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Informação do jogo</div>
      <div class="details-meta">
        <div><span class="status-live">${statusCurto}</span> • ${statusLongo}</div>
        <div>Minuto: ${minuto ? `${minuto}'` : "-"}</div>
        <div>Liga: ${jogo.league.name}</div>
        <div>Data: ${formatarDataHora(jogo.fixture.date)}</div>
        <div>Árbitro: ${arbitro}</div>
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Local</div>
      <div class="details-meta">
        <div>Estádio: ${estadio}</div>
        <div>Cidade: ${cidade}</div>
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Resultado ao intervalo</div>
      <div class="details-meta">
        <div>${jogo.score?.halftime?.home ?? "-"} - ${jogo.score?.halftime?.away ?? "-"}</div>
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Resultado final</div>
      <div class="details-meta">
        <div>${jogo.score?.fulltime?.home ?? "-"} - ${jogo.score?.fulltime?.away ?? "-"}</div>
      </div>
    </div>
  `;
}

/* TOASTS */

function criarToastContainer() {
  if (document.getElementById("toastContainer")) return;

  const container = document.createElement("div");
  container.id = "toastContainer";
  container.className = "toast-container";
  document.body.appendChild(container);
}

function mostrarToast(titulo, mensagem) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-item";
  toast.innerHTML = `
    <div class="toast-title">${titulo}</div>
    <div class="toast-message">${mensagem}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}
