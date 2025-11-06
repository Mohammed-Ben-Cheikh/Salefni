import type { ReactNode } from "react";
import MainFooter from "../Footer/main";
import MainHeader from "../Header/main";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MainHeader />
      <main className="pt-16 flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </main>
      <MainFooter />
    </div>
  );
};

export default MainLayout;
