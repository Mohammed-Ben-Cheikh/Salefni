import { CheckCircle, Send } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "../../../store";
import type {
  ApplicationFormData,
  CreditApplication,
} from "../../../types/credit";
import { formatCurrency } from "../../../utils/creditCalculations";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const CreditApplicationForm = () => {
  const { currentSimulation, addApplication } = useAppStore();
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    monthlyIncome: "",
    profession: currentSimulation?.profession || "",
    employmentStatus: "employed",
    comments: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const employmentOptions = [
    { value: "employed", label: "Salarié(e)" },
    { value: "self_employed", label: "Indépendant(e)" },
    { value: "unemployed", label: "Sans emploi" },
    { value: "retired", label: "Retraité(e)" },
  ];

  const handleInputChange = (
    field: keyof ApplicationFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!/^[0-9\s+()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Numéro de téléphone invalide";
    }

    if (!formData.monthlyIncome.trim()) {
      newErrors.monthlyIncome = "Le revenu mensuel est requis";
    } else if (parseFloat(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = "Le revenu doit être supérieur à 0";
    }

    if (!formData.profession.trim()) {
      newErrors.profession = "La profession est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentSimulation) {
      alert(
        "Aucune simulation trouvée. Veuillez d'abord effectuer une simulation."
      );
      window.location.href = "/simulation";
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const application: CreditApplication = {
        id: Date.now().toString(),
        simulationId: currentSimulation.id,
        applicant: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          monthlyIncome: parseFloat(formData.monthlyIncome),
          profession: formData.profession,
          employmentStatus: formData.employmentStatus as
            | "employed"
            | "self_employed"
            | "unemployed"
            | "retired",
          comments: formData.comments,
        },
        status: "pending",
        priority: false,
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Sauvegarder en base
      const response = await fetch("http://localhost:3001/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
      });

      if (response.ok) {
        // Créer une notification pour l'admin
        await fetch("http://localhost:3001/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: Date.now().toString(),
            type: "new_application",
            title: "Nouvelle demande de crédit",
            message: `${formData.firstName} ${formData.lastName} a soumis une demande de crédit`,
            applicationId: application.id,
            read: false,
            createdAt: new Date().toISOString(),
          }),
        });

        addApplication(application);
        setIsSubmitted(true);
      } else {
        throw new Error("Erreur lors de la soumission");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Une erreur est survenue lors de la soumission de votre demande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentSimulation) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 mb-4">
            Vous devez d'abord effectuer une simulation pour pouvoir faire une
            demande.
          </p>
          <Button onClick={() => (window.location.href = "/simulation")}>
            Faire une simulation
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Demande envoyée !
          </h2>
          <p className="text-green-700 mb-6">
            Votre demande de crédit a été transmise avec succès. Vous recevrez
            une réponse sous 48h à l'adresse email fournie.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
            <Button variant="outline" onClick={() => navigate("/simulation")}>
              Nouvelle simulation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Demande de crédit
          </h2>
          <p className="text-gray-600 mt-2">
            Complétez vos informations pour finaliser votre demande
          </p>
        </div>

        <div className="p-6">
          {/* Récapitulatif de la simulation */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Récapitulatif de votre simulation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-600">Montant</p>
                <p className="font-semibold">
                  {formatCurrency(currentSimulation.amount)}
                </p>
              </div>
              <div>
                <p className="text-blue-600">Durée</p>
                <p className="font-semibold">
                  {currentSimulation.duration} mois
                </p>
              </div>
              <div>
                <p className="text-blue-600">Mensualité</p>
                <p className="font-semibold">
                  {formatCurrency(currentSimulation.monthlyPayment)}
                </p>
              </div>
              <div>
                <p className="text-blue-600">Coût total</p>
                <p className="font-semibold">
                  {formatCurrency(currentSimulation.totalCost)}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Prénom"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={errors.firstName}
                required
              />

              <Input
                label="Nom"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={errors.lastName}
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label="Téléphone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={errors.phone}
                required
              />

              <Input
                label="Revenu mensuel net (€)"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) =>
                  handleInputChange("monthlyIncome", e.target.value)
                }
                error={errors.monthlyIncome}
                min="0"
                step="100"
                required
              />

              <Input
                label="Profession"
                value={formData.profession}
                onChange={(e) =>
                  handleInputChange("profession", e.target.value)
                }
                error={errors.profession}
                required
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation professionnelle{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) =>
                    handleInputChange("employmentStatus", e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {employmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) =>
                    handleInputChange("comments", e.target.value)
                  }
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Informations complémentaires..."
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => (window.location.href = "/simulation")}
              >
                Retour à la simulation
              </Button>
              <Button type="submit" loading={isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer la demande
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreditApplicationForm;
