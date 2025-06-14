// src/components/moneymate/AddTransactionDialog.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import type { Transaction, TransactionType, IncomeCategory, ExpenseCategory } from '@/types';
import { incomeCategories, expenseCategories } from '@/types';
import { useToast } from '@/hooks/use-toast';


const formSchema = z.object({
  type: z.enum(['income', 'expense'], { required_error: "Transaction type is required." }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  category: z.string().min(1, { message: "Category is required." }),
  date: z.date({ required_error: "Date is required." }),
  description: z.string().optional(),
});

type TransactionFormData = z.infer<typeof formSchema>;

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { date: Date }) => void;
  updateTransaction: (transaction: Transaction) => void;
  existingTransaction?: Transaction | null;
}

export default function AddTransactionDialog({
  isOpen,
  onClose,
  addTransaction,
  updateTransaction,
  existingTransaction,
}: AddTransactionDialogProps) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<TransactionType>(existingTransaction?.type || 'expense');

  const defaultValues = useMemo(() => ({
    type: existingTransaction?.type || 'expense',
    amount: existingTransaction?.amount || 0,
    category: existingTransaction?.category || '',
    date: existingTransaction?.date ? new Date(existingTransaction.date) : new Date(),
    description: existingTransaction?.description || '',
  }), [existingTransaction]);

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const currentType = watch('type', defaultValues.type);

  useEffect(() => {
    if (existingTransaction) {
        setSelectedType(existingTransaction.type);
        reset({
            type: existingTransaction.type,
            amount: existingTransaction.amount,
            category: existingTransaction.category,
            date: new Date(existingTransaction.date),
            description: existingTransaction.description || '',
        });
    } else {
        setSelectedType('expense'); // Default for new transaction
        reset(defaultValues);
    }
  }, [existingTransaction, reset, defaultValues]);


  const onSubmit: SubmitHandler<TransactionFormData> = (data) => {
    try {
      if (existingTransaction) {
        updateTransaction({ ...data, id: existingTransaction.id, date: data.date.toISOString().split('T')[0] });
        toast({ title: "Success", description: "Transaction updated successfully." });
      } else {
        addTransaction(data);
        toast({ title: "Success", description: "Transaction added successfully." });
      }
      onClose();
      reset(defaultValues); // Reset to initial default values for a new form
    } catch (error) {
      console.error("Failed to save transaction:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to save transaction." });
    }
  };

  const categories = currentType === 'income' ? incomeCategories : expenseCategories;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
          <DialogDescription>
            {existingTransaction ? 'Update the details of your transaction.' : 'Enter the details of your new income or expense.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value as TransactionType);
                    setSelectedType(value as TransactionType);
                    setValue('category', ''); // Reset category when type changes
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount')}
              placeholder="0.00"
            />
            {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
             <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value} // Ensure value is controlled
                  key={currentType} // Force re-render when type changes
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder={`Select ${currentType} category`} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="e.g., Groceries from Walmart"
            />
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (existingTransaction ? 'Saving...' : 'Adding...') : (existingTransaction ? 'Save Changes' : 'Add Transaction')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
