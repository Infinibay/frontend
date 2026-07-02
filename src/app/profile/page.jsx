'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import {
  Page,
  Card,
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Avatar,
  Alert,
  RoleBadge,
  PasswordStrength,
  ResponsiveStack,
  ResponsiveGrid,
  Spinner,
} from '@infinibay/harbor';
import {
  Lock,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';

import { UpdateUserDocument } from '@/gql/hooks';
import { realTimeCurrentUserUpdated, fetchCurrentUser } from '@/state/slices/auth';
import { usePageHeader } from '@/hooks/usePageHeader';
import { getGravatarUrl } from '@/utils/gravatar';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userLoading = useSelector((state) => state.auth.loading?.fetchUser);
  const userError = useSelector((state) => state.auth.error?.fetchUser);
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

  // The password section is "active" purely as a function of its content —
  // never merely because a field was focused. This prevents keyboard users who
  // tab through the (empty) password fields from latching required-validation
  // and being blocked from a name-only save.
  const currentPassword = watch('currentPassword');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');
  const isPasswordSection = Boolean(currentPassword || newPassword || confirmPassword);

  const [runUpdateUser, { loading: updateLoading }] = useMutation(UpdateUserDocument, {
    onCompleted: (data) => {
      dispatch(realTimeCurrentUserUpdated(data.updateUser));
      toast.success('Profile updated successfully');
      // Clearing the fields also collapses the (now content-derived) section.
      setValue('currentPassword', '');
      setValue('newPassword', '');
      setValue('confirmPassword', '');
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
    } catch {
      // The mutation's onError handler already surfaces failures via toast;
      // this catch just guards against an unhandled rejection.
    }
  };

  const gravatarUrl = useMemo(
    () => (user?.email ? getGravatarUrl(user.email, { size: 256 }) : undefined),
    [user?.email]
  );
  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : '';

  // The auth slice keeps `user` as an object with null fields (never null), so
  // gate on a real id. Distinguish a failed fetch from an in-flight one so a
  // broken load shows a retryable error instead of an eternal spinner.
  if (!user?.id) {
    return (
      <Page size="md" gap="md">
        <Card variant="default">
          {userError && !userLoading ? (
            <ResponsiveStack direction="col" gap={4}>
              <Alert tone="danger" title="Couldn't load your profile">
                {userError || 'We were unable to load your profile. Please try again.'}
              </Alert>
              <ResponsiveStack direction="row" justify="start">
                <Button
                  variant="secondary"
                  onClick={() => dispatch(fetchCurrentUser())}
                >
                  Retry
                </Button>
              </ResponsiveStack>
            </ResponsiveStack>
          ) : (
            <ResponsiveStack direction="row" gap={3} align="center" justify="center">
              <Spinner />
              <span>Loading profile…</span>
            </ResponsiveStack>
          )}
        </Card>
      </Page>
    );
  }

  const roleKey = user.role
    ? String(user.role).toLowerCase() === 'admin'
      ? 'admin'
      : 'viewer'
    : null;

  return (
    <Page size="lg" gap="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ResponsiveStack direction="col" gap={6}>
          {/* Identity */}
          <Card
            variant="default"
            title="Basic information"
            description="Update your personal information. Only fill the fields you want to change."
          >
            <ResponsiveStack direction="col" gap={5}>
              <ResponsiveStack direction="row" gap={4} align="center">
                <Avatar name={displayName} src={gravatarUrl} size="xl" />
                <ResponsiveStack direction="col" gap={1}>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>
                    {displayName}
                  </span>
                  <span style={{ opacity: 0.7 }}>{user.email}</span>
                  {roleKey ? (
                    <span>
                      <RoleBadge role={roleKey} label={user.role} size="sm" />
                    </span>
                  ) : null}
                </ResponsiveStack>
              </ResponsiveStack>

              <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: 'First name is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="First name"
                      placeholder="Your first name"
                      autoComplete="given-name"
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
                      autoComplete="family-name"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </ResponsiveGrid>

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Email address"
                    type="email"
                    disabled
                    hint="Email address cannot be changed. Ask an administrator to change it."
                    {...field}
                  />
                )}
              />
            </ResponsiveStack>
          </Card>

          {/* Password change */}
          <Card
            variant="default"
            leadingIcon={<Lock size={18} />}
            leadingIconTone="purple"
            title="Change password"
            description="Leave all password fields blank to keep your current password."
          >
            <ResponsiveStack direction="col" gap={4}>
              <ResponsiveGrid columns={{ base: 1, md: 3 }} gap={4}>
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
                      autoComplete="current-password"
                      suffix={
                        <IconButton
                          size="sm"
                          variant="ghost"
                          label={hideCurrent ? 'Show password' : 'Hide password'}
                          icon={hideCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                          onClick={() => setHideCurrent((s) => !s)}
                          type="button"
                        />
                      }
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
                      autoComplete="new-password"
                      suffix={
                        <IconButton
                          size="sm"
                          variant="ghost"
                          label={hideNew ? 'Show password' : 'Hide password'}
                          icon={hideNew ? <EyeOff size={16} /> : <Eye size={16} />}
                          onClick={() => setHideNew((s) => !s)}
                          type="button"
                        />
                      }
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
                      autoComplete="new-password"
                      suffix={
                        <IconButton
                          size="sm"
                          variant="ghost"
                          label={hideConfirm ? 'Show password' : 'Hide password'}
                          icon={hideConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          onClick={() => setHideConfirm((s) => !s)}
                          type="button"
                        />
                      }
                      error={fieldState.error?.message}
                      {...field}
                    />
                  )}
                />
              </ResponsiveGrid>

              {newPassword ? (
                <PasswordStrength value={newPassword} />
              ) : null}

              {isPasswordSection && (
                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      // Clearing the fields collapses the content-derived section.
                      setValue('currentPassword', '');
                      setValue('newPassword', '');
                      setValue('confirmPassword', '');
                    }}
                  >
                    Cancel password change
                  </Button>
                </div>
              )}
            </ResponsiveStack>
          </Card>

          <ResponsiveStack direction="row" justify="end">
            <Button
              type="submit"
              size="lg"
              loading={updateLoading}
              disabled={updateLoading}
            >
              {updateLoading ? 'Saving…' : 'Save changes'}
            </Button>
          </ResponsiveStack>
        </ResponsiveStack>
      </form>

      {/* Gravatar info — decoupled from the save form. */}
      <Card
        variant="default"
        title="Profile avatar"
        description="Your avatar is managed through Gravatar, based on your email address."
      >
        <ResponsiveStack
          direction={{ base: 'col', sm: 'row' }}
          gap={6}
          align="start"
        >
          <Avatar name={displayName} src={gravatarUrl} size="xl" />
          <ResponsiveStack direction="col" gap={3}>
            <p style={{ margin: 0, opacity: 0.7 }}>
              The avatar is automatically generated from{' '}
              <code style={{ fontFamily: 'monospace' }}>{user.email}</code> via
              Gravatar. Change it by creating a Gravatar account with this
              email and uploading a picture.
            </p>
            <ButtonGroup>
              <Button
                variant="secondary"
                size="sm"
                icon={<ExternalLink size={16} />}
                onClick={() =>
                  window.open('https://gravatar.com', '_blank', 'noopener,noreferrer')
                }
              >
                Manage on Gravatar
              </Button>
            </ButtonGroup>
          </ResponsiveStack>
        </ResponsiveStack>
      </Card>

      <Alert tone="info">
        Need to change your email address? Ask an administrator — it can&apos;t be
        self-serviced.
      </Alert>
    </Page>
  );
}
