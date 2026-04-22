'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import {
  Plus,
  Download,
  RefreshCw,
  Upload,
  Save,
  X,
  Edit3,
  HelpCircle,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  AppHeader,
  Breadcrumbs,
  Button,
  ResponsiveStack,
  Spinner,
} from '@infinibay/harbor';

import { useHelp } from '@/hooks/useHelp';
import { HelpSheet } from '@/components/layout/HelpSheet';
import { useHeaderActions } from '@/contexts/HeaderActionContext';
import { NotificationBell } from '@/components/recommendations/NotificationBell';
import { selectUser } from '@/state/slices/auth';
import {
  selectHeaderBreadcrumbs,
  selectHeaderSubtitle,
  selectHeaderActions,
  selectHeaderHelpTooltip,
  selectHeaderBackButton,
} from '@/state/slices/header';

const iconMap = {
  Plus,
  Download,
  RefreshCw,
  Upload,
  Save,
  X,
  Edit3,
  HelpCircle,
  ChevronLeft,
  Loader2,
  AlertCircle,
};

function harborVariant(v) {
  switch (v) {
    case 'destructive':
      return 'destructive';
    case 'outline':
    case 'secondary':
      return 'secondary';
    case 'ghost':
    case 'link':
      return 'ghost';
    default:
      return 'primary';
  }
}

export function GlobalHeader() {
  const breadcrumbs = useSelector(selectHeaderBreadcrumbs);
  const subtitle = useSelector(selectHeaderSubtitle);
  const actions = useSelector(selectHeaderActions);
  const helpTooltip = useSelector(selectHeaderHelpTooltip);
  const backButton = useSelector(selectHeaderBackButton);
  const user = useSelector(selectUser);

  const isAdmin = user?.role === 'ADMIN';
  const { helpConfig } = useHelp();
  const { triggerAction } = useHeaderActions();
  const [helpSheetOpen, setHelpSheetOpen] = useState(false);

  if (!breadcrumbs.length && !actions.length && !helpConfig && !backButton) {
    return null;
  }

  const left = (
    <ResponsiveStack direction="row" gap={3} align="center">
      {backButton ? (
        <Link href={backButton.href}>
          <Button variant="ghost" size="sm" icon={<ChevronLeft size={14} />}>
            {backButton.label || 'Back'}
          </Button>
        </Link>
      ) : null}

      {breadcrumbs.length > 0 ? (
        <Breadcrumbs
          items={breadcrumbs.map((c) => ({
            label: c.label,
            href: c.isCurrent ? undefined : c.href,
          }))}
        />
      ) : null}

      {subtitle ? <span>{subtitle.text}</span> : null}
    </ResponsiveStack>
  );

  const right = (
    <ResponsiveStack direction="row" gap={2} align="center">
      {isAdmin ? <NotificationBell /> : null}

      {helpConfig ? (
        <Button
          variant="ghost"
          size="sm"
          icon={<HelpCircle size={14} />}
          onClick={() => setHelpSheetOpen(true)}
          title={helpTooltip || 'Help'}
        >
          {''}
        </Button>
      ) : null}

      {actions.map((action) => {
        const IconComponent = action.icon ? iconMap[action.icon] : null;
        const iconEl = action.loading ? (
          <Spinner size={14} />
        ) : IconComponent ? (
          <IconComponent size={14} />
        ) : undefined;
        return (
          <Button
            key={action.id}
            variant={harborVariant(action.variant)}
            size="sm"
            loading={action.loading || undefined}
            disabled={action.disabled || false}
            icon={iconEl}
            onClick={() => triggerAction(action.id)}
            title={action.tooltip}
          >
            {action.label}
          </Button>
        );
      })}
    </ResponsiveStack>
  );

  return (
    <>
      <AppHeader left={left} right={right} />
      <HelpSheet
        open={helpSheetOpen}
        onOpenChange={setHelpSheetOpen}
        config={helpConfig}
      />
    </>
  );
}
