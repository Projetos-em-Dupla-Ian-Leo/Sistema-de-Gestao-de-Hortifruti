import { useState, useMemo } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Receipt,
  CreditCard,
  AlertCircle,
  Eye,
  Check,
  Download,
  Printer,
  Target,
  Award,
  Wallet,
  History,
  Phone,
  HandCoins,
  Mail,
  MessageCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { format, parseISO, startOfMonth, endOfMonth, subMonths, isWithinInterval, differenceInDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

// ============================================
// FUNÇÃO AUXILIAR PARA ABRIR EMAIL NO PROVEDOR CORRETO
// ============================================
const getMailUrl = (email: string, subject: string, body: string) => {
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  } 
  else if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com' || domain === 'msn.com') {
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  } 
  else if (domain === 'yahoo.com' || domain === 'yahoo.com.br' || domain === 'ymail.com') {
    return `https://mail.yahoo.com/d/compose?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  } 
  else {
    // Fallback para cliente padrão do sistema
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
};

export default function Financeiro() {
  const { orders, purchases, products, clients, updateOrderPaymentStatus, updatePurchasePaymentStatus } = useApp();
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [period, setPeriod] = useState<"all" | "month" | "quarter" | "year">("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [forecastMonths, setForecastMonths] = useState(3);
  const [selectedClientDetails, setSelectedClientDetails] = useState<any>(null);
  const [selectedSupplierDetails, setSelectedSupplierDetails] = useState<any>(null);
  const [selectedOrderFromClient, setSelectedOrderFromClient] = useState<any>(null);
  const [selectedPurchaseFromSupplier, setSelectedPurchaseFromSupplier] = useState<any>(null);
  
  // Estados para filtro do Radar Chart
  const [radarPeriod, setRadarPeriod] = useState<"6" | "12" | "24">("6");

  // ========== CÁLCULO DO INTERVALO ==========
  const interval = useMemo(() => {
    if (period === "all") {
      const allDates = [...orders.map(o => parseISO(o.date)), ...purchases.map(p => parseISO(p.date))];
      const minDate = allDates.length > 0 ? new Date(Math.min(...allDates.map(d => d.getTime()))) : new Date();
      return {
        start: startOfMonth(minDate),
        end: new Date(),
        label: "Todos os tempos"
      };
    }
    const now = selectedMonth;
    if (period === "month") {
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        label: format(now, "MMMM 'de' yyyy", { locale: ptBR })
      };
    } else if (period === "quarter") {
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const quarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
      return {
        start: quarterStart,
        end: quarterEnd,
        label: `${format(quarterStart, "MMM", { locale: ptBR })} - ${format(quarterEnd, "MMM yyyy", { locale: ptBR })}`
      };
    } else {
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31),
        label: `Ano ${now.getFullYear()}`
      };
    }
  }, [period, selectedMonth, orders, purchases]);

  // ========== FILTRAGEM DE DADOS ==========
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const orderDate = parseISO(o.date);
      return isWithinInterval(orderDate, { start: interval.start, end: interval.end });
    });
  }, [orders, interval]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
      const purchaseDate = parseISO(p.date);
      return isWithinInterval(purchaseDate, { start: interval.start, end: interval.end });
    });
  }, [purchases, interval]);

  // Função para verificar vencimento
  const isOrderOverdue = (order: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = parseISO(order.paymentDueDate);
    dueDate.setHours(0, 0, 0, 0);
    return order.paymentStatus !== "paid" && isBefore(dueDate, today);
  };

  const isPurchaseOverdue = (purchase: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = parseISO(purchase.paymentDueDate);
    dueDate.setHours(0, 0, 0, 0);
    return purchase.paymentStatus !== "paid" && isBefore(dueDate, today);
  };

  const paidOrders = filteredOrders.filter(o => o.paymentStatus === "paid");
  const paidPurchases = filteredPurchases.filter(p => p.paymentStatus === "paid");
  
  // TODOS os pendentes (sem filtro - para os cards e tab Pendentes)
  const allPendingOrders = orders.filter(o => o.paymentStatus !== "paid");
  const allPendingPurchases = purchases.filter(p => p.paymentStatus !== "paid");

  // ========== MÉTRICAS ==========
  // Métricas do período (para gráficos e KPIs)
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalValue, 0);
  const totalExpenses = paidPurchases.reduce((sum, p) => sum + p.totalValue, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const averageTicket = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  
  // CONTAS A RECEBER E PAGAR - SEM FILTRO DE PERÍODO (todas as pendências)
  const accountsReceivable = allPendingOrders.reduce((sum, o) => sum + o.totalValue, 0);
  const accountsPayable = allPendingPurchases.reduce((sum, p) => sum + p.totalValue, 0);

  // ========== GRÁFICOS ==========
  const monthlyData = useMemo(() => {
    const last24Months: { month: string; receitas: number; despesas: number; lucro: number }[] = [];
    const today = new Date();
    for (let i = 23; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthOrders = orders.filter(o => {
        const orderDate = parseISO(o.date);
        return o.paymentStatus === "paid" && isWithinInterval(orderDate, { start: monthStart, end: monthEnd });
      });
      const monthRevenue = monthOrders.reduce((sum, o) => sum + o.totalValue, 0);
      
      const monthPurchases = purchases.filter(p => {
        const purchaseDate = parseISO(p.date);
        return p.paymentStatus === "paid" && isWithinInterval(purchaseDate, { start: monthStart, end: monthEnd });
      });
      const monthExpenses = monthPurchases.reduce((sum, p) => sum + p.totalValue, 0);
      
      last24Months.push({
        month: format(monthDate, "MMM/yy", { locale: ptBR }),
        receitas: monthRevenue,
        despesas: monthExpenses,
        lucro: monthRevenue - monthExpenses,
      });
    }
    return last24Months;
  }, [orders, purchases]);

  // Dados do Radar Chart com filtro
  const getMonthNumber = (month: string): number => {
    const months: Record<string, number> = {
      "Jan": 0, "Fev": 1, "Mar": 2, "Abr": 3, "Mai": 4, "Jun": 5,
      "Jul": 6, "Ago": 7, "Set": 8, "Out": 9, "Nov": 10, "Dez": 11
    };
    return months[month] || 0;
  };

  const radarData = useMemo(() => {
    const months = parseInt(radarPeriod);
    return monthlyData.slice(-months);
  }, [monthlyData, radarPeriod]);

  const accumulatedData = useMemo(() => {
    let runningRevenue = 0;
    let runningProfit = 0;
    return monthlyData.slice(-12).map(item => {
      runningRevenue += item.receitas;
      runningProfit += item.lucro;
      return {
        month: item.month,
        receitasAcumuladas: runningRevenue,
        lucroAcumulado: runningProfit,
      };
    });
  }, [monthlyData]);

  const revenueByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    paidOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product && product.category) {
          const current = categoryMap.get(product.category) || 0;
          categoryMap.set(product.category, current + item.total);
        }
      });
    });
    const colors = ["#2D5016", "#5CA652", "#89B84A", "#D6B43D", "#4A7C2E", "#3A6B8C", "#FF8C42", "#6B4E71"];
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [paidOrders, products]);

  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    paidPurchases.forEach(purchase => {
      purchase.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product && product.category) {
          const current = categoryMap.get(product.category) || 0;
          categoryMap.set(product.category, current + item.total);
        }
      });
    });
    const colors = ["#D64B4B", "#E57373", "#EF9A9A", "#FFCDD2", "#F44336", "#D32F2F", "#C62828", "#B71C1C"];
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  }, [paidPurchases, products]);

  const topClients = useMemo(() => {
    const clientMap = new Map<string, { name: string; total: number; count: number }>();
    paidOrders.forEach(order => {
      const existing = clientMap.get(order.clientId);
      if (existing) {
        existing.total += order.totalValue;
        existing.count += 1;
      } else {
        clientMap.set(order.clientId, { name: order.clientName, total: order.totalValue, count: 1 });
      }
    });
    return Array.from(clientMap.values()).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [paidOrders]);

  const topSuppliers = useMemo(() => {
    const supplierMap = new Map<string, { name: string; total: number; count: number }>();
    paidPurchases.forEach(purchase => {
      const existing = supplierMap.get(purchase.supplierId);
      if (existing) {
        existing.total += purchase.totalValue;
        existing.count += 1;
      } else {
        supplierMap.set(purchase.supplierId, { name: purchase.supplierName, total: purchase.totalValue, count: 1 });
      }
    });
    return Array.from(supplierMap.values()).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [paidPurchases]);

  const salesForecast = useMemo(() => {
    const last6Months = monthlyData.slice(-6);
    const avgRevenue = last6Months.reduce((sum, m) => sum + m.receitas, 0) / (last6Months.length || 1);
    const avgGrowth = last6Months.slice(1).reduce((sum, m, i) => {
      const prev = last6Months[i].receitas;
      return sum + (prev > 0 ? (m.receitas - prev) / prev : 0);
    }, 0) / (last6Months.length - 1 || 1);
    
    const forecast: { month: string; projetado: number }[] = [];
    let lastRevenue = monthlyData[monthlyData.length - 1]?.receitas || avgRevenue;
    for (let i = 1; i <= forecastMonths; i++) {
      const nextRevenue = lastRevenue * (1 + avgGrowth);
      forecast.push({
        month: format(subMonths(new Date(), -i), "MMM/yy", { locale: ptBR }),
        projetado: nextRevenue,
      });
      lastRevenue = nextRevenue;
    }
    return forecast;
  }, [monthlyData, forecastMonths]);

  const financialHealth = {
    liquidity: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
    receivablesRatio: totalRevenue > 0 ? (accountsReceivable / totalRevenue) * 100 : 0,
    payablesRatio: totalExpenses > 0 ? (accountsPayable / totalExpenses) * 100 : 0,
    profitPerOrder: paidOrders.length > 0 ? netProfit / paidOrders.length : 0,
  };

  // ========== FUNÇÕES ==========
  const handleMarkOrderAsPaid = (orderId: string) => {
    if (confirm("Marcar este pedido como pago? Isso atualizará o Dashboard e o Financeiro.")) {
      updateOrderPaymentStatus(orderId, "paid");
      alert("Pedido marcado como pago com sucesso!");
    }
  };

  const handleMarkPurchaseAsPaid = (purchaseId: string) => {
    if (confirm("Marcar esta compra como paga? Isso atualizará o Dashboard e o Financeiro.")) {
      updatePurchasePaymentStatus(purchaseId, "paid");
      alert("Compra marcada como paga com sucesso!");
    }
  };

  const handlePrevPeriod = () => {
    if (period === "all") return;
    const newDate = new Date(selectedMonth);
    if (period === "month") newDate.setMonth(newDate.getMonth() - 1);
    else if (period === "quarter") newDate.setMonth(newDate.getMonth() - 3);
    else newDate.setFullYear(newDate.getFullYear() - 1);
    setSelectedMonth(newDate);
  };

  const handleNextPeriod = () => {
    if (period === "all") return;
    const newDate = new Date(selectedMonth);
    if (period === "month") newDate.setMonth(newDate.getMonth() + 1);
    else if (period === "quarter") newDate.setMonth(newDate.getMonth() + 3);
    else newDate.setFullYear(newDate.getFullYear() + 1);
    setSelectedMonth(newDate);
  };

  const getOrderStatusBadge = (order: any) => {
    if (order.paymentStatus === "paid") {
      return <Badge variant="success" className="bg-green-100 text-green-700">Pago</Badge>;
    }
    if (order.paymentMethod === "fiado") {
      return <Badge className="bg-amber-100 text-amber-700">Fiado (sem vencimento)</Badge>;
    }
    if (isOrderOverdue(order)) {
      const days = differenceInDays(new Date(), parseISO(order.paymentDueDate));
      return <Badge variant="danger" className="bg-red-100 text-red-700">Vencido há {days} dias</Badge>;
    }
    const daysLeft = differenceInDays(parseISO(order.paymentDueDate), new Date());
    return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Pendente ({daysLeft} dias)</Badge>;
  };

  const getPurchaseStatusBadge = (purchase: any) => {
    if (purchase.paymentStatus === "paid") {
      return <Badge variant="success" className="bg-green-100 text-green-700">Pago</Badge>;
    }
    if (isPurchaseOverdue(purchase)) {
      const days = differenceInDays(new Date(), parseISO(purchase.paymentDueDate));
      return <Badge variant="danger" className="bg-red-100 text-red-700">Vencido há {days} dias</Badge>;
    }
    const daysLeft = differenceInDays(parseISO(purchase.paymentDueDate), new Date());
    return <Badge variant="warning" className="bg-yellow-100 text-yellow-700">Pendente ({daysLeft} dias)</Badge>;
  };

  const handleExport = () => {
    const reportData = {
      periodo: interval.label,
      receitaTotal: totalRevenue,
      despesasTotais: totalExpenses,
      lucroLiquido: netProfit,
      margemLucro: profitMargin,
      contasAReceber: accountsReceivable,
      contasAPagar: accountsPayable,
      ticketMedio: averageTicket,
      topClientes: topClients,
      topFornecedores: topSuppliers,
      dadosMensais: monthlyData,
    };
    console.log("Relatório exportado:", reportData);
    alert("Relatório exportado! Verifique o console para os dados.");
  };

  const kpiCards = [
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toFixed(2).replace(".", ",")}`,
      subtitle: `${paidOrders.length} pedidos pagos`,
      icon: ArrowUpCircle,
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Despesas Totais",
      value: `R$ ${totalExpenses.toFixed(2).replace(".", ",")}`,
      subtitle: `${paidPurchases.length} compras pagas`,
      icon: ArrowDownCircle,
      color: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Lucro Líquido",
      value: `R$ ${netProfit.toFixed(2).replace(".", ",")}`,
      subtitle: `Margem: ${profitMargin.toFixed(1)}%`,
      icon: DollarSign,
      color: netProfit >= 0 ? "bg-blue-50" : "bg-red-50",
      iconColor: netProfit >= 0 ? "text-blue-600" : "text-red-600",
    },
    {
      title: "Ticket Médio",
      value: `R$ ${averageTicket.toFixed(2).replace(".", ",")}`,
      subtitle: `Por pedido`,
      icon: Wallet,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Contas a Receber",
      value: `R$ ${accountsReceivable.toFixed(2).replace(".", ",")}`,
      subtitle: `${allPendingOrders.length} pedidos pendentes`,
      icon: CreditCard,
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Contas a Pagar",
      value: `R$ ${accountsPayable.toFixed(2).replace(".", ",")}`,
      subtitle: `${allPendingPurchases.length} compras pendentes`,
      icon: Receipt,
      color: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Financeiro</h1>
          <p className="text-gray-500">Análise completa das finanças do negócio</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <Button variant={period === "all" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("all")} className={period === "all" ? "bg-[#2D5016]" : ""}>Todos</Button>
          <Button variant={period === "month" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("month")} className={period === "month" ? "bg-[#2D5016]" : ""}>Mês</Button>
          <Button variant={period === "quarter" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("quarter")} className={period === "quarter" ? "bg-[#2D5016]" : ""}>Trimestre</Button>
          <Button variant={period === "year" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("year")} className={period === "year" ? "bg-[#2D5016]" : ""}>Ano</Button>
        </div>
        {period !== "all" && (
          <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
            <Button variant="ghost" size="sm" onClick={handlePrevPeriod} className="h-8 px-2">←</Button>
            <div className="flex items-center gap-2 px-2"><Calendar className="w-4 h-4 text-gray-500" /><span className="text-sm font-medium">{interval.label}</span></div>
            <Button variant="ghost" size="sm" onClick={handleNextPeriod} className="h-8 px-2">→</Button>
          </div>
        )}
      </div>

      {/* KPIs - 6 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${kpi.color}`}>
                    <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-gray-500">{kpi.title}</p>
                <p className="text-xs text-gray-400 mt-1">{kpi.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="analise-avancada">Análise Avançada</TabsTrigger>
          <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          <TabsTrigger value="clientes-fornecedores">Clientes/Forn.</TabsTrigger>
          <TabsTrigger value="previsoes">Previsões</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="fiado">Fiado</TabsTrigger>
        </TabsList>

        {/* TAB VISÃO GERAL */}
        <TabsContent value="visao-geral" className="space-y-6 mt-6">
          <Card><CardContent className="p-6"><h3 className="text-lg font-semibold mb-4">Evolução Mensal (12 meses)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={monthlyData.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="receitas" fill="#5CA652" name="Receitas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesas" fill="#D64B4B" name="Despesas" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="lucro" stroke="#2D5016" strokeWidth={3} name="Lucro" dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent></Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardContent className="p-6"><h3 className="text-lg font-semibold mb-4">Receitas Acumuladas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={accumulatedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                  <Area type="monotone" dataKey="receitasAcumuladas" fill="#5CA652" stroke="#2D5016" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="lucroAcumulado" fill="#89B84A" stroke="#5CA652" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent></Card>

            <Card><CardContent className="p-6"><h3 className="text-lg font-semibold mb-4">Indicadores de Saúde</h3>
              <div className="space-y-4">
                <div><div className="flex justify-between mb-1"><span className="text-sm text-gray-600">Margem de Lucro</span><span className={`text-sm font-bold ${financialHealth.liquidity >= 35 ? "text-green-600" : "text-yellow-600"}`}>{financialHealth.liquidity.toFixed(1)}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#2D5016] h-2 rounded-full" style={{ width: `${Math.min(100, financialHealth.liquidity)}%` }} /></div>
                <p className="text-xs text-gray-400 mt-1">Meta mínima: 35%</p></div>
                <div><div className="flex justify-between mb-1"><span className="text-sm text-gray-600">Contas a Receber / Receita</span><span className="text-sm font-bold text-orange-600">{financialHealth.receivablesRatio.toFixed(1)}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(100, financialHealth.receivablesRatio)}%` }} /></div></div>
                <div><div className="flex justify-between mb-1"><span className="text-sm text-gray-600">Contas a Pagar / Despesa</span><span className="text-sm font-bold text-yellow-600">{financialHealth.payablesRatio.toFixed(1)}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${Math.min(100, financialHealth.payablesRatio)}%` }} /></div></div>
                <div className="pt-2 border-t"><div className="flex justify-between"><span className="text-sm text-gray-600">Lucro por Pedido</span><span className="font-bold text-blue-600">R$ {financialHealth.profitPerOrder.toFixed(2)}</span></div></div>
              </div>
            </CardContent></Card>
          </div>
        </TabsContent>

        {/* TAB ANÁLISE AVANÇADA */}
        <TabsContent value="analise-avancada" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Performance por Período</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRadarPeriod("6")}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        radarPeriod === "6" ? "bg-[#2D5016] text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      6 meses
                    </button>
                    <button
                      onClick={() => setRadarPeriod("12")}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        radarPeriod === "12" ? "bg-[#2D5016] text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      12 meses
                    </button>
                    <button
                      onClick={() => setRadarPeriod("24")}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        radarPeriod === "24" ? "bg-[#2D5016] text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      24 meses
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="month" />
                    <PolarRadiusAxis />
                    <Radar name="Receitas" dataKey="receitas" stroke="#5CA652" fill="#5CA652" fillOpacity={0.5} />
                    <Radar name="Lucro" dataKey="lucro" stroke="#2D5016" fill="#2D5016" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Mostrando últimos {radarPeriod} meses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Variação Percentual</h3>
                <div className="space-y-4 max-h-[350px] overflow-y-auto">
                  {monthlyData.slice(-12).map((item, idx) => {
                    const prevItem = monthlyData.slice(-13)[idx];
                    const variation = prevItem ? ((item.receitas - prevItem.receitas) / prevItem.receitas) * 100 : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">R$ {item.receitas.toFixed(2).replace(".", ",")}</span>
                          <span className={`text-sm font-bold ${variation >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {variation >= 0 ? "▲" : "▼"} {Math.abs(variation).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Análise de Tendência</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Crescimento Médio Mensal</p>
                  <p className="text-xl font-bold text-green-600">
                    {monthlyData.length > 1 ? (((monthlyData[monthlyData.length-1].receitas - monthlyData[0].receitas) / monthlyData[0].receitas) * 100 / monthlyData.length).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <Target className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Meta de Crescimento</p>
                  <p className="text-xl font-bold text-blue-600">15%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <Award className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Status da Meta</p>
                  <p className={`text-xl font-bold ${monthlyData.length > 1 && (((monthlyData[monthlyData.length-1].receitas - monthlyData[0].receitas) / monthlyData[0].receitas) * 100 / monthlyData.length) >= 15 ? "text-green-600" : "text-yellow-600"}`}>
                    {monthlyData.length > 1 && (((monthlyData[monthlyData.length-1].receitas - monthlyData[0].receitas) / monthlyData[0].receitas) * 100 / monthlyData.length) >= 15 ? "Atingindo" : "Em progresso"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB POR CATEGORIA */}
        <TabsContent value="categorias" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardContent className="p-6"><h3 className="text-lg font-semibold mb-4">Receitas por Categoria</h3>
              {revenueByCategory.length > 0 ? (<><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={revenueByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {revenueByCategory.map((entry, idx) => (<Cell key={`fin-rev-cell-${idx}`} fill={entry.color} />))}
              </Pie><Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} /></PieChart></ResponsiveContainer>
              <div className="mt-4 space-y-2">{revenueByCategory.map((item) => (<div key={item.name} className="flex items-center justify-between p-2 border-b"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span>{item.name}</span></div><span className="font-semibold text-green-600">R$ {item.value.toFixed(2)}</span></div>))}</div></>) : (<div className="h-[300px] flex items-center justify-center text-gray-400">Nenhuma receita registrada</div>)}
            </CardContent></Card>

            <Card><CardContent className="p-6"><h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
              {expensesByCategory.length > 0 ? (<><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={expensesByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {expensesByCategory.map((entry, idx) => (<Cell key={`fin-exp-cell-${idx}`} fill={entry.color} />))}
              </Pie><Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} /></PieChart></ResponsiveContainer>
              <div className="mt-4 space-y-2">{expensesByCategory.map((item) => (<div key={item.name} className="flex items-center justify-between p-2 border-b"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span>{item.name}</span></div><span className="font-semibold text-red-600">R$ {item.value.toFixed(2)}</span></div>))}</div></>) : (<div className="h-[300px] flex items-center justify-center text-gray-400">Nenhuma despesa registrada</div>)}
            </CardContent></Card>
          </div>
        </TabsContent>

        {/* TAB CLIENTES/FORNECEDORES */}
        <TabsContent value="clientes-fornecedores" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 Clientes */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top 5 Clientes</h3>
                {topClients.length > 0 ? (
                  <div className="space-y-3">
                    {topClients.map((client, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.count} pedidos</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs mt-1 h-7 px-2"
                            onClick={() => setSelectedClientDetails(client)}
                          >
                            <Eye className="w-3 h-3 mr-1" /> Ver pedidos
                          </Button>
                        </div>
                        <p className="font-bold text-green-600">R$ {client.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">Nenhum cliente registrado</div>
                )}
              </CardContent>
            </Card>

            {/* Top 5 Fornecedores */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top 5 Fornecedores</h3>
                {topSuppliers.length > 0 ? (
                  <div className="space-y-3">
                    {topSuppliers.map((supplier, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-gray-500">{supplier.count} compras</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs mt-1 h-7 px-2"
                            onClick={() => setSelectedSupplierDetails(supplier)}
                          >
                            <Eye className="w-3 h-3 mr-1" /> Ver compras
                          </Button>
                        </div>
                        <p className="font-bold text-red-600">R$ {supplier.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">Nenhum fornecedor registrado</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB PREVISÕES */}
        <TabsContent value="previsoes" className="space-y-6 mt-6">
          <Card><CardContent className="p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Previsão de Vendas</h3>
            <div className="flex items-center gap-2"><span className="text-sm text-gray-500">Meses à frente:</span>
              <select className="px-2 py-1 border rounded" value={forecastMonths} onChange={(e) => setForecastMonths(Number(e.target.value))}>
                <option value={3}>3 meses</option><option value={6}>6 meses</option><option value={12}>12 meses</option>
              </select>
            </div></div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesForecast}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                <Line type="monotone" dataKey="projetado" stroke="#2D5016" strokeWidth={3} strokeDasharray="5 5" name="Projeção" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 mt-4 text-center">⚠️ Projeção baseada na média de crescimento dos últimos 6 meses</p>
          </CardContent></Card>
        </TabsContent>

        {/* TAB PENDENTES - SEPARADOS POR CLIENTES E FORNECEDORES */}
        <TabsContent value="pendentes" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clientes (Devem pagar) */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-orange-500" />
                    Clientes (Devem pagar)
                  </h3>
                  <Badge variant="outline" className="bg-orange-100 text-orange-700">
                    Total: R$ {accountsReceivable.toFixed(2)}
                  </Badge>
                </div>
                {allPendingOrders.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {allPendingOrders.map((order) => {
                      const client = clients.find(c => c.id === order.clientId);
                      const handleNotify = () => {
                        if (!client?.notificationPreference || !client?.notificationContact) {
                          alert(`Cliente ${order.clientName} não possui canal de notificação cadastrado. Edite o cliente em Cadastro para adicionar.`);
                          return;
                        }
                        const msg = `Olá ${order.clientName}! Gostaríamos de lembrar que você possui um pagamento pendente no valor de R$ ${order.totalValue.toFixed(2)} referente ao pedido ${order.id} na Shizen Orgânicos. Por favor, entre em contato para regularizar. Obrigado!`;
                        if (client.notificationPreference === "whatsapp") {
                          const phone = client.notificationContact.replace(/\D/g, "");
                          window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`, "_blank");
                        } else {
                          const subject = `Lembrete de Pagamento - Shizen Orgânicos`;
                          const mailUrl = getMailUrl(client.notificationContact, subject, msg);
                          window.open(mailUrl, "_blank");
                        }
                      };
                      return (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.clientName}</p>
                          <p className="text-xs text-gray-500">Pedido: {order.id}</p>
                          <p className="text-sm text-orange-600">
                            {order.paymentMethod === "fiado" ? "Fiado (sem vencimento)" : `Vence em: ${format(parseISO(order.paymentDueDate), "dd/MM/yyyy")}`}
                          </p>
                          {client?.notificationPreference && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              {client.notificationPreference === "whatsapp" ? <MessageCircle className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                              {client.notificationPreference === "whatsapp" ? "WhatsApp" : "E-mail"}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-700">R$ {order.totalValue.toFixed(2)}</p>
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <Button variant="ghost" size="sm" className="text-blue-600 h-7 px-2 gap-1" onClick={handleNotify} title="Enviar notificação de cobrança">
                              <Phone className="w-3 h-3" /> Notificar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-green-600 h-7 px-2 gap-1" onClick={() => handleMarkOrderAsPaid(order.id)}>
                              <Check className="w-4 h-4" /> Marcar pago
                            </Button>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum pagamento pendente de clientes</p>
                    <p className="text-sm">Todas as contas estão em dia!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fornecedores (Devo pagar) */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-purple-500" />
                    Fornecedores (Devo pagar)
                  </h3>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    Total: R$ {accountsPayable.toFixed(2)}
                  </Badge>
                </div>
                {allPendingPurchases.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {allPendingPurchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium">{purchase.supplierName}</p>
                          <p className="text-xs text-gray-500">Compra: {purchase.id}</p>
                          <p className="text-sm text-purple-600">
                            Vence em: {format(parseISO(purchase.paymentDueDate), "dd/MM/yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-700">R$ {purchase.totalValue.toFixed(2)}</p>
                          <Button variant="ghost" size="sm" className="text-green-600 mt-1" onClick={() => handleMarkPurchaseAsPaid(purchase.id)}>
                            <Check className="w-4 h-4" /> Marcar pago
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum pagamento pendente a fornecedores</p>
                    <p className="text-sm">Todas as contas estão em dia!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* TAB FIADO */}
        <TabsContent value="fiado" className="space-y-6 mt-6">
          {(() => {
            const fiadoOrders = orders.filter(o => o.paymentMethod === "fiado");
            const fiadoPaid = fiadoOrders.filter(o => o.paymentStatus === "paid");
            const fiadoPending = fiadoOrders.filter(o => o.paymentStatus !== "paid");
            const totalFiado = fiadoOrders.reduce((sum, o) => sum + o.totalValue, 0);
            const totalFiadoPaid = fiadoPaid.reduce((sum, o) => sum + o.totalValue, 0);
            const totalFiadoPending = fiadoPending.reduce((sum, o) => sum + o.totalValue, 0);
            const clientsWithFiado = new Set(fiadoOrders.map(o => o.clientId)).size;
            const clientsWithPending = new Set(fiadoPending.map(o => o.clientId)).size;

            const chartData = [
              { name: "Pagos", value: fiadoPaid.length, valor: totalFiadoPaid, fill: "#5CA652" },
              { name: "Pendentes", value: fiadoPending.length, valor: totalFiadoPending, fill: "#D64B4B" },
            ];

            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <HandCoins className="w-8 h-8 mx-auto text-amber-600 mb-2" />
                      <p className="text-2xl font-bold text-amber-700">{fiadoOrders.length}</p>
                      <p className="text-sm text-gray-600">Total de Pedidos a Fiado</p>
                      <p className="text-xs text-gray-400 mt-1">R$ {totalFiado.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Check className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <p className="text-2xl font-bold text-green-700">{fiadoPaid.length}</p>
                      <p className="text-sm text-gray-600">Pagos</p>
                      <p className="text-xs text-gray-400 mt-1">R$ {totalFiadoPaid.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <AlertCircle className="w-8 h-8 mx-auto text-red-600 mb-2" />
                      <p className="text-2xl font-bold text-red-700">{fiadoPending.length}</p>
                      <p className="text-sm text-gray-600">Pendentes</p>
                      <p className="text-xs text-gray-400 mt-1">R$ {totalFiadoPending.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CreditCard className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <p className="text-2xl font-bold text-blue-700">{clientsWithFiado}</p>
                      <p className="text-sm text-gray-600">Clientes com Fiado</p>
                      <p className="text-xs text-gray-400 mt-1">{clientsWithPending} com pendência</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Situação dos Fiados</h3>
                      {fiadoOrders.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                              {chartData.map((entry, idx) => (<Cell key={`fin-fiado-cell-${idx}`} fill={entry.fill} />))}
                            </Pie>
                            <Tooltip formatter={(v: number, name: string, props: any) => [`${v} pedidos (R$ ${props.payload.valor?.toFixed(2)})`, name]} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[280px] flex items-center justify-center text-gray-400">Nenhum pedido a fiado registrado</div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Fiados por Cliente</h3>
                      <div className="space-y-3 max-h-[280px] overflow-y-auto">
                        {(() => {
                          const clientMap = new Map<string, { name: string; total: number; paid: number; pending: number }>();
                          fiadoOrders.forEach(o => {
                            const existing = clientMap.get(o.clientId) || { name: o.clientName, total: 0, paid: 0, pending: 0 };
                            existing.total += o.totalValue;
                            if (o.paymentStatus === "paid") existing.paid += o.totalValue;
                            else existing.pending += o.totalValue;
                            clientMap.set(o.clientId, existing);
                          });
                          return Array.from(clientMap.values()).map((c, i) => (
                            <div key={i} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <p className="font-medium">{c.name}</p>
                                <p className="font-bold text-amber-700">R$ {c.total.toFixed(2)}</p>
                              </div>
                              <div className="text-xs">
                                {c.pending > 0 ? (
                                  <span className="text-red-600">Pendente: R$ {c.pending.toFixed(2)}</span>
                                ) : (
                                  <span className="text-green-600">Pago: R$ {c.paid.toFixed(2)}</span>
                                )}
                              </div>  
                            </div>
                          ));
                        })()}
                        {fiadoOrders.length === 0 && <div className="text-center py-8 text-gray-400">Nenhum fiado registrado</div>}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <HandCoins className="w-5 h-5 text-amber-600" />
                        Todos os Pedidos a Fiado
                      </h3>
                      <div className="flex gap-2">
                        <Badge className="bg-amber-100 text-amber-700">{fiadoOrders.length} pedidos</Badge>
                        <Badge className="bg-amber-100 text-amber-700">R$ {totalFiado.toFixed(2)} total</Badge>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {fiadoOrders.length > 0 ? fiadoOrders.map(order => {
                        const client = clients.find(c => c.id === order.clientId);
                        return (
                          <div key={order.id} className={`flex items-center justify-between p-3 rounded-lg ${order.paymentStatus === "paid" ? "bg-green-50" : "bg-amber-50"}`}>
                            <div>
                              <p className="font-medium">{order.clientName}</p>
                              <p className="text-xs text-gray-500">Pedido: {order.id} · {format(parseISO(order.date), "dd/MM/yyyy")}</p>
                              <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-amber-800">R$ {order.totalValue.toFixed(2)}</p>
                              {order.paymentStatus === "paid" ? (
                                <Badge className="bg-green-100 text-green-700 mt-1">Pago</Badge>
                              ) : (
                                <div className="flex items-center gap-1 mt-1 justify-end">
                                  {client?.notificationPreference && (
                                    <Button variant="ghost" size="sm" className="text-blue-600 h-7 px-2 gap-1" onClick={() => {
                                      const msg = `Olá ${order.clientName}! Você possui um valor de R$ ${order.totalValue.toFixed(2)} em aberto referente ao pedido ${order.id} na Shizen Orgânicos. Por favor, entre em contato!`;
                                      if (client.notificationPreference === "whatsapp") {
                                        const phone = client.notificationContact!.replace(/\D/g, "");
                                        window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`, "_blank");
                                      } else {
                                        const subject = "Lembrete - Fiado Shizen Orgânicos";
                                        const mailUrl = getMailUrl(client.notificationContact!, subject, msg);
                                        window.open(mailUrl, "_blank");
                                      }
                                    }}>
                                      <Phone className="w-3 h-3" /> Notificar
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" className="text-green-600 h-7 px-2 gap-1" onClick={() => handleMarkOrderAsPaid(order.id)}>
                                    <Check className="w-3 h-3" /> Pago
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="text-center py-12 text-gray-400">
                          <HandCoins className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Nenhum pedido a fiado registrado</p>
                          <p className="text-sm">Pedidos com pagamento "Fiado" aparecerão aqui</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          })()}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes do Pedido */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Detalhes do Pedido {selectedOrder?.id}</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Cliente</p><p className="font-medium">{selectedOrder.clientName}</p></div>
                <div>{getOrderStatusBadge(selectedOrder)}</div>
                <div><p className="text-sm text-gray-500">Data do Pedido</p><p>{format(parseISO(selectedOrder.date), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Vencimento</p><p>{selectedOrder.paymentMethod === "fiado" ? "Sem data definida" : format(parseISO(selectedOrder.paymentDueDate), "dd/MM/yyyy")}</p></div>
              </div>
              <div><p className="text-sm text-gray-500 mb-2">Produtos</p><div className="space-y-2">{selectedOrder.items.map((item: any, idx: number) => (<div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded"><div><p className="font-medium">{item.productName}</p><p className="text-sm text-gray-500">{item.quantity} x R$ {item.unitPrice.toFixed(2)}</p></div><p className="font-semibold">R$ {item.total.toFixed(2)}</p></div>))}</div></div>
              <div className="border-t pt-4"><div className="flex justify-between items-center"><p className="text-lg font-semibold">Total</p><p className="text-2xl font-bold text-[#2D5016]">R$ {selectedOrder.totalValue.toFixed(2)}</p></div></div>
              {selectedOrder.paymentStatus !== "paid" && (<Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => { handleMarkOrderAsPaid(selectedOrder.id); setSelectedOrder(null); }}><Check className="w-4 h-4 mr-2" /> Marcar este pedido como Pago</Button>)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes da Compra */}
      <Dialog open={!!selectedPurchase} onOpenChange={() => setSelectedPurchase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Detalhes da Compra {selectedPurchase?.id}</DialogTitle></DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Fornecedor</p><p className="font-medium">{selectedPurchase.supplierName}</p></div>
                <div>{getPurchaseStatusBadge(selectedPurchase)}</div>
                <div><p className="text-sm text-gray-500">Data da Compra</p><p>{format(parseISO(selectedPurchase.date), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Vencimento</p><p>{format(parseISO(selectedPurchase.paymentDueDate), "dd/MM/yyyy")}</p></div>
              </div>
              <div><p className="text-sm text-gray-500 mb-2">Produtos</p><div className="space-y-2">{selectedPurchase.items.map((item: any, idx: number) => (<div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded"><div><p className="font-medium">{item.productName}</p><p className="text-sm text-gray-500">{item.quantity} x R$ {item.unitPrice.toFixed(2)}</p></div><p className="font-semibold">R$ {item.total.toFixed(2)}</p></div>))}</div></div>
              <div className="border-t pt-4"><div className="flex justify-between items-center"><p className="text-lg font-semibold">Total</p><p className="text-2xl font-bold text-[#2D5016]">R$ {selectedPurchase.totalValue.toFixed(2)}</p></div></div>
              {selectedPurchase.paymentStatus !== "paid" && (<Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => { handleMarkPurchaseAsPaid(selectedPurchase.id); setSelectedPurchase(null); }}><Check className="w-4 h-4 mr-2" /> Marcar esta compra como Paga</Button>)}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de detalhes do Cliente */}
      <Dialog open={!!selectedClientDetails} onOpenChange={() => setSelectedClientDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pedidos de {selectedClientDetails?.name}</DialogTitle>
          </DialogHeader>
          {selectedClientDetails && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{selectedClientDetails.name}</p>
                  <p className="text-sm text-gray-500">{selectedClientDetails.count} pedidos realizados</p>
                  <p className="text-sm text-gray-500">Total gasto: R$ {selectedClientDetails.total.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Pedidos realizados:</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {orders
                    .filter(o => o.clientName === selectedClientDetails.name && o.paymentStatus === "paid")
                    .map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Pedido {order.id}</p>
                          <p className="text-xs text-gray-500">{format(parseISO(order.date), "dd/MM/yyyy")}</p>
                          <p className="text-xs text-gray-500">{order.items.length} itens</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-green-600">R$ {order.totalValue.toFixed(2)}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedOrderFromClient(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {orders.filter(o => o.clientName === selectedClientDetails.name && o.paymentStatus === "paid").length === 0 && (
                    <div className="text-center py-8 text-gray-400">Nenhum pedido pago encontrado</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de detalhes do Fornecedor */}
      <Dialog open={!!selectedSupplierDetails} onOpenChange={() => setSelectedSupplierDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compras de {selectedSupplierDetails?.name}</DialogTitle>
          </DialogHeader>
          {selectedSupplierDetails && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{selectedSupplierDetails.name}</p>
                  <p className="text-sm text-gray-500">{selectedSupplierDetails.count} compras realizadas</p>
                  <p className="text-sm text-gray-500">Total gasto: R$ {selectedSupplierDetails.total.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Compras realizadas:</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {purchases
                    .filter(p => p.supplierName === selectedSupplierDetails.name && p.paymentStatus === "paid")
                    .map(purchase => (
                      <div key={purchase.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Compra {purchase.id}</p>
                          <p className="text-xs text-gray-500">{format(parseISO(purchase.date), "dd/MM/yyyy")}</p>
                          <p className="text-xs text-gray-500">{purchase.items.length} itens</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-red-600">R$ {purchase.totalValue.toFixed(2)}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedPurchaseFromSupplier(purchase)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {purchases.filter(p => p.supplierName === selectedSupplierDetails.name && p.paymentStatus === "paid").length === 0 && (
                    <div className="text-center py-8 text-gray-400">Nenhuma compra paga encontrada</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal de Detalhes do Pedido (Individual) */}
      <Dialog open={!!selectedOrderFromClient} onOpenChange={() => setSelectedOrderFromClient(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido {selectedOrderFromClient?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrderFromClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Cliente</p><p className="font-medium">{selectedOrderFromClient.clientName}</p></div>
                <div><p className="text-sm text-gray-500">Data</p><p>{format(parseISO(selectedOrderFromClient.date), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Vencimento</p><p>{selectedOrderFromClient.paymentMethod === "fiado" ? "Sem data definida" : format(parseISO(selectedOrderFromClient.paymentDueDate), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Pagamento</p><p className="capitalize">{selectedOrderFromClient.paymentMethod}</p></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Produtos</p>
                <div className="space-y-2">
                  {selectedOrderFromClient.items.map((item: any, idx: number) => (
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
              <div className="border-t pt-4 flex justify-between">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-2xl font-bold text-[#2D5016]">R$ {selectedOrderFromClient.totalValue.toFixed(2)}</p>
              </div>
              {selectedOrderFromClient.clientObservation && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Observações do Cliente:</p>
                  <p className="text-sm text-blue-600">{selectedOrderFromClient.clientObservation}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes da Compra (Individual) */}
      <Dialog open={!!selectedPurchaseFromSupplier} onOpenChange={() => setSelectedPurchaseFromSupplier(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Compra {selectedPurchaseFromSupplier?.id}</DialogTitle>
          </DialogHeader>
          {selectedPurchaseFromSupplier && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">Fornecedor</p><p className="font-medium">{selectedPurchaseFromSupplier.supplierName}</p></div>
                <div><p className="text-sm text-gray-500">Data</p><p>{format(parseISO(selectedPurchaseFromSupplier.date), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Vencimento</p><p>{format(parseISO(selectedPurchaseFromSupplier.paymentDueDate), "dd/MM/yyyy")}</p></div>
                <div><p className="text-sm text-gray-500">Pagamento</p><p className="capitalize">{selectedPurchaseFromSupplier.paymentMethod}</p></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Produtos</p>
                <div className="space-y-2">
                  {selectedPurchaseFromSupplier.items.map((item: any, idx: number) => (
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
              <div className="border-t pt-4 flex justify-between">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-2xl font-bold text-[#2D5016]">R$ {selectedPurchaseFromSupplier.totalValue.toFixed(2)}</p>
              </div>
              {selectedPurchaseFromSupplier.notes && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Observações:</p>
                  <p className="text-sm text-gray-600">{selectedPurchaseFromSupplier.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}