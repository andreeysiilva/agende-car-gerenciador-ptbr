
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientSidebar } from "./ClientSidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Layout principal para as páginas do cliente
export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <ClientSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-4 md:p-6 pt-16 md:pt-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
