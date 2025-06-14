
// src/app/(app)/reports/page.tsx
"use client";

import useTransactions from '@/hooks/useTransactions';
import ReportsSection from '@/components/moneymate/ReportsSection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  const { transactions } = useTransactions();

  return (
    <div className="space-y-8">
       <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center space-x-3">
                 <FileText className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-2xl font-semibold">Financial Reports</CardTitle>
                    <CardDescription>Dive deep into your spending and earning patterns.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Analyze your financial health with detailed charts and downloadable reports. 
                Understand your habits to make smarter financial decisions.
            </p>
        </CardContent>
      </Card>
      
      <ReportsSection transactions={transactions} />

      {/* Placeholder for more advanced report options */}
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Advanced Reporting Options</CardTitle>
          <CardDescription>Customize date ranges, compare periods, and more.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">More reporting features coming soon!</p>
        </CardContent>
      </Card>
      */}
    </div>
  );
}
