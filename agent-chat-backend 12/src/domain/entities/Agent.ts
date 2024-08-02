export class Agent {
  public id?: number;
  public name: string;
  public email: string;
  public password: string;
  public mobile: string;
  public createdOn?: Date;

  constructor(id: number | undefined, name: string, email: string, password: string, mobile: string, createdOn?: Date) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.mobile = mobile;
    this.createdOn = createdOn;
  }
}
