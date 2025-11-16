import { Calculator, FileText, Send } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "../../../store";
import type { SimulationFormData } from "../../../types/credit";
import {
  createSimulation,
  formatCurrency,
  formatPercentage,
  validateSimulationForm,
} from "../../../utils/creditCalculations";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Modal from "../../ui/Modal";
import NavigateButton from "../../ui/Navigation";

const CreditSimulator = () => {
  const { addSimulation, currentSimulation } = useAppStore();
  const [formData, setFormData] = useState<SimulationFormData>({
    creditType: "consommation",
    profession: "",
    amount: "",
    duration: "",
    annualRate: "3.5",
    fixedFees: "",
    insuranceRate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const creditTypes = [
    { value: "auto", label: "Crédit Auto" },
    { value: "consommation", label: "Crédit Consommation" },
    { value: "immobilier", label: "Crédit Immobilier" },
    { value: "professionnel", label: "Crédit Professionnel" },
  ];

  const handleInputChange = (
    field: keyof SimulationFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSimulationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const simulation = createSimulation({
      creditType: formData.creditType,
      profession: formData.profession,
      amount: parseFloat(formData.amount),
      duration: parseInt(formData.duration),
      annualRate: parseFloat(formData.annualRate),
      fixedFees: formData.fixedFees ? parseFloat(formData.fixedFees) : 0,
      insuranceRate: formData.insuranceRate
        ? parseFloat(formData.insuranceRate)
        : 0,
    });

    addSimulation(simulation);
    setShowResults(true);
  };

  const resetForm = () => {
    setFormData({
      creditType: "consommation",
      profession: "",
      amount: "",
      duration: "",
      annualRate: "3.5",
      fixedFees: "",
      insuranceRate: "",
    });
    setErrors({});
    setShowResults(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Simulateur de Crédit
            </h2>
          </div>
          <p className="text-gray-600 mt-2">
            Calculez votre mensualité et obtenez un aperçu de votre crédit
          </p>
        </div>

        <div className="p-6">
          {!showResults ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type de crédit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de crédit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.creditType}
                    onChange={(e) =>
                      handleInputChange("creditType", e.target.value)
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {creditTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profession */}
                <Input
                  label="Profession"
                  value={formData.profession}
                  onChange={(e) =>
                    handleInputChange("profession", e.target.value)
                  }
                  error={errors.profession}
                  required
                />

                {/* Montant */}
                <Input
                  label="Montant du crédit (€)"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  error={errors.amount}
                  min="1000"
                  max="1000000"
                  step="100"
                  required
                />

                {/* Durée */}
                <Input
                  label="Durée (mois)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  error={errors.duration}
                  min="6"
                  max="360"
                  required
                />

                {/* Taux annuel */}
                <Input
                  label="Taux annuel (%)"
                  type="number"
                  value={formData.annualRate}
                  onChange={(e) =>
                    handleInputChange("annualRate", e.target.value)
                  }
                  error={errors.annualRate}
                  min="0"
                  max="20"
                  step="0.1"
                  required
                />

                {/* Frais fixes */}
                <Input
                  label="Frais fixes (€)"
                  type="number"
                  value={formData.fixedFees}
                  onChange={(e) =>
                    handleInputChange("fixedFees", e.target.value)
                  }
                  error={errors.fixedFees}
                  min="0"
                  step="10"
                />

                {/* Assurance */}
                <Input
                  label="Assurance (%)"
                  type="number"
                  value={formData.insuranceRate}
                  onChange={(e) =>
                    handleInputChange("insuranceRate", e.target.value)
                  }
                  error={errors.insuranceRate}
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              <div className="flex justify-center space-x-4">
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Réinitialiser
                </Button>
                <Button type="submit">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculer
                </Button>
              </div>
            </form>
          ) : (
            currentSimulation && (
              <div className="space-y-6">
                {/* Résultats principaux */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Résultats de votre simulation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">
                        Mensualité
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(currentSimulation.monthlyPayment)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">
                        Coût total
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(currentSimulation.totalCost)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">TAEG</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatPercentage(currentSimulation.taeg)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tableau d'amortissement (aperçu) */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Échéancier (premiers mois)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Mois
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Mensualité
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Capital
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Intérêts
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Capital restant
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSimulation.amortizationSchedule
                          .slice(0, 6)
                          .map((entry) => (
                            <tr key={entry.month} className="border-t">
                              <td className="px-4 py-2 text-sm">
                                {entry.month}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {formatCurrency(entry.monthlyPayment)}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {formatCurrency(entry.principal)}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {formatCurrency(entry.interest)}
                              </td>
                              <td className="px-4 py-2 text-sm">
                                {formatCurrency(entry.remainingBalance)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {currentSimulation.amortizationSchedule.length > 6 && (
                    <p className="text-sm text-gray-500 mt-2">
                      ... et {currentSimulation.amortizationSchedule.length - 6}{" "}
                      autres mensualités
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-center space-x-4">
                  <Button variant="secondary" onClick={resetForm}>
                    Nouvelle simulation
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  <NavigateButton
                    to="/application"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Faire une demande
                  </NavigateButton>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal de demande de crédit */}
      <Modal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        title="Faire une demande de crédit"
        size="lg"
      >
        <p className="text-gray-600 mb-4">
          Vous allez être redirigé vers le formulaire de demande basé sur votre
          simulation.
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={() => setShowApplicationModal(false)}
          >
            Annuler
          </Button>
          <NavigateButton to="/application">Continuer</NavigateButton>
        </div>
      </Modal>
    </div>
  );
};

export default CreditSimulator;
