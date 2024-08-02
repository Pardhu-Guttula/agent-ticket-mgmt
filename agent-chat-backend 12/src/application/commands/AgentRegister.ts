export class AgentRegisterCommand {
    constructor(
      public name: string,
      public email: string,
      public password: string,
      public mobile: string,        
      public agentCreatedOn?: Date  
    ) {}
  }
  