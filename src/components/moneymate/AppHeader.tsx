
// src/components/moneymate/AppHeader.tsx
"use client";

import Link from 'next/link';
import { UserCircle, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useTheme } from '@/context/ThemeContext';


export default function AppHeader() {
  const { user, logout } = useAuth();
  const { isMobile } = useSidebar(); 
  const { theme, toggleTheme } = useTheme();

  if (!user) {
    return (
       <header className="py-3 px-4 sm:px-6 lg:px-8 shadow-md bg-card sticky top-0 z-40 border-b">
        <div className="max-w-full mx-auto flex items-center justify-between h-12">
        </div>
      </header>
    );
  }

  const defaultAvatar = "https://placehold.co/128x128/E0E7FF/4A5568.png?text=U";

  return (
    <header className="py-3 px-4 sm:px-6 lg:px-8 shadow-sm bg-card sticky top-0 z-40 border-b">
      <div className="max-w-full mx-auto flex items-center justify-between h-12">
        <div className="flex items-center">
           <SidebarTrigger className="md:hidden mr-2 h-8 w-8" />
        </div>
        
        <div className="flex items-center space-x-2">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="text-foreground/70 hover:text-foreground"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarImage 
                    src={user.avatarUrl || defaultAvatar} 
                    alt={user.name} 
                    />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                    </p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild> 
                <Link href="/settings">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
