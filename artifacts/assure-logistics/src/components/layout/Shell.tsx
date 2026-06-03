import React from 'react';
import { Link, useLocation } from 'wouter';
import { Package, Truck, LayoutDashboard, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/shipments', label: 'Shipments', icon: Package },
    { href: '/carriers', label: 'Carriers', icon: Truck },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader className="flex h-14 items-center justify-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-primary-foreground">
              <Activity className="h-5 w-5 text-sidebar-primary" />
              <span className="truncate">Assure Logistics</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="mt-4 px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={location === item.href || (location.startsWith(item.href) && item.href !== '/')}>
                    <Link href={item.href} data-testid={`nav-${item.label.toLowerCase()}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4 text-xs text-muted-foreground text-center">
            System Online
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            {/* Top nav extras could go here */}
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
