import mongoose, { Document, Schema } from "mongoose";

export interface IParticipant {
  user?: mongoose.Types.ObjectId | null;
  isGuest: boolean;
  guestName?: string;
  guestRating?: number;
  joinedAt: Date;
  score: number;
  buchholz: number;
}

export interface ITournament extends Document {
  name: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  format: "Swiss" | "Round Robin" | "Knockout";
  formatType: "Classical" | "Rapid" | "Blitz";
  timeControl: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  tournamentType: "Solo" | "Team";
  venueType: "Online" | "Offline";
  totalRounds: number;
  currentRound: number;
  startDate: Date;
  endDate?: Date;
  location: string;
  access: "Public" | "Private";
  participants: IParticipant[];
}

const TournamentSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 1000,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    format: {
      type: String,
      enum: ["Swiss", "Round Robin", "Knockout"],
      default: "Swiss",
    },
    formatType: {
      type: String,
      enum: ["Classical", "Rapid", "Blitz"],
      default: "Blitz",
    },
    timeControl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
    totalRounds: {
      type: Number,
      required: true,
      min: 1,
    },
    currentRound: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
      required: true,
      default: "Online",
    },
    access: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
    tournamentType: {
      type: String,
      enum: ["Solo", "Team"],
      default: "Solo",
    },
    venueType: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", default: null },
        joinedAt: { type: Date, default: Date.now },
        score: { type: Number, default: 0 },
        buchholz: { type: Number, default: 0 },
        isGuest: { type: Boolean, default: false },
        guestName: { type: String, default: null },
        guestRating: { type: Number, default: 1200 },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<ITournament>("Tournament", TournamentSchema);
