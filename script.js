async function mostrarJogos() {
  const resposta = await fetch("/api/live");
  const dados = await resposta.json();

  const container = document.getElementById("games");
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
  const leagueTitle = document.createElement("h2");
  leagueTitle.textContent = liga;
  leagueTitle.style.marginTop = "30px";
  container.appendChild(leagueTitle);

  ligas[liga].forEach(jogo => {
    const div = document.createElement("div");
    div.classList.add("game-card");

    div.innerHTML = `
      <div class="match-row">
        <div class="team">
          <img src="${jogo.teams.home.logo}" class="logo">
          <span>${jogo.teams.home.name}</span>
        </div>

        <div class="score">
          ${jogo.goals.home} - ${jogo.goals.away}
        </div>

        <div class="team">
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