
// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Simplified for mock
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd validate credentials against a backend
      login(data.email); // Mock login, name will be default "Demo User"
      toast({ title: "Login Successful", description: "Welcome back!" });
      // router.push('/dashboard'); // AuthContext handles redirection
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
       <div className="absolute top-6 left-6">
         <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors">
            <Landmark className="h-7 w-7" />
            <span className="text-xl font-bold">MoneyMate</span>
          </Link>
       </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Log in to your MoneyMate account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <Button variant="link" size="sm" className="text-muted-foreground" asChild>
             <Link href="#">Forgot password?</Link>
           </Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
