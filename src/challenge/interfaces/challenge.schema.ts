import * as mongoose from "mongoose";

export const ChallengeSchema = new mongoose.Schema(
  {
    dateChallenge: { type: Date },
    status: { type: String },
    dateSolicited: { type: Date },
    dateResponce: { type: Date },
    solicit: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    categorie: { type: String },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
    partida: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
  },
  { timestamps: true, collection: "challenges" }
);
