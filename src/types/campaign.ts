export interface Campaign {
  id: string;
  title: string;
  code: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  organizerName: string;
  organizerContact: string;
  location: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  contributions?: Contribution[];
}

export interface Contribution {
  id: string;
  amount: number;
  name: string;
  email: string;
  phoneNumber: string;
  message?: string;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pledge {
  id: string;
  campaignId: string;
  amount: number;
  userPhone: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}