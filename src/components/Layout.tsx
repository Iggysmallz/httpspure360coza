import { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import ChatBot from "./ChatBot";

interface LayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

const Layout = ({ children, showBottomNav = true }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className={showBottomNav ? "flex-1 pb-20 md:pb-0" : "flex-1"}>
        {children}
      </main>
      {showBottomNav && <BottomNav />}
      <ChatBot />
    </div>
  );
};

export default Layout;
