import { Calculator, Shield, TrendingUp, Users } from "lucide-react";
import { NavLink } from "router-kit";
import MainLayout from "../../../components/common/Layout/main";
import Button from "../../../components/ui/Button";

const Home = () => {
  const features = [
    {
      icon: Calculator,
      title: "Simulation rapide",
      description:
        "Calculez votre mensualité en quelques clics et obtenez un échéancier détaillé",
    },
    {
      icon: Users,
      title: "Service personnalisé",
      description:
        "Une équipe d'experts à votre écoute pour vous accompagner dans vos projets",
    },
    {
      icon: TrendingUp,
      title: "Taux compétitifs",
      description:
        "Bénéficiez des meilleurs taux du marché adaptés à votre profil",
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description:
        "Vos données sont protégées selon les standards de sécurité les plus élevés",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Simulez votre crédit en toute simplicité
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez nos solutions de financement adaptées à tous vos
              projets. Simulation gratuite, devis instantané et accompagnement
              personnalisé.
            </p>
            <div className="space-x-4">
              <NavLink to="/simulation">
                <Button size="lg">
                  <Calculator className="h-5 w-5 mr-2" />
                  Simuler mon crédit
                </Button>
              </NavLink>
              <Button variant="outline" size="lg">
                En savoir plus
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Types de crédits */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Nos solutions de financement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🚗</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Crédit Auto
                </h3>
                <p className="text-gray-600 text-sm">
                  Financez votre véhicule neuf ou d'occasion
                </p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🏠</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Crédit Immobilier
                </h3>
                <p className="text-gray-600 text-sm">
                  Réalisez votre projet immobilier
                </p>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Crédit Consommation
                </h3>
                <p className="text-gray-600 text-sm">
                  Pour tous vos projets personnels
                </p>
              </div>

              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">🏢</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Crédit Professionnel
                </h3>
                <p className="text-gray-600 text-sm">
                  Développez votre activité
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 bg-blue-600 rounded-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à concrétiser votre projet ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Simulez votre crédit maintenant et obtenez une réponse de principe
              immédiate
            </p>
            <NavLink to="/simulation">
              <Button size="lg" variant="secondary">
                <Calculator className="h-5 w-5 mr-2" />
                Commencer ma simulation
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
