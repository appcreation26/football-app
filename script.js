async function mostrarJogos() {
  const resposta = await fetch("/api/live");
  const dados = await resposta.json();

  const container = document.getElementById("games");
  container.innerHTML = "";

  if (!dados.response || dados.response.length === 0) {
    container.innerHTML = "<p>Sem jogos ao vivo no momento.</p>";
    return;
  }

div.classList.add("game-card");

div.innerHTML = `
  <div class="league">${jogo.league.name}</div>
  <div class="teams">
    ${jogo.teams.home.name} vs ${jogo.teams.away.name}
  </div>
  <div class="score">
    ${jogo.goals.home} - ${jogo.goals.away}
  </div>
  <div class="minute">
    Minuto: ${jogo.fixture.status.elapsed || 0}'
  </div>
`;
}