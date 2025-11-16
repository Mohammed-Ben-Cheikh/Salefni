import type { AmortizationEntry, Simulation } from "../types/credit";

/**
 * Calcule la mensualité d'un crédit
 */
export function calculateMonthlyPayment(
  amount: number,
  annualRate: number,
  durationInMonths: number,
  fixedFees: number = 0,
  insuranceRate: number = 0
): number {
  const monthlyRate = annualRate / 100 / 12;
  const insuranceAmount = (amount * insuranceRate) / 100 / 12;
  const feePerMonth = fixedFees / durationInMonths;

  if (monthlyRate === 0) {
    return amount / durationInMonths + insuranceAmount + feePerMonth;
  }

  const factor = Math.pow(1 + monthlyRate, durationInMonths);
  const monthlyPayment = (amount * monthlyRate * factor) / (factor - 1);

  return monthlyPayment + insuranceAmount + feePerMonth;
}

/**
 * Calcule le coût total du crédit
 */
export function calculateTotalCost(
  monthlyPayment: number,
  durationInMonths: number,
  fixedFees: number = 0
): number {
  return monthlyPayment * durationInMonths + fixedFees;
}

/**
 * Calcule le TAEG simplifié
 */
export function calculateTAEG(
  amount: number,
  totalCost: number,
  durationInMonths: number
): number {
  const totalInterest = totalCost - amount;
  const yearlyRate = totalInterest / amount / (durationInMonths / 12);
  return yearlyRate * 100;
}

/**
 * Génère le tableau d'amortissement
 */
export function generateAmortizationSchedule(
  amount: number,
  annualRate: number,
  durationInMonths: number,
  monthlyPayment: number
): AmortizationEntry[] {
  const monthlyRate = annualRate / 100 / 12;
  const schedule: AmortizationEntry[] = [];
  let remainingBalance = amount;

  for (let month = 1; month <= durationInMonths; month++) {
    const interest = remainingBalance * monthlyRate;
    const principal = monthlyPayment - interest;
    remainingBalance = Math.max(0, remainingBalance - principal);

    schedule.push({
      month,
      monthlyPayment,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingBalance: Math.round(remainingBalance * 100) / 100,
    });
  }

  return schedule;
}

/**
 * Crée une simulation complète
 */
export function createSimulation(formData: {
  creditType: string;
  profession: string;
  amount: number;
  duration: number;
  annualRate: number;
  fixedFees?: number;
  insuranceRate?: number;
}): Simulation {
  const {
    amount,
    duration,
    annualRate,
    fixedFees = 0,
    insuranceRate = 0,
  } = formData;

  const monthlyPayment = calculateMonthlyPayment(
    amount,
    annualRate,
    duration,
    fixedFees,
    insuranceRate
  );

  const totalCost = calculateTotalCost(monthlyPayment, duration, fixedFees);
  const taeg = calculateTAEG(amount, totalCost, duration);
  const amortizationSchedule = generateAmortizationSchedule(
    amount,
    annualRate,
    duration,
    monthlyPayment
  );

  return {
    id: Date.now().toString(),
    creditType: formData.creditType as
      | "auto"
      | "consommation"
      | "immobilier"
      | "professionnel",
    profession: formData.profession,
    amount,
    duration,
    annualRate,
    fixedFees,
    insuranceRate,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    taeg: Math.round(taeg * 100) / 100,
    amortizationSchedule,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Formate un montant en euros
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * Valide les données du formulaire de simulation
 */
export function validateSimulationForm(data: {
  amount: string;
  duration: string;
  annualRate: string;
  fixedFees?: string;
  insuranceRate?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const amount = parseFloat(data.amount);
  const duration = parseInt(data.duration);
  const annualRate = parseFloat(data.annualRate);
  const fixedFees = data.fixedFees ? parseFloat(data.fixedFees) : 0;
  const insuranceRate = data.insuranceRate ? parseFloat(data.insuranceRate) : 0;

  if (isNaN(amount) || amount <= 0) {
    errors.amount = "Le montant doit être supérieur à 0";
  } else if (amount < 1000 || amount > 1000000) {
    errors.amount = "Le montant doit être entre 1 000€ et 1 000 000€";
  }

  if (isNaN(duration) || duration <= 0) {
    errors.duration = "La durée doit être supérieure à 0";
  } else if (duration < 6 || duration > 360) {
    errors.duration = "La durée doit être entre 6 et 360 mois";
  }

  if (isNaN(annualRate) || annualRate < 0) {
    errors.annualRate = "Le taux doit être positif";
  } else if (annualRate > 20) {
    errors.annualRate = "Le taux ne peut pas dépasser 20%";
  }

  if (fixedFees < 0) {
    errors.fixedFees = "Les frais fixes ne peuvent pas être négatifs";
  }

  if (insuranceRate < 0 || insuranceRate > 5) {
    errors.insuranceRate = "Le taux d'assurance doit être entre 0% et 5%";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
