import { User } from './user';
import { Message } from './message';
export interface Conversation {
  id?: string,
  name?: string,
  type?: ConversationType,
  lastMessage?: string,
  lastActivityTime?: Date,
  participants?: string[],
  messages?: Message[],
  receiverId?: string,
  avatarUrl?: string
}

export enum ConversationType {
  PRIVATE = "private",
  GROUP = "group"
}

