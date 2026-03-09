async function mostrarJogos() {
  const container = document.getElementById("games");
  container.innerHTML = "<p>🔄 A procurar jogos...</p>";

  try {
    const resposta = await fetch("/api/live");
    const dados = await resposta.json();

    container.innerHTML = "";

    if (!dados.response || dados.response.length === 0) {
      container.innerHTML = "<p>Sem jogos ao vivo no momento.</p>";
      return;
    }

    const ligas = {};

    dados.response.forEach(jogo => {
      if (!ligas[jogo.league.name]) {
        ligas[jogo.league.name] = [];
      }
      ligas[jogo.league.name].push(jogo);
    });

    for (const liga in ligas) {
      const leagueHeader = document.createElement("div");
      leagueHeader.classList.add("league-header");

      const leagueLogo = ligas[liga][0].league.logo;

      leagueHeader.innerHTML = `
        <img src="${leagueLogo}" class="league-logo">
        <span>${liga}</span>
      `;

      container.appendChild(leagueHeader);

      ligas[liga].forEach(jogo => {
        const div = document.createElement("div");
        div.classList.add("game-card");

        div.innerHTML = `
          <div class="match-row">
            <div class="team team-left">
              <img src="${jogo.teams.home.logo}" class="logo">
              <span>${jogo.teams.home.name}</span>
            </div>

            <div class="score">
              ${jogo.goals.home} - ${jogo.goals.away}
            </div>

            <div class="team team-right">
              <span>${jogo.teams.away.name}</span>
              <img src="${jogo.teams.away.logo}" class="logo">
            </div>
          </div>

          <div class="minute">
            ${jogo.fixture.status.short} • ${jogo.fixture.status.elapsed || 0}'
          </div>
        `;

        container.appendChild(div);
      });
    }
  } catch (erro) {
    container.innerHTML = "<p>Erro ao carregar os jogos.</p>";
    console.error("Erro:", erro);
  }
}
