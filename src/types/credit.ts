// Types pour les simulations de crédit
export interface Simulation {
  id: string;
  creditType: "auto" | "consommation" | "immobilier" | "professionnel";
  profession: string;
  amount: number; // Montant du crédit
  duration: number; // Durée en mois
  annualRate: number; // Taux annuel en pourcentage
  fixedFees?: number; // Frais fixes optionnels
  insuranceRate?: number; // Assurance en pourcentage
  monthlyPayment: number; // Mensualité calculée
  totalCost: number; // Coût total
  taeg: number; // TAEG simplifié
  amortizationSchedule: AmortizationEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface AmortizationEntry {
  month: number;
  monthlyPayment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

// Types pour les demandes de crédit
export interface CreditApplication {
  id: string;
  simulationId: string;
  applicant: ApplicantInfo;
  status: "pending" | "in_progress" | "approved" | "rejected";
  priority: boolean;
  notes: AdminNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicantInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  profession: string;
  employmentStatus: "employed" | "self_employed" | "unemployed" | "retired";
  comments?: string;
}

export interface AdminNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: "new_application" | "status_change";
  title: string;
  message: string;
  applicationId?: string;
  read: boolean;
  createdAt: string;
}

// Types pour les utilisateurs
export interface User {
  id: number;
  email: string;
  password: string;
  role: "admin" | "guest";
  name: string;
}

// Types pour les filtres et recherches
export interface ApplicationFilters {
  status?: string;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "status";
  sortOrder?: "asc" | "desc";
}

// Types pour les formulaires
export interface SimulationFormData {
  creditType: string;
  profession: string;
  amount: string;
  duration: string;
  annualRate: string;
  fixedFees?: string;
  insuranceRate?: string;
}

export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  monthlyIncome: string;
  profession: string;
  employmentStatus: string;
  comments?: string;
}
