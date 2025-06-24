
import { ReactNode } from "react";
import { ClientSidebar } from "./ClientSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
