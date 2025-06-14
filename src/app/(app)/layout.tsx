
// src/app/(app)/layout.tsx
"use client";

import React, { useEffect } from 'react';
import { useRouter }  from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/moneymate/AppHeader';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Landmark, LayoutDashboard, ArrowLeftRight, BarChart3, Settings, LogOut, HelpCircle, LifeBuoy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Basic Skeleton for loading state */}
        <header className="py-4 px-4 sm:px-6 lg:px-8 shadow-md bg-card sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-10">
             <Skeleton className="h-8 w-32" />
             <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </header>
        <div className="flex flex-1">
          <div className="w-64 bg-card p-4 hidden md:block">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
          </div>
          <main className="flex-1 p-6">
            <Skeleton className="h-32 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Or a redirect component, though useEffect handles it
  }
  
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <SidebarProvider defaultOpen>
      <div className="flex flex-col min-h-screen">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader className="items-center">
             <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg text-sidebar-primary group-data-[collapsible=icon]:hidden">
                <Landmark className="h-6 w-6" />
                <span>MoneyMate</span>
            </Link>
            <Link href="/dashboard" className="items-center gap-2 font-semibold text-lg text-sidebar-primary hidden group-data-[collapsible=icon]:flex">
                 <Landmark className="h-6 w-6" />
                 <span className="sr-only">MoneyMate</span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                    tooltip={{ children: item.label, side: "right", align:"center" }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-2 border-t border-sidebar-border">
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton 
                        variant="ghost" 
                        className="justify-start text-muted-foreground hover:text-sidebar-foreground"
                        onClick={logout}
                        tooltip={{ children: "Log Out", side: "right", align:"center" }}
                    >
                        <LogOut />
                        <span>Log Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
            <AppHeader />
            <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-auto">
                 {children}
            </main>
             <footer className="py-4 text-center text-xs text-muted-foreground border-t bg-card">
                 <p>&copy; {new Date().getFullYear()} MoneyMate App. Your finances, simplified.</p>
            </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
