import { useState, useMemo, useEffect } from "react";
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
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Shield,
  UserCog,
  ShoppingBag,
  Package,
  DollarSign,
  Users,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Clock,
  Mail,
  Phone,
  Calendar,
  Eye,
  Filter
} from "lucide-react";
import { useApp, User, UserRole } from "../context/AppContext";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Modal de usuário
function UserModal({ 
  user, 
  onClose, 
  onSave 
}: { 
  user?: User; 
  onClose: () => void; 
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
    role: user?.role || "seller",
    status: user?.status || "active",
  });

  const roles = [
    { value: "admin", label: "Administrador", icon: Shield, description: "Acesso total ao sistema" },
    { value: "seller", label: "Vendedor", icon: ShoppingBag, description: "Vendas, clientes e pedidos" },
    { value: "stock", label: "Estoque", icon: Package, description: "Estoque, compras e produtos" },
    { value: "financial", label: "Financeiro", icon: DollarSign, description: "Relatórios e finanças" },
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert("Nome e e-mail são obrigatórios!");
      return;
    }
    if (!user && !formData.password) {
      alert("Senha é obrigatória para novo usuário!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const saveData = {
      name: formData.name,
      email: formData.email,
      password: formData.password || (user?.password || ""),
      role: formData.role as UserRole,
      status: formData.status as 'active' | 'inactive',
    };
    onSave(saveData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Alterado de max-w-md para max-w-lg para dar mais largura lateral */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">{user ? "Editar Usuário" : "Novo Usuário"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium dark:text-gray-300">Nome *</label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nome completo"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium dark:text-gray-300">E-mail *</label>
            <Input 
              type="email"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="usuario@shizen.com"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium dark:text-gray-300">Senha {!user && "*"}</label>
            <Input 
              type="password"
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder={user ? "Deixe em branco para manter a mesma" : "********"}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium dark:text-gray-300">Confirmar Senha</label>
            <Input 
              type="password"
              value={formData.confirmPassword} 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Digite a senha novamente"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium dark:text-gray-300">Perfil de Acesso</label>
            <select 
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label} - {role.description}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium dark:text-gray-300">Status</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="active"
                  checked={formData.status === "active"}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'active'})}
                  className="w-4 h-4"
                />
                <span className="text-sm dark:text-gray-300">Ativo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="inactive"
                  checked={formData.status === "inactive"}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'inactive'})}
                  className="w-4 h-4"
                />
                <span className="text-sm dark:text-gray-300">Inativo</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={handleSubmit} className="flex-1 bg-[#2D5016] hover:bg-[#1f3a10]">Salvar</Button>
        </div>
      </div>
    </div>
  );
}

// Modal de detalhes do usuário
function UserDetailsModal({ user, onClose }: { user: User; onClose: () => void }) {
  const roleInfo = {
    admin: { label: "Administrador", icon: Shield, color: "text-purple-600", bg: "bg-purple-100" },
    seller: { label: "Vendedor", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    stock: { label: "Estoque", icon: Package, color: "text-green-600", bg: "bg-green-100" },
    financial: { label: "Financeiro", icon: DollarSign, color: "text-orange-600", bg: "bg-orange-100" },
  };
  const info = roleInfo[user.role];
  const Icon = info.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Alterado de max-w-md para max-w-lg para dar mais largura lateral */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Detalhes do Usuário</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-5 h-5 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className={`w-20 h-20 rounded-full ${info.bg} flex items-center justify-center`}>
              <Icon className={`w-10 h-10 ${info.color}`} />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-bold dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
          
          <div className="border-t dark:border-gray-700 pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Perfil</span>
              <Badge className={`${info.bg} ${info.color}`}>{info.label}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              {user.status === "active" ? (
                <Badge variant="success" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Ativo</Badge>
              ) : (
                <Badge variant="danger" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Inativo</Badge>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Criado em</span>
              <span className="text-sm dark:text-gray-300">{format(parseISO(user.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
            </div>
            {user.lastLogin && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Último acesso</span>
                <span className="text-sm dark:text-gray-300">{format(parseISO(user.lastLogin), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t dark:border-gray-700">
            <h4 className="text-sm font-semibold dark:text-white mb-2">Permissões:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {user.role === "admin" && (
                <>
                  <li>✅ Acesso total ao sistema</li>
                  <li>✅ Gerenciar usuários</li>
                  <li>✅ Ver todas as seções</li>
                </>
              )}
              {user.role === "seller" && (
                <>
                  <li>✅ Visualizar produtos</li>
                  <li>✅ Visualizar clientes</li>
                  <li>✅ Criar e gerenciar pedidos</li>
                  <li>✅ Visualizar histórico de vendas</li>
                </>
              )}
              {user.role === "stock" && (
                <>
                  <li>✅ Gerenciar produtos</li>
                  <li>✅ Controlar estoque</li>
                  <li>✅ Registrar compras</li>
                  <li>✅ Gerenciar fornecedores</li>
                </>
              )}
              {user.role === "financial" && (
                <>
                  <li>✅ Visualizar relatórios financeiros</li>
                  <li>✅ Acompanhar contas a receber/pagar</li>
                  <li>✅ Exportar dados financeiros</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">Fechar</Button>
        </div>
      </div>
    </div>
  );
}

export default function Usuarios() {
  const { users, addUser, updateUser, deleteUser, getCurrentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  // Altera os dados da Ana para Inativa, Financeiro e atualiza seu último acesso
// Configura a Ana como Financeiro apenas UMA VEZ (quando o componente monta pela primeira vez)
useEffect(() => {
  // Usar uma flag no localStorage para executar apenas uma vez
  const hasConfiguredAna = localStorage.getItem('shizen_ana_configured');
  
  if (!hasConfiguredAna) {
    const ana = users.find(u => u.name.toLowerCase().includes("ana"));
    if (ana && (ana.role !== "financial" || ana.status !== "active")) {
      updateUser(ana.id, {
        role: "financial",
        status: "active",
        lastLogin: new Date().toISOString()
      });
      localStorage.setItem('shizen_ana_configured', 'true');
    }
  }
}, [users, updateUser]);

  // Filtrar usuários e deletar/remover o "Usuário Teste" da listagem
  const filteredUsers = useMemo(() => {
    // Remove "Usuário Teste" diretamente no filtro inicial
    let filtered = users.filter(u => u.name !== "Usuário Teste");
    
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== "todos") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    if (statusFilter !== "todos") {
      filtered = filtered.filter(u => u.status === statusFilter);
    }
    
    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleSaveUser = (data: any) => {
    if (editingUser) {
      updateUser(editingUser.id, data);
      alert("Usuário atualizado com sucesso!");
    } else {
      addUser(data);
      alert("Usuário criado com sucesso!");
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const actionVerb = newStatus === "active" ? "ativar" : "desativar";
    const actionPast = newStatus === "active" ? "ativado" : "desativado";
    if (confirm(`Tem certeza que deseja ${actionVerb} o usuário ${user.name}?`)) {
      updateUser(user.id, { status: newStatus });
      alert(`Usuário ${actionPast} com sucesso!`);
    }
  };

  const roleColors = {
    admin: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", label: "Administrador" },
    seller: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: "Vendedor" },
    stock: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", label: "Estoque" },
    financial: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", label: "Financeiro" },
  };

  const stats = {
    total: users.filter(u => u.name !== "Usuário Teste").length,
    active: users.filter(u => u.status === "active" && u.name !== "Usuário Teste").length,
    inactive: users.filter(u => u.status === "inactive" && u.name !== "Usuário Teste").length,
    byRole: {
      admin: users.filter(u => u.role === "admin" && u.name !== "Usuário Teste").length,
      seller: users.filter(u => u.role === "seller" && u.name !== "Usuário Teste").length,
      stock: users.filter(u => u.role === "stock" && u.name !== "Usuário Teste").length,
      financial: users.filter(u => u.role === "financial" && u.name !== "Usuário Teste").length,
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Acesso Negado</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Apenas administradores podem gerenciar usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold dark:text-white">Usuários</h1>
          <p className="text-gray-500 dark:text-gray-400">Gerencie os acessos ao sistema</p>
        </div>
        <Button className="bg-[#2D5016] hover:bg-[#1f3a10] gap-2" onClick={() => { setEditingUser(null); setShowUserModal(true); }}>
          <Plus className="w-4 h-4" /> Novo Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Usuários</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.active}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ativos</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 mx-auto text-red-600 dark:text-red-400 mb-2" />
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.inactive}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Inativos</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.byRole.admin}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Administradores</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Buscar por nome ou e-mail..." 
            className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="todos">Todos os perfis</option>
          <option value="admin">Administradores</option>
          <option value="seller">Vendedores</option>
          <option value="stock">Estoque</option>
          <option value="financial">Financeiro</option>
        </select>
        <select 
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="todos">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {/* Lista de Usuários - Cards com tamanho e espaçamento adequados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const roleColor = roleColors[user.role];
          const isCurrentUser = currentUser?.id === user.id;
          
          return (
            <Card key={user.id} className="hover:shadow-md transition-shadow flex flex-col justify-between min-h-[260px]">
              <CardContent className="p-6 flex flex-col justify-between h-full w-full">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full ${roleColor.bg} flex items-center justify-center shrink-0`}>
                        <UserCog className={`w-7 h-7 ${roleColor.text}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-lg dark:text-white truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-700 shrink-0">Você</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`${roleColor.bg} ${roleColor.text}`}>{roleColor.label}</Badge>
                    {user.status === "active" ? (
                      <Badge variant="success" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Ativo</Badge>
                    ) : (
                      <Badge variant="danger" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Inativo</Badge>
                    )}
                  </div>
                  
                  {user.lastLogin && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-4">
                      <Clock className="w-3 h-3" />
                      <span>Último acesso: {format(parseISO(user.lastLogin), "dd/MM/yyyy HH:mm")}</span>
                    </div>
                  )}
                </div>
                
                {/* Container de Ações Melhorado: Flex-wrap impede estouros */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t dark:border-gray-700 mt-auto w-full justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-[75px] text-xs h-9 px-2"
                    onClick={() => setViewingUser(user)}
                  >
                    <Eye className="w-3 h-3 mr-1 shrink-0" /> Detalhes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 min-w-[65px] text-xs h-9 px-2"
                    onClick={() => { setEditingUser(user); setShowUserModal(true); }}
                  >
                    <Edit className="w-3 h-3 mr-1 shrink-0" /> Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`flex-1 min-w-[80px] text-xs h-9 px-2 ${user.status === "active" ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"}`}
                    onClick={() => handleToggleStatus(user)}
                    disabled={isCurrentUser}
                  >
                    {user.status === "active" ? (
                      <>
                        <Lock className="w-3 h-3 mr-1 shrink-0" /> Desativar
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 mr-1 shrink-0" /> Ativar
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 h-9 w-9 p-0 shrink-0"
                    onClick={() => {
                      if (confirm(`Excluir permanentemente o usuário ${user.name}?`)) {
                        deleteUser(user.id);
                      }
                    }}
                    disabled={isCurrentUser}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && searchTerm !== "" && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Nenhum usuário encontrado para "{searchTerm}"
        </div>
      )}

      {/* Modals */}
      {showUserModal && (
        <UserModal 
          user={editingUser || undefined} 
          onClose={() => { setShowUserModal(false); setEditingUser(null); }} 
          onSave={handleSaveUser} 
        />
      )}
      {viewingUser && (
        <UserDetailsModal 
          user={viewingUser} 
          onClose={() => setViewingUser(null)} 
        />
      )}
    </div>
  );
}