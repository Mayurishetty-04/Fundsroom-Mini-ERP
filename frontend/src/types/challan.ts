export interface ChallanItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number | string;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  totalQuantity: number;
  status: "DRAFT" | "CONFIRMED" | "CANCELLED";
  createdById: string;
  createdAt: string;

  customer?: {
    id: string;
    customerName: string;
    businessName?: string;
  };

  items: ChallanItem[];

  createdBy?: {
    id: string;
    name: string;
    role: string;
  };
}