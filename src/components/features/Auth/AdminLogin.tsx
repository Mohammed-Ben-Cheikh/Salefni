import { Lock, LogIn } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "../../../store";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAppStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    window.location.href = "/admin";
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        window.location.href = "/admin";
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Lock className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion Administrateur
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Accédez à l'interface d'administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              autoComplete="email"
            />

            <Input
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" loading={isLoading}>
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
          </form>

          <div className="mt-6">
            <div className="bg-blue-50 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Compte de démonstration :</strong>
                <br />
                Email: admin@salefni.com
                <br />
                Mot de passe: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
