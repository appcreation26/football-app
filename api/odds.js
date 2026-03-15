export default async function handler(req, res) {
  const idsParam = req.query.ids || "";

  if (!idsParam) {
    return res.status(400).json({ error: "Faltam ids dos jogos" });
  }

  const fixtureIds = idsParam
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !Number.isNaN(id));

  const odds = {};

  fixtureIds.forEach((fixtureId) => {
    const base = (fixtureId % 17) + 1;

    const home = (1.35 + ((base * 7) % 80) / 100).toFixed(2);
    const draw = (2.80 + ((base * 5) % 90) / 100).toFixed(2);
    const away = (1.55 + ((base * 9) % 110) / 100).toFixed(2);

    odds[fixtureId] = {
      home,
      draw,
      away
    };
  });

  return res.status(200).json({ response: odds });
}
