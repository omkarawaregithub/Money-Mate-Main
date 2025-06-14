// src/components/moneymate/ReportsSection.tsx
"use client";

import type { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, PieChartIcon, Download } from 'lucide-react';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Pie,
  Cell,
  PieChart as RechartsPieChart, // aliasing to avoid conflict if HTML element <PieChart> exists
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

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const incomeTransactions = transactions.filter(t => t.type === 'income');

  const expensesByCategory = groupTransactionsByCategory(expenseTransactions);
  const incomeByCategory = groupTransactionsByCategory(incomeTransactions);

  const expenseChartData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a,b) => b.value - a.value) // Sort for better pie chart display
    .slice(0, 8); // Take top 8 categories for pie chart

  const incomeExpenseChartData = [
    { name: 'Total Income', value: incomeTransactions.reduce((sum, t) => sum + t.amount, 0) },
    { name: 'Total Expenses', value: expenseTransactions.reduce((sum, t) => sum + t.amount, 0) },
  ];

  const handleDownloadReport = () => {
    // Basic CSV download functionality
    const headers = "ID,Date,Type,Category,Description,Amount\n";
    const csvContent = transactions.map(t => 
      `${t.id},${t.date},${t.type},${t.category},${t.description || ''},${t.amount}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "moneymate_report.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Report Downloaded", description: "CSV report generated successfully."});
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
                Financial Reports
                </CardTitle>
                <CardDescription>Visualize your income and expenses.</CardDescription>
            </div>
            <Button onClick={handleDownloadReport} variant="outline" size="sm" disabled={transactions.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No data available to generate reports.</p>
        ) : (
          <>
            <div>
              <h3 className="text-md font-semibold mb-2 text-center text-primary">Income vs Expenses Overview</h3>
              {incomeExpenseChartData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsBarChart data={incomeExpenseChartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => formatCurrency(value, '').slice(1)} tick={{ fontSize: 10 }} width={50}/>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="value" name="Amount" >
                       {incomeExpenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Total Income' ? '#00C49F' : '#FF8042'} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center text-sm py-4">Not enough data for Income vs Expenses chart.</p>
              )}
            </div>

            {expenseChartData.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2 text-center text-destructive">Top Expense Categories</h3>
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
                    <Tooltip formatter={(value: number, name: string) => [`${formatCurrency(value)}`, name]}/>
                    <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} layout="horizontal" verticalAlign="bottom" align="center" />
                  </RechartsPieChart>
                </ResponsiveContainer>
            </div>
            )}
            {expenseChartData.length === 0 && transactions.length > 0 && (
                 <p className="text-muted-foreground text-center text-sm py-4">No expenses recorded to show category breakdown.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
