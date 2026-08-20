import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Users,
  Package,
  Truck,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { useApp, Product, Client, Supplier } from "../context/AppContext";

// ========== MODAL DE PRODUTO ==========
function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product?: Product;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const { validateProfitMargin } = useApp();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "Hortaliças",
    unit: product?.unit || "Un",
    price: product?.price || 0,
    cost: product?.cost || 0,
    stock: product?.stock || 0,
    minStock: product?.minStock || 10,
    icon: product?.icon || "🥬",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const marginValidation = validateProfitMargin(formData.cost, formData.price);

  const categories = ["Hortaliças", "Frutas", "Legumes", "Grãos", "Congelados", "Embalagens", "Despesas Comerciais"];
  const units = ["Un", "Kg", "g", "L", "ml", "Bandeja", "Pacote"];

  const emojiOptions = [
    "🥬", "🥗", "🥦", "🥑", "🍅", "🍆", "🥒", "🌽", "🥕", "🧄", "🧅",
    "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝", "🥭", "🥚", "🧀",
    "🐟", "🍗", "🥩", "📦", "🎁", "🏷️",
  ];
  const categoryEmojis: Record<string, string[]> = {
    "Hortaliças": ["🥬", "🥗", "🥦", "🥒", "🌿", "🍃", "🥑"],
    "Frutas": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝", "🥭"],
    "Legumes": ["🥕", "🍆", "🌽", "🧄", "🧅", "🥔", "🍠"],
    "Grãos": ["🌾", "🍚", "🌽", "🥜", "🌻"],
    "Congelados": ["🐟", "🍗", "🥩", "🧊"],
    "Embalagens": ["📦", "🎁", "🏷️", "📃", "🔖", "📎"],
    "Despesas Comerciais": ["💼", "📊", "💰", "📈", "🖨️", "📝"],
  };
  const suggestedEmojis = categoryEmojis[formData.category] || ["🥬", "🍅", "🍌", "📦"];

  const handleEmojiSelect = (emoji: string) => {
    setFormData({ ...formData, icon: emoji });
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">{product ? "Editar Produto" : "Novo Produto"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Ícone */}
          <div>
            <label className="text-sm font-medium dark:text-gray-300">Ícone (Emoji)</label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{formData.icon || "📦"}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Clique para escolher um ícone</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showEmojiPicker && (
                <div className="absolute z-50 mt-2 p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-lg w-full max-h-64 overflow-y-auto">
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">✨ Sugeridos para {formData.category}:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedEmojis.map(emoji => (
                        <button key={emoji} type="button" onClick={() => handleEmojiSelect(emoji)} className="w-10 h-10 text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t dark:border-gray-700 pt-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">📦 Todos os emojis:</p>
                    <div className="flex flex-wrap gap-2">
                      {emojiOptions.map(emoji => (
                        <button key={emoji} type="button" onClick={() => handleEmojiSelect(emoji)} className="w-10 h-10 text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center">
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium dark:text-gray-300">Nome *</label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Alface Crespa Orgânica" />
          </div>

          <div>
            <label className="text-sm font-medium dark:text-gray-300">Categoria</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium dark:text-gray-300">Unidade</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
              {units.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium dark:text-gray-300">Preço de Venda (R$)</label>
              <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm font-medium dark:text-gray-300">Custo (R$)</label>
              <Input type="number" step="0.01" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })} />
            </div>
          </div>

          {/* Alerta de margem mínima - RN02 */}
          {formData.cost > 0 && formData.price > 0 && (
            <div className={`p-3 rounded-lg ${marginValidation.isValid ? "bg-green-50" : "bg-yellow-50"} border`}>
              <div className="flex items-start gap-2">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${marginValidation.isValid ? "text-green-600" : "text-yellow-600"}`} />
                <div>
                  <p className={`text-sm font-medium ${marginValidation.isValid ? "text-green-800" : "text-yellow-800"}`}>
                    {marginValidation.message}
                  </p>
                  {!marginValidation.isValid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-xs"
                      onClick={() => setFormData({ ...formData, price: marginValidation.suggestedPrice })}
                    >
                      Aplicar preço sugerido
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium dark:text-gray-300">Estoque</label>
              <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm font-medium dark:text-gray-300">Estoque Mínimo</label>
              <Input type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={() => onSave(formData)} className="flex-1 bg-[#2D5016] hover:bg-[#1f3a10]">Salvar</Button>
        </div>
      </div>
    </div>
  );
}

// ========== MODAL DE CLIENTE ==========
function ClientModal({ client, onClose, onSave }: { client?: Client; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: client?.name || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
    notificationPreference: client?.notificationPreference || ("" as "" | "email" | "whatsapp"),
    notificationContact: client?.notificationContact || "",
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{client ? "Editar Cliente" : "Novo Cliente"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div><label className="text-sm font-medium">Nome</label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
          <div>
            <label className="text-sm font-medium">Canal de Notificação de Cobrança</label>
            <p className="text-xs text-gray-500 mb-1">Como este cliente prefere receber lembretes de pagamento?</p>
            <div className="grid grid-cols-3 gap-2">
            
              <button type="button" onClick={() => setFormData({ ...formData, notificationPreference: "whatsapp", notificationContact: formData.phone.replace(/\D/g, "") })} className={`p-2 rounded-lg border text-sm font-medium ${formData.notificationPreference === "whatsapp" ? "bg-green-600 text-white" : "bg-white text-gray-600"}`}>WhatsApp</button>
              <button type="button" onClick={() => setFormData({ ...formData, notificationPreference: "email", notificationContact: formData.email })} className={`p-2 rounded-lg border text-sm font-medium ${formData.notificationPreference === "email" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}>E-mail</button>
            </div>
            {formData.notificationPreference !== "" && (
              <div className="mt-2">
                <label className="text-sm font-medium">{formData.notificationPreference === "whatsapp" ? "Número do WhatsApp (apenas dígitos)" : "E-mail para notificações"}</label>
                <Input value={formData.notificationContact} onChange={(e) => setFormData({ ...formData, notificationContact: e.target.value })} placeholder={formData.notificationPreference === "whatsapp" ? "11987654321" : "cliente@email.com"} className="mt-1" />
              </div>
            )}
          </div>
          <div><label className="text-sm font-medium">Telefone</label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
          <div><label className="text-sm font-medium">E-mail</label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Endereço</label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={() => onSave({ ...formData, notificationPreference: formData.notificationPreference || undefined, notificationContact: formData.notificationContact || undefined })} className="flex-1 bg-[#2D5016]">Salvar</Button>
        </div>
      </div>
    </div>
  );
}

// ========== MODAL DE FORNECEDOR (com campo certified) ==========
function SupplierModal({ supplier, onClose, onSave }: { supplier?: Supplier; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: supplier?.name || "",
    address: supplier?.address || "",
    phone: supplier?.phone || "",
    email: supplier?.email || "",
    productType: supplier?.productType || "",
    cnpj: supplier?.cnpj || "",
    contactPerson: supplier?.contactPerson || "",
    notes: supplier?.notes || "",
    certified: supplier?.certified || false,
  });

  const productTypes = ["Hortaliças e Verduras", "Frutas", "Grãos e Cereais", "Laticínios", "Ovos", "Mel e Derivados", "Embalagens", "Outros"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{supplier ? "Editar Fornecedor" : "Novo Fornecedor"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div><label className="text-sm font-medium">Nome do Fornecedor *</label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Tipo de Produto *</label><select className="w-full px-3 py-2 border rounded-lg" value={formData.productType} onChange={(e) => setFormData({ ...formData, productType: e.target.value })}><option value="">Selecione...</option>{productTypes.map(type => <option key={type}>{type}</option>)}</select></div>
          <div><label className="text-sm font-medium">Telefone *</label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
          <div><label className="text-sm font-medium">E-mail</label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Endereço</label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
          <div><label className="text-sm font-medium">CNPJ (opcional)</label><Input value={formData.cnpj} onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Pessoa de Contato</label><Input value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} /></div>
          
          {/* ✅ Campo certificado */}
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="certified" checked={formData.certified} onChange={(e) => setFormData({ ...formData, certified: e.target.checked })} className="w-4 h-4" />
            <label htmlFor="certified" className="text-sm font-medium">Fornecedor certificado</label>
          </div>
          <p className="text-xs text-gray-500 -mt-2">Fornecedores certificados têm prioridade nas compras</p>
          
          <div><label className="text-sm font-medium">Observações</label><Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} /></div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={() => onSave(formData)} className="flex-1 bg-[#2D5016]">Salvar</Button>
        </div>
      </div>
    </div>
  );
}

// ========== PÁGINA PRINCIPAL DE CADASTRO ==========
export default function Cadastro() {
  const { products, clients, suppliers, addProduct, updateProduct, deleteProduct, addClient, updateClient, deleteClient, addSupplier, updateSupplier, deleteSupplier } = useApp();
  const [activeTab, setActiveTab] = useState("produtos");
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const categories = ["todas", "Hortaliças", "Frutas", "Legumes", "Grãos", "Congelados", "Embalagens", "Despesas Comerciais"];

  const filteredProducts = products.filter(p => {
    const matchesSearch = productSearchTerm === "" || p.name.toLowerCase().startsWith(productSearchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todas" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const filteredClients = clients.filter(c => clientSearchTerm === "" || c.name.toLowerCase().startsWith(clientSearchTerm.toLowerCase()));
  const filteredSuppliers = suppliers.filter(s => supplierSearchTerm === "" || s.name.toLowerCase().startsWith(supplierSearchTerm.toLowerCase()));

  const handleSaveProduct = (data: any) => {
    if (editingProduct) updateProduct(editingProduct.id, data);
    else addProduct(data);
    setShowProductModal(false);
    setEditingProduct(null);
  };
  const handleDeleteProduct = (id: string) => { if (confirm("Tem certeza?")) deleteProduct(id); };
  const handleSaveClient = (data: any) => {
    if (editingClient) updateClient(editingClient.id, data);
    else addClient(data);
    setShowClientModal(false);
    setEditingClient(null);
  };
  const handleDeleteClient = (id: string) => { if (confirm("Tem certeza?")) deleteClient(id); };
  const handleSaveSupplier = (data: any) => {
    if (editingSupplier) updateSupplier(editingSupplier.id, data);
    else addSupplier(data);
    setShowSupplierModal(false);
    setEditingSupplier(null);
  };
  const handleDeleteSupplier = (id: string) => { if (confirm("Tem certeza?")) deleteSupplier(id); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Cadastro</h1>
        <p className="text-gray-500">Gerencie produtos, clientes, fornecedores e estoque</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
        </TabsList>

        {/* PRODUTOS */}
        <TabsContent value="produtos" className="space-y-4 mt-4">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Buscar produto" className="pl-10" value={productSearchTerm} onChange={(e) => setProductSearchTerm(e.target.value)} /></div>
            <select className="px-4 py-2 border rounded-lg bg-white" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>{categories.map(cat => <option key={cat} value={cat}>{cat === "todas" ? "Todas categorias" : cat}</option>)}</select>
            <Button className="bg-[#2D5016] gap-2" onClick={() => { setEditingProduct(null); setShowProductModal(true); }}><Plus className="w-4 h-4" /> Novo Produto</Button>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b bg-gray-50"><th className="text-left p-4">Produto</th><th className="text-left p-4">Categoria</th><th className="text-left p-4">Unidade</th><th className="text-left p-4">Preço</th><th className="text-left p-4">Estoque</th><th className="text-left p-4">Status</th><th className="text-left p-4">Ações</th></tr></thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const isLowStock = product.stock <= product.minStock;
                    return (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="p-4"><div className="flex items-center gap-3"><span className="text-2xl">{product.icon}</span><span className="font-medium">{product.name}</span></div></td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">{product.unit}</td>
                        <td className="p-4 font-medium text-green-600">R$ {product.price.toFixed(2)}</td>
                        <td className="p-4"><span className={isLowStock ? "text-red-600" : ""}>{product.stock}</span></td>
                        <td className="p-4">{isLowStock ? <Badge variant="warning">Baixo estoque</Badge> : <Badge variant="success">Normal</Badge>}</td>
                        <td className="p-4"><div className="flex gap-2"><Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingProduct(product); setShowProductModal(true); }}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="w-4 h-4" /></Button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
          {filteredProducts.length === 0 && productSearchTerm !== "" && <div className="text-center py-8 text-gray-500">Nenhum produto encontrado começando com "{productSearchTerm}"</div>}
        </TabsContent>

        {/* CLIENTES */}
        <TabsContent value="clientes" className="space-y-4 mt-4">
          <div className="flex gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Buscar cliente" className="pl-10" value={clientSearchTerm} onChange={(e) => setClientSearchTerm(e.target.value)} /></div>
            <Button className="bg-[#2D5016] gap-2" onClick={() => { setEditingClient(null); setShowClientModal(true); }}><Plus className="w-4 h-4" /> Novo Cliente</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map(client => (
              <Card key={client.id} className="hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#2D5016] flex items-center justify-center text-white font-bold text-lg">{client.name.charAt(0)}</div><div><p className="font-semibold">{client.name}</p><p className="text-xs text-gray-500">{client.phone}</p></div></div></div>
                  <p className="text-sm text-gray-600 mb-1 truncate">{client.email}</p>
                  <p className="text-sm text-gray-500 truncate">{client.address}</p>
                  {client.notificationPreference && <div className="flex items-center gap-1 mt-1">{client.notificationPreference === "whatsapp" ? <MessageCircle className="w-3 h-3 text-green-600" /> : <Mail className="w-3 h-3 text-blue-600" />}<span className="text-xs text-gray-400">Notif. via {client.notificationPreference === "whatsapp" ? "WhatsApp" : "E-mail"}</span></div>}
                  <div className="mt-3 pt-3 border-t flex gap-2"><Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingClient(client); setShowClientModal(true); }}><Edit className="w-3 h-3 mr-1" /> Editar</Button><Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteClient(client.id)}><Trash2 className="w-3 h-3" /></Button></div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredClients.length === 0 && clientSearchTerm !== "" && <div className="text-center py-8 text-gray-500">Nenhum cliente encontrado começando com "{clientSearchTerm}"</div>}
        </TabsContent>

        {/* FORNECEDORES */}
        <TabsContent value="fornecedores" className="space-y-4 mt-4">
          <div className="flex gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Buscar fornecedor" className="pl-10" value={supplierSearchTerm} onChange={(e) => setSupplierSearchTerm(e.target.value)} /></div>
            <Button className="bg-[#2D5016] gap-2" onClick={() => { setEditingSupplier(null); setShowSupplierModal(true); }}><Plus className="w-4 h-4" /> Novo Fornecedor</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSuppliers.map(supplier => (
              <Card key={supplier.id} className="hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2D5016] flex items-center justify-center text-white"><Truck className="w-5 h-5" /></div>
                      <div>
                        <p className="font-semibold">{supplier.name}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{supplier.productType}</Badge>
                          {supplier.certified && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">Certificado</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600"><Phone className="w-3 h-3" /><span>{supplier.phone}</span></div>
                    {supplier.email && <div className="flex items-center gap-2 text-gray-600"><Mail className="w-3 h-3" /><span className="truncate">{supplier.email}</span></div>}
                    {supplier.address && <div className="flex items-center gap-2 text-gray-500 text-xs"><MapPin className="w-3 h-3" /><span className="truncate">{supplier.address}</span></div>}
                    {supplier.contactPerson && <div className="flex items-center gap-2 text-gray-500 text-xs"><User className="w-3 h-3" /><span>Contato: {supplier.contactPerson}</span></div>}
                    {supplier.notes && <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-500">📝 {supplier.notes}</div>}
                  </div>
                  <div className="mt-3 pt-3 border-t flex gap-2"><Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingSupplier(supplier); setShowSupplierModal(true); }}><Edit className="w-3 h-3 mr-1" /> Editar</Button><Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteSupplier(supplier.id)}><Trash2 className="w-3 h-3" /></Button></div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredSuppliers.length === 0 && supplierSearchTerm !== "" && <div className="text-center py-8 text-gray-500">Nenhum fornecedor encontrado começando com "{supplierSearchTerm}"</div>}
        </TabsContent>
      </Tabs>

      {showProductModal && <ProductModal product={editingProduct || undefined} onClose={() => { setShowProductModal(false); setEditingProduct(null); }} onSave={handleSaveProduct} />}
      {showClientModal && <ClientModal client={editingClient || undefined} onClose={() => { setShowClientModal(false); setEditingClient(null); }} onSave={handleSaveClient} />}
      {showSupplierModal && <SupplierModal supplier={editingSupplier || undefined} onClose={() => { setShowSupplierModal(false); setEditingSupplier(null); }} onSave={handleSaveSupplier} />}
    </div>
  );
}