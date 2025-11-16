import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CreditApplication,
  Notification,
  Simulation,
  User,
} from "../types/credit";

interface AppState {
  // Authentification
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Simulations
  currentSimulation: Simulation | null;
  simulations: Simulation[];
  setCurrentSimulation: (simulation: Simulation | null) => void;
  addSimulation: (simulation: Simulation) => void;
  getSimulations: () => Promise<void>;

  // Applications
  applications: CreditApplication[];
  getApplications: () => Promise<void>;
  addApplication: (application: CreditApplication) => void;
  updateApplicationStatus: (id: string, status: string) => Promise<void>;
  addNote: (applicationId: string, note: string) => Promise<void>;

  // Notifications
  notifications: Notification[];
  getNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  unreadCount: number;
}

const API_BASE = "http://localhost:3001/api";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      isAuthenticated: false,
      currentSimulation: null,
      simulations: [],
      applications: [],
      notifications: [],
      unreadCount: 0,

      // Actions d'authentification
      login: async (email: string, password: string) => {
        try {
          const response = await fetch(
            `${API_BASE}/users?email=${email}&password=${password}`
          );
          const users = await response.json();

          if (users.length > 0) {
            const user = users[0];
            set({ user, isAuthenticated: true });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          currentSimulation: null,
          applications: [],
          notifications: [],
          unreadCount: 0,
        });
      },

      // Actions pour les simulations
      setCurrentSimulation: (simulation: Simulation | null) => {
        set({ currentSimulation: simulation });
      },

      addSimulation: (simulation: Simulation) => {
        set((state) => ({
          simulations: [...state.simulations, simulation],
          currentSimulation: simulation,
        }));
      },

      getSimulations: async () => {
        try {
          const response = await fetch(`${API_BASE}/simulations`);
          const simulations = await response.json();
          set({ simulations });
        } catch (error) {
          console.error("Error fetching simulations:", error);
        }
      },

      // Actions pour les applications
      getApplications: async () => {
        try {
          const response = await fetch(`${API_BASE}/applications`);
          const applications = await response.json();
          set({ applications });
        } catch (error) {
          console.error("Error fetching applications:", error);
        }
      },

      addApplication: (application: CreditApplication) => {
        set((state) => ({
          applications: [...state.applications, application],
        }));
      },

      updateApplicationStatus: async (id: string, status: string) => {
        try {
          const response = await fetch(`${API_BASE}/applications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });

          if (response.ok) {
            const updatedApp = await response.json();
            set((state) => ({
              applications: state.applications.map((app) =>
                app.id === id ? updatedApp : app
              ),
            }));
          }
        } catch (error) {
          console.error("Error updating application status:", error);
        }
      },

      addNote: async (applicationId: string, noteContent: string) => {
        try {
          const { user } = get();
          const note = {
            id: Date.now().toString(),
            content: noteContent,
            createdBy: user?.name || "Admin",
            createdAt: new Date().toISOString(),
          };

          const response = await fetch(
            `${API_BASE}/applications/${applicationId}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                notes: [
                  ...(get().applications.find((app) => app.id === applicationId)
                    ?.notes || []),
                  note,
                ],
              }),
            }
          );

          if (response.ok) {
            const updatedApp = await response.json();
            set((state) => ({
              applications: state.applications.map((app) =>
                app.id === applicationId ? updatedApp : app
              ),
            }));
          }
        } catch (error) {
          console.error("Error adding note:", error);
        }
      },

      // Actions pour les notifications
      getNotifications: async () => {
        try {
          const response = await fetch(`${API_BASE}/notifications`);
          const notifications = await response.json();
          const unreadCount = notifications.filter(
            (n: Notification) => !n.read
          ).length;
          set({ notifications, unreadCount });
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      },

      markNotificationAsRead: async (id: string) => {
        try {
          const response = await fetch(`${API_BASE}/notifications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
          });

          if (response.ok) {
            set((state) => ({
              notifications: state.notifications.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
              ),
              unreadCount: Math.max(0, state.unreadCount - 1),
            }));
          }
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      },
    }),
    {
      name: "salefni-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentSimulation: state.currentSimulation,
      }),
    }
  )
);
