export default async function handler(req, res) {
  const response = await fetch("https://sportapi7.p.rapidapi.com/api/v1/sport/football/events/live", {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "COLOCA_AQUI_A_TUA_API_KEY",
      "X-RapidAPI-Host": "sportapi7.p.rapidapi.com"
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}