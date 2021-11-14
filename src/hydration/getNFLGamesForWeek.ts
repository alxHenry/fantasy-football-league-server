import axios from "axios";
import { getCurrentNFLSeason } from "./getCurrentNFLSeason";
import { baseUrl, getBearerToken } from "./nflDotComUtils";

export type GameStatus = "FINAL" | "SCHEDULED" | "IN_PROGRESS";
export type NFLDotComPhase = "FINAL";

export interface NFLGame {
  nflId: string;
  awayAbbrev: string;
  awayScore: number | null;
  homeAbbrev: string;
  homeScore: number | null;
  gameClock: string | null;
  period: string | null;
  status: GameStatus;
  time: string; // ex: "2021-11-12T01:20:00Z"
}

interface NFLDotComGameResponse {
  id: string;
  homeTeam: {
    abbreviation: string;
  };
  awayTeam: {
    abbreviation: string;
  };
  time: string; // ex: "2021-11-12T01:20:00Z"
  detail?: {
    // Only included for started or ended games
    gameClock: string;
    homePointsTotal: number;
    period: string | null; // Not sure about this for live game
    phase: NFLDotComPhase;
    visitorPointsTotal: number;
  };
}

const transformNFLDotComGameResponse = (game: NFLDotComGameResponse): NFLGame => {
  return {
    nflId: game.id,
    awayAbbrev: game.awayTeam.abbreviation,
    awayScore: game.detail?.visitorPointsTotal ?? null,
    homeAbbrev: game.homeTeam.abbreviation,
    homeScore: game.detail?.homePointsTotal ?? null,
    gameClock: game.detail?.gameClock ?? null,
    period: game.detail?.period ?? null,
    status: game.detail?.phase ?? "SCHEDULED",
    time: game.time,
  };
};

interface NFLDotComGamesResponse {
  games: NFLDotComGameResponse[];
}

export const getNFLGamesForWeek = async (week: number): Promise<NFLGame[]> => {
  try {
    const url = `${baseUrl}/games?season=${getCurrentNFLSeason()}&seasonType=REG&week=${week}`;
    const response = await axios.get<NFLDotComGamesResponse>(url, { headers: { authorization: getBearerToken() } });
    console.log(response.data);

    const games = response.data.games;
    return games.map(transformNFLDotComGameResponse);
  } catch (err) {
    console.error(`Failed to get nfl games for week ${week}`, err);
    return [];
  }
};
