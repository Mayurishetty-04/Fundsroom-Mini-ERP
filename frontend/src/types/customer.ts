export interface FollowUp {
  id: string;
  note: string;
  followUpDate?: string;
  createdAt: string;

  createdBy?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface Customer {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  businessName: string;
  gstNumber?: string;
  customerType: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
  address: string;
  status: "LEAD" | "ACTIVE" | "INACTIVE";
  followUpDate?: string;
  notes?: string;
  createdAt?: string;

  followUps?: FollowUp[];
}