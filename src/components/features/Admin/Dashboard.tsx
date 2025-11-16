import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Download, Eye, Flag } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppStore } from "../../../store";
import type {
  ApplicationFilters,
  CreditApplication,
} from "../../../types/credit";
import { formatCurrency } from "../../../utils/creditCalculations";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Modal from "../../ui/Modal";

const AdminDashboard = () => {
  const { applications, getApplications, updateApplicationStatus, addNote } =
    useAppStore();
  const [filteredApplications, setFilteredApplications] = useState<
    CreditApplication[]
  >([]);
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedApp, setSelectedApp] = useState<CreditApplication | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const statusOptions = [
    { value: "", label: "Tous les statuts" },
    { value: "pending", label: "En attente" },
    { value: "in_progress", label: "En cours" },
    { value: "approved", label: "Approuvée" },
    { value: "rejected", label: "Refusée" },
  ];

  const statusLabels = {
    pending: "En attente",
    in_progress: "En cours",
    approved: "Approuvée",
    rejected: "Refusée",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    getApplications();
  }, [getApplications]);

  useEffect(() => {
    let filtered = [...applications];

    // Filtrer par statut
    if (filters.status) {
      filtered = filtered.filter((app) => app.status === filters.status);
    }

    // Filtrer par recherche
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.applicant.firstName.toLowerCase().includes(search) ||
          app.applicant.lastName.toLowerCase().includes(search) ||
          app.applicant.email.toLowerCase().includes(search)
      );
    }

    // Trier
    filtered.sort((a, b) => {
      let aValue: string | number = a[filters.sortBy!];
      let bValue: string | number = b[filters.sortBy!];

      if (filters.sortBy === "createdAt" || filters.sortBy === "updatedAt") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      const order = filters.sortOrder === "asc" ? 1 : -1;
      return aValue > bValue ? order : -order;
    });

    setFilteredApplications(filtered);
  }, [applications, filters]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    await updateApplicationStatus(appId, newStatus);
  };

  const handleAddNote = async () => {
    if (!selectedApp || !newNote.trim()) return;

    setIsAddingNote(true);
    try {
      await addNote(selectedApp.id, newNote);
      setNewNote("");
      // Actualiser les données de l'application sélectionnée
      const updatedApp = applications.find((app) => app.id === selectedApp.id);
      if (updatedApp) {
        setSelectedApp(updatedApp);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleViewDetails = (app: CreditApplication) => {
    setSelectedApp(app);
    setShowDetailModal(true);
  };

  const exportToCSV = () => {
    const csvContent = [
      "Date,Nom,Email,Téléphone,Statut,Montant,Revenu,Profession",
      ...filteredApplications.map((app) =>
        [
          new Date(app.createdAt).toLocaleDateString("fr-FR"),
          `${app.applicant.firstName} ${app.applicant.lastName}`,
          app.applicant.email,
          app.applicant.phone,
          statusLabels[app.status],
          // Note: we'd need to fetch simulation data to get amount
          "",
          app.applicant.monthlyIncome,
          app.applicant.profession,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demandes-credit-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Administration des demandes
              </h2>
              <p className="text-gray-600 mt-2">
                {applications.length} demande
                {applications.length > 1 ? "s" : ""} au total
              </p>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Filtres */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher par nom ou email..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />

            <div>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as
                      | "createdAt"
                      | "updatedAt"
                      | "status",
                  }))
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date de création</option>
                <option value="updatedAt">Dernière modification</option>
                <option value="status">Statut</option>
              </select>
            </div>

            <div>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortOrder: e.target.value as "asc" | "desc",
                  }))
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Plus récent</option>
                <option value="asc">Plus ancien</option>
              </select>
            </div>
          </div>

          {/* Tableau des demandes */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demandeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {app.applicant.firstName} {app.applicant.lastName}
                            </p>
                            {app.priority && (
                              <Flag className="h-4 w-4 text-red-500 ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {app.applicant.profession}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">
                        {app.applicant.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.applicant.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value)
                        }
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${
                          statusColors[app.status]
                        }`}
                      >
                        <option value="pending">En attente</option>
                        <option value="in_progress">En cours</option>
                        <option value="approved">Approuvée</option>
                        <option value="rejected">Refusée</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(app.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(app)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Aucune demande trouvée avec ces critères.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détail */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Détail de la demande"
        size="xl"
      >
        {selectedApp && (
          <div className="space-y-6">
            {/* Informations demandeur */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Informations du demandeur
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Nom complet</p>
                  <p className="font-medium">
                    {selectedApp.applicant.firstName}{" "}
                    {selectedApp.applicant.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{selectedApp.applicant.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Téléphone</p>
                  <p className="font-medium">{selectedApp.applicant.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Profession</p>
                  <p className="font-medium">
                    {selectedApp.applicant.profession}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Revenu mensuel</p>
                  <p className="font-medium">
                    {formatCurrency(selectedApp.applicant.monthlyIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Situation</p>
                  <p className="font-medium">
                    {selectedApp.applicant.employmentStatus}
                  </p>
                </div>
              </div>
              {selectedApp.applicant.comments && (
                <div className="mt-4">
                  <p className="text-gray-600">Commentaires</p>
                  <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">
                    {selectedApp.applicant.comments}
                  </p>
                </div>
              )}
            </div>

            {/* Notes administratives */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Notes internes
              </h4>
              <div className="space-y-3 mb-4">
                {selectedApp.notes.map((note) => (
                  <div key={note.id} className="bg-blue-50 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-blue-900">
                        {note.createdBy}
                      </span>
                      <span className="text-xs text-blue-600">
                        {new Date(note.createdAt).toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800">{note.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Ajouter une note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddNote}
                  loading={isAddingNote}
                  disabled={!newNote.trim()}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
