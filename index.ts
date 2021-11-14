import * as dotenv from "dotenv";
import { getCurrentNFLWeek } from "./src/hydration/getCurrentNFLWeek";
import { getNFLGamesForWeek } from "./src/hydration/getNFLGamesForWeek";
dotenv.config();

getNFLGamesForWeek(getCurrentNFLWeek()).then((games) => {
  console.log(games);
});
