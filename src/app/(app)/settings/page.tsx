
// src/app/(app)/settings/page.tsx
"use client";

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."), // Simplified for mock
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;


export default function SettingsPage() {
  const { user, login, logout } = useAuth(); // `login` can be used to update user details in this mock
  const { toast } = useToast();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    }
  });

  const onProfileSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    // Simulate updating user profile
    login(data.email, data.name); // Re-use login to update user in AuthContext
    toast({ title: "Profile Updated", description: "Your profile details have been saved." });
  };

  const onPasswordSubmit: SubmitHandler<PasswordFormValues> = (data) => {
    // Simulate changing password
    console.log("Password change data:", data); // In a real app, this would hit an API
    toast({ title: "Password Changed", description: "Your password has been updated (simulated)." });
    passwordForm.reset();
  };


  if (!user) {
    return <p>Loading user settings...</p>;
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>Manage your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://placehold.co/100x100.png" alt={user.name} data-ai-hint="profile avatar large" />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>
            <Separator />
             <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...profileForm.register('name')} />
                    {profileForm.formState.errors.name && <p className="text-sm text-destructive mt-1">{profileForm.formState.errors.name.message}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" {...profileForm.register('email')} />
                     {profileForm.formState.errors.email && <p className="text-sm text-destructive mt-1">{profileForm.formState.errors.email.message}</p>}
                </div>
                 <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                    {profileForm.formState.isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
            </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" {...passwordForm.register('currentPassword')} />
              {passwordForm.formState.errors.currentPassword && <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.currentPassword.message}</p>}
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" {...passwordForm.register('newPassword')} />
              {passwordForm.formState.errors.newPassword && <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" {...passwordForm.register('confirmPassword')} />
              {passwordForm.formState.errors.confirmPassword && <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                {passwordForm.formState.isSubmitting ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="text-2xl text-destructive">Account Actions</CardTitle>
            <CardDescription>Manage your account status.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="destructive" onClick={logout} className="w-full sm:w-auto">Log Out</Button>
            <p className="text-xs text-muted-foreground mt-2">Logging out will end your current session.</p>
        </CardContent>
      </Card>
    </div>
  );
}
