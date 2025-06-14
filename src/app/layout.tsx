
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import { AppSettingsProvider } from '@/context/AppSettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'MoneyMate - Expense Tracker',
  description: 'Track your expenses, manage your budget, and achieve financial clarity with MoneyMate.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <AuthProvider>
          <AppSettingsProvider>
            <ThemeProvider>{children}<Toaster /></ThemeProvider>
          </AppSettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
