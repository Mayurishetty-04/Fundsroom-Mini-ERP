export interface Product {
  id: string;
  productName: string;
  sku: string;
  category: string;
  unitPrice: number | string;
  currentStock: number;
  minimumStockQuantity: number;
  warehouseLocation: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  movementType: "IN" | "OUT";
  reason: string;
  createdById: string;
  createdAt: string;

  product?: {
    id: string;
    productName: string;
    sku: string;
  };

  createdBy?: {
    id: string;
    name: string;
    role: string;
  };
}