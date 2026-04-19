'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  Card,
  Button,
  TextField,
  Avatar,
  Alert,
  ButtonGroup,
} from '@infinibay/harbor';
import {
  User,
  Lock,
  ExternalLink,
  Eye,
  EyeOff,
  UserRound,
} from 'lucide-react';

import { UpdateUserDocument } from '@/gql/hooks';
import { realTimeCurrentUserUpdated } from '@/state/slices/auth';
import { usePageHeader } from '@/hooks/usePageHeader';
import { getGravatarUrl } from '@/utils/gravatar';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isPasswordSection, setIsPasswordSection] = useState(false);
  const [hideCurrent, setHideCurrent] = useState(true);
  const [hideNew, setHideNew] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const {
    control,
    handleSubmit,
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

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Profile', isCurrent: true },
      ],
      title: 'Profile',
      actions: [],
    },
    []
  );

  const onSubmit = async (data) => {
    try {
      const input = {};

      if (data.firstName.trim() !== (user.firstName || '')) {
        input.firstName = data.firstName.trim();
      }
      if (data.lastName.trim() !== (user.lastName || '')) {
        input.lastName = data.lastName.trim();
      }

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

      await runUpdateUser({ variables: { id: user.id, input } });
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const newPassword = watch('newPassword');
  const gravatarUrl = useMemo(
    () => (user?.email ? getGravatarUrl(user.email, { size: 256 }) : undefined),
    [user?.email]
  );
  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : '';

  if (!user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-fg-muted">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Identity */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={displayName} src={gravatarUrl} size="xl" />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-fg truncate">{displayName}</h2>
              <p className="text-sm text-fg-muted truncate">{user.email}</p>
              {user.role && (
                <p className="text-xs text-fg-subtle uppercase tracking-wider mt-1">
                  {user.role}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-lg bg-accent-2/15 flex items-center justify-center">
              <User className="h-4 w-4 text-accent-2" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-fg">Basic information</h3>
              <p className="text-xs text-fg-muted">
                Update your personal information. Only fill the fields you want to change.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={control}
              rules={{ required: 'First name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  label="First name"
                  placeholder="Your first name"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: 'Last name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Last name"
                  placeholder="Your last name"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="mt-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Email address"
                  type="email"
                  disabled
                  hint="Email address cannot be changed"
                  {...field}
                />
              )}
            />
          </div>
        </Card>

        {/* Password change */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center">
              <Lock className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-fg">Change password</h3>
              <p className="text-xs text-fg-muted">
                Leave all password fields blank to keep your current password.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="currentPassword"
              control={control}
              rules={{
                required: isPasswordSection ? 'Current password is required' : false,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Current password"
                  type={hideCurrent ? 'password' : 'text'}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setHideCurrent((s) => !s)}
                      className="text-fg-muted hover:text-fg"
                    >
                      {hideCurrent ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  onFocus={() => setIsPasswordSection(true)}
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: isPasswordSection ? 'New password is required' : false,
                minLength: isPasswordSection
                  ? { value: 8, message: 'At least 8 characters' }
                  : undefined,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  label="New password"
                  type={hideNew ? 'password' : 'text'}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setHideNew((s) => !s)}
                      className="text-fg-muted hover:text-fg"
                    >
                      {hideNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  onFocus={() => setIsPasswordSection(true)}
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: isPasswordSection ? 'Please confirm your new password' : false,
                validate: isPasswordSection
                  ? (v) => v === newPassword || 'Passwords do not match'
                  : undefined,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  label="Confirm new password"
                  type={hideConfirm ? 'password' : 'text'}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setHideConfirm((s) => !s)}
                      className="text-fg-muted hover:text-fg"
                    >
                      {hideConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  onFocus={() => setIsPasswordSection(true)}
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          </div>

          {isPasswordSection && (
            <div className="mt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsPasswordSection(false);
                  setValue('currentPassword', '');
                  setValue('newPassword', '');
                  setValue('confirmPassword', '');
                }}
              >
                Cancel password change
              </Button>
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            loading={updateLoading}
            disabled={updateLoading}
          >
            {updateLoading ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>

      {/* Gravatar info — decoupled from the save form. */}
      <Card variant="default" className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-success/15 flex items-center justify-center">
            <UserRound className="h-4 w-4 text-success" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-fg">Profile avatar</h3>
            <p className="text-xs text-fg-muted">
              Your avatar is managed through Gravatar, based on your email address.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-6 p-4 rounded-xl bg-surface-1 border border-white/8">
          <Avatar name={displayName} src={gravatarUrl} size="xl" />

          <div className="flex-1 space-y-3">
            <p className="text-sm text-fg-muted">
              The avatar is automatically generated from{' '}
              <span className="font-mono text-fg">{user.email}</span> via Gravatar.
              Change it by creating a Gravatar account with this email and uploading a picture.
            </p>

            <ButtonGroup>
              <Button
                variant="secondary"
                size="sm"
                icon={<ExternalLink className="h-4 w-4" />}
                onClick={() => window.open('https://gravatar.com', '_blank')}
              >
                Manage on Gravatar
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Card>

      <Alert tone="info">
        Need to change your email address? Ask an administrator — it can&apos;t be
        self-serviced.
      </Alert>
    </div>
  );
}
