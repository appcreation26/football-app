let todosOsJogos = [];
let ligaSelecionada = null;
let jogoSelecionadoId = null;

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
      gamesContainer.innerHTML = `<p class="muted">Sem jogos ao vivo neste momento.</p>`;
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
    if (!mapaLigas[jogo.league.name]) {
      mapaLigas[jogo.league.name] = {
        nome: jogo.league.name,
        logo: jogo.league.logo,
        quantidade: 0,
      };
    }
    mapaLigas[jogo.league.name].quantidade += 1;
  });

  const ligas = Object.values(mapaLigas).sort((a, b) =>
    a.nome.localeCompare(b.nome)
  );

  leagueList.innerHTML = "";

  ligas.forEach((liga) => {
    const item = document.createElement("div");
    item.className = "league-item";

    if (ligaSelecionada === liga.nome) {
      item.classList.add("active");
    }

    item.innerHTML = `
      <img src="${liga.logo}" alt="${liga.nome}">
      <span>${liga.nome}</span>
    `;

    item.addEventListener("click", () => {
      ligaSelecionada = liga.nome;
      jogoSelecionadoId = null;
      renderLigas(todosOsJogos);
      renderJogos();
      matchDetails.innerHTML = `<p class="muted">Seleciona um jogo na coluna central.</p>`;
    });

    leagueList.appendChild(item);
  });
}

function renderJogos() {
  const jogosFiltrados = ligaSelecionada
    ? todosOsJogos.filter((jogo) => jogo.league.name === ligaSelecionada)
    : todosOsJogos;

  gamesContainer.innerHTML = "";

  if (jogosFiltrados.length === 0) {
    gamesContainer.innerHTML = `<p class="muted">Sem jogos para esta liga.</p>`;
    return;
  }

  jogosFiltrados.forEach((jogo) => {
    const card = document.createElement("div");
    card.className = "game-card";

    if (jogoSelecionadoId === jogo.fixture.id) {
      card.classList.add("selected");
    }

    const statusCurto = jogo.fixture.status.short || "";
    const minuto = jogo.fixture.status.elapsed || 0;

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
          <div class="score">${jogo.goals.home} - ${jogo.goals.away}</div>
          <div class="minute">${statusCurto} • ${minuto}'</div>
        </div>

        <div class="team team-right">
          <span class="team-name">${jogo.teams.away.name}</span>
          <img src="${jogo.teams.away.logo}" class="logo" alt="${jogo.teams.away.name}">
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      jogoSelecionadoId = jogo.fixture.id;
      renderJogos();
      renderDetalhes(jogo);
    });

    gamesContainer.appendChild(card);
  });
}

function renderDetalhes(jogo) {
  const statusCurto = jogo.fixture.status.short || "";
  const statusLongo = jogo.fixture.status.long || "";
  const minuto = jogo.fixture.status.elapsed || 0;
  const estadio = jogo.fixture.venue?.name || "Sem estádio disponível";
  const cidade = jogo.fixture.venue?.city || "Sem cidade disponível";

  matchDetails.innerHTML = `
    <div class="details-card">
      <div class="details-title">Resumo do jogo</div>

      <div class="details-teams">
        <div class="details-team">
          <img src="${jogo.teams.home.logo}" alt="${jogo.teams.home.name}">
          <div>${jogo.teams.home.name}</div>
        </div>

        <div class="details-score">${jogo.goals.home} - ${jogo.goals.away}</div>

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
      <div class="details-title">Próxima fase</div>
      <div class="details-meta">
        <div>Na próxima etapa vamos mostrar aqui:</div>
        <div>• eventos do jogo</div>
        <div>• golos e cartões</div>
        <div>• estatísticas</div>
        <div>• últimos resultados</div>
      </div>
    </div>
  `;
}
