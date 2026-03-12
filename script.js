let dataSelecionada = new Date();
let todosOsJogos = [];
let ligaSelecionada = "Primeira Liga";
let jogoSelecionadoId = null;
let tabSelecionada = "live";

const MENU_LIGAS = {
  Portugal: ["Primeira Liga", "Liga Portugal 2"],
  Spain: ["La Liga", "La Liga 2"],
  England: ["Premier League", "Championship", "League One"],
  France: ["Ligue 1"],
  Germany: ["Bundesliga", "2. Bundesliga"],
  Italy: ["Serie A"],
  Netherlands: ["Eredivisie", "Eerste Divisie"],
  Belgium: ["Pro League"],
  Scotland: ["Premiership"],
  Turkey: ["Süper Lig", "1. Lig"],
  Greece: ["Super League"],
  Austria: ["Austrian Bundesliga", "2. Liga"],
  Switzerland: ["Super League"],
  Denmark: ["Superliga"],
  Sweden: ["Allsvenskan"],
  Norway: ["Eliteserien"],
  "Czech-Republic": ["Czech Liga"],
  Serbia: ["Super Liga"],
  Romania: ["Liga I"],
  Hungary: ["NB I"],
  Bulgaria: ["First League"],
  Slovakia: ["Super Liga"],
  Slovenia: ["PrvaLiga"]
};

const COUNTRY_FLAGS = {
  Portugal: "https://media.api-sports.io/flags/pt.svg",
  Spain: "https://media.api-sports.io/flags/es.svg",
  England: "https://media.api-sports.io/flags/gb.svg",
  France: "https://media.api-sports.io/flags/fr.svg",
  Germany: "https://media.api-sports.io/flags/de.svg",
  Italy: "https://media.api-sports.io/flags/it.svg",
  Netherlands: "https://media.api-sports.io/flags/nl.svg",
  Belgium: "https://media.api-sports.io/flags/be.svg",
  Scotland: "https://media.api-sports.io/flags/gb.svg",
  Turkey: "https://media.api-sports.io/flags/tr.svg",
  Greece: "https://media.api-sports.io/flags/gr.svg",
  Austria: "https://media.api-sports.io/flags/at.svg",
  Switzerland: "https://media.api-sports.io/flags/ch.svg",
  Denmark: "https://media.api-sports.io/flags/dk.svg",
  Sweden: "https://media.api-sports.io/flags/se.svg",
  Norway: "https://media.api-sports.io/flags/no.svg",
  "Czech-Republic": "https://media.api-sports.io/flags/cz.svg",
  Serbia: "https://media.api-sports.io/flags/rs.svg",
  Romania: "https://media.api-sports.io/flags/ro.svg",
  Hungary: "https://media.api-sports.io/flags/hu.svg",
  Bulgaria: "https://media.api-sports.io/flags/bg.svg",
  Slovakia: "https://media.api-sports.io/flags/sk.svg",
  Slovenia: "https://media.api-sports.io/flags/si.svg"
};

const gamesContainer = document.getElementById("games");
const leagueList = document.getElementById("leagueList");
const matchDetails = document.getElementById("matchDetails");
const loadBtn = document.getElementById("loadBtn");
const currentDateLabel = document.getElementById("currentDateLabel");

loadBtn.addEventListener("click", mostrarJogos);

renderSidebar();
atualizarLabelData();
mostrarJogos();

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
  atualizarLabelData();
  mostrarJogos();
}

function diaSeguinte() {
  dataSelecionada.setDate(dataSelecionada.getDate() + 1);
  atualizarLabelData();
  mostrarJogos();
}

function irHoje() {
  dataSelecionada = new Date();
  atualizarLabelData();
  mostrarJogos();
}

function getFavoritas() {
  const guardadas = localStorage.getItem("ligasFavoritas");
  return guardadas ? JSON.parse(guardadas) : [];
}

function guardarFavoritas(lista) {
  localStorage.setItem("ligasFavoritas", JSON.stringify(lista));
}

function toggleFavorita(nomeLiga) {
  let favoritas = getFavoritas();

  if (favoritas.includes(nomeLiga)) {
    favoritas = favoritas.filter((l) => l !== nomeLiga);
  } else {
    favoritas.push(nomeLiga);
  }

  guardarFavoritas(favoritas);
  renderSidebar();
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
      renderJogos();
      return;
    }

    todosOsJogos = dados.response;

    const jogosDaLiga = todosOsJogos.filter(
      (jogo) => jogo.league.name === ligaSelecionada
    );

    const haLive = jogosDaLiga.some((jogo) =>
      ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(jogo.fixture.status.short)
    );

    const haUpcoming = jogosDaLiga.some((jogo) =>
      ["NS", "TBD"].includes(jogo.fixture.status.short)
    );

    const haFinished = jogosDaLiga.some((jogo) =>
      ["FT", "AET", "PEN"].includes(jogo.fixture.status.short)
    );

    if (haLive) {
      tabSelecionada = "live";
    } else if (haUpcoming) {
      tabSelecionada = "upcoming";
    } else if (haFinished) {
      tabSelecionada = "finished";
    }

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

    favoritas.forEach((liga) => {
      const item = criarLeagueItem(liga);
      favLeagues.appendChild(item);
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

  Object.entries(MENU_LIGAS).forEach(([pais, ligas]) => {
    const countryGroup = document.createElement("div");
    countryGroup.className = "country-group";

    const countryHeader = document.createElement("div");
    countryHeader.className = "country-header";
    countryHeader.innerHTML = `
      <div class="country-header-left">
        <img src="${COUNTRY_FLAGS[pais] || ""}" class="country-flag" alt="${pais}">
        <span class="country-name">${pais}</span>
      </div>
      <span class="country-arrow">▶</span>
    `;

    const countryLeagues = document.createElement("div");
    countryLeagues.className = "country-leagues";
    countryLeagues.style.display = "none";

    let paisTemLigaSelecionada = false;

    ligas.forEach((liga) => {
      const item = criarLeagueItem(liga);

      if (ligaSelecionada === liga) {
        paisTemLigaSelecionada = true;
      }

      countryLeagues.appendChild(item);
    });

    if (paisTemLigaSelecionada) {
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

function criarLeagueItem(liga) {
  const favoritas = getFavoritas();
  const item = document.createElement("div");
  item.className = "league-item";

  if (ligaSelecionada === liga) {
    item.classList.add("active");
  }

  const estrela = favoritas.includes(liga) ? "★" : "☆";

  item.innerHTML = `
    <div class="league-item-content">
      <span>${liga}</span>
    </div>
    <button class="favorite-btn" type="button">${estrela}</button>
  `;

  item.addEventListener("click", () => {
    ligaSelecionada = liga;
    jogoSelecionadoId = null;
    renderSidebar();
    renderJogos();
    matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
  });

  item.querySelector(".favorite-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorita(liga);
  });

  return item;
}

function renderJogos() {
  const jogosFiltrados = todosOsJogos.filter(
    (jogo) => jogo.league.name === ligaSelecionada
  );

  gamesContainer.innerHTML = "";
  renderTabs();

  if (jogosFiltrados.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Sem jogos para esta liga nesta data.";
    gamesContainer.appendChild(empty);
    return;
  }

  const jogosLive = jogosFiltrados.filter((jogo) =>
    ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(jogo.fixture.status.short)
  );

  const jogosPorComecar = jogosFiltrados.filter((jogo) =>
    ["NS", "TBD"].includes(jogo.fixture.status.short)
  );

  const jogosTerminados = jogosFiltrados.filter((jogo) =>
    ["FT", "AET", "PEN"].includes(jogo.fixture.status.short)
  );

  let jogosParaMostrar = [];

  if (tabSelecionada === "live") {
    jogosParaMostrar = jogosLive;
  } else if (tabSelecionada === "finished") {
    jogosParaMostrar = jogosTerminados;
  } else if (tabSelecionada === "upcoming") {
    jogosParaMostrar = jogosPorComecar;
  }

  if (jogosParaMostrar.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Sem jogos nesta categoria.";
    gamesContainer.appendChild(empty);
    return;
  }

  jogosParaMostrar.forEach((jogo) => {
    const card = document.createElement("div");
    card.className = "game-card";

    if (jogoSelecionadoId === jogo.fixture.id) {
      card.classList.add("selected");
    }

    const statusCurto = jogo.fixture.status.short || "";
    const minuto = jogo.fixture.status.elapsed || 0;

    let infoCentro = "";
    if (["NS", "TBD"].includes(statusCurto)) {
      infoCentro = formatarHora(jogo.fixture.date);
    } else if (["FT", "AET", "PEN"].includes(statusCurto)) {
      infoCentro = statusCurto;
    } else {
      infoCentro = `${statusCurto} • ${minuto}'`;
    }

    card.innerHTML = `
      <div class="game-top">
        <div class="game-league">
          <img src="${jogo.league.logo}" alt="${jogo.league.name}">
          <span>${jogo.league.name}</span>
        </div>
        <div class="live-badge">${statusCurto}</div>
      </div>

      <div class="match-row">
        <div class="team team-left">
          <img src="${jogo.teams.home.logo}" class="logo" alt="${jogo.teams.home.name}">
          <span class="team-name">${jogo.teams.home.name}</span>
        </div>

        <div class="score-box">
          <div class="score">${jogo.goals.home ?? 0} - ${jogo.goals.away ?? 0}</div>
          <div class="minute">${infoCentro}</div>
        </div>

        <div class="team team-right">
          <span class="team-name">${jogo.teams.away.name}</span>
          <img src="${jogo.teams.away.logo}" class="logo" alt="${jogo.teams.away.name}">
        </div>
      </div>
    `;

    card.addEventListener("click", async () => {
      jogoSelecionadoId = jogo.fixture.id;
      renderJogos();
      await renderDetalhes(jogo);
    });

    gamesContainer.appendChild(card);
  });
}

function renderTabs() {
  const tabs = document.createElement("div");
  tabs.className = "games-tabs";

  tabs.innerHTML = `
    <button class="games-tab ${tabSelecionada === "live" ? "active" : ""}" data-tab="live">Direto</button>
    <button class="games-tab ${tabSelecionada === "finished" ? "active" : ""}" data-tab="finished">Terminado</button>
    <button class="games-tab ${tabSelecionada === "upcoming" ? "active" : ""}" data-tab="upcoming">Em Breve</button>
  `;

  tabs.querySelectorAll(".games-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      tabSelecionada = btn.dataset.tab;
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
  const amarelos = eventos.filter(
    (evento) => evento.type === "Card" && evento.detail === "Yellow Card"
  );
  const vermelhos = eventos.filter(
    (evento) =>
      evento.type === "Card" &&
      (evento.detail === "Red Card" || evento.detail === "Second Yellow card")
  );

  const homeStats = estatisticas.find(
    (item) => item.team && item.team.id === jogo.teams.home.id
  );
  const awayStats = estatisticas.find(
    (item) => item.team && item.team.id === jogo.teams.away.id
  );

  const posseCasa = getStatValue(homeStats, "Ball Possession");
  const posseFora = getStatValue(awayStats, "Ball Possession");
  const rematesBalizaCasa = getStatValue(homeStats, "Shots on Goal");
  const rematesBalizaFora = getStatValue(awayStats, "Shots on Goal");
  const cantosCasa = getStatValue(homeStats, "Corner Kicks");
  const cantosFora = getStatValue(awayStats, "Corner Kicks");
  const faltasCasa = getStatValue(homeStats, "Fouls");
  const faltasFora = getStatValue(awayStats, "Fouls");

  const dominio = calcularDominio(
    posseCasa,
    posseFora,
    rematesBalizaCasa,
    rematesBalizaFora,
    cantosCasa,
    cantosFora
  );

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
          <span>${dominio.away}%}</span>
        </div>
        <div class="muted small-note">
          Estimado com base em posse, remates à baliza e cantos.
        </div>
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
        ${
          golos.length
            ? golos.map(g => `<div>${g.time.elapsed}' • ${g.team.name} • ${g.player?.name || "Sem nome"}</div>`).join("")
            : "<div>Sem golos registados.</div>"
        }
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Cartões amarelos</div>
      <div class="details-meta">
        ${
          amarelos.length
            ? amarelos.map(c => `<div>${c.time.elapsed}' • ${c.team.name} • ${c.player?.name || "Sem nome"}</div>`).join("")
            : "<div>Sem amarelos registados.</div>"
        }
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Cartões vermelhos</div>
      <div class="details-meta">
        ${
          vermelhos.length
            ? vermelhos.map(c => `<div>${c.time.elapsed}' • ${c.team.name} • ${c.player?.name || "Sem nome"}</div>`).join("")
            : "<div>Sem vermelhos registados.</div>"
        }
      </div>
    </div>
  `;
}

function getStatValue(teamStats, statName) {
  if (!teamStats || !teamStats.statistics) return 0;
  const stat = teamStats.statistics.find((s) => s.type === statName);
  if (!stat || stat.value === null || stat.value === undefined) return 0;
  if (typeof stat.value === "string" && stat.value.includes("%")) {
    return parseInt(stat.value.replace("%", ""), 10) || 0;
  }
  return Number(stat.value) || 0;
}

function calcularDominio(posseCasa, posseFora, rematesCasa, rematesFora, cantosCasa, cantosFora) {
  const totalCasa = (posseCasa * 1) + (rematesCasa * 8) + (cantosCasa * 4);
  const totalFora = (posseFora * 1) + (rematesFora * 8) + (cantosFora * 4);
  const total = totalCasa + totalFora;
  if (total === 0) return { home: 50, away: 50 };
  return {
    home: Math.round((totalCasa / total) * 100),
    away: Math.round((totalFora / total) * 100),
  };
}

function renderStatRow(label, homeValue, awayValue) {
  return `
    <div class="stat-row">
      <div class="stat-home">${homeValue}</div>
      <div class="stat-label">${label}</div>
      <div class="stat-away">${awayValue}</div>
    </div>
  `;
}
