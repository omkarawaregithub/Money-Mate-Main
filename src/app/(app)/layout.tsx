
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
  // SidebarTrigger, // SidebarTrigger is used in AppHeader for mobile
  // SidebarMenuSub,
  // SidebarMenuSubItem,
  // SidebarMenuSubButton,
  // SidebarSeparator,
  // SidebarGroup,
  // SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Landmark, LayoutDashboard, ArrowLeftRight, BarChart3, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { Button } from '@/components/ui/button'; // Not used directly here
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, logout } = useAuth(); // Removed 'user' as it's not directly used here
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen"> {/* Simplified skeleton for loading state */}
        <div className="w-64 bg-card p-4 hidden md:block border-r">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-full mb-3" />
        </div>
        <div className="flex-1 flex flex-col">
          <header className="py-3 px-4 sm:px-6 lg:px-8 shadow-sm bg-card sticky top-0 z-40 border-b">
            <div className="max-w-full mx-auto flex items-center justify-end h-12">
               <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Skeleton className="h-24 w-full mb-6 rounded-lg" />
            <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This state should ideally not be reached due to the useEffect redirect,
    // but it's a fallback. Returning null avoids rendering the layout for unauthenticated users.
    return null; 
  }
  
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <SidebarProvider defaultOpen> {/* Ensure defaultOpen is true or based on cookie/preference */}
      <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="items-center p-3">
           <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              <Landmark className="h-6 w-6" />
              <span>MoneyMate</span>
          </Link>
          <Link href="/dashboard" className="items-center gap-2.5 font-semibold text-lg text-sidebar-foreground hidden group-data-[collapsible=icon]:flex">
               <Landmark className="h-6 w-6" />
               <span className="sr-only">MoneyMate</span>
          </Link>
        </SidebarHeader>
        
        <SidebarContent className="p-2 flex-1"> {/* Use flex-1 to push footer down */}
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, side: "right", align:"center" }}
                  className="justify-start"
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
                      className="justify-start text-sidebar-foreground/80 w-full" // Using opacity for slightly subdued text
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

      <SidebarInset className="flex flex-col bg-background"> {/* Ensure SidebarInset handles its background */}
          <AppHeader />
          <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto"> {/* Ensure main content can scroll */}
               {children}
          </main>
           <footer className="py-4 text-center text-xs text-muted-foreground border-t bg-card shrink-0">
               <p>&copy; {new Date().getFullYear()} MoneyMate App. Your finances, simplified.</p>
          </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
