import { User } from '../users/entities/user.entity';

declare module 'express' {
  interface Request {
    currentUser?: User | null;
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}
