import mongoose from "mongoose";
import { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  type:
    | "TOURNAMENT_CREATED"
    | "ROUND_STARTED"
    | "TOURNAMENT_COMPLETED"
    | "PLAYER_JOINED";
  tournament?: mongoose.Types.ObjectId;
  message: string;
}

const ActivitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "7d",
    },
  },
  { timestamps: true },
);

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: "ROLE_UPDATE" | "TOURNAMENT_UPDATE" | "SYSTEM";
  message: string;
  isRead: boolean;
  relatedTournament?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedTournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
    createdAt: { type: Date, default: Date.now, expires: "3d" },
  },
  { timestamps: true },
);

export const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema,
);
