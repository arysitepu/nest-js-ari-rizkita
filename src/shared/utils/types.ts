export class RoleDecorator {
  private key: string;
  private role: string;

  constructor(key, role) {
    this.key = key;
    this.role = role;
  }

  getKey() {
    return this.key;
  }

  getRole() {
    return this.role;
  }
}