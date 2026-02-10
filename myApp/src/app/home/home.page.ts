import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonFab,
  IonFabButton,
  IonInput,
  IonModal,
  IonButtons,
  AlertController,
} from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { add, trash, create } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Conversation } from '../models';
import { ConversationsService } from '../services/conversations.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonFab,
    IonFabButton,
    IonInput,
    IonModal,
    IonButtons,
    CommonModule,
    FormsModule,
  ],
})
export class HomePage implements OnInit {
  @ViewChild('newConversationModal') newConversationModal!: IonModal;
  @ViewChild('editModal') editModal!: IonModal;

  conversations: Conversation[] = [];
  newUserName = '';
  editingId: string | null = null;
  editingUserName = '';

  add = add;
  trash = trash;
  create = create;

  constructor(
    private conversationsService: ConversationsService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ add, trash, create });
  }

  ngOnInit() {
    this.loadConversations();
  }

  loadConversations() {
    this.conversationsService.conversations$.subscribe((conversations: Conversation[]) => {
      this.conversations = conversations;
    });
  }

  openNewConversationModal() {
    this.newUserName = '';
    this.newConversationModal.present();
  }

  closeModal() {
    this.newConversationModal.dismiss();
  }

  createConversation() {
    if (this.newUserName.trim()) {
      this.conversationsService.addConversation(this.newUserName);
      this.newUserName = '';
      this.newConversationModal.dismiss();
    }
  }

  deleteConversation(id: string, event: Event) {
    event.stopPropagation();
    this.conversationsService.deleteConversation(id);
  }

  openEditModal(conversation: Conversation, event: Event) {
    event.stopPropagation();
    this.editingId = conversation.id;
    this.editingUserName = conversation.userName;
    this.editModal.present();
  }

  updateConversation() {
    if (this.editingId && this.editingUserName.trim()) {
      this.conversationsService.updateConversation(
        this.editingId,
        this.editingUserName
      );
      this.editingId = null;
      this.editingUserName = '';
      this.editModal.dismiss();
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editingUserName = '';
    this.editModal.dismiss();
  }

  openConversation(id: string) {
    this.router.navigate(['/chat', id]);
  }

  formatTime(date: Date) {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  }
}
