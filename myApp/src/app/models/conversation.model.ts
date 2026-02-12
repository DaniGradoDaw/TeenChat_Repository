export interface Message {
  id: string;
  conversationId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: Date;
  //messages: Message[];
}
