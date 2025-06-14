
// src/app/(app)/reports/page.tsx
"use client";

import useTransactions from '@/hooks/useTransactions';
import ReportsSection from '@/components/moneymate/ReportsSection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useAppSettingsContext } from '@/context/AppSettingsContext';

export default function ReportsPage() {
  const { transactions } = useTransactions();
  const { appSettings } = useAppSettingsContext();

  return (
    <div className="space-y-8">
       <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center space-x-3">
                 <FileText className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-2xl font-semibold">Financial Reports</CardTitle>
                    <CardDescription>
                      Dive deep into your spending and earning patterns. Reports include all transactions,
                      and figures are displayed using your global currency setting ({appSettings.currency}).
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Analyze your financial health with detailed charts. Reports are generated from all transactions.
                The currency symbol ({appSettings.currency}) used for chart values is based on your global app setting.
                Note: If transactions exist in multiple currencies, chart values are direct aggregates.
            </p>
        </CardContent>
      </Card>
      
      <ReportsSection transactions={transactions} />
    </div>
  );
}
