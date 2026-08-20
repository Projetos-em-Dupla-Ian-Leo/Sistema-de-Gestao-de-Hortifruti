import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  Package,
  Settings,
  Users,
  Truck,
  LogOut,
  Bell,
  CheckCircle,
  ShoppingBag,
  AlertCircle,
  PackageCheck,
  Clock,
  CheckCheck,
  Trash2,
  User,
  Camera,
  X,
  Trash,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import logoShizen from "../../imports/cropped-logo_shizen-1.png";

// Menu items com permissões
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", permission: "view_dashboard" },
  { icon: Package, label: "Cadastro", path: "/dashboard/cadastro", permission: "*" },
  { icon: ShoppingCart, label: "Vendas", path: "/dashboard/vendas", permission: "seller" },
  { icon: Truck, label: "Compras", path: "/dashboard/compras", permission: "stock" },
  { icon: DollarSign, label: "Financeiro", path: "/dashboard/financeiro", permission: "financial" },
  { icon: Settings, label: "Configurações", path: "/dashboard/configuracoes", permission: "*" },
  { icon: Users, label: "Usuários", path: "/dashboard/usuarios", permission: "admin" },
];

// Ícones para notificações
const notificationIcons = {
  order_created: { icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-100" },
  order_paid: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-100" },
  purchase_created: { icon: PackageCheck, color: "text-purple-500", bg: "bg-purple-100" },
  purchase_paid: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-100" },
  low_stock: { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-100" },
  expiring_product: { icon: Clock, color: "text-orange-500", bg: "bg-orange-100" },
};

// Labels e emojis padrão por perfil
const roleConfig: Record<string, { label: string; color: string; defaultEmoji: string; bg: string }> = {
  admin: { label: "Administrador", color: "text-gray-600", defaultEmoji: "👤", bg: "bg-gray-100" },
  seller: { label: "Vendedor", color: "text-blue-600", defaultEmoji: "🛒", bg: "bg-blue-100" },
  stock: { label: "Gestor de Estoque", color: "text-green-600", defaultEmoji: "📦", bg: "bg-green-100" },
  financial: { label: "Financeiro", color: "text-orange-600", defaultEmoji: "💰", bg: "bg-orange-100" },
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    getCurrentUser, 
    updateUser, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications, 
    getUnreadCount,
    logout 
  } = useApp();
  
  const currentUser = getCurrentUser();
  const userRole = currentUser?.role || "admin";
  const roleInfo = roleConfig[userRole] || roleConfig.admin;
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const unreadCount = getUnreadCount();

  // Atualizar formulário quando usuário mudar
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser]);

  const getTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
  };

  const handleSaveProfile = () => {
    if (currentUser) {
      const updates: any = {
        name: profileForm.name,
        email: profileForm.email,
      };
      if (avatarPreview) {
        updates.avatar = avatarPreview;
      } else if (profileForm.avatar && profileForm.avatar !== roleInfo.defaultEmoji) {
        updates.avatar = profileForm.avatar;
      } else {
        updates.avatar = roleInfo.defaultEmoji;
      }
      updateUser(currentUser.id, updates);
      setEditingProfile(false);
      setProfileOpen(false);
      alert("Perfil atualizado com sucesso!");
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setProfileForm({ ...profileForm, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setProfileForm({ ...profileForm, avatar: roleInfo.defaultEmoji });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Filtrar menu por permissão
  const hasMenuPermission = (item: typeof menuItems[0]) => {
    if (userRole === "admin") return true;
    if (item.permission === "*") return true;
    if (item.permission === "admin") return false;
    if (item.permission === "view_dashboard") return userRole === "financial";
    if (item.permission === "seller") return userRole === "seller";
    if (item.permission === "stock") return userRole === "stock";
    if (item.permission === "financial") return userRole === "financial";
    return false;
  };

  const filteredMenuItems = menuItems.filter(hasMenuPermission);

  // Nome de exibição para o header (primeiro nome)
  const displayName = currentUser?.name?.split(" ")[0] || "Usuário";

  // Avatar a ser exibido
  const getDisplayAvatar = () => {
    if (avatarPreview) return avatarPreview;
    if (profileForm.avatar && profileForm.avatar !== roleInfo.defaultEmoji) return profileForm.avatar;
    if (currentUser?.avatar && currentUser.avatar !== roleInfo.defaultEmoji) return currentUser.avatar;
    return roleInfo.defaultEmoji;
  };

  const displayAvatar = getDisplayAvatar();
  const isEmojiAvatar = displayAvatar === roleInfo.defaultEmoji || (displayAvatar.length <= 2 && !displayAvatar.startsWith('data:image'));

  return (
    <div className="flex h-screen bg-[#F7F6F2] dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-[280px] bg-[#2D5016] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <img src={logoShizen} alt="Shizen Orgânicos" className="h-16 w-auto" />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => item.path !== "#" && navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-[88px] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-8 gap-6">
          {/* Notificações */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Notificações</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-[#2D5016] hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Marcar todas
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Limpar
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {!notifications || notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Nenhuma notificação</p>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const IconData = notificationIcons[notif.type as keyof typeof notificationIcons] || notificationIcons.order_created;
                      const Icon = IconData.icon;
                      return (
                        <div
                          key={notif.id}
                          className={`p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                            !notif.read ? "bg-green-50 dark:bg-green-900/20" : ""
                          }`}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.link) {
                              navigate(notif.link);
                            }
                            setNotificationsOpen(false);
                          }}
                        >
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-full ${IconData.bg} dark:bg-opacity-20`}>
                              <Icon className={`w-4 h-4 ${IconData.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{notif.message}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getTimeAgo(notif.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Perfil do Usuário */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors p-2"
            >
              <div className={`w-10 h-10 rounded-full ${roleInfo.bg} dark:bg-opacity-20 flex items-center justify-center text-xl overflow-hidden`}>
                {isEmojiAvatar ? (
                  <span className="text-xl">{displayAvatar}</span>
                ) : (
                  <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-white">{displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                {!editingProfile ? (
                  <>
                    <div className="p-4 border-b dark:border-gray-700 text-center">
                      <div className={`w-20 h-20 rounded-full ${roleInfo.bg} dark:bg-opacity-20 flex items-center justify-center text-4xl mx-auto mb-3 overflow-hidden`}>
                        {isEmojiAvatar ? (
                          <span className="text-4xl">{displayAvatar}</span>
                        ) : (
                          <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{currentUser?.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                      <p className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${roleInfo.bg} ${roleInfo.color} dark:bg-opacity-20`}>
                        {roleInfo.label}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => setEditingProfile(true)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User size={18} />
                        <span className="text-sm">Editar Perfil</span>
                      </button>
                      <hr className="my-2 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={18} />
                        <span className="text-sm">Sair</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Editar Perfil</h3>
                      <button onClick={() => setEditingProfile(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div className={`w-24 h-24 rounded-full ${roleInfo.bg} dark:bg-opacity-20 flex items-center justify-center text-4xl mx-auto mb-2 overflow-hidden`}>
                            {avatarPreview ? (
                              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : profileForm.avatar && profileForm.avatar !== roleInfo.defaultEmoji ? (
                              <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-4xl">{profileForm.avatar || roleInfo.defaultEmoji}</span>
                            )}
                          </div>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Camera size={14} className="text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                        <div className="flex justify-center mt-2">
                          <button
                            onClick={handleRemoveAvatar}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash size={12} />
                            Remover foto
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5016] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setEditingProfile(false)}
                          className="flex-1 px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 px-4 py-2 bg-[#2D5016] text-white rounded-lg hover:bg-[#1f3a10] transition-colors"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}