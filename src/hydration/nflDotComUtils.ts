export const baseUrl = "https://api.nfl.com/experience/v1";

export const getBearerToken = (): string => `Bearer ${process.env.NFL_DOT_COM_AUTH_TOKEN}`;
