import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Package, 
  Users, 
  DollarSign, 
  Check, 
  AlertCircle,
  ArrowRight,
  Clock,
  AlertTriangle,
  Truck,
  Receipt,
  Calendar,
  Eye,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { format, parseISO, startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths, subYears, isWithinInterval, isAfter, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { products, orders, clients, purchases, users, getLowStockProducts, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [periodType, setPeriodType] = useState<"all" | "month" | "quarter" | "year">("all");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ✅ RN08 – Notificação de pagamentos pendentes há mais de 15 dias
  useEffect(() => {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    fifteenDaysAgo.setHours(0, 0, 0, 0);

    const longPendingOrders = orders.filter(order => {
      if (order.paymentStatus === "paid") return false;
      const orderDate = new Date(order.date);
      return orderDate <= fifteenDaysAgo;
    });

    if (longPendingOrders.length > 0) {
      const lastNotification = localStorage.getItem("shizen_overdue_notification_date");
      const today = new Date().toISOString().split("T")[0];
      if (lastNotification !== today) {
        addNotification({
          type: "overdue_payment",
          title: "⚠️ Pagamentos atrasados",
          message: `${longPendingOrders.length} cliente(s) possuem pagamento pendente há mais de 15 dias. Acesse o Financeiro para regularizar.`,
          link: "/dashboard/financeiro",
        });
        localStorage.setItem("shizen_overdue_notification_date", today);
      }
    }
  }, [orders, addNotification]);

  // Calcular intervalo baseado no período selecionado
  const interval = useMemo(() => {
    const now = selectedDate;
    if (periodType === "all") {
      return {
        start: new Date(0), // Início dos tempos
        end: new Date(2999, 11, 31), // Futuro distante
        label: "Todos",
        monthsToShow: 0
      };
    } else if (periodType === "month") {
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        label: format(now, "MMMM 'de' yyyy", { locale: ptBR }),
        monthsToShow: 1
      };
    } else if (periodType === "quarter") {
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
      return {
        start: quarterStart,
        end: quarterEnd,
        label: `${format(quarterStart, "MMM", { locale: ptBR })} - ${format(quarterEnd, "MMM yyyy", { locale: ptBR })}`,
        monthsToShow: 3
      };
    } else {
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31),
        label: `Ano ${now.getFullYear()}`,
        monthsToShow: 12
      };
    }
  }, [periodType, selectedDate]);

  // Funções de navegação (desabilitadas caso seja "all")
  const handlePrevPeriod = () => {
    if (periodType === "all") return;
    const newDate = new Date(selectedDate);
    if (periodType === "month") newDate.setMonth(newDate.getMonth() - 1);
    else if (periodType === "quarter") newDate.setMonth(newDate.getMonth() - 3);
    else if (periodType === "year") newDate.setFullYear(newDate.getFullYear() - 1);
    setSelectedDate(newDate);
  };

  const handleNextPeriod = () => {
    if (periodType === "all") return;
    const newDate = new Date(selectedDate);
    if (periodType === "month") newDate.setMonth(newDate.getMonth() + 1);
    else if (periodType === "quarter") newDate.setMonth(newDate.getMonth() + 3);
    else if (periodType === "year") newDate.setFullYear(newDate.getFullYear() + 1);
    setSelectedDate(newDate);
  };

  // ========== CÁLCULOS DO PERÍODO ==========
  const periodOrders = useMemo(() => {
    return orders.filter(o => {
      if (periodType === "all") return true; // Inclui absolutamente tudo
      const orderDate = parseISO(o.date);
      return isWithinInterval(orderDate, { start: interval.start, end: interval.end });
    });
  }, [orders, interval, periodType]);

  const periodPurchases = useMemo(() => {
    return purchases.filter(p => {
      if (periodType === "all") return true; // Inclui absolutamente tudo
      const purchaseDate = parseISO(p.date);
      return isWithinInterval(purchaseDate, { start: interval.start, end: interval.end });
    });
  }, [purchases, interval, periodType]);

  // Vendas do período
  const periodSales = periodOrders
    .filter(o => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalValue, 0);

  // Compras do período
  const periodExpenses = periodPurchases
    .filter(p => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + p.totalValue, 0);

  // ========== CÁLCULOS GLOBAIS ==========
  const totalSales = orders
    .filter(o => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalValue, 0);

  const totalPurchases = purchases
    .filter(p => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + p.totalValue, 0);

  const cogs = useMemo(() => {
    let totalCogs = 0;
    orders
      .filter(o => o.paymentStatus === "paid")
      .forEach(order => {
        order.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            totalCogs += product.cost * item.quantity;
          }
        });
      });
    return totalCogs;
  }, [orders, products]);

  const grossProfit = totalSales - cogs;
  const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
  const operatingExpenses = totalPurchases - cogs;
  const netProfit = grossProfit - operatingExpenses;

  const pendingOrders = orders.filter(o => o.paymentStatus === "pending").length;
  const accountsPayable = purchases
    .filter(p => p.paymentStatus === "pending" || p.paymentStatus === "overdue")
    .reduce((sum, p) => sum + p.totalValue, 0);

  const lowStockProducts = getLowStockProducts();
  const lowStockCount = lowStockProducts.length;
  const expiredProducts = products.filter(p => p.validity && isAfter(new Date(), parseISO(p.validity)));
  
  const activeClients = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const clientsWithOrders = new Set(
      orders
        .filter(o => o.date && isAfter(parseISO(o.date), thirtyDaysAgo))
        .map(o => o.clientId)
    );
    return clientsWithOrders.size;
  }, [orders]);

  // ========== GRÁFICOS COM FILTRO ==========
  const monthlyChartData = useMemo(() => {
    const data: { month: string; vendas: number; compras: number }[] = [];

    if (periodType === "all") {
      const allDates = [...orders, ...purchases].map(x => parseISO(x.date).getTime());
      if (allDates.length === 0) return [];
      
      const oldestDate = new Date(Math.min(...allDates));
      let currentMonth = startOfMonth(oldestDate);
      const endMonth = startOfMonth(new Date());

      while (currentMonth <= endMonth) {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        const monthSales = orders
          .filter(o => o.paymentStatus === "paid" && o.date && isWithinInterval(parseISO(o.date), { start: monthStart, end: monthEnd }))
          .reduce((sum, o) => sum + o.totalValue, 0);
        
        const monthPurchases = purchases
          .filter(p => p.paymentStatus === "paid" && p.date && isWithinInterval(parseISO(p.date), { start: monthStart, end: monthEnd }))
          .reduce((sum, p) => sum + p.totalValue, 0);

        data.push({
          month: format(currentMonth, "MMM/yy", { locale: ptBR }),
          vendas: monthSales,
          compras: monthPurchases,
        });

        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }
    } else {
      const monthsToShow = interval.monthsToShow;
      for (let i = monthsToShow - 1; i >= 0; i--) {
        let monthDate;
        if (periodType === "year") {
          monthDate = new Date(selectedDate.getFullYear(), 11 - i, 1);
        } else if (periodType === "quarter") {
          const quarterStartMonth = Math.floor(selectedDate.getMonth() / 3) * 3;
          monthDate = new Date(selectedDate.getFullYear(), quarterStartMonth + i, 1);
        } else {
          monthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - (monthsToShow - 1) + i, 1);
        }
        
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        
        const monthSales = orders
          .filter(o => o.paymentStatus === "paid" && o.date && isWithinInterval(parseISO(o.date), { start: monthStart, end: monthEnd }))
          .reduce((sum, o) => sum + o.totalValue, 0);
        
        const monthPurchases = purchases
          .filter(p => p.paymentStatus === "paid" && p.date && isWithinInterval(parseISO(p.date), { start: monthStart, end: monthEnd }))
          .reduce((sum, p) => sum + p.totalValue, 0);
        
        data.push({
          month: format(monthDate, "MMM", { locale: ptBR }),
          vendas: monthSales,
          compras: monthPurchases,
        });
      }
    }
    return data;
  }, [orders, purchases, periodType, selectedDate, interval]);

  // Vendas por categoria (filtradas pelo período)
  const categorySales = useMemo(() => {
    const categoryMap = new Map<string, number>();
    periodOrders
      .filter(o => o.paymentStatus === "paid")
      .forEach(order => {
        order.items?.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product && product.category) {
            const current = categoryMap.get(product.category) || 0;
            categoryMap.set(product.category, current + item.total);
          }
        });
      });
    const colors = ["#2D5016", "#5CA652", "#89B84A", "#D6B43D", "#4A7C2E", "#3A6B8C"];
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [periodOrders, products]);

  // Compras por categoria (filtradas pelo período)
  const categoryPurchases = useMemo(() => {
    const categoryMap = new Map<string, number>();
    periodPurchases
      .filter(p => p.paymentStatus === "paid")
      .forEach(purchase => {
        purchase.items?.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product && product.category) {
            const current = categoryMap.get(product.category) || 0;
            categoryMap.set(product.category, current + item.total);
          }
        });
      });
    const colors = ["#D64B4B", "#E57373", "#EF9A9A", "#FFCDD2", "#F44336", "#D32F2F"];
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [periodPurchases, products]);

  // Evolução de clientes (filtrada pelo período)
  const clientEvolution = useMemo(() => {
    const data: { month: string; gained: number; lost: number }[] = [];

    if (periodType === "all") {
      const allDates = orders.map(x => parseISO(x.date).getTime());
      if (allDates.length === 0) return [];

      const oldestDate = new Date(Math.min(...allDates));
      let currentMonth = startOfMonth(oldestDate);
      const endMonth = startOfMonth(new Date());

      while (currentMonth <= endMonth) {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        const clientsInMonth = new Set(
          orders
            .filter(o => o.date && isWithinInterval(parseISO(o.date), { start: monthStart, end: monthEnd }))
            .map(o => o.clientId)
        );

        const previousMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        const prevStart = startOfMonth(previousMonthDate);
        const prevEnd = endOfMonth(previousMonthDate);
        const previousClients = new Set(
          orders
            .filter(o => o.date && isWithinInterval(parseISO(o.date), { start: prevStart, end: prevEnd }))
            .map(o => o.clientId)
        );

        const gained = Array.from(clientsInMonth).filter(c => !previousClients.has(c)).length;
        const lost = Array.from(previousClients).filter(c => !clientsInMonth.has(c)).length;

        data.push({
          month: format(currentMonth, "MMM/yy", { locale: ptBR }),
          gained,
          lost,
        });

        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }
    } else {
      const monthsToShow = interval.monthsToShow;
      for (let i = monthsToShow - 1; i >= 0; i--) {
        let monthDate;
        if (periodType === "year") {
          monthDate = new Date(selectedDate.getFullYear(), 11 - i, 1);
        } else if (periodType === "quarter") {
          const quarterStartMonth = Math.floor(selectedDate.getMonth() / 3) * 3;
          monthDate = new Date(selectedDate.getFullYear(), quarterStartMonth + i, 1);
        } else {
          monthDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - (monthsToShow - 1) + i, 1);
        }
        
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        
        const clientsInMonth = new Set(
          orders
            .filter(o => o.date && isWithinInterval(parseISO(o.date), { start: monthStart, end: monthEnd }))
            .map(o => o.clientId)
        );
        
        const previousMonthDate = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1);
        const prevStart = startOfMonth(previousMonthDate);
        const prevEnd = endOfMonth(previousMonthDate);
        const previousClients = new Set(
          orders
            .filter(o => o.date && isWithinInterval(parseISO(o.date), { start: prevStart, end: prevEnd }))
            .map(o => o.clientId)
        );
        
        const gained = Array.from(clientsInMonth).filter(c => !previousClients.has(c)).length;
        const lost = Array.from(previousClients).filter(c => !clientsInMonth.has(c)).length;
        
        data.push({
          month: format(monthDate, "MMM", { locale: ptBR }),
          gained,
          lost,
        });
      }
    }
    return data;
  }, [orders, periodType, selectedDate, interval]);

  // Últimos pedidos e compras (filtrados pelo período)
  const recentOrders = [...periodOrders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const recentPurchases = [...periodPurchases].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  
  const expiringSoon = products.filter(p => {
    if (!p.validity) return false;
    const daysLeft = differenceInDays(parseISO(p.validity), new Date());
    return daysLeft >= 0 && daysLeft <= 7;
  });

  const isProfitNegative = netProfit < 0;
  const periodProfit = periodSales - periodExpenses;

  const kpiCards = [
    {
      title: "Vendas do Período",
      value: `R$ ${periodSales.toFixed(2).replace(".", ",")}`,
      subtitle: interval.label,
      icon: ShoppingBag,
      color: "bg-green-50",
      iconColor: "text-green-600",
      link: "/dashboard/vendas",
      linkText: "Ver vendas"
    },
    {
      title: "Lucro do Período",
      value: `R$ ${periodProfit.toFixed(2).replace(".", ",")}`,
      subtitle: periodProfit >= 0 ? "Positivo" : "Negativo",
      icon: DollarSign,
      color: periodProfit >= 0 ? "bg-blue-50" : "bg-red-50",
      iconColor: periodProfit >= 0 ? "text-blue-600" : "text-red-600",
      link: "/dashboard/financeiro",
      linkText: "Ver detalhes"
    },
    {
      title: "Contas a Pagar",
      value: `R$ ${accountsPayable.toFixed(2).replace(".", ",")}`,
      subtitle: `${purchases.filter(p => p.paymentStatus === "pending").length} compras pendentes`,
      icon: Receipt,
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      link: "/dashboard/compras",
      linkText: "Ver compras"
    },
    {
      title: "Pedidos Pendentes",
      value: pendingOrders.toString(),
      subtitle: `${pendingOrders} aguardando pagamento`,
      icon: Clock,
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
      link: "/dashboard/vendas",
      linkText: "Ver pedidos"
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-gray-500">Visão geral do seu negócio</p>
        </div>
        
        {/* Filtros de período */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant={periodType === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriodType("all")}
              className={periodType === "all" ? "bg-[#2D5016]" : ""}
            >
              Todos
            </Button>
            <Button
              variant={periodType === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriodType("month")}
              className={periodType === "month" ? "bg-[#2D5016]" : ""}
            >
              Mês
            </Button>
            <Button
              variant={periodType === "quarter" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriodType("quarter")}
              className={periodType === "quarter" ? "bg-[#2D5016]" : ""}
            >
              Trimestre
            </Button>
            <Button
              variant={periodType === "year" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriodType("year")}
              className={periodType === "year" ? "bg-[#2D5016]" : ""}
            >
              Ano
            </Button>
          </div>
          
          {/* Seletor de data */}
          <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrevPeriod} 
              className="h-8 px-2"
              disabled={periodType === "all"}
            >
              ←
            </Button>
            <div className="flex items-center gap-2 px-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{interval.label}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNextPeriod} 
              className="h-8 px-2"
              disabled={periodType === "all"}
            >
              →
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${kpi.color}`}>
                    <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                  </div>
                  {kpi.link && (
                    <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={() => window.location.href = kpi.link}>
                      {kpi.linkText} <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <p className="text-xs text-gray-400 mt-1">{kpi.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerta de lucro negativo */}
      {isProfitNegative && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">Atenção: Lucro Negativo</p>
                <p className="text-sm text-red-700">
                  Você está no vermelho. Revise seus custos, aumente os preços ou reduza despesas.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-red-700" onClick={() => window.location.href = "/dashboard/financeiro"}>
              Analisar finanças →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
        </TabsList>

        {/* TAB VISÃO GERAL */}
        <TabsContent value="visao-geral" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Vendas vs Compras</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="vendas" fill="#5CA652" name="Vendas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="compras" fill="#D64B4B" name="Compras" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Resumo Financeiro</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total de Vendas</span>
                    <span className="font-bold text-green-600">R$ {totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Custo dos Produtos Vendidos</span>
                    <span className="font-bold text-red-600">R$ {cogs.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-semibold">Lucro Bruto</span>
                    <span className="font-bold text-blue-600">R$ {grossProfit.toFixed(2)} ({grossMargin.toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Despesas (estoque não vendido)</span>
                    <span className="font-bold text-orange-600">R$ {operatingExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-semibold">Resultado Líquido</span>
                    <span className={`font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      R$ {netProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Vendas por Categoria</h3>
                {categorySales.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categorySales}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categorySales.map((entry, idx) => (
                          <Cell key={`ds-sales-cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    Nenhuma venda no período
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Compras por Categoria</h3>
                {categoryPurchases.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryPurchases}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryPurchases.map((entry, idx) => (
                          <Cell key={`ds-purchases-cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    Nenhuma compra no período
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cards de alertas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lowStockCount > 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-yellow-800">Estoque Baixo</p>
                      <p className="text-sm text-yellow-700">{lowStockCount} produtos precisam de reposição</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-yellow-700" onClick={() => window.location.href = "/dashboard/cadastro"}>
                    Ver estoque →
                  </Button>
                </CardContent>
              </Card>
            )}
            {expiringSoon.length > 0 && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="font-semibold text-orange-800">Produtos a Vencer</p>
                      <p className="text-sm text-orange-700">{expiringSoon.length} produtos vencem em até 7 dias</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-orange-700" onClick={() => window.location.href = "/dashboard/cadastro"}>
                    Ver produtos →
                  </Button>
                </CardContent>
              </Card>
            )}
            {accountsPayable > 0 && (
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">Contas a Pagar</p>
                      <p className="text-sm text-red-700">R$ {accountsPayable.toFixed(2)} em compras pendentes</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-700" onClick={() => window.location.href = "/dashboard/compras"}>
                    Ver compras →
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* TAB CLIENTES */}
        <TabsContent value="clientes" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-700">{clients.length}</p>
                <p className="text-sm text-gray-600">Total de Clientes</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-4 text-center">
                <Check className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-700">{activeClients}</p>
                <p className="text-sm text-gray-600">Ativos (últ. 30 dias)</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <p className="text-2xl font-bold text-yellow-700">
                  {orders.filter(o => o.paymentStatus === "pending").length}
                </p>
                <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-purple-700">
                  R$ {(totalSales / (clients.length || 1)).toFixed(2).replace(".", ",")}
                </p>
                <p className="text-sm text-gray-600">Ticket Médio</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Evolução de Clientes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="gained" fill="#5CA652" name="Ganhos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lost" fill="#D64B4B" name="Perdidos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB FUNCIONÁRIOS */}
        <TabsContent value="funcionarios" className="space-y-6 mt-6">
          {(() => {
            const sellers = users.filter(u => u.role === "seller" && u.status === "active");
            const paidOrders = orders.filter(o => o.paymentStatus === "paid");

            const sellerStats = sellers.map(seller => {
              const sellerOrders = paidOrders.filter(o => o.sellerId === seller.id);
              const totalSales = sellerOrders.reduce((sum, o) => sum + o.totalValue, 0);
              const orderCount = sellerOrders.length;
              const avgTicket = orderCount > 0 ? totalSales / orderCount : 0;
              return { id: seller.id, name: seller.name, totalSales, orderCount, avgTicket };
            }).sort((a, b) => b.totalSales - a.totalSales);

            const totalSellerSales = sellerStats.reduce((sum, s) => sum + s.totalSales, 0);

            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-[#2D5016] text-white">
                    <CardContent className="p-4 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-white/80" />
                      <p className="text-2xl font-bold">{sellers.length}</p>
                      <p className="text-sm text-white/80">Vendedores Ativos</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <p className="text-2xl font-bold text-green-700">R$ {totalSellerSales.toFixed(0)}</p>
                      <p className="text-sm text-gray-600">Total em Vendas</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <ShoppingBag className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <p className="text-2xl font-bold text-blue-700">{paidOrders.filter(o => o.sellerId).length}</p>
                      <p className="text-sm text-gray-600">Total em Pedidos</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                      <p className="text-2xl font-bold text-purple-700">
                        R$ {sellers.length > 0 ? (totalSellerSales / sellers.length).toFixed(0) : "0"}
                      </p>
                      <p className="text-sm text-gray-600">Média por Vendedor</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Vendas por Funcionário</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sellerStats} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis type="number" stroke="#888" tickFormatter={(v) => `R$ ${v.toFixed(0)}`} />
                          <YAxis type="category" dataKey="name" stroke="#888" width={100} />
                          <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                          <Bar dataKey="totalSales" fill="#5CA652" name="Vendas Totais" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Pedidos por Funcionário</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sellerStats}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip />
                          <Bar dataKey="orderCount" fill="#2D5016" name="Pedidos" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Ranking de Vendedores</h3>
                    <div className="space-y-3">
                      {sellerStats.map((seller, idx) => {
                        const share = totalSellerSales > 0 ? (seller.totalSales / totalSellerSales) * 100 : 0;
                        const medals = ["🥇", "🥈", "🥉"];
                        return (
                          <div key={seller.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <span className="text-2xl w-8">{medals[idx] || `#${idx + 1}`}</span>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{seller.name}</span>
                                <span className="font-bold text-green-700">R$ {seller.totalSales.toFixed(2)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-[#2D5016] h-2 rounded-full" style={{ width: `${share}%` }} />
                              </div>
                              <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                <span>{seller.orderCount} pedidos</span>
                                <span>Ticket médio: R$ {seller.avgTicket.toFixed(2)}</span>
                                <span>{share.toFixed(1)}% do total</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {sellerStats.length === 0 && (
                        <div className="text-center py-8 text-gray-400">Nenhum vendedor com pedidos registrados</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          })()}
        </TabsContent>

        {/* TAB ESTOQUE */}
        <TabsContent value="estoque" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50">
              <CardContent className="p-4 text-center">
                <Package className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-700">{products.length}</p>
                <p className="text-sm text-gray-600">Total de Produtos</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <p className="text-2xl font-bold text-yellow-700">{lowStockCount}</p>
                <p className="text-sm text-gray-600">Estoque Baixo</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50">
              <CardContent className="p-4 text-center">
                <AlertCircle className="w-8 h-8 mx-auto text-red-600 mb-2" />
                <p className="text-2xl font-bold text-red-700">{expiredProducts.length}</p>
                <p className="text-sm text-gray-600">Produtos Vencidos</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">⚠️ Produtos com Baixo Estoque</h3>
              {lowStockProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.icon}</span>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">Estoque: {product.stock} {product.unit}</p>
                        </div>
                      </div>
                      <Badge variant="warning">Mínimo: {product.minStock}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">✅ Todos os produtos com estoque adequado</div>
              )}
            </CardContent>
          </Card>

          {expiringSoon.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">📅 Produtos Próximos do Vencimento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {expiringSoon.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.icon}</span>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-orange-600">Vence em: {format(parseISO(product.validity!), "dd/MM/yyyy")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB MOVIMENTAÇÕES */}
        <TabsContent value="movimentacoes" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Últimos Pedidos</h3>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = "/dashboard/vendas"}>
                  Ver todos →
                </Button>
              </div>
              <div className="space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                   <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{order.clientName}</p>
                  <p className="text-sm text-gray-500">{format(parseISO(order.date), "dd/MM/yyyy")}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs mt-1 h-7 px-2"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-3 h-3 mr-1" /> Ver detalhes
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">R$ {order.totalValue.toFixed(2)}</p>
                  <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
                    {order.paymentStatus === "paid" ? "Pago" : "Pendente"}
                  </Badge>
                </div>
              </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">Nenhum pedido no período</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Últimas Compras</h3>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = "/dashboard/compras"}>
                  Ver todas →
                </Button>
              </div>
              <div className="space-y-3">
                {recentPurchases.length > 0 ? (
                  recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{purchase.supplierName}</p>
                      <p className="text-sm text-gray-500">{format(parseISO(purchase.date), "dd/MM/yyyy")}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs mt-1 h-7 px-2"
                        onClick={() => setSelectedPurchase(purchase)}
                      >
                        <Eye className="w-3 h-3 mr-1" /> Ver detalhes
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">R$ {purchase.totalValue.toFixed(2)}</p>
                      <Badge variant={purchase.paymentStatus === "paid" ? "success" : "warning"}>
                        {purchase.paymentStatus === "paid" ? "Pago" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">Nenhuma compra no período</div>
                )}
              </div>
            </CardContent>
          </Card>
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
                <div><p className="text-sm text-gray-500">Cliente</p><p className="font-medium">{selectedOrder.clientName}</p></div>
                <div><p className="text-sm text-gray-500">Data</p><p>{format(parseISO(selectedOrder.date), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Vencimento</p><p>{format(parseISO(selectedOrder.paymentDueDate), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Status</p><Badge variant={selectedOrder.paymentStatus === "paid" ? "success" : "warning"}>{selectedOrder.paymentStatus === "paid" ? "Pago" : "Pendente"}</Badge></div>
              </div>
              <div><p className="text-sm text-gray-500 mb-2">Produtos</p><div className="space-y-2">{selectedOrder.items.map((item: any, idx: number) => (<div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded"><div><p className="font-medium">{item.productName}</p><p className="text-sm text-gray-500">{item.quantity} x R$ {item.unitPrice.toFixed(2)}</p></div><p className="font-semibold">R$ {item.total.toFixed(2)}</p></div>))}</div></div>
              <div className="border-t pt-4 flex justify-between"><p className="text-lg font-semibold">Total</p><p className="text-2xl font-bold text-[#2D5016]">R$ {selectedOrder.totalValue.toFixed(2)}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes da Compra */}
      <Dialog open={!!selectedPurchase} onOpenChange={() => setSelectedPurchase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Compra {selectedPurchase?.id}</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Fornecedor</p><p className="font-medium">{selectedPurchase.supplierName}</p></div>
                <div><p className="text-sm text-gray-500">Data</p><p>{format(parseISO(selectedPurchase.date), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Vencimento</p><p>{format(parseISO(selectedPurchase.paymentDueDate), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Status</p><Badge variant={selectedPurchase.paymentStatus === "paid" ? "success" : "warning"}>{selectedPurchase.paymentStatus === "paid" ? "Pago" : "Pendente"}</Badge></div>
              </div>
              <div><p className="text-sm text-gray-500 mb-2">Produtos</p><div className="space-y-2">{selectedPurchase.items.map((item: any, idx: number) => (<div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded"><div><p className="font-medium">{item.productName}</p><p className="text-sm text-gray-500">{item.quantity} x R$ {item.unitPrice.toFixed(2)}</p></div><p className="font-semibold">R$ {item.total.toFixed(2)}</p></div>))}</div></div>
              <div className="border-t pt-4 flex justify-between"><p className="text-lg font-semibold">Total</p><p className="text-2xl font-bold text-[#2D5016]">R$ {selectedPurchase.totalValue.toFixed(2)}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}