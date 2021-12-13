import { Player } from "src/players/interfaces/player.interface";
import { Document } from "mongoose";

import { ChallengeStatus } from "./challenge-status.enum";

export interface Challenge extends Document {
  dateChallenge: Date;
  status: ChallengeStatus;
  dateSolicited: Date;
  dateResponce: Date;
  solicit: Player;
  categorie: string;
  Players: Array<Player>;
  game: Game;
}

export interface Game extends Document {
  categorie: string;
  players: Array<Player>;
  def: Player;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
