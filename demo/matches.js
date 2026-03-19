export const demoMatches = [
  {
    fixture: {
      id: 1,
      date: "2026-03-20T20:30:00+00:00",
      status: { short: "NS", long: "Not Started", elapsed: null },
      venue: { name: "Estádio do Dragão", city: "Porto" },
      referee: "João Pinheiro"
    },
    league: {
      name: "Primeira Liga",
      country: "Portugal",
      logo: "https://media.api-sports.io/football/leagues/94.png"
    },
    teams: {
      home: { name: "FC Porto", logo: "https://media.api-sports.io/football/teams/212.png" },
      away: { name: "Benfica", logo: "https://media.api-sports.io/football/teams/211.png" }
    },
    goals: { home: null, away: null },
    score: {
      halftime: { home: null, away: null },
      fulltime: { home: null, away: null }
    }
  },

  {
    fixture: {
      id: 2,
      date: "2026-03-20T18:00:00+00:00",
      status: { short: "1H", long: "First Half", elapsed: 32 },
      venue: { name: "Alvalade", city: "Lisboa" },
      referee: "Artur Soares Dias"
    },
    league: {
      name: "Primeira Liga",
      country: "Portugal",
      logo: "https://media.api-sports.io/football/leagues/94.png"
    },
    teams: {
      home: { name: "Sporting CP", logo: "https://media.api-sports.io/football/teams/228.png" },
      away: { name: "Braga", logo: "https://media.api-sports.io/football/teams/217.png" }
    },
    goals: { home: 1, away: 0 },
    score: {
      halftime: { home: 1, away: 0 },
      fulltime: { home: null, away: null }
    }
  },

  {
    fixture: {
      id: 3,
      date: "2026-03-20T15:00:00+00:00",
      status: { short: "FT", long: "Match Finished", elapsed: 90 },
      venue: { name: "Allianz Arena", city: "Munique" },
      referee: "Felix Zwayer"
    },
    league: {
      name: "Bundesliga",
      country: "Germany",
      logo: "https://media.api-sports.io/football/leagues/78.png"
    },
    teams: {
      home: { name: "Bayern", logo: "https://media.api-sports.io/football/teams/157.png" },
      away: { name: "Dortmund", logo: "https://media.api-sports.io/football/teams/165.png" }
    },
    goals: { home: 3, away: 2 },
    score: {
      halftime: { home: 2, away: 1 },
      fulltime: { home: 3, away: 2 }
    }
  }
];
