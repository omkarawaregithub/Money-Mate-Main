
// src/app/page.tsx (Landing Page)
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Landmark, TrendingUp, ListChecks, BarChart3, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <header className="py-4 px-4 sm:px-6 lg:px-8 shadow-sm bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Landmark className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">MoneyMate</h1>
          </div>
          <nav className="space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <section className="text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6">
            Achieve Financial Clarity with <span className="text-primary">MoneyMate</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Your smart, simple, and secure solution for tracking expenses, managing budgets, and gaining insights into your financial habits.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/register">Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
          <div className="mt-16 relative aspect-[16/9] max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden">
            <Image 
              src="https://placehold.co/1200x675.png" 
              alt="MoneyMate Dashboard Preview"
              layout="fill"
              objectFit="cover"
              data-ai-hint="dashboard finance"
              priority
            />
          </div>
        </section>

        <section id="features" className="py-16 sm:py-24">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose MoneyMate?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-primary" />}
              title="Smart Tracking"
              description="Effortlessly log income and expenses. Categorize transactions for a clear overview of your spending."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Insightful Reports"
              description="Visualize your financial data with interactive charts. Understand where your money goes."
            />
            <FeatureCard
              icon={<ListChecks className="h-10 w-10 text-primary" />}
              title="Budget Management"
              description="Set financial goals and stay on track. (Coming Soon)"
            />
            <FeatureCard
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="Secure & Private"
              description="Your financial data is stored locally on your device, ensuring privacy and control."
            />
             <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="User Friendly"
              description="Intuitive interface designed for ease of use on any device."
            />
             <FeatureCard
              icon={<Landmark className="h-10 w-10 text-primary" />}
              title="Always Free"
              description="Core features are free to use. Get started without any commitments."
            />
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-muted-foreground text-sm bg-card/50 border-t">
        <p>&copy; {new Date().getFullYear()} MoneyMate. Take control of your finances.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-foreground mb-2 text-center">{title}</h4>
      <p className="text-muted-foreground text-sm text-center">{description}</p>
    </div>
  );
}
