# 🏦 Salefni - Plateforme de Simulation et Gestion de Crédits

Une application web moderne permettant la simulation de crédits et la gestion des demandes administratives.

## 🎯 Fonctionnalités

### Pour les visiteurs (Guests)

- **Simulation de crédit** : Calcul instantané de mensualités, coût total, TAEG
- **Types de crédits supportés** : Auto, Consommation, Immobilier, Professionnel
- **Échéancier détaillé** : Tableau d'amortissement avec répartition capital/intérêts
- **Demande de crédit** : Formulaire complet basé sur la simulation
- **Export PDF** : Téléchargement des simulations (à venir)

### Pour les administrateurs

- **Dashboard complet** : Vue d'ensemble des demandes
- **Gestion des statuts** : En attente, En cours, Approuvée, Refusée
- **Système de notes** : Annotations internes pour chaque demande
- **Filtres et recherche** : Par statut, nom, email, date
- **Notifications** : Alertes pour nouvelles demandes
- **Export CSV** : Extraction des données pour analyse

## 🛠️ Technologies utilisées

- **Frontend** : React 19 + TypeScript + Vite
- **Routing** : Router-kit
- **State Management** : Zustand avec persistance
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **Backend Mock** : JSON Server
- **Dates** : date-fns
- **Export** : jsPDF + html2canvas (à venir)

## 🚀 Installation et démarrage

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
git clone https://github.com/Mohammed-Ben-Cheikh/Salefni.git
cd Salefni
npm install
```

### Démarrage du serveur mock

```bash
npm run server
```

Le serveur JSON sera disponible sur `http://localhost:3001`

### Démarrage de l'application

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5174`

### Démarrage complet (serveur + app)

```bash
npm run dev:full
```

## 📁 Structure du projet

```
src/
├── components/
│   ├── common/           # Composants partagés (Header, Footer, Layout)
│   ├── features/         # Composants métier
│   │   ├── Auth/         # Authentification admin
│   │   ├── CreditSimulator/  # Simulateur de crédit
│   │   ├── CreditApplication/ # Formulaire de demande
│   │   └── Admin/        # Interface d'administration
│   └── ui/               # Composants UI réutilisables
├── pages/                # Pages de l'application
├── store/                # Gestion d'état Zustand
├── types/                # Types TypeScript
├── utils/                # Utilitaires (calculs, validation)
└── router/               # Configuration des routes
```

## 🔐 Authentification

### Compte administrateur par défaut :

- **Email** : `admin@salefni.com`
- **Mot de passe** : `admin123`

## 📊 Base de données

Les données sont stockées dans `api/db.json` avec les collections :

- `simulations` : Simulations de crédit
- `applications` : Demandes de crédit
- `notifications` : Notifications admin
- `users` : Utilisateurs (admin)

## 🧮 Calculs de crédit

L'application implémente les formules financières standard :

- **Mensualité** : Calcul avec taux, durée, assurance
- **TAEG** : Taux Annuel Effectif Global
- **Amortissement** : Répartition capital/intérêts par période
- **Validation** : Contrôles de cohérence des données

## 🎨 Interface utilisateur

- Design responsive (mobile-first)
- Interface moderne avec Tailwind CSS
- Composants réutilisables avec props typées
- Animations et transitions fluides
- Accessibilité prise en compte

## 📱 Pages principales

- `/` : Page d'accueil avec présentation des services
- `/simulation` : Simulateur de crédit interactif
- `/application` : Formulaire de demande de crédit
- `/admin/login` : Connexion administrateur
- `/admin` : Dashboard d'administration

## 🔄 Workflow typique

1. **Visiteur** accède à la simulation
2. **Saisie** des paramètres du crédit
3. **Calcul** automatique des résultats
4. **Demande** basée sur la simulation
5. **Notification** envoyée à l'admin
6. **Traitement** par l'administrateur
7. **Suivi** du statut de la demande

## 🚀 Fonctionnalités à venir

- [ ] Export PDF des simulations
- [ ] Système d'emails automatiques
- [ ] Authentification par JWT
- [ ] Téléchargement de pièces justificatives
- [ ] Tableau de bord analytics
- [ ] API REST complète
- [ ] Tests unitaires et e2e

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- Signaler des bugs
- Proposer des améliorations
- Soumettre des pull requests

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Salefni** - Votre partenaire de confiance pour tous vos projets de financement 🏦
