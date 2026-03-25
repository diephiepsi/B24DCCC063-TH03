export interface HistoryLog {
  admin: string;
  time: string;
  action: 'Approved' | 'Rejected';
  reason?: string;
}

export interface Club {
  id: string;
  avatar: string;
  name: string;
  foundedDate: string;
  description: string; // Nội dung HTML
  leader: string;
  isActive: boolean;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nu';
  address: string;
  strength: string;
  clubId: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  note?: string;
  history?: HistoryLog[];
}