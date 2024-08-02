export class ChatMessage {
    constructor(
      public message: string,
      public senderType: string,
      public chatStarted: Date
    ) {}
  }
  