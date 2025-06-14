// src/components/moneymate/ReportsSection.tsx
"use client";

import type { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, PieChartIcon, Download } from 'lucide-react';
import { useAppSettingsContext } from '@/context/AppSettingsContext';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  Cell,
  PieChart as RechartsPieChart, 
  BarChart as RechartsBarChart,
} from 'recharts';
import { groupTransactionsByCategory, formatCurrency } from '@/lib/transactionUtils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ReportsSectionProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#A52A2A'];


export default function ReportsSection({ transactions }: ReportsSectionProps) {
  const { toast } = useToast();
  const { appSettings } = useAppSettingsContext();
  const globalAppCurrency = appSettings.currency; // Use the global app currency for filtering reports

  // Filter transactions to include only those matching the global app currency
  const relevantTransactions = transactions.filter(t => t.currency === globalAppCurrency);

  const expenseTransactions = relevantTransactions.filter(t => t.type === 'expense');
  const incomeTransactions = relevantTransactions.filter(t => t.type === 'income');

  const expensesByCategory = groupTransactionsByCategory(expenseTransactions);

  const expenseChartData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a,b) => b.value - a.value)
    .slice(0, 8);

  const incomeExpenseChartData = [
    { name: 'Total Income', value: incomeTransactions.reduce((sum, t) => sum + t.amount, 0) },
    { name: 'Total Expenses', value: expenseTransactions.reduce((sum, t) => sum + t.amount, 0) },
  ];

  const handleDownloadReport = () => {
    if (transactions.length === 0) {
        toast({ variant: "destructive", title: "No Data", description: "No transactions to download." });
        return;
    }
    // CSV download includes all transactions, regardless of global currency filter for reports
    const headers = "ID,Date,Type,Category,Description,Amount,Currency\n";
    const csvContent = transactions.map(t => 
      `${t.id},${t.date},${t.type},${t.category},"${(t.description || '').replace(/"/g, '""')}",${t.amount},${t.currency}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `moneymate_report_${globalAppCurrency}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Report Downloaded", description: `CSV report (for all currencies) generated.`});
    } else {
       toast({ variant: "destructive", title: "Download Failed", description: "Your browser does not support this feature."});
    }
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="text-xl font-headline flex items-center">
                <BarChart className="mr-2 h-6 w-6 text-primary" />
                Financial Reports (in {globalAppCurrency})
                </CardTitle>
                <CardDescription>Visualize your income and expenses for transactions in {globalAppCurrency}.</CardDescription>
            </div>
            <Button onClick={handleDownloadReport} variant="outline" size="sm" disabled={transactions.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {relevantTransactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No data available in {globalAppCurrency} to generate reports.</p>
        ) : (
          <>
            <div>
              <h3 className="text-md font-semibold mb-2 text-center text-primary">Income vs Expenses Overview ({globalAppCurrency})</h3>
              {incomeExpenseChartData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsBarChart data={incomeExpenseChartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis 
                        tickFormatter={(value) => formatCurrency(value, globalAppCurrency).replace(/[^0-9.,]/g, '')} 
                        tick={{ fontSize: 10 }} 
                        width={globalAppCurrency === 'INR' ? 60 : 50}
                    />
                    <Tooltip formatter={(value: number) => formatCurrency(value, globalAppCurrency)} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="value" name="Amount" >
                       {incomeExpenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Total Income' ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-5))'} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center text-sm py-4">Not enough data for Income vs Expenses chart in {globalAppCurrency}.</p>
              )}
            </div>

            {expenseChartData.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2 text-center text-destructive">Top Expense Categories ({globalAppCurrency})</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={expenseChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      tick={{fontSize: 10}}
                    >
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${formatCurrency(value, globalAppCurrency)}`, name]}/>
                    <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} layout="horizontal" verticalAlign="bottom" align="center" />
                  </RechartsPieChart>
                </ResponsiveContainer>
            </div>
            )}
            {expenseChartData.length === 0 && relevantTransactions.length > 0 && (
                 <p className="text-muted-foreground text-center text-sm py-4">No expenses recorded in {globalAppCurrency} to show category breakdown.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
