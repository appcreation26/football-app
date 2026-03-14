export default async function handler(req, res) {
  const API_KEY = process.env.API_KEY;

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  const dataFormatada = `${ano}-${mes}-${dia}`;

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${dataFormatada}`,
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
    res.status(500).json({ error: "Erro ao buscar jogos do dia" });
  }
}
