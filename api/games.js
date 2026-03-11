export default async function handler(req, res) {
  const API_KEY = process.env.API_KEY;
  const date = req.query.date;

  if (!date) {
    return res.status(400).json({ error: "Falta a data" });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "API_KEY não encontrada nas variáveis da Vercel" });
  }

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${date}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": API_KEY,
        },
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "Resposta inválida da API",
        raw: text
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar jogos por data",
      details: error.message
    });
  }
}
