import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { Conversation } from '../models';
import { ConversationsService } from '../services/conversations.service';

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
export class ChatPage implements OnInit {
  @ViewChild(IonContent) ionContent!: IonContent;

  conversation: Conversation | undefined;
  messageText = '';

  arrowBack = arrowBack;
  send = send;

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

  loadConversation(id: string) {
    const conversation = this.conversationsService.getConversationById(id);
    if (conversation) {
      this.conversation = conversation;
      setTimeout(() => this.scrollToBottom(), 100);
    } else {
      this.router.navigate(['/home']);
    }
  }

  sendMessage() {
    if (this.messageText.trim() && this.conversation) {
      this.conversationsService.addMessage(
        this.conversation.id,
        this.messageText
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
