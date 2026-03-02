async function mostrarJogos() {
  const resposta = await fetch("/api/live");
  const dados = await resposta.json();

  const container = document.getElementById("games");
  container.innerHTML = "";

  if (!dados.response || dados.response.length === 0) {
    container.innerHTML = "<p>Sem jogos ao vivo no momento.</p>";
    return;
  }

  dados.response.forEach(jogo => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${jogo.league.name}</h3>
      <p>${jogo.teams.home.name} vs ${jogo.teams.away.name}</p>
      <p><strong>${jogo.goals.home} - ${jogo.goals.away}</strong></p>
      <p>Minuto: ${jogo.fixture.status.elapsed || 0}'</p>
      <hr>
    `;

    container.appendChild(div);
  });
}