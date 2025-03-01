import { ProjectMember } from "../models/project";

export class MemberData {
  static getMembers(): ProjectMember[] {
    return [
      { id: 1, name: 'Alice Schmidt', email: 'alice@example.com', password: 'secure123' },
      { id: 2, name: 'Bob Müller', email: 'bob@example.com', password: 'secure123' },
      { id: 3, name: 'Clara Becker', email: 'clara@example.com', password: 'secure123' },
      { id: 4, name: 'David Braun', email: 'david@example.com', password: 'secure123' }
    ];
  }
}