export interface Message {
  sender_id: string;
  receiver_id: string;
  message: string;
  timestamp?: string;
}

export interface User {
  id: string;
  name: string;
  group_id: string;
}
