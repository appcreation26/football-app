let todosOsJogos = [];
let ligaSelecionada = null;
let jogoSelecionadoId = null;
let tabSelecionada = "live";

const TOP_LEAGUES = [
  "Primeira Liga",
  "La Liga",
  "La Liga 2",
  "Premier League",
  "Championship",
  "League One",
  "Ligue 1",
  "Bundesliga",
  "2. Bundesliga",
  "Serie A",
  "Eredivisie",
  "Eerste Divisie",
  "Pro League",
  "Premiership",
  "Süper Lig",
  "1. Lig",
  "Super League",
  "Austrian Bundesliga",
  "Challenge League",
  "Superliga",
  "Allsvenskan",
  "Eliteserien",
  "Czech Liga",
  "Super Liga",
  "Liga I",
  "NB I",
  "First League",
  "PrvaLiga"
];

const gamesContainer = document.getElementById("games");
const leagueList = document.getElementById("leagueList");
const matchDetails = document.getElementById("matchDetails");
const loadBtn = document.getElementById("loadBtn");

loadBtn.addEventListener("click", mostrarJogos);

async function mostrarJogos() {
  gamesContainer.innerHTML = `<p class="muted">🔄 A carregar jogos...</p>`;
  leagueList.innerHTML = `<p class="muted">🔄 A carregar ligas...</p>`;
  matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;

  try {
    const resposta = await fetch("/api/live");
    const dados = await resposta.json();

    if (!dados.response || dados.response.length === 0) {
      todosOsJogos = [];
      gamesContainer.innerHTML = `<p class="muted">Sem jogos neste dia.</p>`;
      leagueList.innerHTML = `<p class="muted">Sem ligas disponíveis.</p>`;
      return;
    }

    todosOsJogos = dados.response;

    renderLigas(todosOsJogos);

    if (!ligaSelecionada && todosOsJogos.length > 0) {
      ligaSelecionada = todosOsJogos[0].league.name;
    }

    renderJogos();
  } catch (erro) {
    console.error("Erro:", erro);
    gamesContainer.innerHTML = `<p class="muted">Erro ao carregar jogos.</p>`;
    leagueList.innerHTML = `<p class="muted">Erro ao carregar ligas.</p>`;
  }
}

function renderLigas(jogos) {
  const mapaLigas = {};

  jogos.forEach((jogo) => {
    const country = jogo.league.country || "Outros";

    if (!mapaLigas[country]) {
      mapaLigas[country] = {
        nome: country,
        flag: jogo.league.flag,
        ligas: {}
      };
    }

    if (!mapaLigas[country].ligas[jogo.league.name]) {
      mapaLigas[country].ligas[jogo.league.name] = {
        nome: jogo.league.name,
        logo: jogo.league.logo
      };
    }
  });

  const paises = Object.values(mapaLigas).sort((a, b) => {
    const aTemTop = Object.values(a.ligas).some((liga) => TOP_LEAGUES.includes(liga.nome));
    const bTemTop = Object.values(b.ligas).some((liga) => TOP_LEAGUES.includes(liga.nome));

    if (aTemTop && !bTemTop) return -1;
    if (!aTemTop && bTemTop) return 1;

    return a.nome.localeCompare(b.nome);
  });

  leagueList.innerHTML = "";

  paises.forEach((pais) => {
    const ligasArray = Object.values(pais.ligas).sort((a, b) => {
      const aTop = TOP_LEAGUES.includes(a.nome);
      const bTop = TOP_LEAGUES.includes(b.nome);

      if (aTop && !bTop) return -1;
      if (!aTop && bTop) return 1;

      return a.nome.localeCompare(b.nome);
    });

    const countryGroup = document.createElement("div");
    countryGroup.className = "country-group";

    const countryHeader = document.createElement("div");
    countryHeader.className = "country-header";

    countryHeader.innerHTML = `
      <div class="country-header-left">
        ${pais.flag ? `<img src="${pais.flag}" class="country-flag" alt="${pais.nome}">` : ""}
        <span class="country-name">${pais.nome}</span>
      </div>
      <span class="country-arrow">▼</span>
    `;

    const countryLeagues = document.createElement("div");
    countryLeagues.className = "country-leagues";

    ligasArray.forEach((liga) => {
      const item = document.createElement("div");
      item.className = "league-item";

      if (ligaSelecionada === liga.nome) {
        item.classList.add("active");
      }

      item.innerHTML = `
        <img src="${liga.logo}" alt="${liga.nome}">
        <span>${liga.nome}</span>
      `;

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        ligaSelecionada = liga.nome;
        jogoSelecionadoId = null;
        renderLigas(todosOsJogos);
        renderJogos();
        matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
      });

      countryLeagues.appendChild(item);
    });

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

function renderJogos() {
  const jogosFiltrados = ligaSelecionada
    ? todosOsJogos.filter((jogo) => jogo.league.name === ligaSelecionada)
    : todosOsJogos;

  gamesContainer.innerHTML = "";
  renderTabs();

  if (jogosFiltrados.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Sem jogos para esta liga.";
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
          <span>${dominio.away}%</span>
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
            ? golos
                .map(
                  (g) =>
                    `<div>${g.time.elapsed}' • ${g.team.name} • ${g.player?.name || "Sem nome"}</div>`
                )
                .join("")
            : "<div>Sem golos registados.</div>"
        }
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Cartões amarelos</div>
      <div class="details-meta">
        ${
          amarelos.length
            ? amarelos
                .map(
                  (c) =>
                    `<div>${c.time.elapsed}' • ${c.team.name} • ${c.player?.name || "Sem nome"}</div>`
                )
                .join("")
            : "<div>Sem amarelos registados.</div>"
        }
      </div>
    </div>

    <div class="details-card">
      <div class="details-title">Cartões vermelhos</div>
      <div class="details-meta">
        ${
          vermelhos.length
            ? vermelhos
                .map(
                  (c) =>
                    `<div>${c.time.elapsed}' • ${c.team.name} • ${c.player?.name || "Sem nome"}</div>`
                )
                .join("")
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

function calcularDominio(
  posseCasa,
  posseFora,
  rematesCasa,
  rematesFora,
  cantosCasa,
  cantosFora
) {
  const pesoPosseCasa = posseCasa * 1;
  const pesoPosseFora = posseFora * 1;

  const pesoRematesCasa = rematesCasa * 8;
  const pesoRematesFora = rematesFora * 8;

  const pesoCantosCasa = cantosCasa * 4;
  const pesoCantosFora = cantosFora * 4;

  const totalCasa = pesoPosseCasa + pesoRematesCasa + pesoCantosCasa;
  const totalFora = pesoPosseFora + pesoRematesFora + pesoCantosFora;
  const total = totalCasa + totalFora;

  if (total === 0) {
    return { home: 50, away: 50 };
  }

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
