/*import { Injectable } from '@angular/core';
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
// datos de prueba, TEMP
  private initializeMockData() {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        userName: 'usuario',
        lastMessage: '',
        lastMessageTime: new Date(Date.now() - 2 * 60000),
        messages: [
          {
            id: 'msg1',
            conversationId: '1',
            userId: 'user1',
            userName: 'usuario',
            content: 'probando',
            timestamp: new Date(Date.now() - 1 * 60000),
          },
          {
            id: 'msg2',
            conversationId: '1',
            userId: 'currentUser',
            userName: 'Tú',
            content: 'a',
            timestamp: new Date(Date.now() - 1 * 60000),
          },
          {
            id: 'msg3',
            conversationId: '1',
            userId: 'user1',
            userName: 'usuario',
            content: 'e',
            timestamp: new Date(Date.now() - 2 * 60000),
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
*/
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  onSnapshot, // Importante para las actualizaciones en tiempo real
} from '@angular/fire/firestore';

// Asegúrate de que esta ruta sea correcta para tus interfaces
import { Message, Conversation } from '../models'; 



// =============================================================
// CONVERTERS PARA FIRESTORE (Definidos fuera de la clase para reusabilidad y limpieza)
// =============================================================

/**
 * FirestoreDataConverter para la interfaz Conversation.
 * Define cómo convertir entre un objeto Conversation de tu aplicación
 * y el formato de datos almacenado en Firestore.
 */
const conversationConverter = {
  /**
   * Convierte un objeto Conversation a un formato compatible con Firestore.
   * Se llama cuando guardas o actualizas una conversación en Firestore.
   * @param conversation El objeto Conversation de tu aplicación.
   * @returns Un objeto DocumentData listo para Firestore.
   */
  toFirestore(conversation: Partial<Conversation>): DocumentData {
    return {
      userName: conversation.userName,
      lastMessage: conversation.lastMessage,
      // Maneja la conversión de Date a Timestamp de Firestore.
      // Si lastMessageTime ya es un Timestamp (por ejemplo, al usar serverTimestamp()),
      // lo mantiene. Si es un Date, lo convierte.
      lastMessageTime: conversation.lastMessageTime instanceof Date
        ? Timestamp.fromDate(conversation.lastMessageTime)
        : serverTimestamp(), // O directamente serverTimestamp() si siempre quieres la hora del servidor.
    };
  },

  /**
   * Convierte un snapshot de Firestore a un objeto Conversation.
   * Se llama cuando lees una conversación desde Firestore.
   * @param snapshot El QueryDocumentSnapshot de Firestore.
   * @param options Opciones de Snapshot.
   * @returns Un objeto Conversation de tu aplicación.
   */
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Conversation {
    const data = snapshot.data(options);
    return {
      id: snapshot.id, // Asigna el ID del documento de Firestore a la propiedad 'id' de tu objeto.
      userName: data['userName'],
      lastMessage: data['lastMessage'],
      // Convierte el Timestamp de Firestore a un objeto Date de JavaScript.
      lastMessageTime: (data['lastMessageTime'] as Timestamp)?.toDate(),
    };
  },
};

/**
 * FirestoreDataConverter para la interfaz Message.
 * Define cómo convertir entre un objeto Message de tu aplicación
 * y el formato de datos almacenado en Firestore.
 */
const messageConverter = {
  /**
   * Convierte un objeto Message a un formato compatible con Firestore.
   * Se llama cuando guardas o actualizas un mensaje en Firestore.
   * @param message El objeto Message de tu aplicación.
   * @returns Un objeto DocumentData listo para Firestore.
   */
  toFirestore(message: Partial<Message>): DocumentData {
    return {
      userId: message.userId,
      userName: message.userName,
      content: message.content,
      // Maneja la conversión de Date a Timestamp de Firestore.
      timestamp: message.timestamp instanceof Date
        ? Timestamp.fromDate(message.timestamp)
        : serverTimestamp(),
    };
  },

  /**
   * Convierte un snapshot de Firestore a un objeto Message.
   * Se llama cuando lees un mensaje desde Firestore.
   * @param snapshot El QueryDocumentSnapshot de Firestore.
   * @param options Opciones de Snapshot.
   * @returns Un objeto Message de tu aplicación.
   */
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Message {
    const data = snapshot.data(options);
    return {
      id: snapshot.id, // Asigna el ID del documento de Firestore.
      // Obtiene el ID de la conversación a partir de la ruta del documento padre.
      // snapshot.ref.parent.parent apunta al documento de la conversación.
      conversationId: snapshot.ref.parent.parent?.id || '', 
      userId: data['userId'],
      userName: data['userName'],
      content: data['content'],
      timestamp: (data['timestamp'] as Timestamp)?.toDate(), // Convierte Timestamp a Date.
    };
  },
};

// =============================================================
// SERVICIO DE CONVERSACIONES
// =============================================================

@Injectable({
  providedIn: 'root',
})
export class ConversationsService {
  
  // BehaviorSubject para mantener la lista de conversaciones en tiempo real.
  // Cualquier componente suscrito a 'conversations$' recibirá las actualizaciones.
  private _conversations = new BehaviorSubject<Conversation[]>([]);
  public conversations$: Observable<Conversation[]> = this._conversations.asObservable();

  constructor(private firestore: Firestore, private ngZone: NgZone) {
    // Al instanciar el servicio, inicia el listener para las conversaciones.
    this.listenForConversations();
    
  }

  /**
   * Configura un listener en tiempo real para la colección 'conversations' en Firestore.
   * Cada vez que los datos cambian en la base de datos, _conversations se actualiza.
   */
  private listenForConversations() {
    // Obtiene una referencia a la colección 'conversations' y aplica nuestro converter.
    const conversationsCollection = collection(this.firestore, 'conversations').withConverter(conversationConverter);

    // Define la consulta: ordenar por la hora del último mensaje para mostrar las más recientes.
    const q = query(conversationsCollection, orderBy('lastMessageTime', 'desc'));

    // onSnapshot establece el listener en tiempo real.
    console.log('Iniciando listener en tiempo real para conversaciones...');
    onSnapshot(q, (snapshot) => {
      const conversations: Conversation[] = snapshot.docs.map(doc => doc.data()) as Conversation[];
      console.log(`Conversaciones actualizadas en tiempo real: ${conversations.length} conversaciones`, conversations);
      this._conversations.next(conversations); // Emite las conversaciones actualizadas a los suscriptores.
    }, (error) => {
      console.error("Error al escuchar conversaciones en tiempo real:", error);
      // Podrías manejar el error de forma más sofisticada, como emitir un estado de error.
    });
  }

  /**
   * Obtiene un Observable de una conversación específica por su ID.
   * Este Observable se actualizará si la conversación en la lista global cambia.
   * @param id El ID de la conversación a buscar.
   * @returns Un Observable que emite la Conversation encontrada o 'undefined'.
   */
  getConversationById(id: string): Observable<Conversation | undefined> {
    return this.conversations$.pipe(
      map(conversations => conversations.find(c => c.id === id))
    );
  }

  /**
   * Obtiene un Observable de los mensajes para una conversación específica, en tiempo real.
   * Los mensajes están en una subcolección 'messages' dentro de cada documento de conversación.
   * @param conversationId El ID de la conversación cuyos mensajes se quieren obtener.
   * @returns Un Observable que emite un array de Messages.
   */
  getMessagesForConversation(conversationId: string): Observable<Message[]> {
    if (!conversationId) {
      return of([]); // Si no hay ID, devuelve un observable vacío.
    }

    // Referencia a la subcolección 'messages' de la conversación, con su converter.
    const messagesCollection = collection(this.firestore, 'conversations', conversationId, 'messages').withConverter(messageConverter);

    // Consulta para los mensajes: ordenados por timestamp ascendente.
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));

    // onSnapshot establece el listener en tiempo real para los mensajes.
    return new Observable<Message[]>(observer => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages: Message[] = snapshot.docs.map(doc => doc.data()) as Message[];
        observer.next(messages); // Emite los mensajes actualizados.
      }, (error) => {
        console.error("Error al escuchar mensajes en tiempo real:", error);
        observer.error(error);
      });
      // La función de retorno se ejecuta cuando el Observable se desuscribe.
      return () => unsubscribe(); // Limpia el listener de Firestore para evitar fugas de memoria.
    });
  }

  /**
   * Añade una nueva conversación a la colección 'conversations' en Firestore.
   * @param userName El nombre de usuario de la nueva conversación.
   * @returns Una Promesa que resuelve con el ID de la nueva conversación.
   */
  async addConversation(userName: string): Promise<string> {
    return this.ngZone.run(async () => {
      try {
        const newConversationData: Partial<Conversation> = {
          userName: userName,
          lastMessage: 'Nueva conversación iniciada', // Mensaje inicial por defecto.
          lastMessageTime: serverTimestamp() as any, // Firestore establecerá el timestamp.
        };

        // addDoc crea un nuevo documento con un ID generado automáticamente.
        const docRef = await addDoc(
          collection(this.firestore, 'conversations').withConverter(conversationConverter),
          newConversationData
        );
        console.log('Nueva conversación creada en la base de datos - ID:', docRef.id, 'Usuario:', userName);
        return docRef.id;
      } catch (error) {
        console.error('Error añadiendo la conversación:', error);
        throw error; // Propaga el error para que el componente lo pueda manejar.
      }
    });
  }

  /**
   * Elimina una conversación de Firestore por su ID.
   * ATENCIÓN: Por diseño de Firestore, esto NO elimina automáticamente las subcolecciones (mensajes).
   * Para una eliminación recursiva, se suele usar una Firebase Cloud Function.
   * @param id El ID de la conversación a eliminar.
   * @returns Una Promesa que resuelve cuando la conversación ha sido eliminada.
   */
  async deleteConversation(id: string): Promise<void> {
    return this.ngZone.run(async () => {
      try {
        await deleteDoc(doc(this.firestore, 'conversations', id));
        console.log('Conversación eliminada de la base de datos - ID:', id);
      } catch (error) {
        console.error('Error eliminando la conversación:', error);
        throw error;
      }
    });
  }

  /**
   * Añade un nuevo mensaje a una conversación específica y actualiza los detalles de la última actividad de la conversación.
   * @param conversationId El ID de la conversación a la que añadir el mensaje.
   * @param content El contenido del mensaje.
   * @param userId El ID del usuario que envía el mensaje.
   * @param userName El nombre del usuario que envía el mensaje.
   * @returns Una Promesa que resuelve cuando el mensaje ha sido añadido y la conversación actualizada.
   */
  async addMessage(conversationId: string, content: string, userId: string, userName: string): Promise<void> {
    return this.ngZone.run(async () => {
      try {
        // 1. Añadir el mensaje a la subcolección 'messages'
        const newMessageData: Partial<Message> = {
          userId: userId,
          userName: userName,
          content: content,
          timestamp: serverTimestamp() as any, // Deja que Firestore establezca el timestamp.
        };
        await addDoc(
          collection(this.firestore, 'conversations', conversationId, 'messages').withConverter(messageConverter),
          newMessageData
        );

        // 2. Actualizar el documento principal de la conversación
        // Esto actualiza 'lastMessage' y 'lastMessageTime', lo que también reordenará la conversación en la UI.
        const conversationRef = doc(this.firestore, 'conversations', conversationId);
        await updateDoc(conversationRef, {
          lastMessage: content,
          lastMessageTime: serverTimestamp(),
        });

        console.log(`Mensaje añadido a la conversación '${conversationId}' y detalles de la conversación actualizados.`);
      } catch (error) {
        console.error('Error añadiendo el mensaje o actualizando la conversación:', error);
        throw error;
      }
    });
  }

  /**
   * Actualiza el nombre de usuario de una conversación existente.
   * @param id El ID de la conversación a actualizar.
   * @param newUserName El nuevo nombre de usuario para la conversación.
   * @returns Una Promesa que resuelve cuando la conversación ha sido actualizada.
   */
  async updateConversation(id: string, newUserName: string): Promise<void> {
    return this.ngZone.run(async () => {
      try {
        const conversationRef = doc(this.firestore, 'conversations', id);
        await updateDoc(conversationRef, { userName: newUserName });
        console.log(`Conversación con ID '${id}' actualizada con el nuevo nombre: '${newUserName}'.`);
      } catch (error) {
        console.error('Error actualizando la conversación:', error);
        throw error;
      }
    });
  }
}


