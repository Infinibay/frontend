'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import {
  Header,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
} from '@/components/ui/header';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SizeProvider } from '@/components/ui/size-provider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ExternalLink } from 'lucide-react';
import { UpdateUserDocument } from '@/gql/hooks';
import { realTimeCurrentUserUpdated } from '@/state/slices/auth';
import { User, Lock } from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isPasswordSection, setIsPasswordSection] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [runUpdateUser, { loading: updateLoading }] = useMutation(UpdateUserDocument, {
    onCompleted: (data) => {
      dispatch(realTimeCurrentUserUpdated(data.updateUser));
      toast.success('Profile updated successfully');

      // Clear password fields after successful update
      if (isPasswordSection) {
        setValue('currentPassword', '');
        setValue('newPassword', '');
        setValue('confirmPassword', '');
        setIsPasswordSection(false);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  // Pre-populate form with current user data
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      // Build input object with only changed fields
      const input = {};

      if (data.firstName.trim() !== (user.firstName || '')) {
        input.firstName = data.firstName.trim();
      }
      if (data.lastName.trim() !== (user.lastName || '')) {
        input.lastName = data.lastName.trim();
      }

      // Include password fields if updating password
      if (isPasswordSection && data.newPassword) {
        if (data.newPassword !== data.confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
        input.currentPassword = data.currentPassword;
        input.password = data.newPassword;
      }

      if (Object.keys(input).length === 0) {
        return toast.info('No changes to save');
      }

      const variables = {
        id: user.id,
        input,
      };

      await runUpdateUser({ variables });
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };


  const newPassword = watch('newPassword');

  if (!user) {
    return (
      <SizeProvider defaultSize="md">
        <div className="min-h-screen flex items-center justify-center size-padding">
          <div className="text-glass-text-secondary size-text">
            Loading profile...
          </div>
        </div>
      </SizeProvider>
    );
  }

  return (
    <SizeProvider defaultSize="md">
      {/* Header Component */}
      <Header
        variant="glass"
        elevated
        sticky={true}
        style={{ top: 0 }}
        className="z-30"
      >
        <HeaderLeft className="w-[200px]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </HeaderLeft>
        <HeaderCenter>
          <h1 className="text-lg sm:text-2xl font-medium text-foreground">
            Profile Settings
          </h1>
        </HeaderCenter>
        <HeaderRight className="w-[200px]">
        </HeaderRight>
      </Header>

      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">

          {/* Profile Information Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card className="glass-strong glow-subtle p-6" forceGlass={true}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold">Basic Information</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update your personal information. Only fill the fields you want to change.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <Controller
                      name="firstName"
                      control={control}
                      rules={{ required: 'First name is required' }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="firstName"
                          type="text"
                          placeholder="Enter your first name"
                          className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${errors.firstName ? 'border-red-500' : ''}`}
                          aria-label="First name"
                        />
                      )}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500" role="alert">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Controller
                      name="lastName"
                      control={control}
                      rules={{ required: 'Last name is required' }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="lastName"
                          type="text"
                          placeholder="Enter your last name"
                          className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${errors.lastName ? 'border-red-500' : ''}`}
                          aria-label="Last name"
                        />
                      )}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500" role="alert">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        disabled
                        className="bg-muted text-muted-foreground cursor-not-allowed"
                        aria-label="Email address (read only)"
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>
              </div>
            </Card>

            {/* Password Section */}
            <Card className="glass-strong glow-subtle p-6" forceGlass={true}>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold">Change Password</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Leave all password fields blank if you don't want to change your password
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password
                    </Label>
                    <Controller
                      name="currentPassword"
                      control={control}
                      rules={{
                        required: isPasswordSection ? 'Current password is required' : false
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="currentPassword"
                          type="password"
                          placeholder="Enter current password"
                          className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${errors.currentPassword ? 'border-red-500' : ''}`}
                          aria-label="Current password"
                          onFocus={() => setIsPasswordSection(true)}
                        />
                      )}
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500" role="alert">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </Label>
                    <Controller
                      name="newPassword"
                      control={control}
                      rules={{
                        required: isPasswordSection ? 'New password is required' : false,
                        minLength: isPasswordSection ? {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        } : undefined,
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${errors.newPassword ? 'border-red-500' : ''}`}
                          aria-label="New password"
                          onFocus={() => setIsPasswordSection(true)}
                        />
                      )}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500" role="alert">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </Label>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      rules={{
                        required: isPasswordSection ? 'Please confirm your new password' : false,
                        validate: isPasswordSection ? (value) =>
                          value === newPassword || 'Passwords do not match' : undefined,
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          className={`bg-background hover:bg-accent/50 transition-all focus:shadow-md ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          aria-label="Confirm new password"
                          onFocus={() => setIsPasswordSection(true)}
                        />
                      )}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500" role="alert">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {isPasswordSection && (
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsPasswordSection(false);
                        setValue('currentPassword', '');
                        setValue('newPassword', '');
                        setValue('confirmPassword', '');
                      }}
                      aria-label="Cancel password change"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateLoading}
                aria-label="Save profile changes"
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>

          {/* Profile Avatar Section - Gravatar */}
          <Card className="glass-strong glow-subtle p-6 mt-6" forceGlass={true}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold">Profile Avatar</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your avatar is managed through Gravatar based on your email address
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-4 rounded-lg bg-muted/30">
                {/* Current Avatar Preview */}
                <div className="flex-shrink-0">
                  <Avatar
                    email={user.email}
                    fallback={`${user.firstName} ${user.lastName}`}
                    size="lg"
                    className="w-24 h-24"
                  />
                </div>

                {/* Gravatar Information */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-sm font-medium mb-2">About Your Avatar</h3>
                    <p className="text-sm text-muted-foreground">
                      Your profile picture is automatically generated from your email address ({user.email}) using Gravatar.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Change Your Avatar</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Visit Gravatar.com and create a free account</li>
                      <li>Upload your desired profile picture</li>
                      <li>Associate it with your email: {user.email}</li>
                      <li>Your new avatar will appear automatically here</li>
                    </ol>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://gravatar.com', '_blank')}
                    className="mt-2"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage Avatar on Gravatar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SizeProvider>
  );
}