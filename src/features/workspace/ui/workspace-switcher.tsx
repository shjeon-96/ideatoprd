'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Building2,
  ChevronDown,
  Plus,
  User,
  Check,
  Settings,
} from 'lucide-react';
import { Button } from '@/src/shared/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/shared/ui/dropdown-menu';
import { useWorkspace } from './workspace-context';
import { cn } from '@/src/shared/lib/utils';

interface WorkspaceSwitcherProps {
  className?: string;
}

export function WorkspaceSwitcher({ className }: WorkspaceSwitcherProps) {
  const router = useRouter();
  const t = useTranslations('workspace');
  const {
    currentWorkspace,
    workspaces,
    setCurrentWorkspace,
    canManageWorkspace,
  } = useWorkspace();
  const [open, setOpen] = useState(false);

  const handleSelectPersonal = () => {
    setCurrentWorkspace(null);
    router.push('/dashboard');
    setOpen(false);
  };

  const handleSelectWorkspace = (workspace: (typeof workspaces)[0]) => {
    // We need to fetch full workspace data here
    setCurrentWorkspace(
      {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        credit_balance: workspace.credit_balance,
        owner_id: '', // Will be filled by full fetch
        subscription_id: null,
        settings: {},
        created_at: '',
        updated_at: '',
      },
      workspace.role
    );
    router.push(`/w/${workspace.slug}/dashboard`);
    setOpen(false);
  };

  const handleCreateWorkspace = () => {
    router.push('/workspace/new');
    setOpen(false);
  };

  const handleWorkspaceSettings = () => {
    if (currentWorkspace) {
      router.push(`/w/${currentWorkspace.slug}/settings`);
    }
    setOpen(false);
  };

  // Don't show if user has no workspaces
  if (workspaces.length === 0) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('gap-2 px-3', className)}
        >
          {currentWorkspace ? (
            <>
              <Building2 className="size-4" />
              <span className="max-w-32 truncate">{currentWorkspace.name}</span>
            </>
          ) : (
            <>
              <User className="size-4" />
              <span>{t('personal')}</span>
            </>
          )}
          <ChevronDown className="size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{t('switchTitle')}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Personal option */}
        <DropdownMenuItem
          onClick={handleSelectPersonal}
          className="gap-2"
        >
          <User className="size-4" />
          <span className="flex-1">{t('personal')}</span>
          {!currentWorkspace && <Check className="size-4" />}
        </DropdownMenuItem>

        {/* Workspace list */}
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => handleSelectWorkspace(workspace)}
            className="gap-2"
          >
            <Building2 className="size-4" />
            <span className="flex-1 truncate">{workspace.name}</span>
            <span className="text-xs text-muted-foreground">
              {workspace.credit_balance}{t('creditsSuffix')}
            </span>
            {currentWorkspace?.id === workspace.id && (
              <Check className="size-4" />
            )}
          </DropdownMenuItem>
        ))}

        {/* Actions */}
        <DropdownMenuSeparator />

        {currentWorkspace && canManageWorkspace && (
          <DropdownMenuItem onClick={handleWorkspaceSettings} className="gap-2">
            <Settings className="size-4" />
            <span>{t('settings')}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleCreateWorkspace} className="gap-2">
          <Plus className="size-4" />
          <span>{t('create.button')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
