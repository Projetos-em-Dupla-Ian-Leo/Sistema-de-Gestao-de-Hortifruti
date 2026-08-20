import { useState, useMemo } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Package,
  AlertTriangle,
  Clock,
  Eye,
  X,
  Truck,
  Box,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { format, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Estoque() {
  const { products, getLowStockProducts, getExpiringProducts, adjustStock, getCurrentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [movementQuantity, setMovementQuantity] = useState(1);
  const [movementType, setMovementType] = useState<"entrada" | "saida">("entrada");
  const [movementReason, setMovementReason] = useState("");

  const currentUser = getCurrentUser();

  const lowStock = useMemo(() => getLowStockProducts(), [products]);
  const expiringSoon = useMemo(() => getExpiringProducts(), [products]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(p =>
      p.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleMovement = () => {
    if (!selectedProduct) return;
    if (movementQuantity <= 0) {
      alert("Quantidade deve ser maior que zero");
      return;
    }
    if (movementType === "saida" && movementQuantity > selectedProduct.stock) {
      alert(`Estoque insuficiente! Disponível: ${selectedProduct.stock}`);
      return;
    }

    const quantityChange = movementType === "entrada" ? movementQuantity : -movementQuantity;
    const reason = movementReason || (movementType === "entrada" ? "Ajuste manual - entrada" : "Ajuste manual - saída");
    

    adjustStock(selectedProduct.id, quantityChange);
    
    // Registro de auditoria (simulado no localStorage)
    const logs = JSON.parse(localStorage.getItem("shizen_stock_logs") || "[]");
    logs.unshift({
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: quantityChange,
      type: movementType,
      reason,
      userId: currentUser?.id,
      userName: currentUser?.name,
      date: new Date().toISOString(),
    });
    localStorage.setItem("shizen_stock_logs", JSON.stringify(logs.slice(0, 100)));

    alert(`${movementType === "entrada" ? "Entrada" : "Saída"} registrada com sucesso!`);
    setShowMovementModal(false);
    setSelectedProduct(null);
    setMovementQuantity(1);
    setMovementReason("");
  };

  const handleDiscardExpired = () => {
    if (!selectedProduct) return;
    const quantity = selectedProduct.stock;
    if (quantity === 0) return;
    if (confirm(`Descartar ${quantity} unidade(s) de ${selectedProduct.name} (motivo: vencido)?`)) {
      adjustStock(selectedProduct.id, -quantity);
      const logs = JSON.parse(localStorage.getItem("shizen_stock_logs") || "[]");
      logs.unshift({
        id: Date.now(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: -quantity,
        type: "saida",
        reason: "Descarte por vencimento",
        userId: currentUser?.id,
        userName: currentUser?.name,
        date: new Date().toISOString(),
      });
      localStorage.setItem("shizen_stock_logs", JSON.stringify(logs.slice(0, 100)));
      alert(`Produto descartado! Estoque atualizado.`);
      setShowExpiryModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Estoque</h1>
          <p className="text-gray-500">Controle de produtos, validades e movimentações</p>
        </div>
      </div>

      {/* Alertas de estoque baixo e vencimento */}
      {(lowStock.length > 0 || expiringSoon.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStock.length > 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-800">Estoque Baixo</p>
                    <p className="text-sm text-yellow-700">
                      {lowStock.length} produto(s) abaixo do mínimo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {expiringSoon.length > 0 && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-800">Produtos a Vencer</p>
                    <p className="text-sm text-orange-700">
                      {expiringSoon.length} produto(s) vencem em até 7 dias.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar produto (começa com)..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabela de produtos */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-700">Produto</th>
                <th className="text-left p-4 font-medium text-gray-700">Categoria</th>
                <th className="text-left p-4 font-medium text-gray-700">Unidade</th>
                <th className="text-left p-4 font-medium text-gray-700">Estoque</th>
                <th className="text-left p-4 font-medium text-gray-700">Validade</th>
                <th className="text-left p-4 font-medium text-gray-700">Situação</th>
                <th className="text-left p-4 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const isLow = product.stock <= product.minStock;
                const isExpired = product.validity && new Date(product.validity) < new Date();
                const daysToExpire = product.validity
                  ? differenceInDays(parseISO(product.validity), new Date())
                  : null;
                const isExpiringSoon = daysToExpire !== null && daysToExpire >= 0 && daysToExpire <= 7;

                return (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.icon}</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">{product.unit}</td>
                    <td className={`p-4 font-medium ${isLow ? "text-red-600" : ""}`}>
                      {product.stock}
                    </td>
                    <td className="p-4">
                      {product.validity ? (
                        <span className={isExpired ? "text-red-600" : isExpiringSoon ? "text-orange-600" : ""}>
                          {format(parseISO(product.validity), "dd/MM/yyyy")}
                          {!isExpired && daysToExpire !== null && daysToExpire <= 7 && (
                            <span className="text-xs ml-1">({daysToExpire} dias)</span>
                          )}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4">
                      {isExpired ? (
                        <Badge variant="danger" className="bg-red-100 text-red-700">Vencido</Badge>
                      ) : isLow ? (
                        <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Baixo</Badge>
                      ) : (
                        <Badge variant="success" className="bg-green-100 text-green-700">Normal</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setMovementType("entrada");
                            setMovementQuantity(1);
                            setMovementReason("");
                            setShowMovementModal(true);
                          }}
                          title="Dar entrada"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setMovementType("saida");
                            setMovementQuantity(1);
                            setMovementReason("");
                            setShowMovementModal(true);
                          }}
                          title="Dar saída"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        {isExpired && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowExpiryModal(true);
                            }}
                            title="Descartar vencido"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum produto encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de movimentação */}
      <Dialog open={showMovementModal} onOpenChange={setShowMovementModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {movementType === "entrada" ? "Dar entrada" : "Dar saída"} - {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                min={1}
                value={movementQuantity}
                onChange={(e) => setMovementQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label>Motivo (opcional)</Label>
              <Input
                placeholder="Ex: Ajuste de inventário, doação, quebra..."
                value={movementReason}
                onChange={(e) => setMovementReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowMovementModal(false)}>Cancelar</Button>
              <Button onClick={handleMovement} className="bg-[#2D5016]">Confirmar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de descarte de vencido */}
      <Dialog open={showExpiryModal} onOpenChange={setShowExpiryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descartar produto vencido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Produto: <strong>{selectedProduct?.name}</strong><br />
              Estoque atual: <strong>{selectedProduct?.stock}</strong> {selectedProduct?.unit}<br />
              Validade: {selectedProduct?.validity && format(parseISO(selectedProduct.validity), "dd/MM/yyyy")}
            </p>
            <p className="text-red-600 text-sm">
              ⚠️ Esta ação removerá todo o estoque deste produto.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowExpiryModal(false)}>Cancelar</Button>
              <Button onClick={handleDiscardExpired} className="bg-red-600 hover:bg-red-700">Descartar tudo</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}