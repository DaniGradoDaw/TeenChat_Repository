import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonInput,
  IonButtons,
  IonFooter,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { arrowBack, send } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Conversation, Message } from '../models';
import { ConversationsService } from '../services/conversations.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonInput,
    IonButtons,
    IonFooter,
    CommonModule,
    FormsModule,
  ],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) ionContent!: IonContent;

  conversation: Conversation | undefined;
  messages: Message[] = [];
  messageText = '';

  arrowBack = arrowBack;
  send = send;

  private messagesSubscription: Subscription | null = null;
  private conversationSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private conversationsService: ConversationsService,
    private router: Router
  ) {
    addIcons({ arrowBack, send });
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      const conversationId = params['id'];
      this.loadConversation(conversationId);
    });
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.conversationSubscription) {
      this.conversationSubscription.unsubscribe();
    }
  }

  loadConversation(id: string) {
    // Subscribe to conversation updates (will update header if name changes)
    if (this.conversationSubscription) {
      this.conversationSubscription.unsubscribe();
    }
    
    this.conversationSubscription = this.conversationsService.getConversationById(id).subscribe(conversation => {
      if (conversation) {
        this.conversation = conversation;
      } else if (!this.conversation) {
        // Only navigate to home on the first load if conversation doesn't exist
        this.router.navigate(['/home']);
      }
    });
    
    // Subscribe to messages for this conversation (stay subscribed for real-time updates)
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    
    this.messagesSubscription = this.conversationsService.getMessagesForConversation(id).subscribe(messages => {
      this.messages = messages;
      console.log('Mensajes cargados en tiempo real:', messages);
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  sendMessage() {
    if (this.messageText.trim() && this.conversation) {
      this.conversationsService.addMessage(
        this.conversation.id,
        this.messageText,
        'currentUser',
        'Tú'
      );
      this.messageText = '';
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  scrollToBottom() {
    if (this.ionContent) {
      this.ionContent.scrollToBottom(300);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  formatTime(date: Date) {
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}
