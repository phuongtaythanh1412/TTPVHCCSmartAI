
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Procedure {
  id: string;
  title: string;
  category: string;
  description: string;
  estimatedDays: number;
  cost: string;
}

export interface DocumentStatus {
  id: string;
  citizenName: string;
  procedureName: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  submittedDate: string;
  updatedDate: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  LANDING = 'LANDING',
  TRACKING = 'TRACKING',
  SUBMIT = 'SUBMIT',
  BOOKING = 'BOOKING',
  LOGIN = 'LOGIN',
  CHAT = 'CHAT',
  REPORT = 'REPORT',
  NOTIFICATIONS = 'NOTIFICATIONS'
}

// For compatibility with components using AppView naming conventions
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PROCEDURES = 'PROCEDURES',
  TRACKING = 'TRACKING',
  CHATBOT = 'CHATBOT',
  APPOINTMENT = 'APPOINTMENT'
}
