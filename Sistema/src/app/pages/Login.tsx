import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useApp } from "../context/AppContext";
import logoShizen from "../../imports/cropped-logo_shizen-1.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular um pequeno delay para melhor experiência
    setTimeout(() => {
      if (login(email, password)) {
        navigate("/dashboard");
      } else {
        alert("E-mail ou senha inválidos! Tente novamente.");
        setIsLoading(false);
      }
    }, 500);
  };

  // Credenciais de teste para facilitar (opcional - pode remover depois)
  const testCredentials = [
    { email: "admin@shizen.com", password: "admin123", role: "Administrador" },
    { email: "vendedor@shizen.com", password: "venda123", role: "Vendedor" },
    { email: "estoque@shizen.com", password: "estoque123", role: "Estoque" },
    { email: "financeiro@shizen.com", password: "finan123", role: "Financeiro" },
  ];

  const fillTestCredentials = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white">
      {/* Logo oficial Shizen Orgânicos - Topo esquerdo */}
      <div className="absolute top-8 left-8">
        <img
          src={logoShizen}
          alt="Shizen Orgânicos"
          className="h-16 w-auto"
        />
      </div>

      {/* Caixa de Login Centralizada */}
      <div className="w-full max-w-md px-8">
        <div className="mb-8">
          <h2 className="text-3xl mb-2" style={{ fontWeight: 600 }}>
            Bem-vindo de volta!
          </h2>
          <p className="text-gray-600">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-sm text-[#2D5016] hover:underline">
              Esqueci minha senha
            </a>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#2D5016] hover:bg-[#1f3a10] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Painel de credenciais de teste (apenas para desenvolvimento - remova em produção) */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center mb-3">
            🔐 Credenciais de teste:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {testCredentials.map((cred, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => fillTestCredentials(cred.email, cred.password)}
                className="text-left p-2 rounded hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-[#2D5016]">{cred.role}</span>
                <br />
                <span className="text-gray-500 text-xs">{cred.email}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            Clique em qualquer perfil para preencher automaticamente
          </p>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2026 Shizen Orgânicos. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}