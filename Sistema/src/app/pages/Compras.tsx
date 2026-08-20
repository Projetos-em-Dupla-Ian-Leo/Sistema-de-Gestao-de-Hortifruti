import { useState, useMemo } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Plus, Search, Trash2, Package, Truck, Eye, Check, Filter, Award } from "lucide-react";
import { useApp, Supplier, Product, Purchase } from "../context/AppContext";
import { format, parseISO, differenceInDays, isWithinInterval, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  icon: string;
}

export default function Compras() {
  const { products, suppliers, purchases, addPurchase, updatePurchasePaymentStatus } = useApp();
  const [activeTab, setActiveTab] = useState("nova");
  
  // Estados da compra
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [showOnlyCertified, setShowOnlyCertified] = useState(false); // ✅ NOVO: filtro apenas certificados
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [paymentDueDate, setPaymentDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState(1);
  
  // Estados para histórico
  const [historySearchTerm, setHistorySearchTerm] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<"todos" | "pending" | "paid" | "overdue">("todos");
  const [historyDateFilter, setHistoryDateFilter] = useState<"todos" | "hoje" | "semana" | "mes" | "personalizado">("todos");
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const [historySortBy, setHistorySortBy] = useState<"data" | "fornecedor" | "valor" | "vencimento">("data");
  const [historySortOrder, setHistorySortOrder] = useState<"asc" | "desc">("desc");
  const [historyCertifiedFilter, setHistoryCertifiedFilter] = useState<"todos" | "certificados">("todos");
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  // Fornecedores filtrados (com suporte a certificados)
  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers;
    
    // Filtro por nome
    if (supplierSearchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().startsWith(supplierSearchTerm.toLowerCase())
      );
    }
    
    // ✅ NOVO: Filtro apenas certificados
    if (showOnlyCertified) {
      filtered = filtered.filter(s => s.certified === true);
    }
    
    // Ordenar: certificados primeiro (prioridade RN10)
    return [...filtered].sort((a, b) => {
      if (a.certified && !b.certified) return -1;
      if (!a.certified && b.certified) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [suppliers, supplierSearchTerm, showOnlyCertified]);

  // Produtos filtrados
  const filteredProducts = useMemo(() => {
    if (!productSearchTerm) return products;
    return products.filter(p => 
      p.name.toLowerCase().startsWith(productSearchTerm.toLowerCase())
    );
  }, [products, productSearchTerm]);

  // Verificar se compra está vencida
  const isOverdue = (purchase: Purchase) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = parseISO(purchase.paymentDueDate);
    dueDate.setHours(0, 0, 0, 0);
    return purchase.paymentStatus !== "paid" && isBefore(dueDate, today);
  };

  // Obter status correto para filtro
  const getPurchaseStatusForFilter = (purchase: Purchase): "pending" | "paid" | "overdue" => {
    if (purchase.paymentStatus === "paid") return "paid";
    if (isOverdue(purchase)) return "overdue";
    return "pending";
  };

  // Filtrar por data
  const getDateFilterInterval = () => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    switch (historyDateFilter) {
      case "hoje":
        return { start: startOfToday, end: endOfToday };
      case "semana":
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { start: weekAgo, end: endOfToday };
      case "mes":
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { start: monthAgo, end: endOfToday };
      case "personalizado":
        if (historyStartDate && historyEndDate) {
          return { start: new Date(historyStartDate), end: new Date(historyEndDate) };
        }
        return null;
      default:
        return null;
    }
  };

  // Compras filtradas
// Compras filtradas
const filteredPurchases = useMemo(() => {
  let filtered = [...purchases];
  
  if (historySearchTerm) {
    filtered = filtered.filter(p => 
      p.supplierName.toLowerCase().startsWith(historySearchTerm.toLowerCase())
    );
  }
  
  if (historyStatusFilter !== "todos") {
    filtered = filtered.filter(p => getPurchaseStatusForFilter(p) === historyStatusFilter);
  }
  
  // ✅ NOVO: Filtrar apenas compras de fornecedores certificados
  if (historyCertifiedFilter === "certificados") {
    const certifiedSupplierIds = suppliers.filter(s => s.certified === true).map(s => s.id);
    filtered = filtered.filter(p => certifiedSupplierIds.includes(p.supplierId));
  }
  
  const dateInterval = getDateFilterInterval();
  if (dateInterval) {
    filtered = filtered.filter(p => {
      const purchaseDate = parseISO(p.date);
      return isWithinInterval(purchaseDate, { start: dateInterval.start, end: dateInterval.end });
    });
  }
  
  filtered.sort((a, b) => {
    let comparison = 0;
    switch (historySortBy) {
      case "data":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "fornecedor":
        comparison = a.supplierName.localeCompare(b.supplierName);
        break;
      case "valor":
        comparison = a.totalValue - b.totalValue;
        break;
      case "vencimento":
        comparison = new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime();
        break;
      default:
        comparison = 0;
    }
    return historySortOrder === "asc" ? comparison : -comparison;
  });
  
  return filtered;
}, [purchases, historySearchTerm, historyStatusFilter, historyCertifiedFilter, historyDateFilter, historyStartDate, historyEndDate, historySortBy, historySortOrder, suppliers]);

  const totalValue = cartItems.reduce((acc, item) => acc + item.total, 0);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    
    const existingItem = cartItems.find(item => item.productId === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.unitPrice }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        unitPrice: product.cost,
        total: product.cost * quantity,
        icon: product.icon,
      }]);
    }
    setShowProductModal(false);
    setProductSearchTerm("");
    setProductQuantity(1);
    setSelectedProduct(null);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
        : item
    ));
  };

  const handleMarkAsPaid = (purchaseId: string) => {
    if (confirm("Marcar esta compra como paga? Isso atualizará o Dashboard e o Financeiro.")) {
      updatePurchasePaymentStatus(purchaseId, "paid");
      alert("Compra marcada como paga com sucesso!");
    }
  };

  const handleSubmit = () => {
    if (!selectedSupplier) {
      alert("Selecione um fornecedor!");
      return;
    }
    if (cartItems.length === 0) {
      alert("Adicione produtos à compra!");
      return;
    }
    if (!paymentDueDate) {
      alert("Informe a data de vencimento do pagamento!");
      return;
    }

    const purchaseCount = purchases.length + 1;
    const newId = `CMP-${String(purchaseCount).padStart(3, '0')}`;
    
    const newPurchase = {
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      date: new Date().toISOString().split("T")[0],
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      totalValue: totalValue,
      paymentStatus: "pending" as const,
      paymentDueDate: paymentDueDate,
      paymentMethod: paymentMethod,
      notes: notes || undefined,
    };

    addPurchase(newPurchase);
    
    setSelectedSupplier(null);
    setCartItems([]);
    setPaymentMethod("pix");
    setPaymentDueDate("");
    setNotes("");
    setSupplierSearchTerm("");
    
    alert("Compra registrada com sucesso! Estoque atualizado.");
  };

  const getStatusBadge = (purchase: Purchase) => {
    if (purchase.paymentStatus === "paid") {
      return <Badge variant="success" className="bg-green-100 text-green-700">Pago</Badge>;
    }
    if (isOverdue(purchase)) {
      const days = differenceInDays(new Date(), parseISO(purchase.paymentDueDate));
      return <Badge variant="danger" className="bg-red-100 text-red-700">Vencido há {days} dias</Badge>;
    }
    const daysLeft = differenceInDays(parseISO(purchase.paymentDueDate), new Date());
    if (daysLeft < 0) {
      return <Badge variant="danger" className="bg-red-100 text-red-700">Vencido</Badge>;
    }
    return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Pendente ({daysLeft} dias)</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold dark:text-white">Compras</h1>
        <p className="text-gray-500 dark:text-gray-400">Gerencie suas aquisições e histórico de compras</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nova">Nova Compra</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Compras</TabsTrigger>
        </TabsList>

        {/* TAB NOVA COMPRA */}
        <TabsContent value="nova" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Fornecedor
                  </h3>

                  <div className="flex flex-col gap-3 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="Buscar fornecedor" 
                        className="pl-10" 
                        value={supplierSearchTerm}
                        onChange={(e) => setSupplierSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    {/* ✅ NOVO: Filtro apenas certificados */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="onlyCertified"
                        checked={showOnlyCertified}
                        onChange={(e) => setShowOnlyCertified(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="onlyCertified" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                        <Award className="w-4 h-4 text-green-600" />
                        Mostrar apenas fornecedores certificados
                      </label>
                      {showOnlyCertified && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs ml-auto">
                          {filteredSuppliers.length} certificados
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <div
                          key={supplier.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedSupplier?.id === supplier.id
                              ? "bg-[#2D5016] text-white"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedSupplier(supplier)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              selectedSupplier?.id === supplier.id ? "bg-white/20" : "bg-[#2D5016]/10"
                            }`}>
                              <Truck className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium">{supplier.name}</p>
                                {supplier.certified && (
                                  <Badge variant="outline" className="bg-green-100 text-green-700 text-xs">
                                    Certificado
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm ${selectedSupplier?.id === supplier.id ? "text-white/80" : "text-gray-500"}`}>
                                {supplier.productType}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        {showOnlyCertified ? (
                          <>
                            <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Nenhum fornecedor certificado encontrado</p>
                            <p className="text-xs mt-1">Tente desabilitar o filtro</p>
                          </>
                        ) : (
                          <>
                            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Nenhum fornecedor encontrado</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedSupplier && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Fornecedor selecionado:</p>
                      <p className="font-semibold">{selectedSupplier.name}</p>
                      <p className="text-sm text-gray-600">{selectedSupplier.phone}</p>
                      <p className="text-sm text-gray-600">{selectedSupplier.email}</p>
                      {selectedSupplier.certified && (
                        <Badge variant="outline" className="mt-2 bg-green-100 text-green-700">✅ Fornecedor Certificado</Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <Label>Forma de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX (à vista)</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                      <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>

                  <div>
                    <Label>Data de Vencimento</Label>
                    <Input 
                      type="date" 
                      value={paymentDueDate}
                      onChange={(e) => setPaymentDueDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Observações</Label>
                    <Textarea
                      placeholder="Notas fiscais, condições de pagamento, etc..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Itens da Compra</h3>
                    <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-[#2D5016] hover:bg-[#1f3a10] gap-2">
                          <Plus className="w-4 h-4" />
                          Adicionar Produto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Adicionar Produto</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input 
                              placeholder="Buscar produto" 
                              className="pl-10" 
                              value={productSearchTerm}
                              onChange={(e) => setProductSearchTerm(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                            {filteredProducts.map((product) => (
                              <div
                                key={product.id}
                                className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                                  selectedProduct?.id === product.id ? "border-[#2D5016] bg-green-50" : ""
                                }`}
                                onClick={() => setSelectedProduct(product)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{product.icon}</span>
                                  <div className="flex-1">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-500">
                                      Custo: R$ {product.cost.toFixed(2)} | Estoque: {product.stock} {product.unit}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {selectedProduct && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="font-semibold mb-2">Produto selecionado: {selectedProduct.name}</p>
                              <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                  <Label>Quantidade ({selectedProduct.unit})</Label>
                                  <Input 
                                    type="number" 
                                    min={1} 
                                    value={productQuantity}
                                    onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label>Preço de Compra (R$)</Label>
                                  <Input 
                                    type="number" 
                                    step="0.01" 
                                    value={selectedProduct.cost}
                                    disabled
                                  />
                                </div>
                                <Button 
                                  onClick={() => addToCart(selectedProduct, productQuantity)}
                                  className="bg-[#2D5016]"
                                >
                                  Adicionar
                                </Button>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">
                                O preço de custo será atualizado automaticamente (média ponderada)
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {cartItems.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-3 font-medium text-gray-700">Produto</th>
                            <th className="text-left p-3 font-medium text-gray-700">Qtd</th>
                            <th className="text-left p-3 font-medium text-gray-700">Unidade</th>
                            <th className="text-left p-3 font-medium text-gray-700">Preço Compra</th>
                            <th className="text-left p-3 font-medium text-gray-700">Total</th>
                            <th className="text-left p-3 font-medium text-gray-700">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((item) => (
                            <tr key={item.productId} className="border-b">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{item.icon}</span>
                                  <span>{item.productName}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <Input 
                                  type="number" 
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                                  className="w-20 text-center"
                                  min={1}
                                />
                              </td>
                              <td className="p-3">
                                {products.find(p => p.id === item.productId)?.unit || "Un"}
                              </td>
                              <td className="p-3">R$ {item.unitPrice.toFixed(2)}</td>
                              <td className="p-3 font-medium">R$ {item.total.toFixed(2)}</td>
                              <td className="p-3">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600"
                                  onClick={() => removeFromCart(item.productId)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                               </td>
                             </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhum produto adicionado</p>
                      <p className="text-sm">Clique em "Adicionar Produto" para começar</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#2D5016] text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg">Total da Compra</span>
                    <span className="text-3xl font-bold">
                      R$ {totalValue.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <Button 
                    className="w-full bg-white text-[#2D5016] hover:bg-gray-100 h-12 font-semibold"
                    onClick={handleSubmit}
                  >
                    Registrar Compra
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB HISTÓRICO DE COMPRAS */}
        <TabsContent value="historico" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  <div>
    <Label className="text-sm">Buscar por Fornecedor</Label>
    <div className="relative mt-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input 
        placeholder="Nome do fornecedor..." 
        className="pl-10" 
        value={historySearchTerm}
        onChange={(e) => setHistorySearchTerm(e.target.value)}
      />
    </div>
  </div>
  <div>
    <Label className="text-sm">Status</Label>
    <select 
      className="w-full mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
      value={historyStatusFilter}
      onChange={(e) => setHistoryStatusFilter(e.target.value as any)}
    >
      <option value="todos">Todos</option>
      <option value="pending">Pendentes</option>
      <option value="paid">Pagos</option>
      <option value="overdue">Vencidos</option>
    </select>
  </div>
  {/* ✅ NOVO FILTRO: Fornecedor Certificado */}
  <div>
    <Label className="text-sm">Fornecedor</Label>
    <select 
      className="w-full mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
      value={historyCertifiedFilter}
      onChange={(e) => setHistoryCertifiedFilter(e.target.value as any)}
    >
      <option value="todos">Todos</option>
      <option value="certificados">Apenas certificados</option>
    </select>
  </div>
  <div>
    <Label className="text-sm">Período</Label>
    <select 
      className="w-full mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
      value={historyDateFilter}
      onChange={(e) => setHistoryDateFilter(e.target.value as any)}
    >
      <option value="todos">Todos</option>
      <option value="hoje">Hoje</option>
      <option value="semana">Últimos 7 dias</option>
      <option value="mes">Último mês</option>
      <option value="personalizado">Personalizado</option>
    </select>
  </div>
  <div>
    <Label className="text-sm">Ordenar por</Label>
    <div className="flex gap-2 mt-1">
      <select 
        className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
        value={historySortBy}
        onChange={(e) => setHistorySortBy(e.target.value as any)}
      >
        <option value="data">Data</option>
        <option value="fornecedor">Fornecedor</option>
        <option value="valor">Valor</option>
        <option value="vencimento">Vencimento</option>
      </select>
      <button
        onClick={() => setHistorySortOrder(historySortOrder === "asc" ? "desc" : "asc")}
        className="px-3 py-2 border rounded-lg hover:bg-gray-50"
      >
        {historySortOrder === "asc" ? "↑" : "↓"}
      </button>
    </div>
  </div>
</div>
              {historyDateFilter === "personalizado" && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label className="text-sm">Data Inicial</Label>
                    <Input 
                      type="date" 
                      value={historyStartDate}
                      onChange={(e) => setHistoryStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Data Final</Label>
                    <Input 
                      type="date" 
                      value={historyEndDate}
                      onChange={(e) => setHistoryEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-col-1 md:grid-cols-2 gap-4">
            {filteredPurchases.map((purchase) => (
              <Card key={purchase.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="fle items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">Compra {purchase.id}</h3>
                        {getStatusBadge(purchase)}
                      </div>
                      <p className="text-gray-600"><strong>Fornecedor:</strong> {purchase.supplierName}</p>
                      <p className="text-gray-600"><strong>Data:</strong> {format(parseISO(purchase.date), "dd/MM/yyyy", { locale: ptBR })}</p>
                      <p className="text-gray-600"><strong>Vencimento:</strong> {format(parseISO(purchase.paymentDueDate), "dd/MM/yyyy", { locale: ptBR })}</p>
                      <p className="text-gray-600"><strong>Pagamento:</strong> {
                        purchase.paymentMethod === "pix" ? "PIX" : 
                        purchase.paymentMethod === "boleto" ? "Boleto" :
                        purchase.paymentMethod === "cartao" ? "Cartão" :
                        purchase.paymentMethod === "transferencia" ? "Transferência" : "Cheque"
                      }</p>
                      {purchase.notes && (
                        <p className="text-sm text-gray-500 mt-1">📝 {purchase.notes}</p>
                      )}
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedPurchase(purchase)}>
                          <Eye className="w-4 h-4" /> Ver produtos
                        </Button>
                        {purchase.paymentStatus !== "paid" && (
                          <Button variant="ghost" size="sm" className="gap-1 text-green-600" onClick={() => handleMarkAsPaid(purchase.id)}>
                            <Check className="w-4 h-4" /> Marcar pago
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#2D5016]">R$ {purchase.totalValue.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPurchases.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Truck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Nenhuma compra encontrada</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes da Compra */}
      <Dialog open={!!selectedPurchase} onOpenChange={() => setSelectedPurchase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Compra {selectedPurchase?.id}</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fornecedor</p>
                  <p className="font-medium">{selectedPurchase.supplierName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedPurchase)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data da Compra</p>
                  <p>{format(parseISO(selectedPurchase.date), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vencimento</p>
                  <p>{format(parseISO(selectedPurchase.paymentDueDate), "dd/MM/yyyy")}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Produtos</p>
                <div className="space-y-2">
                  {selectedPurchase.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">{item.quantity} x R$ {item.unitPrice.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold">R$ {item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-2xl font-bold text-[#2D5016]">R$ {selectedPurchase.totalValue.toFixed(2)}</p>
                </div>
              </div>

              {selectedPurchase.notes && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Observações:</p>
                  <p className="text-sm text-gray-600">{selectedPurchase.notes}</p>
                </div>
              )}

              {selectedPurchase.paymentStatus !== "paid" && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 mt-4"
                  onClick={() => {
                    handleMarkAsPaid(selectedPurchase.id);
                    setSelectedPurchase(null);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Marcar esta compra como Paga
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}