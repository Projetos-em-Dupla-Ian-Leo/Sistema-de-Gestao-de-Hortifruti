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
import { Plus, Search, Trash2, Package as PackageIcon, Eye, Check, Filter, HandCoins, UserCheck, Users } from "lucide-react";
import { useApp, Client, Product, Order } from "../context/AppContext";
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

export default function Vendas() {
  const { products, clients, orders, addOrder, updateOrderPaymentStatus, getCurrentUser, users } = useApp();
  const [activeTab, setActiveTab] = useState("novo");
  
  // Estados do pedido
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [selectedSellerId, setSelectedSellerId] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [paymentDueDate, setPaymentDueDate] = useState("");
  const [clientObservation, setClientObservation] = useState("");
  const [internalObservation, setInternalObservation] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
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
  const [historySortBy, setHistorySortBy] = useState<"data" | "cliente" | "valor" | "vencimento">("data");
  const [historySortOrder, setHistorySortOrder] = useState<"asc" | "desc">("desc");
  const [historySellerFilter, setHistorySellerFilter] = useState<string>("todos");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Vendedores ativos
  const activeSellers = useMemo(() => {
    return users.filter(u => u.role === "seller" && u.status === "active");
  }, [users]);

  // Clientes filtrados
  const filteredClients = useMemo(() => {
    if (!clientSearchTerm) return clients;
    return clients.filter(c => 
      c.name.toLowerCase().startsWith(clientSearchTerm.toLowerCase())
    );
  }, [clients, clientSearchTerm]);

  // Produtos filtrados
  const filteredProducts = useMemo(() => {
    if (!productSearchTerm) return products;
    return products.filter(p => 
      p.name.toLowerCase().startsWith(productSearchTerm.toLowerCase())
    );
  }, [products, productSearchTerm]);

  // Verificar se pedido está vencido
  const isOverdue = (order: Order) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = parseISO(order.paymentDueDate);
    dueDate.setHours(0, 0, 0, 0);
    return order.paymentStatus !== "paid" && isBefore(dueDate, today);
  };

  // Obter status correto para filtro
  const getOrderStatusForFilter = (order: Order): "pending" | "paid" | "overdue" => {
    if (order.paymentStatus === "paid") return "paid";
    if (isOverdue(order)) return "overdue";
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

  // Pedidos filtrados
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    
    if (historySearchTerm) {
      filtered = filtered.filter(o => 
        o.clientName.toLowerCase().startsWith(historySearchTerm.toLowerCase())
      );
    }
    
    if (historyStatusFilter !== "todos") {
      filtered = filtered.filter(o => getOrderStatusForFilter(o) === historyStatusFilter);
    }
    
     if (historySellerFilter !== "todos") {
    filtered = filtered.filter(o => o.sellerId === historySellerFilter);
  }
    
    const dateInterval = getDateFilterInterval();
    if (dateInterval) {
      filtered = filtered.filter(o => {
        const orderDate = parseISO(o.date);
        return isWithinInterval(orderDate, { start: dateInterval.start, end: dateInterval.end });
      });
    }
    
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (historySortBy) {
        case "data":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "cliente":
          comparison = a.clientName.localeCompare(b.clientName);
          break;
        case "valor":
          comparison = a.totalValue - b.totalValue;
          break;
        case "vencimento":
          comparison = new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime();
          break;
      }
      return historySortOrder === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  }, [orders, historySearchTerm, historyStatusFilter, historyDateFilter, historyStartDate, historyEndDate, historySortBy, historySortOrder]);

  const totalValue = cartItems.reduce((acc, item) => acc + item.total, 0);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    if (product.stock < quantity) {
      alert(`Estoque insuficiente! Disponível: ${product.stock} ${product.unit}`);
      return;
    }
    
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
        unitPrice: product.price,
        total: product.price * quantity,
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
    const product = products.find(p => p.id === productId);
    if (product && product.stock < newQuantity) {
      alert(`Estoque insuficiente! Disponível: ${product.stock} ${product.unit}`);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
        : item
    ));
  };

  const handleMarkAsPaid = (orderId: string) => {
    if (confirm("Marcar este pedido como pago? Isso atualizará o Dashboard e o Financeiro.")) {
      updateOrderPaymentStatus(orderId, "paid");
      alert("Pedido marcado como pago com sucesso!");
    }
  };

  const handleSubmit = () => {
    if (!selectedClient) {
      alert("Selecione um cliente!");
      return;
    }
    if (!selectedSellerId) {
      alert("Selecione o vendedor responsável pela venda!");
      return;
    }
    if (cartItems.length === 0) {
      alert("Adicione produtos ao pedido!");
      return;
    }
    if (!paymentDueDate && paymentMethod !== "fiado") {
      alert("Informe a data de vencimento do pagamento!");
      return;
    }

    const orderCount = orders.length + 1;
    const newId = `ORD-${String(orderCount).padStart(3, '0')}`;
    
    const selectedSeller = activeSellers.find(s => s.id === selectedSellerId);

    const newOrder = {
      id: newId,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      date: new Date().toISOString().split("T")[0],
      scheduledDate: scheduledDate || undefined,
      items: cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      totalValue: totalValue,
      paymentStatus: "pending" as const,
      paymentDueDate: paymentMethod === "fiado" ? "9999-12-31" : paymentDueDate,
      paymentMethod: paymentMethod,
      clientObservation: clientObservation || undefined,
      internalObservation: internalObservation || undefined,
      sellerId: selectedSellerId,
      sellerName: selectedSeller?.name,
    };

    addOrder(newOrder);
    
    setSelectedClient(null);
    setSelectedSellerId("");
    setCartItems([]);
    setPaymentMethod("pix");
    setPaymentDueDate("");
    setClientObservation("");
    setInternalObservation("");
    setScheduledDate("");
    setClientSearchTerm("");
    
    alert(`Pedido realizado com sucesso! Vendedor: ${selectedSeller?.name}`);
  };

  const getStatusBadge = (order: Order) => {
    if (order.paymentStatus === "paid") {
      return <Badge variant="success" className="bg-green-100 text-green-700">Pago</Badge>;
    }
    if (order.paymentMethod === "fiado") {
      return <Badge className="bg-amber-100 text-amber-700">Fiado (sem vencimento)</Badge>;
    }
    if (isOverdue(order)) {
      const days = differenceInDays(new Date(), parseISO(order.paymentDueDate));
      return <Badge variant="danger" className="bg-red-100 text-red-700">Vencido há {days} dias</Badge>;
    }
    const daysLeft = differenceInDays(parseISO(order.paymentDueDate), new Date());
    if (daysLeft < 0) {
      return <Badge variant="danger" className="bg-red-100 text-red-700">Vencido</Badge>;
    }
    return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Pendente ({daysLeft} dias)</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold dark:text-white">Vendas</h1>
        <p className="text-gray-500 dark:text-gray-400">Gerencie seus pedidos e histórico de vendas</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="novo">Novo Pedido</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Pedidos</TabsTrigger>
        </TabsList>

        {/* TAB NOVO PEDIDO */}
        <TabsContent value="novo" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold">Cliente</h3>
                    </div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder="Buscar cliente" 
                      className="pl-10" 
                      value={clientSearchTerm}
                      onChange={(e) => setClientSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedClient?.id === client.id
                            ? "bg-[#2D5016] text-white"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedClient(client)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                            selectedClient?.id === client.id ? "bg-white/20" : "bg-[#2D5016]/10"
                          }`}>
                            {client.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{client.name}</p>
                            <p className={`text-sm ${selectedClient?.id === client.id ? "text-white/80" : "text-gray-500"}`}>
                              {client.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedClient && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">Cliente selecionado:</p>
                      <p className="font-semibold">{selectedClient.name}</p>
                      <p className="text-sm text-gray-600">{selectedClient.email}</p>
                      <p className="text-sm text-gray-600">{selectedClient.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* NOVO CARD: VENDEDOR RESPONSÁVEL */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    Vendedor Responsável
                  </h3>
                  <div className="space-y-2">
                    {activeSellers.length > 0 ? (
                      activeSellers.map((seller) => (
                        <div
                          key={seller.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedSellerId === seller.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedSellerId(seller.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                              selectedSellerId === seller.id ? "bg-white/20" : "bg-blue-100"
                            }`}>
                              {seller.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{seller.name}</p>
                              <p className={`text-sm ${selectedSellerId === seller.id ? "text-white/80" : "text-gray-500"}`}>
                                {seller.email}
                              </p>
                            </div>
                            {selectedSellerId === seller.id && (
                              <Check className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhum vendedor ativo cadastrado</p>
                        <p className="text-sm">Cadastre vendedores em Cadastro → Usuários</p>
                      </div>
                    )}
                  </div>
                  {selectedSellerId && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Vendedor selecionado:</p>
                      <p className="font-semibold">{activeSellers.find(s => s.id === selectedSellerId)?.name}</p>
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
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                      <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="fiado">Fiado (Sem data definida)</SelectItem>
                    </SelectContent>
                  </Select>

                  {paymentMethod !== "fiado" ? (
                    <div>
                      <Label>Data de Vencimento</Label>
                      <Input
                        type="date"
                        value={paymentDueDate}
                        onChange={(e) => setPaymentDueDate(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                      <HandCoins className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Venda no Fiado</p>
                        <p className="text-xs text-amber-600">Sem data de vencimento definida. O pedido ficará na seção de Fiado no Financeiro.</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Agendar Entrega (opcional)</Label>
                    <Input 
                      type="date" 
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <Label>Observações do Cliente</Label>
                  <Textarea
                    placeholder="Ex: Sem cebola na salada, embalagem para presente..."
                    rows={3}
                    value={clientObservation}
                    onChange={(e) => setClientObservation(e.target.value)}
                  />
                  <Label>Observações Internas</Label>
                  <Textarea
                    placeholder="Ex: Cliente VIP, desconto especial..."
                    rows={2}
                    value={internalObservation}
                    onChange={(e) => setInternalObservation(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Itens do Pedido</h3>
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
                                      R$ {product.price.toFixed(2)} | Estoque: {product.stock} {product.unit}
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
                                    max={selectedProduct.stock}
                                    value={productQuantity}
                                    onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
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
                                Estoque disponível: {selectedProduct.stock} {selectedProduct.unit}
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
                            <th className="text-left p-3 font-medium text-gray-700">Preço</th>
                            <th className="text-left p-3 font-medium text-gray-700">Total</th>
                            <th className="text-left p-3 font-medium text-gray-700"></th>
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
                      <PackageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nenhum produto adicionado</p>
                      <p className="text-sm">Clique em "Adicionar Produto" para começar</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#2D5016] text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg">Total do Pedido</span>
                    <span className="text-3xl font-bold">
                      R$ {totalValue.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <Button 
                    className="w-full bg-white text-[#2D5016] hover:bg-gray-100 h-12 font-semibold"
                    onClick={handleSubmit}
                  >
                    Finalizar Pedido
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB HISTÓRICO DE PEDIDOS */}
        <TabsContent value="historico" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
  <div>
    <Label className="text-sm">Buscar por Cliente</Label>
    <div className="relative mt-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input 
        placeholder="Nome do cliente..." 
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
  {/* ✅ NOVO FILTRO: Vendedor */}
  <div>
    <Label className="text-sm">Vendedor</Label>
    <select 
      className="w-full mt-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
      value={historySellerFilter}
      onChange={(e) => setHistorySellerFilter(e.target.value)}
    >
      <option value="todos">Todos os vendedores</option>
      {activeSellers.map(seller => (
        <option key={seller.id} value={seller.id}>{seller.name}</option>
      ))}
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
        <option value="cliente">Cliente</option>
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
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">Pedido {order.id}</h3>
                        {getStatusBadge(order)}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600"><strong>Cliente:</strong> {order.clientName}</p>
                      {order.sellerName && (
                        <p className="text-gray-600"><strong>Vendedor:</strong> {order.sellerName}</p>
                      )}
                      <p className="text-gray-600"><strong>Data:</strong> {format(parseISO(order.date), "dd/MM/yyyy", { locale: ptBR })}</p>
                      <p className="text-gray-600"><strong>Vencimento:</strong> {order.paymentMethod === "fiado" ? "Sem data definida" : format(parseISO(order.paymentDueDate), "dd/MM/yyyy", { locale: ptBR })}</p>
                      <p className="text-gray-600"><strong>Pagamento:</strong> {
                        order.paymentMethod === "pix" ? "PIX" :
                        order.paymentMethod === "cartao" ? "Cartão Crédito" :
                        order.paymentMethod === "cartao_debito" ? "Cartão Débito" :
                        order.paymentMethod === "dinheiro" ? "Dinheiro" :
                        order.paymentMethod === "fiado" ? "Fiado" :
                        order.paymentMethod === "boleto" ? "Boleto" : order.paymentMethod
                      }</p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => setSelectedOrder(order)}>
                          <Eye className="w-4 h-4" /> Ver produtos
                        </Button>
                        {order.paymentStatus !== "paid" && (
                          <Button variant="ghost" size="sm" className="gap-1 text-green-600" onClick={() => handleMarkAsPaid(order.id)}>
                            <Check className="w-4 h-4" /> Marcar pago
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#2D5016]">R$ {order.totalValue.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <PackageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Nenhum pedido encontrado</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes do Pedido */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{selectedOrder.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedOrder)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data do Pedido</p>
                  <p>{format(parseISO(selectedOrder.date), "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vencimento</p>
                  <p>{selectedOrder.paymentMethod === "fiado" ? "Sem data definida" : format(parseISO(selectedOrder.paymentDueDate), "dd/MM/yyyy")}</p>
                </div>
                {selectedOrder.sellerName && (
                  <div>
                    <p className="text-sm text-gray-500">Vendedor</p>
                    <p className="font-medium">{selectedOrder.sellerName}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Produtos</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
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
                  <p className="text-2xl font-bold text-[#2D5016]">R$ {selectedOrder.totalValue.toFixed(2)}</p>
                </div>
              </div>

              {selectedOrder.paymentStatus !== "paid" && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 mt-4"
                  onClick={() => {
                    handleMarkAsPaid(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Marcar este pedido como Pago
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}