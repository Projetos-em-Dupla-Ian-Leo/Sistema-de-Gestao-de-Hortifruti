import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { useApp } from "../context/AppContext";
import {
  Sun,
  Moon,
  Languages,
  Type,
  Eye,
  Bell,
  Database,
  RotateCcw,
  Monitor,
  Contrast,
  Volume2,
  Printer,
  Download,
  Upload,
  Zap,
  Palette,
  Trash2,
  AlertCircle,
} from "lucide-react";

export default function Configuracoes() {
  const { 
    getCurrentUser, 
    exportBackup,
    importBackup
  } = useApp();
  
  const currentUser = getCurrentUser();
  
  // Estados de tema
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large" | "xlarge">("medium");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [daltonism, setDaltonism] = useState<"none" | "protanopia" | "deuteranopia" | "tritanopia">("none");
  const [language, setLanguage] = useState("pt-BR");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [printHeaderFooter, setPrintHeaderFooter] = useState(true);
  const [backupDate, setBackupDate] = useState<string | null>(null);

  // Carregar configurações salvas ao iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("shizen_theme");
    if (savedTheme) setTheme(savedTheme as any);
    
    const savedFontSize = localStorage.getItem("shizen_font_size");
    if (savedFontSize) setFontSize(savedFontSize as any);
    
    const savedReducedMotion = localStorage.getItem("shizen_reduced_motion");
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === "true");
    
    const savedHighContrast = localStorage.getItem("shizen_high_contrast");
    if (savedHighContrast) setHighContrast(savedHighContrast === "true");
    
    const savedDaltonism = localStorage.getItem("shizen_daltonism");
    if (savedDaltonism) setDaltonism(savedDaltonism as any);
    
    const savedLanguage = localStorage.getItem("shizen_language");
    if (savedLanguage) setLanguage(savedLanguage);
    
    const savedNotifications = localStorage.getItem("shizen_notifications");
    if (savedNotifications !== null) setNotificationsEnabled(savedNotifications !== "false");
    
    const savedSound = localStorage.getItem("shizen_sound");
    if (savedSound) setSoundEnabled(savedSound === "true");
    
    const savedPrint = localStorage.getItem("shizen_print_header_footer");
    if (savedPrint !== null) setPrintHeaderFooter(savedPrint !== "false");
    
    const savedBackupDate = localStorage.getItem("shizen_last_backup");
    if (savedBackupDate) setBackupDate(savedBackupDate);
  }, []);

  // Aplicar tema
  useEffect(() => {
    const root = document.documentElement;
    const actualTheme = theme === "system" 
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : theme;
    
    if (actualTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("shizen_theme", theme);
  }, [theme]);

  // Aplicar tamanho da fonte
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes = {
      small: "13px",
      medium: "15px",
      large: "17px",
      xlarge: "19px",
    };
    root.style.fontSize = fontSizes[fontSize];
    localStorage.setItem("shizen_font_size", fontSize);
  }, [fontSize]);

  // Aplicar alto contraste
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    localStorage.setItem("shizen_high_contrast", String(highContrast));
  }, [highContrast]);

  // Aplicar redução de animações
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
    localStorage.setItem("shizen_reduced_motion", String(reducedMotion));
  }, [reducedMotion]);

  // Aplicar filtro de daltonismo
  useEffect(() => {
    const root = document.documentElement;
    const filters = {
      none: "",
      protanopia: "url(#protanopia)",
      deuteranopia: "url(#deuteranopia)",
      tritanopia: "url(#tritanopia)",
    };
    root.style.filter = filters[daltonism];
    localStorage.setItem("shizen_daltonism", daltonism);
  }, [daltonism]);

  // Salvar idioma
  useEffect(() => {
    localStorage.setItem("shizen_language", language);
  }, [language]);

  // Salvar notificações
  useEffect(() => {
    localStorage.setItem("shizen_notifications", String(notificationsEnabled));
    localStorage.setItem("shizen_sound", String(soundEnabled));
    localStorage.setItem("shizen_print_header_footer", String(printHeaderFooter));
  }, [notificationsEnabled, soundEnabled, printHeaderFooter]);

  // Funções de backup
  const handleBackup = () => {
    const backupData = exportBackup();
    const blob = new Blob([backupData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shizen_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    const now = new Date().toLocaleString();
    localStorage.setItem("shizen_last_backup", now);
    setBackupDate(now);
    alert("Backup realizado com sucesso!");
  };

  const handleRestore = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = event.target?.result as string;
          importBackup(data);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const resetSettings = () => {
    if (confirm("Tem certeza que deseja resetar todas as configurações?")) {
      setTheme("light");
      setFontSize("medium");
      setHighContrast(false);
      setReducedMotion(false);
      setDaltonism("none");
      setLanguage("pt-BR");
      setNotificationsEnabled(true);
      setSoundEnabled(false);
      setPrintHeaderFooter(true);
      alert("Configurações resetadas com sucesso!");
    }
  };

  const fontSizeOptions = [
    { value: "small", label: "Pequena", size: "13px", aaSize: "text-sm" },
    { value: "medium", label: "Média", size: "15px", aaSize: "text-base" },
    { value: "large", label: "Grande", size: "17px", aaSize: "text-lg" },
    { value: "xlarge", label: "Muito Grande", size: "19px", aaSize: "text-xl" },
  ];

  const daltonismOptions = [
    { value: "none", label: "Normal", description: "Sem filtro de cor" },
    { value: "protanopia", label: "Protanopia", description: "Dificuldade com vermelho" },
    { value: "deuteranopia", label: "Deuteranopia", description: "Dificuldade com verde" },
    { value: "tritanopia", label: "Tritanopia", description: "Dificuldade com azul/amarelo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Configurações</h1>
          <p className="text-gray-500">Personalize sua experiência no sistema</p>
        </div>
        <Button variant="outline" onClick={resetSettings} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Resetar
        </Button>
      </div>

      <Tabs defaultValue="aparencia" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="acessibilidade">Acessibilidade</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="impressao">Impressão</TabsTrigger>
          <TabsTrigger value="dados">Dados</TabsTrigger>
        </TabsList>

        {/* ABA APARÊNCIA */}
        <TabsContent value="aparencia" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Tema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  className={`p-4 border rounded-lg text-center transition-all ${
                    theme === "light" ? "border-[#2D5016] bg-green-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="font-medium">Claro</p>
                  <p className="text-sm text-gray-500">Modo padrão</p>
                </button>
                <button
                  className={`p-4 border rounded-lg text-center transition-all ${
                    theme === "dark" ? "border-[#2D5016] bg-green-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
                  <p className="font-medium">Escuro</p>
                  <p className="text-sm text-gray-500">Para ambientes com pouca luz</p>
                </button>
                <button
                  className={`p-4 border rounded-lg text-center transition-all ${
                    theme === "system" ? "border-[#2D5016] bg-green-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                  <p className="font-medium">Sistema</p>
                  <p className="text-sm text-gray-500">Segue as configurações do dispositivo</p>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5" />
                Tamanho da Fonte
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {fontSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`p-4 border rounded-lg text-center transition-all ${
                      fontSize === option.value ? "border-[#2D5016] bg-green-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setFontSize(option.value as any)}
                  >
                    <span className={`block mb-2 ${option.aaSize} font-medium`}>Aa</span>
                    <p className="text-sm text-gray-500">{option.label}</p>
                  </button>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">Exemplo de texto com o tamanho selecionado:</p>
                <p className="mt-2 dark:text-white">Este é um exemplo de como o texto aparecerá em todo o sistema.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Idioma
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className={`p-4 border rounded-lg text-center transition-all ${
                    language === "pt-BR" ? "border-[#2D5016] bg-green-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setLanguage("pt-BR")}
                >
                  <p className="font-medium">Português (Brasil)</p>
                  <p className="text-sm text-gray-500">Idioma padrão</p>
                </button>
                <button
                  className="p-4 border rounded-lg text-center opacity-50 cursor-not-allowed"
                  disabled
                >
                  <p className="font-medium">English</p>
                  <p className="text-sm text-gray-400">Em breve</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA ACESSIBILIDADE */}
        <TabsContent value="acessibilidade" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Contrast className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Alto Contraste</p>
                    <p className="text-sm text-gray-500">Melhora a legibilidade para pessoas com baixa visão</p>
                  </div>
                </div>
                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Redução de Animações</p>
                    <p className="text-sm text-gray-500">Remove ou reduz animações para pessoas com sensibilidades</p>
                  </div>
                </div>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Filtro para Daltonismo</p>
                    <p className="text-sm text-gray-500">Ajusta as cores para facilitar a distinção</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daltonismOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`p-3 border rounded-lg text-center transition-all ${
                        daltonism === option.value ? "border-[#2D5016] bg-green-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setDaltonism(option.value as any)}
                    >
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-gray-400">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Atalhos de Teclado</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 border-b">
                  <span>Alternar tema (claro/escuro)</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + T</kbd>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span>Abrir notificações</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + N</kbd>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span>Voltar para Dashboard</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + D</kbd>
                </div>
                <div className="flex justify-between p-2 border-b">
                  <span>Salvar formulário</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + S</kbd>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA NOTIFICAÇÕES */}
        <TabsContent value="notificacoes" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Notificações do Sistema</p>
                    <p className="text-sm text-gray-500">Receber alertas sobre pedidos e estoque</p>
                  </div>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Sons de Notificação</p>
                    <p className="text-sm text-gray-500">Reproduzir som ao receber notificações</p>
                  </div>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} disabled={!notificationsEnabled} />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 As notificações incluem: novos pedidos, pedidos pagos, compras realizadas, 
                  compras pagas, produtos com estoque baixo e produtos próximos do vencimento.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA IMPRESSÃO */}
        <TabsContent value="impressao" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Printer className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Imprimir Cabeçalho e Rodapé</p>
                    <p className="text-sm text-gray-500">Incluir nome da empresa e informações na impressão</p>
                  </div>
                </div>
                <Switch checked={printHeaderFooter} onCheckedChange={setPrintHeaderFooter} />
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview do formato de impressão:</p>
                <div className="border rounded-lg p-3 bg-white dark:bg-gray-900">
                  {printHeaderFooter && (
                    <div className="text-center border-b pb-2 mb-2">
                      <p className="font-bold dark:text-white">Shizen Orgânicos</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Sistema de Gestão</p>
                    </div>
                  )}
                  <div className="min-h-[100px]">
                    <p className="text-sm text-gray-400 text-center">Conteúdo do documento...</p>
                  </div>
                  {printHeaderFooter && (
                    <div className="text-center border-t pt-2 mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Documento gerado em {new Date().toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA DADOS */}
        <TabsContent value="dados" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium">Gerenciamento de Dados</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Faça backup, restaure ou limpe seus dados</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleBackup} className="gap-2 bg-[#2D5016]">
                  <Download className="w-4 h-4" />
                  Fazer Backup
                </Button>
                <Button onClick={handleRestore} variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Restaurar Backup
                </Button>
              </div>

              {backupDate && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Último backup realizado em:</p>
                  <p className="font-medium dark:text-white">{backupDate}</p>
                </div>
              )}

              {/* Botão Resetar Dados */}
              <div className="border-t dark:border-gray-700 pt-4 mt-2">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="font-semibold text-red-800 dark:text-red-300">Área de Risco</p>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                    ⚠️ Resetar todos os dados irá apagar permanentemente produtos, clientes, pedidos, compras, usuários e configurações. 
                    Esta ação não pode ser desfeita. Recomenda-se fazer um backup antes.
                  </p>
                  <Button 
                    onClick={() => {
                      if(confirm('⚠️ ATENÇÃO! Isso irá LIMPAR TODOS OS DADOS do sistema (produtos, clientes, pedidos, compras, usuários e configurações).\n\nRecomenda-se fazer um backup antes.\n\nTem certeza que deseja continuar?')) {
                        if(confirm('ÚLTIMA CONFIRMAÇÃO: Esta ação é IRREVERSÍVEL. Deseja realmente resetar todos os dados?')) {
                          Object.keys(localStorage).filter(key => key.startsWith('shizen_')).forEach(key => localStorage.removeItem(key));
                          alert('Todos os dados foram resetados! A página será recarregada.');
                          window.location.reload();
                        }
                      }
                    }}
                    className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                    Resetar Todos os Dados
                  </Button>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-3">
                    * Após resetar, o sistema recarregará com os dados iniciais de fábrica.
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  💾 O backup inclui todos os produtos, clientes, pedidos, compras, fornecedores, usuários e configurações.
                  Recomenda-se fazer backup regularmente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Filtros SVG para daltonismo */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="protanopia">
          <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
        </filter>
        <filter id="deuteranopia">
          <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
        </filter>
        <filter id="tritanopia">
          <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
        </filter>
      </svg>
    </div>
  );
}