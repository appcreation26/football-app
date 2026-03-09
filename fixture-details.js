export default async function handler(req, res) {
  const API_KEY = process.env.API_KEY;
  const fixtureId = req.query.id;

  if (!fixtureId) {
    return res.status(400).json({ error: "Falta o id do jogo" });
  }

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures/events?fixture=${fixtureId}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": API_KEY,
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar eventos do jogo" });
  }
}