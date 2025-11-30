import { NavBar } from "@/modules/home/ui/components/navbar";
import { AnimatedBackground } from "@/components/animated-background";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
      <NavBar />
      <AnimatedBackground />
      <div className="flex-1 flex flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;
