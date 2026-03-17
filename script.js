let dataSelecionada = new Date();
let todosOsJogos = [];
let oddsPorJogo = {};
let filtroLigaSelecionada = null;
let jogoSelecionadoId = null;
let tabSelecionada = "all";
let ligasFechadas = JSON.parse(localStorage.getItem("ligasFechadas") || "[]");
let jogosFavoritos = JSON.parse(localStorage.getItem("jogosFavoritos") || "[]");
let jogosComAlerta = JSON.parse(localStorage.getItem("jogosComAlerta") || "[]");
let estadoAlertasJogos = JSON.parse(localStorage.getItem("estadoAlertasJogos") || "{}");
let intervaloAlertas = null;

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

loadBtn.addEventListener("click", mostrarJogos);

criarToastContainer();
renderSidebar();
atualizarLabelData();
mostrarJogos();
iniciarMonitorizacaoAlertas();

function guardarLigasFechadas() {
  localStorage.setItem("ligasFechadas", JSON.stringify(ligasFechadas));
}

function guardarJogosFavoritos() {
  localStorage.setItem("jogosFavoritos", JSON.stringify(jogosFavoritos));
}

function guardarJogosComAlerta() {
  localStorage.setItem("jogosComAlerta", JSON.stringify(jogosComAlerta));
}

function guardarEstadoAlertasJogos() {
  localStorage.setItem("estadoAlertasJogos", JSON.stringify(estadoAlertasJogos));
}

function toggleLigaFechada(key) {
  if (ligasFechadas.includes(key)) {
    ligasFechadas = ligasFechadas.filter((item) => item !== key);
  } else {
    ligasFechadas.push(key);
  }
  guardarLigasFechadas();
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

function getLeagueKey(country, display) {
  return `${country}|||${display}`;
}

function parseLeagueKey(key) {
  const [country, display] = key.split("|||");
  return { country, display };
}

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
  mostrarJogos();
}

function diaSeguinte() {
  dataSelecionada.setDate(dataSelecionada.getDate() + 1);
  filtroLigaSelecionada = null;
  jogoSelecionadoId = null;
  tabSelecionada = "all";
  atualizarLabelData();
  renderSidebar();
  mostrarJogos();
}

function irHoje() {
  dataSelecionada = new Date();
  filtroLigaSelecionada = null;
  jogoSelecionadoId = null;
  tabSelecionada = "all";
  atualizarLabelData();
  renderSidebar();
  mostrarJogos();
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

    jogos = jogos.filter((jogo) =>
      jogoPertenceLiga(jogo, country, ligaConfig.apiNames)
    );
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

async function carregarOddsFixas(jogos) {
  const ids = jogos.map((jogo) => jogo.fixture.id).filter(Boolean);

  if (ids.length === 0) {
    oddsPorJogo = {};
    return;
  }

  try {
    const resposta = await fetch(`/api/odds?ids=${ids.join(",")}`);
    const dados = await resposta.json();
    oddsPorJogo = dados.response || {};
  } catch (erro) {
    console.error("Erro ao carregar odds:", erro);
    oddsPorJogo = {};
  }
}

async function mostrarJogos() {
  gamesContainer.innerHTML = `<p class="muted">🔄 A carregar jogos...</p>`;
  matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;

  try {
    const dataAPI = formatarDataAPI(dataSelecionada);
    const resposta = await fetch(`/api/games?date=${dataAPI}`);
    const dados = await resposta.json();

    if (!dados.response || dados.response.length === 0) {
      todosOsJogos = [];
      oddsPorJogo = {};
      renderJogos();
      return;
    }

    todosOsJogos = dados.response;
    await carregarOddsFixas(todosOsJogos);
    renderJogos();
  } catch (erro) {
    console.error("Erro ao carregar jogos:", erro);
    gamesContainer.innerHTML = `<p class="muted">Erro ao carregar jogos.</p>`;
  }
}

function renderSidebar() {
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
        const item = criarLeagueItem(country, display);
        favLeagues.appendChild(item);
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
      const item = criarLeagueItem(grupo.apiCountry, liga.display);

      if (filtroLigaSelecionada === getLeagueKey(grupo.apiCountry, liga.display)) {
        grupoTemLigaSelecionada = true;
      }

      countryLeagues.appendChild(item);
    });

    if (grupoTemLigaSelecionada) {
      countryLeagues.style.display = "flex";
      countryHeader.querySelector(".country-arrow").textContent = "▼";
    }

    countryHeader.addEventListener("click", () => {
      const estaVisivel = countryLeagues.style.display !== "none";
      countryLeagues.style.display = estaVisivel ? "none" : "flex";
      countryHeader.querySelector(".country-arrow").textContent = estaVisivel ? "▶" : "▼";

      if (!estaVisivel) {
        setTimeout(() => {
          countryGroup.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }, 120);
      }
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
    matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
  });

  item.querySelector(".favorite-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorita(country, display);
  });

  return item;
}

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

function isJogoLive(jogo) {
  const status = jogo.fixture.status.short || "";
  return ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status);
}

function isJogoFinished(jogo) {
  const status = jogo.fixture.status.short || "";
  return ["FT", "AET", "PEN"].includes(status);
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

function renderOddCell(value) {
  return `
    <div class="odd-box">
      <span class="odd-value">${value}</span>
    </div>
  `;
}

function renderOdds(jogo) {
  const odds = oddsPorJogo[jogo.fixture.id];

  if (!odds) {
    return `
      <div class="fixture-odds">
        ${renderOddCell("-")}
        ${renderOddCell("-")}
        ${renderOddCell("-")}
      </div>
    `;
  }

  return `
    <div class="fixture-odds">
      ${renderOddCell(odds.home)}
      ${renderOddCell(odds.draw)}
      ${renderOddCell(odds.away)}
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
      ${ativo ? "🔔" : '<span class="fixture-bell-icon"></span>'}
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

          ${renderOdds(jogo)}
          ${renderBellButton(jogo)}
        `;

        row.addEventListener("click", async () => {
          jogoSelecionadoId = jogo.fixture.id;
          renderJogos();
          await renderDetalhes(jogo);
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
        matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
        return;
      }

      if (tabSelecionada === novaTab) {
        tabSelecionada = "all";
        filtroLigaSelecionada = null;
        jogoSelecionadoId = null;
        renderSidebar();
        renderJogos();
        matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
        return;
      }

      tabSelecionada = novaTab;
      jogoSelecionadoId = null;
      renderJogos();
      matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
    });
  });

  gamesContainer.appendChild(tabs);
}

async function renderDetalhes(jogo) {
  const statusCurto = jogo.fixture.status.short || "";
  const statusLongo = jogo.fixture.status.long || "";
  const minuto = jogo.fixture.status.elapsed || 0;
  const estadio = jogo.fixture.venue?.name || "Sem estádio disponível";
  const cidade = jogo.fixture.venue?.city || "Sem cidade disponível";

  matchDetails.innerHTML = `<p class="muted">🔄 A carregar detalhes do jogo...</p>`;

  let eventos = [];
  let estatisticas = [];

  try {
    const [eventosRes, statsRes] = await Promise.all([
      fetch(`/api/fixture-details?id=${jogo.fixture.id}`),
      fetch(`/api/fixture-stats?id=${jogo.fixture.id}`),
    ]);

    const eventosData = await eventosRes.json();
    const statsData = await statsRes.json();

    eventos = eventosData.response || [];
    estatisticas = statsData.response || [];
  } catch (error) {
    console.error("Erro ao carregar detalhes:", error);
  }

  const golos = eventos.filter((evento) => evento.type === "Goal");
  const amarelos = eventos.filter((evento) => evento.type === "Card" && evento.detail === "Yellow Card");
  const vermelhos = eventos.filter(
    (evento) => evento.type === "Card" && (evento.detail === "Red Card" || evento.detail === "Second Yellow card")
  );

  const homeStats = estatisticas.find((item) => item.team && item.team.id === jogo.teams.home.id);
  const awayStats = estatisticas.find((item) => item.team && item.team.id === jogo.teams.away.id);

  const posseCasa = getStatValue(homeStats, "Ball Possession");
  const posseFora = getStatValue(awayStats, "Ball Possession");
  const rematesBalizaCasa = getStatValue(homeStats, "Shots on Goal");
  const rematesBalizaFora = getStatValue(awayStats, "Shots on Goal");
  const cantosCasa = getStatValue(homeStats, "Corner Kicks");
  const cantosFora = getStatValue(awayStats, "Corner Kicks");
  const faltasCasa = getStatValue(homeStats, "Fouls");
  const faltasFora = getStatValue(awayStats, "Fouls");

  const dominio = calcularDominio(posseCasa, posseFora, rematesBalizaCasa, rematesBalizaFora, cantosCasa, cantosFora);

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
      <div class="details-title">Estado</div>
      <div class="details-meta">
        <div><span class="status-live">${statusCurto}</span> • ${statusLongo}</div>
        <div>Minuto: ${minuto}'</div>
        <div>Liga: ${jogo.league.name}</div>
        <div>Data: ${formatarDataHora(jogo.fixture.date)}</div>
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
      <div class="details-title">Domínio estimado</div>
      <div class="details-meta">
        <div class="dominance-labels">
          <span>${jogo.teams.home.name}</span>
          <span>${jogo.teams.away.name}</span>
        </div>
        <div class="dominance-bar">
          <div class="dominance-home" style="width: ${dominio.home}%"></div>
          <div class="dominance-away" style="width: ${dominio.away}%"></div>
        </div>
        <div class="dominance-values">
          <span>${dominio.home}%</span>
          <span>${dominio.away}%</span>
        </div>
        <div class="muted small-note">Estimado com base em posse, remates à baliza e cantos.</div>
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Estatísticas</div>
      <div class="stats-table">
        ${renderStatRow("Posse de bola", posseCasa, posseFora)}
        ${renderStatRow("Remates à baliza", rematesBalizaCasa, rematesBalizaFora)}
        ${renderStatRow("Cantos", cantosCasa, cantosFora)}
        ${renderStatRow("Faltas", faltasCasa, faltasFora)}
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Golos</div>
      <div class="details-meta">
        ${golos.length ? golos.map(g => `<div>${g.time.elapsed}' • ${g.team.name} • ${g.player?.name || "Sem nome"}</div>`).join("") : "<div>Sem golos registados.</div>"}
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Cartões amarelos</div>
      <div class="details-meta">
        ${amarelos.length ? amarelos.map(c => `<div>${c.time.elapsed}' • ${c.team.name} • ${c.player?.name || "Sem nome"}</div>`).join("") : "<div>Sem amarelos registados.</div>"}
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Cartões vermelhos</div>
      <div class="details-meta">
        ${vermelhos.length ? vermelhos.map(c => `<div>${c.time.elapsed}' • ${c.team.name} • ${c.player?.name || "Sem nome"}</div>`).join("") : "<div>Sem vermelhos registados.</div>"}
      </div>
    </div>
  `;
}

/* ALERTAS */

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
  }, 4500);
}

function contarCartoesVermelhos(eventos) {
  return eventos.filter(
    (evento) =>
      evento.type === "Card" &&
      (evento.detail === "Red Card" || evento.detail === "Second Yellow card")
  ).length;
}

async function obterEventosJogo(idJogo) {
  try {
    const resposta = await fetch(`/api/fixture-details?id=${idJogo}`);
    const dados = await resposta.json();
    return dados.response || [];
  } catch (erro) {
    console.error("Erro ao obter eventos do jogo:", erro);
    return [];
  }
}

async function criarEstadoInicialAlerta(jogo) {
  const eventos = await obterEventosJogo(jogo.fixture.id);

  return {
    id: jogo.fixture.id,
    homeName: jogo.teams.home.name,
    awayName: jogo.teams.away.name,
    homeGoals: Number(jogo.goals.home ?? 0),
    awayGoals: Number(jogo.goals.away ?? 0),
    statusShort: jogo.fixture.status.short || "",
    redCards: contarCartoesVermelhos(eventos)
  };
}

async function toggleAlertaJogo(jogo) {
  const id = jogo.fixture.id;

  if (jogosComAlerta.includes(id)) {
    jogosComAlerta = jogosComAlerta.filter((item) => item !== id);
    delete estadoAlertasJogos[id];
    guardarJogosComAlerta();
    guardarEstadoAlertasJogos();
    mostrarToast("Alertas desativados", `${jogo.teams.home.name} x ${jogo.teams.away.name}`);
  } else {
    jogosComAlerta.push(id);
    estadoAlertasJogos[id] = await criarEstadoInicialAlerta(jogo);
    guardarJogosComAlerta();
    guardarEstadoAlertasJogos();
    mostrarToast("Alertas ativados", `${jogo.teams.home.name} x ${jogo.teams.away.name}`);
  }

  renderJogos();
  iniciarMonitorizacaoAlertas();
}

function iniciarMonitorizacaoAlertas() {
  if (intervaloAlertas) {
    clearInterval(intervaloAlertas);
    intervaloAlertas = null;
  }

  if (jogosComAlerta.length === 0) return;

  intervaloAlertas = setInterval(() => {
    verificarAlertasJogos();
  }, 30000);
}

async function verificarAlertasJogos() {
  if (jogosComAlerta.length === 0) return;

  try {
    const dataAPI = formatarDataAPI(dataSelecionada);
    const resposta = await fetch(`/api/games?date=${dataAPI}`);
    const dados = await resposta.json();
    const jogosDia = dados.response || [];

    const jogosMonitorizados = jogosDia.filter((jogo) => jogosComAlerta.includes(jogo.fixture.id));

    for (const jogo of jogosMonitorizados) {
      const id = jogo.fixture.id;

      if (!estadoAlertasJogos[id]) {
        estadoAlertasJogos[id] = await criarEstadoInicialAlerta(jogo);
        continue;
      }

      const anterior = estadoAlertasJogos[id];
      const atualStatus = jogo.fixture.status.short || "";
      const atualHomeGoals = Number(jogo.goals.home ?? 0);
      const atualAwayGoals = Number(jogo.goals.away ?? 0);

      if (["NS", "TBD"].includes(anterior.statusShort) && isJogoLive(jogo)) {
        mostrarToast("Jogo começou", `${jogo.teams.home.name} x ${jogo.teams.away.name}`);
      }

      if (anterior.statusShort !== "HT" && atualStatus === "HT") {
        mostrarToast("Intervalo", `${jogo.teams.home.name} ${atualHomeGoals} - ${atualAwayGoals} ${jogo.teams.away.name}`);
      }

      if (!["FT", "AET", "PEN"].includes(anterior.statusShort) && isJogoFinished(jogo)) {
        mostrarToast("Fim do jogo", `${jogo.teams.home.name} ${atualHomeGoals} - ${atualAwayGoals} ${jogo.teams.away.name}`);
      }

      const totalAnterior = Number(anterior.homeGoals) + Number(anterior.awayGoals);
      const totalAtual = atualHomeGoals + atualAwayGoals;

      if (totalAtual > totalAnterior) {
        mostrarToast("Golo", `${jogo.teams.home.name} ${atualHomeGoals} - ${atualAwayGoals} ${jogo.teams.away.name}`);
      }

      const eventos = await obterEventosJogo(id);
      const vermelhosAtuais = contarCartoesVermelhos(eventos);

      if (vermelhosAtuais > Number(anterior.redCards || 0)) {
        mostrarToast("Cartão vermelho", `${jogo.teams.home.name} x ${jogo.teams.away.name}`);
      }

      estadoAlertasJogos[id] = {
        id,
        homeName: jogo.teams.home.name,
        awayName: jogo.teams.away.name,
        homeGoals: atualHomeGoals,
        awayGoals: atualAwayGoals,
        statusShort: atualStatus,
        redCards: vermelhosAtuais
      };
    }

    guardarEstadoAlertasJogos();
  } catch (erro) {
    console.error("Erro ao verificar alertas:", erro);
  }
}
