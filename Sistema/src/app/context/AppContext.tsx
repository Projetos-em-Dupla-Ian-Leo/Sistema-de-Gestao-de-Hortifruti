import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// ========== TIPOS ==========
export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  validity?: string;
  icon: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notificationPreference?: "email" | "whatsapp";
  notificationContact?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  scheduledDate?: string;
  items: OrderItem[];
  totalValue: number;
  paymentStatus: "pending" | "paid" | "overdue";
  paymentDueDate: string;
  paymentMethod: string;
  clientObservation?: string;
  internalObservation?: string;
  sellerId?: string;
  sellerName?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  productType: string;
  cnpj?: string;
  contactPerson?: string;
  notes?: string;
  createdAt: string;
  certified?: boolean;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  totalValue: number;
  paymentStatus: "pending" | "paid" | "overdue";
  paymentDueDate: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
}

export type UserRole =
  | "admin"
  | "seller"
  | "stock"
  | "financial";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: "active" | "inactive";
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  createdBy?: string;
}

export interface Notification {
  id: string;
  type:
    | "order_created"
    | "order_paid"
    | "purchase_created"
    | "purchase_paid"
    | "low_stock"
    | "expiring_product"
    | "overdue_payment";  // 👈 ADICIONE ESTA LINHA
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  referenceId?: string;
}

export interface UserSettings {
  userId: string;
  primaryColor?: string;
  sidebarColor?: string;
  fontSize?: "small" | "medium" | "large" | "xlarge";
  reducedMotion?: boolean;
  highContrast?: boolean;
  daltonism?:
    | "none"
    | "protanopia"
    | "deuteranopia"
    | "tritanopia";
  language?: "pt-BR" | "en";
}

interface AppContextType {
  products: Product[];
  clients: Client[];
  orders: Order[];
  suppliers: Supplier[];
  purchases: Purchase[];
  users: User[];
  notifications: Notification[];
  userSettings: UserSettings[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (
    id: string,
    updates: Partial<Product>,
  ) => void;
  deleteProduct: (id: string) => void;
  getLowStockProducts: () => Product[];
  getExpiringProducts: () => Product[];
  addClient: (client: Omit<Client, "id" | "createdAt">) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addOrder: (order: Omit<Order, "id" | "createdAt">) => void;
  updateOrderPaymentStatus: (
    orderId: string,
    status: Order["paymentStatus"],
  ) => void;
  addSupplier: (
    supplier: Omit<Supplier, "id" | "createdAt">,
  ) => void;
  updateSupplier: (
    id: string,
    updates: Partial<Supplier>,
  ) => void;
  deleteSupplier: (id: string) => void;
  addPurchase: (
    purchase: Omit<Purchase, "id" | "createdAt">,
  ) => void;
  updatePurchasePaymentStatus: (
    purchaseId: string,
    status: Purchase["paymentStatus"],
  ) => void;
  deletePurchase: (id: string) => void;
  getSupplierPurchases: (supplierId: string) => Purchase[];
  getTotalSpentBySupplier: (supplierId: string) => number;
  adjustStock: (
    productId: string,
    quantityChange: number,
  ) => void;
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getCurrentUser: () => User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  addNotification: (
    notification: Omit<
      Notification,
      "id" | "read" | "createdAt"
    >,
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
  getUserSettings: (userId: string) => UserSettings | undefined;
  updateUserSettings: (
    userId: string,
    settings: Partial<UserSettings>,
  ) => void;
  exportBackup: () => string;
  importBackup: (data: string) => boolean;
  validateProfitMargin: (cost: number, price: number) => {  // 👈 ADICIONE ESTE BLOCO
    isValid: boolean;
    suggestedPrice: number;
    margin: number;
    message: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(
  undefined,
);

// ========== DADOS INICIAIS ==========
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Alface Crespa Orgânica",
    category: "Hortaliças",
    unit: "Un",
    price: 4.5,
    cost: 2.5,
    stock: 5,
    minStock: 10,
    validity: "2026-06-12",
    icon: "🥬",
  },
  {
    id: "2",
    name: "Tomate Orgânico",
    category: "Hortaliças",
    unit: "Kg",
    price: 8.0,
    cost: 5.0,
    stock: 40,
    minStock: 15,
    validity: "2026-05-12",
    icon: "🍅",
  },
  {
    id: "3",
    name: "Banana Prata Orgânica",
    category: "Frutas",
    unit: "Kg",
    price: 6.5,
    cost: 4.0,
    stock: 50,
    minStock: 20,
    validity: "2026-06-02",
    icon: "🍌",
  },
  {
    id: "4",
    name: "Quinoa Orgânica",
    category: "Grãos",
    unit: "500g",
    price: 12.0,
    cost: 8.0,
    stock: 15,
    minStock: 5,
    validity: "2026-08-01",
    icon: "🌾",
  },
  {
    id: "5",
    name: "Caixa de Papelão",
    category: "Embalagens",
    unit: "Un",
    price: 2.5,
    cost: 2.0,
    stock: 100,
    minStock: 30,
    icon: "📦",
  },
  {
    id: "6",
    name: "Brócolis Orgânico",
    category: "Hortaliças",
    unit: "Un",
    price: 6.0,
    cost: 3.5,
    stock: 8,
    minStock: 10,
    validity: "2026-06-02",
    icon: "🥦",
  },
  {
    id: "7",
    name: "Morango Orgânico",
    category: "Frutas",
    unit: "Bandeja",
    price: 15.0,
    cost: 10.0,
    stock: 12,
    minStock: 8,
    validity: "2026-07-10",
    icon: "🍓",
  },
  {
    id: "8",
    name: "Cenoura Orgânica",
    category: "Legumes",
    unit: "Kg",
    price: 5.5,
    cost: 3.0,
    stock: 30,
    minStock: 15,
    validity: "2026-07-10",
    icon: "🥕",
  },
  {
    id: "9",
    name: "Repolho Orgânico",
    category: "Hortaliças",
    unit: "Un",
    price: 7.0,
    cost: 4.5,
    stock: 20,
    minStock: 10,
    validity: "2026-06-15",
    icon: "🥬",
  },
  {
    id: "10",
    name: "Laranja Orgânica",
    category: "Frutas",
    unit: "Kg",
    price: 9.0,
    cost: 6.0,
    stock: 35,
    minStock: 15,
    validity: "2026-06-20",
    icon: "🍊",
  },
  {
    id: "11",
    name: "Abacate Orgânico",
    category: "Frutas",
    unit: "Un",
    price: 12.0,
    cost: 8.0,
    stock: 20,
    minStock: 10,
    validity: "2026-06-30",
    icon: "🥑",
  },
  {
    id: "12",
    name: "Mel Orgânico",
    category: "Outros",
    unit: "500g",
    price: 25.0,
    cost: 18.0,
    stock: 10,
    minStock: 5,
    validity: "2026-06-15",
    icon: "🍯",
  },
];

const initialClients: Client[] = [
  {
    id: "c1",
    name: "Maria Santos",
    phone: "(11) 98765-4321",
    email: "maria@email.com",
    address: "Rua das Flores, 123 - São Paulo, SP",
    notificationPreference: "whatsapp",
    notificationContact: "11987654321",
    createdAt: "2025-01-10",
  },
  {
    id: "c2",
    name: "João Oliveira",
    phone: "(11) 91234-5678",
    email: "joao@email.com",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    notificationPreference: "email",
    notificationContact: "joao@email.com",
    createdAt: "2025-02-15",
  },
  {
    id: "c3",
    name: "Ana Costa",
    phone: "(11) 94567-8901",
    email: "ana@email.com",
    address: "Rua Augusta, 500 - São Paulo, SP",
    notificationPreference: "whatsapp",
    notificationContact: "11945678901",
    createdAt: "2025-03-20",
  },
  {
    id: "c4",
    name: "Carlos Silva",
    phone: "(11) 99876-5432",
    email: "carlos@email.com",
    address: "Rua da Consolação, 200 - São Paulo, SP",
    notificationPreference: "email",
    notificationContact: "carlos@email.com",
    createdAt: "2025-04-05",
  },
  {
    id: "c5",
    name: "Patrícia Lima",
    phone: "(11) 97777-8888",
    email: "patricia@email.com",
    address: "Alameda Jau, 500 - São Paulo, SP",
    notificationPreference: "whatsapp",
    notificationContact: "11977778888",
    createdAt: "2025-05-10",
  },
  {
    id: "c6",
    name: "Ricardo Alves",
    phone: "(11) 96666-5555",
    email: "ricardo@email.com",
    address: "Rua da Paz, 100 - São Paulo, SP",
    notificationPreference: "email",
    notificationContact: "ricardo@email.com",
    createdAt: "2025-06-01",
  },
  {
    id: "c7",
    name: "Fernanda Souza",
    phone: "(11) 95555-4444",
    email: "fernanda@email.com",
    address: "Rua dos Pinheiros, 300 - São Paulo, SP",
    notificationPreference: "whatsapp",
    notificationContact: "11955554444",
    createdAt: "2025-07-15",
  },
];

// ========== VENDAS (ORDERS) - Total ~R$ 1.500 em vendas pagas ==========
const initialOrders: Order[] = [
  // DEZEMBRO 2025 - R$ 300
  {
    id: "ORD-001",
    clientId: "c1",
    clientName: "Maria Santos",
    date: "2025-12-15",
    createdAt: "2025-12-15T10:00:00Z",
    sellerId: "u2",
    sellerName: "Maria Vendedora",
    items: [
      {
        productId: "1",
        productName: "Alface Crespa Orgânica",
        quantity: 10,
        unitPrice: 4.5,
        total: 45,
      },
      {
        productId: "2",
        productName: "Tomate Orgânico",
        quantity: 8,
        unitPrice: 8.0,
        total: 64,
      },
      {
        productId: "7",
        productName: "Morango Orgânico",
        quantity: 5,
        unitPrice: 15.0,
        total: 75,
      },
    ],
    totalValue: 184,
    paymentStatus: "paid",
    paymentDueDate: "2025-12-15",
    paymentMethod: "PIX",
  },
  {
    id: "ORD-002",
    clientId: "c2",
    clientName: "João Oliveira",
    date: "2025-12-20",
    createdAt: "2025-12-20T14:30:00Z",
    sellerId: "u6",
    sellerName: "João Vendedor",
    items: [
      {
        productId: "3",
        productName: "Banana Prata Orgânica",
        quantity: 8,
        unitPrice: 6.5,
        total: 52,
      },
      {
        productId: "10",
        productName: "Laranja Orgânica",
        quantity: 6,
        unitPrice: 9.0,
        total: 54,
      },
    ],
    totalValue: 106,
    paymentStatus: "paid",
    paymentDueDate: "2025-12-20",
    paymentMethod: "Cartão",
  },
  // JANEIRO 2026 - R$ 320
  {
    id: "ORD-003",
    clientId: "c3",
    clientName: "Ana Costa",
    date: "2026-01-10",
    createdAt: "2026-01-10T09:15:00Z",
    sellerId: "u7",
    sellerName: "Pedro Vendedor",
    items: [
      {
        productId: "2",
        productName: "Tomate Orgânico",
        quantity: 12,
        unitPrice: 8.0,
        total: 96,
      },
      {
        productId: "8",
        productName: "Cenoura Orgânica",
        quantity: 10,
        unitPrice: 5.5,
        total: 55,
      },
      {
        productId: "11",
        productName: "Abacate Orgânico",
        quantity: 6,
        unitPrice: 12.0,
        total: 72,
      },
    ],
    totalValue: 223,
    paymentStatus: "paid",
    paymentDueDate: "2026-01-10",
    paymentMethod: "PIX",
  },
  {
    id: "ORD-004",
    clientId: "c4",
    clientName: "Carlos Silva",
    date: "2026-01-25",
    createdAt: "2026-01-25T16:45:00Z",
    sellerId: "u8",
    sellerName: "Carla Vendedora",
    items: [
      {
        productId: "12",
        productName: "Mel Orgânico",
        quantity: 4,
        unitPrice: 25.0,
        total: 100,
      },
    ],
    totalValue: 100,
    paymentStatus: "paid",
    paymentDueDate: "2026-01-25",
    paymentMethod: "Dinheiro",
  },
  // FEVEREIRO 2026 - R$ 250
  {
    id: "ORD-005",
    clientId: "c5",
    clientName: "Patrícia Lima",
    date: "2026-02-05",
    createdAt: "2026-02-05T11:20:00Z",
    sellerId: "u2",
    sellerName: "Maria Vendedora",
    items: [
      {
        productId: "6",
        productName: "Brócolis Orgânico",
        quantity: 15,
        unitPrice: 6.0,
        total: 90,
      },
      {
        productId: "9",
        productName: "Repolho Orgânico",
        quantity: 12,
        unitPrice: 7.0,
        total: 84,
      },
      {
        productId: "1",
        productName: "Alface Crespa Orgânica",
        quantity: 10,
        unitPrice: 4.5,
        total: 45,
      },
    ],
    totalValue: 219,
    paymentStatus: "paid",
    paymentDueDate: "2026-02-05",
    paymentMethod: "Cartão",
  },
  {
    id: "ORD-006",
    clientId: "c6",
    clientName: "Ricardo Alves",
    date: "2026-02-18",
    createdAt: "2026-02-18T13:00:00Z",
    sellerId: "u6",
    sellerName: "João Vendedor",
    items: [
      {
        productId: "4",
        productName: "Quinoa Orgânica",
        quantity: 3,
        unitPrice: 12.0,
        total: 36,
      },
    ],
    totalValue: 36,
    paymentStatus: "pending",
    paymentDueDate: "2026-03-05",
    paymentMethod: "Cartão",
  },
  // MARÇO 2026 - R$ 320
  {
    id: "ORD-007",
    clientId: "c1",
    clientName: "Maria Santos",
    date: "2026-03-10",
    createdAt: "2026-03-10T15:30:00Z",
    sellerId: "u7",
    sellerName: "Pedro Vendedor",
    items: [
      {
        productId: "7",
        productName: "Morango Orgânico",
        quantity: 8,
        unitPrice: 15.0,
        total: 120,
      },
      {
        productId: "3",
        productName: "Banana Prata Orgânica",
        quantity: 10,
        unitPrice: 6.5,
        total: 65,
      },
      {
        productId: "11",
        productName: "Abacate Orgânico",
        quantity: 5,
        unitPrice: 12.0,
        total: 60,
      },
    ],
    totalValue: 245,
    paymentStatus: "paid",
    paymentDueDate: "2026-03-10",
    paymentMethod: "PIX",
  },
  {
    id: "ORD-008",
    clientId: "c2",
    clientName: "João Oliveira",
    date: "2026-03-22",
    createdAt: "2026-03-22T09:00:00Z",
    sellerId: "u8",
    sellerName: "Carla Vendedora",
    items: [
      {
        productId: "2",
        productName: "Tomate Orgânico",
        quantity: 5,
        unitPrice: 8.0,
        total: 40,
      },
      {
        productId: "10",
        productName: "Laranja Orgânica",
        quantity: 5,
        unitPrice: 9.0,
        total: 45,
      },
    ],
    totalValue: 85,
    paymentStatus: "paid",
    paymentDueDate: "2026-03-22",
    paymentMethod: "Cartão",
  },
  // ABRIL 2026 - R$ 280
  {
    id: "ORD-009",
    clientId: "c3",
    clientName: "Ana Costa",
    date: "2026-04-08",
    createdAt: "2026-04-08T10:00:00Z",
    sellerId: "u2",
    sellerName: "Maria Vendedora",
    items: [
      {
        productId: "8",
        productName: "Cenoura Orgânica",
        quantity: 15,
        unitPrice: 5.5,
        total: 82.5,
      },
      {
        productId: "1",
        productName: "Alface Crespa Orgânica",
        quantity: 12,
        unitPrice: 4.5,
        total: 54,
      },
      {
        productId: "12",
        productName: "Mel Orgânico",
        quantity: 2,
        unitPrice: 25.0,
        total: 50,
      },
    ],
    totalValue: 186.5,
    paymentStatus: "paid",
    paymentDueDate: "2026-04-08",
    paymentMethod: "Cartão",
  },
  {
    id: "ORD-010",
    clientId: "c7",
    clientName: "Fernanda Souza",
    date: "2026-04-20",
    createdAt: "2026-04-20T14:00:00Z",
    sellerId: "u6",
    sellerName: "João Vendedor",
    items: [
      {
        productId: "7",
        productName: "Morango Orgânico",
        quantity: 6,
        unitPrice: 15.0,
        total: 90,
      },
    ],
    totalValue: 90,
    paymentStatus: "pending",
    paymentDueDate: "2026-05-10",
    paymentMethod: "Cartão",
  },
  // MAIO 2026 (MÊS ATUAL) - R$ 330
  {
    id: "ORD-011",
    clientId: "c4",
    clientName: "Carlos Silva",
    date: "2026-05-02",
    createdAt: "2026-05-02T11:00:00Z",
    sellerId: "u7",
    sellerName: "Pedro Vendedor",
    items: [
      {
        productId: "4",
        productName: "Quinoa Orgânica",
        quantity: 5,
        unitPrice: 12.0,
        total: 60,
      },
      {
        productId: "11",
        productName: "Abacate Orgânico",
        quantity: 4,
        unitPrice: 12.0,
        total: 48,
      },
    ],
    totalValue: 108,
    paymentStatus: "paid",
    paymentDueDate: "2026-05-02",
    paymentMethod: "PIX",
  },
  {
    id: "ORD-012",
    clientId: "c5",
    clientName: "Patrícia Lima",
    date: "2026-05-10",
    createdAt: "2026-05-10T16:00:00Z",
    sellerId: "u8",
    sellerName: "Carla Vendedora",
    items: [
      {
        productId: "2",
        productName: "Tomate Orgânico",
        quantity: 6,
        unitPrice: 8.0,
        total: 48,
      },
      {
        productId: "3",
        productName: "Banana Prata Orgânica",
        quantity: 8,
        unitPrice: 6.5,
        total: 52,
      },
      {
        productId: "9",
        productName: "Repolho Orgânico",
        quantity: 5,
        unitPrice: 7.0,
        total: 35,
      },
    ],
    totalValue: 135,
    paymentStatus: "paid",
    paymentDueDate: "2026-05-10",
    paymentMethod: "Cartão",
  },
  {
    id: "ORD-013",
    clientId: "c6",
    clientName: "Ricardo Alves",
    date: "2026-05-15",
    createdAt: "2026-05-15T09:30:00Z",
    sellerId: "u2",
    sellerName: "Maria Vendedora",
    items: [
      {
        productId: "12",
        productName: "Mel Orgânico",
        quantity: 3,
        unitPrice: 25.0,
        total: 75,
      },
    ],
    totalValue: 75,
    paymentStatus: "pending",
    paymentDueDate: "2026-05-30",
    paymentMethod: "Cartão",
  },
  {
    id: "ORD-014",
    clientId: "c1",
    clientName: "Maria Santos",
    date: "2026-05-18",
    createdAt: "2026-05-18T13:00:00Z",
    sellerId: "u6",
    sellerName: "João Vendedor",
    items: [
      {
        productId: "7",
        productName: "Morango Orgânico",
        quantity: 3,
        unitPrice: 15.0,
        total: 45,
      },
      {
        productId: "10",
        productName: "Laranja Orgânica",
        quantity: 4,
        unitPrice: 9.0,
        total: 36,
      },
    ],
    totalValue: 81,
    paymentStatus: "pending",
    paymentDueDate: "2026-06-05",
    paymentMethod: "Cartão",
  },
  {
    id: "ORD-015",
    clientId: "c2",
    clientName: "João Oliveira",
    date: "2026-05-22",
    createdAt: "2026-05-22T10:00:00Z",
    sellerId: "u7",
    sellerName: "Pedro Vendedor",
    items: [
      {
        productId: "6",
        productName: "Brócolis Orgânico",
        quantity: 5,
        unitPrice: 6.0,
        total: 30,
      },
      {
        productId: "8",
        productName: "Cenoura Orgânica",
        quantity: 4,
        unitPrice: 5.5,
        total: 22,
      },
    ],
    totalValue: 52,
    paymentStatus: "pending",
    paymentDueDate: "2026-06-10",
    paymentMethod: "PIX",
  },
  // FIADO - Sem data de vencimento definida
  {
    id: "ORD-016",
    clientId: "c3",
    clientName: "Ana Costa",
    date: "2026-04-15",
    createdAt: "2026-04-15T10:00:00Z",
    sellerId: "u8",
    sellerName: "Carla Vendedora",
    items: [
      {
        productId: "2",
        productName: "Tomate Orgânico",
        quantity: 5,
        unitPrice: 8.0,
        total: 40,
      },
      {
        productId: "1",
        productName: "Alface Crespa Orgânica",
        quantity: 8,
        unitPrice: 4.5,
        total: 36,
      },
    ],
    totalValue: 76,
    paymentStatus: "pending",
    paymentDueDate: "9999-12-31",
    paymentMethod: "fiado",
  },
  {
    id: "ORD-017",
    clientId: "c5",
    clientName: "Patrícia Lima",
    date: "2026-03-20",
    createdAt: "2026-03-20T14:00:00Z",
    sellerId: "u2",
    sellerName: "Maria Vendedora",
    items: [
      {
        productId: "7",
        productName: "Morango Orgânico",
        quantity: 6,
        unitPrice: 15.0,
        total: 90,
      },
      {
        productId: "11",
        productName: "Abacate Orgânico",
        quantity: 5,
        unitPrice: 12.0,
        total: 60,
      },
    ],
    totalValue: 150,
    paymentStatus: "paid",
    paymentDueDate: "9999-12-31",
    paymentMethod: "fiado",
  },
  {
    id: "ORD-018",
    clientId: "c7",
    clientName: "Fernanda Souza",
    date: "2026-05-05",
    createdAt: "2026-05-05T09:00:00Z",
    sellerId: "u6",
    sellerName: "João Vendedor",
    items: [
      {
        productId: "12",
        productName: "Mel Orgânico",
        quantity: 2,
        unitPrice: 25.0,
        total: 50,
      },
      {
        productId: "3",
        productName: "Banana Prata Orgânica",
        quantity: 4,
        unitPrice: 6.5,
        total: 26,
      },
    ],
    totalValue: 76,
    paymentStatus: "pending",
    paymentDueDate: "9999-12-31",
    paymentMethod: "fiado",
  },
  // JUNHO 2026 - Pedidos adicionais dos vendedores
  {
    id: "ORD-019",
    clientId: "c4",
    clientName: "Carlos Silva",
    date: "2026-06-02",
    createdAt: "2026-06-02T10:00:00Z",
    sellerId: "u8",
    sellerName: "Carla Vendedora",
    items: [
      {
        productId: "10",
        productName: "Laranja Orgânica",
        quantity: 10,
        unitPrice: 9.0,
        total: 90,
      },
    ],
    totalValue: 90,
    paymentStatus: "paid",
    paymentDueDate: "2026-06-10",
    paymentMethod: "PIX",
  },
  {
    id: "ORD-020",
    clientId: "c6",
    clientName: "Ricardo Alves",
    date: "2026-06-05",
    createdAt: "2026-06-05T14:00:00Z",
    sellerId: "u7",
    sellerName: "Pedro Vendedor",
    items: [
      {
        productId: "4",
        productName: "Quinoa Orgânica",
        quantity: 4,
        unitPrice: 12.0,
        total: 48,
      },
      {
        productId: "9",
        productName: "Repolho Orgânico",
        quantity: 5,
        unitPrice: 7.0,
        total: 35,
      },
    ],
    totalValue: 83,
    paymentStatus: "paid",
    paymentDueDate: "2026-06-12",
    paymentMethod: "Cartão",
  },
];

// ========== COMPRAS (PURCHASES) - Total ~R$ 1.800 em compras pagas ==========
const initialSuppliers: Supplier[] = [
  {
    id: "s1",
    name: "HortiFresh Orgânicos",
    address: "Estrada do Tanque, 150 - Mogi das Cruzes, SP",
    phone: "(11) 98765-1234",
    email: "contato@hortifresh.com.br",
    productType: "Hortaliças e Verduras",
    cnpj: "12.345.678/0001-90",
    contactPerson: "Carlos Silva",
    notes: "Entrega às terças e quintas",
    certified: true,
    createdAt: "2025-01-10",
  },
  {
    id: "s2",
    name: "Frutas Nobre",
    address: "Rua das Laranjeiras, 45 - São Paulo, SP",
    phone: "(11) 91234-5678",
    email: "vendas@frutasnobre.com.br",
    productType: "Frutas Orgânicas",
    cnpj: "98.765.432/0001-21",
    contactPerson: "Ana Nobre",
    notes: "Pagamento à vista com desconto",
    certified: false,
    createdAt: "2025-02-15",
  },
  {
    id: "s3",
    name: "Grãos da Terra",
    address: "Av. dos Estados, 1000 - Santo André, SP",
    phone: "(11) 95555-8888",
    email: "contato@graosdaterra.com.br",
    productType: "Grãos, Cereais e Sementes",
    cnpj: "45.678.901/0001-32",
    contactPerson: "Roberto Santos",
    notes: "Pedido mínimo 10kg",
    certified: false, // ❌ Não certificado
    createdAt: "2025-03-20",
  },
  {
    id: "s4",
    name: "Embalagens Eco",
    address: "Rua do Meio Ambiente, 200 - São Paulo, SP",
    phone: "(11) 94444-3333",
    email: "vendas@embalagenseco.com.br",
    productType: "Embalagens Sustentáveis",
    cnpj: "56.789.012/0001-43",
    contactPerson: "Fernanda Lima",
    notes: "Desconto para compras acima de R$ 500",
    certified: true, // ✅ Certificado (empresa sustentável)
    createdAt: "2025-04-10",
  },
  {
    id: "s5",
    name: "Mel do Vale",
    address: "Estrada do Mel, 50 - Atibaia, SP",
    phone: "(11) 93333-2222",
    email: "contato@meldovale.com.br",
    productType: "Mel e Derivados",
    cnpj: "67.890.123/0001-54",
    contactPerson: "José Apicultor",
    notes: "Mel orgânico certificado",
    certified: true, // ✅ Certificado orgânico
    createdAt: "2025-05-20",
  },
];

const initialPurchases: Purchase[] = [
  // 2025 - R$ 700
  {
    id: "CMP-001",
    supplierId: "s1",
    supplierName: "HortiFresh Orgânicos",
    date: "2025-12-05",
    items: [
      {
        productId: "1",
        productName: "Alface Crespa Orgânica",
        quantity: 60,
        unitPrice: 2.5,
        total: 150,
      },
      {
        productId: "2",
        productName: "Tomate Orgânico",
        quantity: 50,
        unitPrice: 5.0,
        total: 250,
      },
      {
        productId: "6",
        productName: "Brócolis Orgânico",
        quantity: 40,
        unitPrice: 3.5,
        total: 140,
      },
      {
        productId: "9",
        productName: "Repolho Orgânico",
        quantity: 30,
        unitPrice: 4.5,
        total: 135,
      },
    ],
    totalValue: 675,
    paymentStatus: "paid",
    paymentDueDate: "2025-12-20",
    paymentMethod: "Boleto",
    notes: "Compra grande para fim de ano",
    createdAt: "2025-12-05T10:00:00Z",
  },
  // JANEIRO 2026 - R$ 450
  {
    id: "CMP-002",
    supplierId: "s2",
    supplierName: "Frutas Nobre",
    date: "2026-01-10",
    items: [
      {
        productId: "3",
        productName: "Banana Prata Orgânica",
        quantity: 60,
        unitPrice: 4.0,
        total: 240,
      },
      {
        productId: "7",
        productName: "Morango Orgânico",
        quantity: 20,
        unitPrice: 10.0,
        total: 200,
      },
      {
        productId: "10",
        productName: "Laranja Orgânica",
        quantity: 50,
        unitPrice: 6.0,
        total: 300,
      },
    ],
    totalValue: 740,
    paymentStatus: "paid",
    paymentDueDate: "2026-01-25",
    paymentMethod: "PIX",
    notes: "Promoção de verão",
    createdAt: "2026-01-10T09:00:00Z",
  },
  // FEVEREIRO 2026 - R$ 250
  {
    id: "CMP-003",
    supplierId: "s3",
    supplierName: "Grãos da Terra",
    date: "2026-02-15",
    items: [
      {
        productId: "4",
        productName: "Quinoa Orgânica",
        quantity: 30,
        unitPrice: 8.0,
        total: 240,
      },
      {
        productId: "11",
        productName: "Abacate Orgânico",
        quantity: 25,
        unitPrice: 8.0,
        total: 200,
      },
    ],
    totalValue: 440,
    paymentStatus: "paid",
    paymentDueDate: "2026-02-28",
    paymentMethod: "Boleto",
    notes: "Reabastecimento",
    createdAt: "2026-02-15T14:00:00Z",
  },
  // MARÇO 2026 - R$ 300
  {
    id: "CMP-004",
    supplierId: "s1",
    supplierName: "HortiFresh Orgânicos",
    date: "2026-03-05",
    items: [
      {
        productId: "1",
        productName: "Alface Crespa Orgânica",
        quantity: 40,
        unitPrice: 2.5,
        total: 100,
      },
      {
        productId: "2",
        productName: "Tomate Orgânico",
        quantity: 30,
        unitPrice: 5.0,
        total: 150,
      },
      {
        productId: "8",
        productName: "Cenoura Orgânica",
        quantity: 25,
        unitPrice: 3.0,
        total: 75,
      },
    ],
    totalValue: 325,
    paymentStatus: "pending",
    paymentDueDate: "2026-03-25",
    paymentMethod: "Cartão",
    notes: "Aguardando nota fiscal",
    createdAt: "2026-03-05T11:00:00Z",
  },
  // ABRIL 2026 - R$ 280
  {
    id: "CMP-005",
    supplierId: "s2",
    supplierName: "Frutas Nobre",
    date: "2026-04-12",
    items: [
      {
        productId: "3",
        productName: "Banana Prata Orgânica",
        quantity: 40,
        unitPrice: 4.0,
        total: 160,
      },
      {
        productId: "7",
        productName: "Morango Orgânico",
        quantity: 15,
        unitPrice: 10.0,
        total: 150,
      },
      {
        productId: "10",
        productName: "Laranja Orgânica",
        quantity: 30,
        unitPrice: 6.0,
        total: 180,
      },
    ],
    totalValue: 490,
    paymentStatus: "paid",
    paymentDueDate: "2026-04-30",
    paymentMethod: "PIX",
    notes: "Compra mensal",
    createdAt: "2026-04-12T15:30:00Z",
  },
  // MAIO 2026 (MÊS ATUAL) - R$ 280
  {
    id: "CMP-006",
    supplierId: "s5",
    supplierName: "Mel do Vale",
    date: "2026-05-08",
    items: [
      {
        productId: "12",
        productName: "Mel Orgânico",
        quantity: 20,
        unitPrice: 18.0,
        total: 360,
      },
    ],
    totalValue: 360,
    paymentStatus: "paid",
    paymentDueDate: "2026-05-22",
    paymentMethod: "Boleto",
    notes: "Mel orgânico - nova linha",
    createdAt: "2026-05-08T10:00:00Z",
  },
  {
    id: "CMP-007",
    supplierId: "s1",
    supplierName: "HortiFresh Orgânicos",
    date: "2026-05-15",
    items: [
      {
        productId: "1",
        productName: "Alface Crespa Orgânica",
        quantity: 25,
        unitPrice: 2.5,
        total: 62.5,
      },
      {
        productId: "6",
        productName: "Brócolis Orgânico",
        quantity: 20,
        unitPrice: 3.5,
        total: 70,
      },
      {
        productId: "9",
        productName: "Repolho Orgânico",
        quantity: 20,
        unitPrice: 4.5,
        total: 90,
      },
    ],
    totalValue: 222.5,
    paymentStatus: "pending",
    paymentDueDate: "2026-06-05",
    paymentMethod: "Cartão",
    notes: "Entrega parcelada",
    createdAt: "2026-05-15T13:00:00Z",
  },
  {
    id: "CMP-008",
    supplierId: "s4",
    supplierName: "Embalagens Eco",
    date: "2026-05-20",
    items: [
      {
        productId: "5",
        productName: "Caixa de Papelão",
        quantity: 150,
        unitPrice: 2.0,
        total: 300,
      },
    ],
    totalValue: 300,
    paymentStatus: "pending",
    paymentDueDate: "2026-06-15",
    paymentMethod: "Boleto",
    notes: "Embalagens para novos produtos",
    createdAt: "2026-05-20T09:00:00Z",
  },
];

// USUÁRIOS INICIAIS
const initialUsers: User[] = [
  {
    id: "u1",
    name: "Administrador",
    email: "admin@shizen.com",
    password: "admin123",
    role: "admin",
    status: "active",
    avatar: "👤",
    lastLogin: "2026-05-27T10:00:00Z",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "u2",
    name: "Maria Vendedora",
    email: "vendedor@shizen.com",
    password: "venda123",
    role: "seller",
    status: "active",
    avatar: "🛒",
    lastLogin: "2026-05-26T14:30:00Z",
    createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "u3",
    name: "Carlos Estoque",
    email: "estoque@shizen.com",
    password: "estoque123",
    role: "stock",
    status: "active",
    avatar: "📦",
    lastLogin: "2026-05-25T09:00:00Z",
    createdAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "u4",
    name: "Ana Financeiro",
    email: "financeiro@shizen.com",
    password: "finan123",
    role: "financial",
    status: "active",
    avatar: "💰",
    lastLogin: "2026-05-24T11:00:00Z",
    createdAt: "2025-04-01T00:00:00Z",
  },
  {
    id: "u6",
    name: "João Vendedor",
    email: "joao.vendedor@shizen.com",
    password: "venda456",
    role: "seller",
    status: "active",
    avatar: "🛒",
    lastLogin: "2026-06-10T10:00:00Z",
    createdAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "u7",
    name: "Pedro Vendedor",
    email: "pedro.vendedor@shizen.com",
    password: "venda789",
    role: "seller",
    status: "active",
    avatar: "🛒",
    lastLogin: "2026-06-09T14:00:00Z",
    createdAt: "2025-07-01T00:00:00Z",
  },
  {
    id: "u8",
    name: "Carla Vendedora",
    email: "carla.vendedora@shizen.com",
    password: "venda321",
    role: "seller",
    status: "active",
    avatar: "🛒",
    lastLogin: "2026-06-08T11:00:00Z",
    createdAt: "2025-08-01T00:00:00Z",
  },
];

const initialUserSettings: UserSettings[] = [
  {
    userId: "u1",
    primaryColor: "#2D5016",
    sidebarColor: "#2D5016",
    fontSize: "medium",
    reducedMotion: false,
    highContrast: false,
    daltonism: "none",
    language: "pt-BR",
  },
];

// ========== FUNÇÕES DE PERSISTÊNCIA ==========
const DATA_VERSION = "2.0";

function checkAndResetIfVersionChanged() {
  const savedVersion = localStorage.getItem("shizen_data_version");
  if (savedVersion !== DATA_VERSION) {
    const keys = ["shizen_products", "shizen_clients", "shizen_orders", "shizen_suppliers", "shizen_purchases", "shizen_users", "shizen_notifications", "shizen_user_settings", "shizen_current_user"];
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.setItem("shizen_data_version", DATA_VERSION);
  }
}

checkAndResetIfVersionChanged();

function loadFromStorage<T>(key: string, initialData: T): T {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : initialData;
    } catch {
      return initialData;
    }
  }
  return initialData;
}

function saveToStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ========== PROVIDER ==========
export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage("shizen_products", initialProducts),
  );
  const [clients, setClients] = useState<Client[]>(() =>
    loadFromStorage("shizen_clients", initialClients),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage("shizen_orders", initialOrders),
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    loadFromStorage("shizen_suppliers", initialSuppliers),
  );
  const [purchases, setPurchases] = useState<Purchase[]>(() =>
    loadFromStorage("shizen_purchases", initialPurchases),
  );
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage("shizen_users", initialUsers),
  );
  const [notifications, setNotifications] = useState<
    Notification[]
  >(() => loadFromStorage("shizen_notifications", []));
  const [userSettings, setUserSettings] = useState<
    UserSettings[]
  >(() =>
    loadFromStorage(
      "shizen_user_settings",
      initialUserSettings,
    ),
  );
  const [currentUser, setCurrentUser] = useState<User | null>(
    () => {
      const saved = localStorage.getItem("shizen_current_user");
      return saved ? JSON.parse(saved) : null;
    },
  );

  // Salvar dados sempre que mudarem
  useEffect(() => {
    saveToStorage("shizen_products", products);
  }, [products]);
  useEffect(() => {
    saveToStorage("shizen_clients", clients);
  }, [clients]);
  useEffect(() => {
    saveToStorage("shizen_orders", orders);
  }, [orders]);
  useEffect(() => {
    saveToStorage("shizen_suppliers", suppliers);
  }, [suppliers]);
  useEffect(() => {
    saveToStorage("shizen_purchases", purchases);
  }, [purchases]);
  useEffect(() => {
    saveToStorage("shizen_users", users);
  }, [users]);
  useEffect(() => {
    saveToStorage("shizen_notifications", notifications);
  }, [notifications]);
  useEffect(() => {
    saveToStorage("shizen_user_settings", userSettings);
  }, [userSettings]);
  useEffect(() => {
    if (currentUser)
      saveToStorage("shizen_current_user", currentUser);
  }, [currentUser]);

  // ========== FUNÇÕES DE NOTIFICAÇÃO ==========
  const addNotification = (
    notification: Omit<
      Notification,
      "id" | "read" | "createdAt"
    >,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true })),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return Array.isArray(notifications)
      ? notifications.filter((n) => !n.read).length
      : 0;
  };

  // ========== FUNÇÕES DE PRODUTOS ==========
  const addProduct = (product: Omit<Product, "id">) => {
    const newId = Date.now().toString();
    setProducts((prev) => [...prev, { ...product, id: newId }]);
    addNotification({
      type: "low_stock",
      title: "Produto Adicionado",
      message: `${product.name} foi adicionado ao catálogo.`,
      link: "/dashboard/cadastro",
      referenceId: newId,
    });
  };

  const updateProduct = (
    id: string,
    updates: Partial<Product>,
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getLowStockProducts = () =>
    products.filter((p) => p.stock <= p.minStock);
  const getExpiringProducts = () =>
    products.filter(
      (p) => p.validity && new Date(p.validity) < new Date(),
    );

  // ========== FUNÇÕES DE CLIENTES ==========
  const addClient = (
    client: Omit<Client, "id" | "createdAt">,
  ) => {
    const newId = Date.now().toString();
    setClients((prev) => [
      ...prev,
      {
        ...client,
        id: newId,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const updateClient = (
    id: string,
    updates: Partial<Client>,
  ) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // ========== FUNÇÕES DE PEDIDOS ==========
  const adjustStock = (
    productId: string,
    quantityChange: number,
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(
            0,
            p.stock + quantityChange,
          );
          const oldStock = p.stock;

          if (
            newStock <= p.minStock &&
            oldStock > p.minStock &&
            quantityChange < 0
          ) {
            addNotification({
              type: "low_stock",
              title: "Estoque Baixo",
              message: `${p.name} está com estoque baixo! Atual: ${newStock} ${p.unit} (Mínimo: ${p.minStock})`,
              link: "/dashboard/cadastro",
              referenceId: productId,
            });
          }
          return { ...p, stock: newStock };
        }
        return p;
      }),
    );
  };

  const addOrder = (order: Omit<Order, "id" | "createdAt">) => {
    const orderCount = orders.length + 1;
    const newId = `ORD-${String(orderCount).padStart(3, "0")}`;
    const newOrder: Order = {
      ...order,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    order.items.forEach((item) => {
      adjustStock(item.productId, -item.quantity);
    });

    addNotification({
      type: "order_created",
      title: "Novo Pedido",
      message: `Pedido ${newId} criado para ${order.clientName} no valor de R$ ${order.totalValue.toFixed(2)}`,
      link: "/dashboard/vendas",
      referenceId: newId,
    });
  };

  const updateOrderPaymentStatus = (
    orderId: string,
    status: Order["paymentStatus"],
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          if (status === "paid" && o.paymentStatus !== "paid") {
            addNotification({
              type: "order_paid",
              title: "Pagamento Recebido",
              message: `Pedido ${orderId} de ${o.clientName} foi pago! Valor: R$ ${o.totalValue.toFixed(2)}`,
              link: "/dashboard/vendas",
              referenceId: orderId,
            });
          }
          return { ...o, paymentStatus: status };
        }
        return o;
      }),
    );
  };

  // ========== FUNÇÕES DE FORNECEDORES ==========
  const addSupplier = (
    supplier: Omit<Supplier, "id" | "createdAt">,
  ) => {
    const newId = Date.now().toString();
    setSuppliers((prev) => [
      ...prev,
      {
        ...supplier,
        id: newId,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const updateSupplier = (
    id: string,
    updates: Partial<Supplier>,
  ) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };


  // ========== FUNÇÕES DE COMPRAS ==========
  const updateProductCost = (
    productId: string,
    newCost: number,
    quantity: number,
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentTotalValue = p.cost * p.stock;
          const newTotalValue = newCost * quantity;
          const newTotalStock = p.stock + quantity;
          const averageCost =
            (currentTotalValue + newTotalValue) / newTotalStock;
          return { ...p, cost: averageCost };
        }
        return p;
      }),
    );
  };

  const addPurchase = (
    purchase: Omit<Purchase, "id" | "createdAt">,
  ) => {
    const purchaseCount = purchases.length + 1;
    const newId = `CMP-${String(purchaseCount).padStart(3, "0")}`;
    const newPurchase: Purchase = {
      ...purchase,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setPurchases((prev) => [...prev, newPurchase]);

    purchase.items.forEach((item) => {
      adjustStock(item.productId, item.quantity);
      updateProductCost(
        item.productId,
        item.unitPrice,
        item.quantity,
      );
    });

    addNotification({
      type: "purchase_created",
      title: "Nova Compra",
      message: `Compra ${newId} de ${purchase.supplierName} no valor de R$ ${purchase.totalValue.toFixed(2)}`,
      link: "/dashboard/compras",
      referenceId: newId,
    });
  };

  const updatePurchasePaymentStatus = (
    purchaseId: string,
    status: Purchase["paymentStatus"],
  ) => {
    setPurchases((prev) =>
      prev.map((p) => {
        if (p.id === purchaseId) {
          if (status === "paid" && p.paymentStatus !== "paid") {
            addNotification({
              type: "purchase_paid",
              title: "Compra Paga",
              message: `Compra ${purchaseId} de ${p.supplierName} foi paga! Valor: R$ ${p.totalValue.toFixed(2)}`,
              link: "/dashboard/compras",
              referenceId: purchaseId,
            });
          }
          return { ...p, paymentStatus: status };
        }
        return p;
      }),
    );
  };

  const deletePurchase = (id: string) => {
    const purchaseToDelete = purchases.find((p) => p.id === id);
    if (
      purchaseToDelete &&
      confirm(
        "Esta ação irá remover os itens do estoque. Continuar?",
      )
    ) {
      purchaseToDelete.items.forEach((item) => {
        adjustStock(item.productId, -item.quantity);
      });
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } else if (purchaseToDelete) {
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const getSupplierPurchases = (supplierId: string) =>
    purchases.filter((p) => p.supplierId === supplierId);
  const getTotalSpentBySupplier = (supplierId: string) =>
    purchases
      .filter(
        (p) =>
          p.supplierId === supplierId &&
          p.paymentStatus === "paid",
      )
      .reduce((sum, p) => sum + p.totalValue, 0);

  // ========== FUNÇÕES DE USUÁRIOS ==========
  const addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newId = Date.now().toString();
    const newUser: User = {
      ...user,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    addNotification({
      type: "order_created",
      title: "Novo Usuário",
      message: `Usuário ${user.name} foi criado com o perfil ${user.role}.`,
      link: "/dashboard/usuarios",
      referenceId: newId,
    });
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    );
    if (currentUser?.id === id) {
      setCurrentUser((prev) =>
        prev ? { ...prev, ...updates } : null,
      );
      if (updates.avatar !== undefined) {
        saveToStorage("shizen_current_user", {
          ...currentUser,
          ...updates,
        });
      }
    }
  };

  const deleteUser = (id: string) => {
    if (currentUser?.id === id) {
      alert("Você não pode excluir seu próprio usuário!");
      return;
    }
    if (
      confirm("Tem certeza que deseja excluir este usuário?")
    ) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const getCurrentUser = () => currentUser;

  const login = (email: string, password: string): boolean => {
    const user = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        u.status === "active",
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(
        "shizen_current_user",
        JSON.stringify(user),
      );
      updateUser(user.id, {
        lastLogin: new Date().toISOString(),
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("shizen_current_user");
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    const permissions: Record<UserRole, string[]> = {
      admin: ["*"],
      seller: [
        "view_products",
        "view_clients",
        "create_orders",
        "view_orders",
      ],
      stock: [
        "view_products",
        "edit_products",
        "view_stock",
        "edit_stock",
        "create_purchases",
        "view_purchases",
        "view_suppliers",
      ],
      financial: [
        "view_financial",
        "view_reports",
        "view_orders",
        "view_dashboard",
      ],
    };
    if (permissions[currentUser.role].includes("*"))
      return true;
    return permissions[currentUser.role].includes(permission);
  };

  // ========== FUNÇÕES DE CONFIGURAÇÕES DO USUÁRIO ==========
  const getUserSettings = (userId: string) => {
    return userSettings.find((s) => s.userId === userId);
  };

  const updateUserSettings = (
    userId: string,
    settings: Partial<UserSettings>,
  ) => {
    setUserSettings((prev) => {
      const existing = prev.find((s) => s.userId === userId);
      if (existing) {
        return prev.map((s) =>
          s.userId === userId ? { ...s, ...settings } : s,
        );
      }
      return [...prev, { userId, ...settings } as UserSettings];
    });
  };

  // ========== FUNÇÕES DE BACKUP ==========
  const exportBackup = () => {
    const backup = {
      products,
      clients,
      orders,
      suppliers,
      purchases,
      users,
      userSettings,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };
    return JSON.stringify(backup, null, 2);
  };

  const importBackup = (data: string) => {
    try {
      const backup = JSON.parse(data);
      if (backup.products) setProducts(backup.products);
      if (backup.clients) setClients(backup.clients);
      if (backup.orders) setOrders(backup.orders);
      if (backup.suppliers) setSuppliers(backup.suppliers);
      if (backup.purchases) setPurchases(backup.purchases);
      if (backup.users) setUsers(backup.users);
      if (backup.userSettings)
        setUserSettings(backup.userSettings);
      alert(
        "Backup restaurado com sucesso! A página será recarregada.",
      );
      window.location.reload();
      return true;
    } catch {
      alert("Erro ao restaurar backup: arquivo inválido");
      return false;
    }
  };

    // ✅ RN02 – Validação de margem mínima de 35%
  const validateProfitMargin = (cost: number, price: number) => {
    if (cost <= 0) return { isValid: true, suggestedPrice: 0, margin: 0, message: "Informe o custo para calcular a margem" };
    const margin = ((price - cost) / cost) * 100;
    const isValid = margin >= 35;
    const suggestedPrice = cost * 1.35;
    const message = isValid
      ? `Margem atual: ${margin.toFixed(1)}% (mínimo 35% ✓)`
      : `Margem atual: ${margin.toFixed(1)}% (mínimo 35%). Preço sugerido: R$ ${suggestedPrice.toFixed(2)}`;
    return { isValid, suggestedPrice, margin, message };
  };

  return (
    <AppContext.Provider
      value={{
        products,
        clients,
        orders,
        suppliers,
        purchases,
        users,
        notifications,
        userSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        getLowStockProducts,
        getExpiringProducts,
        addClient,
        updateClient,
        deleteClient,
        addOrder,
        updateOrderPaymentStatus,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addPurchase,
        updatePurchasePaymentStatus,
        deletePurchase,
        getSupplierPurchases,
        getTotalSpentBySupplier,
        adjustStock,
        addUser,
        updateUser,
        deleteUser,
        getCurrentUser,
        login,
        logout,
        hasPermission,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        getUnreadCount,
        getUserSettings,
        updateUserSettings,
        exportBackup,
        importBackup,
        validateProfitMargin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(
      "useApp must be used within an AppProvider",
    );
  }
  return context;
}