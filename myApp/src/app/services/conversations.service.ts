import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message, Conversation } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ConversationsService {
  private conversations = new BehaviorSubject<Conversation[]>([]);
  conversations$ = this.conversations.asObservable();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        userName: 'usuario',
        lastMessage: '',
        lastMessageTime: new Date(Date.now() - 5 * 60000),
        messages: [
          {
            id: 'msg1',
            conversationId: '1',
            userId: 'user1',
            userName: 'usuario',
            content: 'probando',
            timestamp: new Date(Date.now() - 15 * 60000),
          },
          {
            id: 'msg2',
            conversationId: '1',
            userId: 'currentUser',
            userName: 'Tú',
            content: 'a',
            timestamp: new Date(Date.now() - 12 * 60000),
          },
          {
            id: 'msg3',
            conversationId: '1',
            userId: 'user1',
            userName: 'usuario',
            content: 'e',
            timestamp: new Date(Date.now() - 8 * 60000),
          }
        ],
      }
    ];

    this.conversations.next(mockConversations);
  }

  getConversations() {
    return this.conversations.getValue();
  }

  getConversationById(id: string) {
    return this.conversations.getValue().find((c: Conversation) => c.id === id);
  }

  private getLastMessageFromMessages(messages: Message[]): { text: string; time: Date } {
    if (messages.length === 0) {
      return {
        text: '0 Mensajes',
        time: new Date(),
      };
    }
    const lastMsg = messages[messages.length - 1];
    return {
      text: lastMsg.content,
      time: lastMsg.timestamp,
    };
  }

  addConversation(userName: string) {
    const lastMessageData = this.getLastMessageFromMessages([]);
    const newConversation: Conversation = {
      id: Date.now().toString(),
      userName,
      lastMessage: lastMessageData.text,
      lastMessageTime: lastMessageData.time,
      messages: [],
    };

    const current = this.conversations.getValue();
    this.conversations.next([...current, newConversation]);
    return newConversation;
  }

  deleteConversation(id: string) {
    const current = this.conversations.getValue();
    this.conversations.next(current.filter((c: Conversation) => c.id !== id));
  }

  addMessage(conversationId: string, content: string) {
    const conversations = this.conversations.getValue();
    const conversation = conversations.find((c: Conversation) => c.id === conversationId);

    if (conversation) {
      const newMessage: Message = {
        id: Date.now().toString(),
        conversationId,
        userId: 'currentUser',
        userName: 'Tú',
        content,
        timestamp: new Date(),
      };

      conversation.messages.push(newMessage);
      conversation.lastMessage = content;
      conversation.lastMessageTime = new Date();

      this.conversations.next([...conversations]);
    }
  }

  updateConversation(id: string, userName: string) {
    const conversations = this.conversations.getValue();
    const conversation = conversations.find((c: Conversation) => c.id === id);

    if (conversation) {
      conversation.userName = userName;
      this.conversations.next([...conversations]);
    }
  }
}
