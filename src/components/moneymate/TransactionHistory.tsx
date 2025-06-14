// src/components/moneymate/TransactionHistory.tsx
"use client";

import { useState } from 'react';
import type { Transaction } from '@/types';
import { formatCurrency, formatDate, getCategoryLabel } from '@/lib/transactionUtils';
import { useAppSettingsContext } from '@/context/AppSettingsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Edit3, ArrowDownUp, ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // Added AlertDialogTrigger back
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';


interface TransactionHistoryProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionHistory({ transactions, onEditTransaction, onDeleteTransaction }: TransactionHistoryProps) {
  const { toast } = useToast();
  const { appSettings } = useAppSettingsContext();
  const { currency } = appSettings;
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'desc' for newest first

  const handleConfirmDelete = (id: string) => {
    onDeleteTransaction(id);
    toast({ title: "Success", description: "Transaction deleted successfully." });
  };

  const sortedAndFilteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  if (transactions.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Transaction History</CardTitle>
          <CardDescription>No transactions recorded yet. Add one to get started!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Your transaction history will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl font-headline">Transaction History</CardTitle>
            <CardDescription>View and manage your past transactions.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter className="mr-2 h-4 w-4" /> Filter ({filterType})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={filterType === 'all'} onCheckedChange={() => setFilterType('all')}>All</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={filterType === 'income'} onCheckedChange={() => setFilterType('income')}>Income</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={filterType === 'expense'} onCheckedChange={() => setFilterType('expense')}>Expense</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              <ArrowDownUp className="mr-2 h-4 w-4" /> Sort Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description/Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{formatDate(transaction.date, 'dd MMM yy')}</TableCell>
                  <TableCell>
                    <div>{transaction.description || getCategoryLabel(transaction.category, transaction.type)}</div>
                    {transaction.description && <div className="text-xs text-muted-foreground">{getCategoryLabel(transaction.category, transaction.type)}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'} className={transaction.type === 'income' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(transaction.amount, currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => onEditTransaction(transaction)} className="mr-1 hover:text-primary">
                      <Edit3 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this transaction.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleConfirmDelete(transaction.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
         {sortedAndFilteredTransactions.length === 0 && filterType !== 'all' && (
            <p className="text-muted-foreground text-center py-8">No transactions match the current filter.</p>
        )}
      </CardContent>
    </Card>
  );
}
