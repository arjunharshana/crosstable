import mongoose, { Document, Schema } from "mongoose";

export interface IMatch extends Document {
  tournament: mongoose.Types.ObjectId;
  round: number;
  board: number;
  whitePlayer: mongoose.Types.ObjectId;
  blackPlayer: mongoose.Types.ObjectId;
  result: "1-0" | "0-1" | "1/2-1/2" | "*";
  pgn: string;
}

const MatchSchema: Schema = new Schema(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    round: { type: Number, required: true },
    board: { type: Number, required: true },
    whitePlayer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blackPlayer: { type: Schema.Types.ObjectId, ref: "User", default: null },
    result: {
      type: String,
      enum: ["1-0", "0-1", "1/2-1/2", "*"],
      default: "*",
    },
    pgn: { type: String, trim: true },
  },
  { timestamps: true },
);

MatchSchema.index({ tournament: 1, round: 1, board: 1 });

export default mongoose.model<IMatch>("Match", MatchSchema);
