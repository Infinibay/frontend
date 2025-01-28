'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { FaMicrochip, FaMemory, FaHdd, FaTrash } from 'react-icons/fa';

export function TemplateCard({ template, onDelete }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <FaMicrochip className="w-4 h-4 mr-2" />
              <span>{template.cores} Cores</span>
            </div>
            <div className="flex items-center text-sm">
              <FaMemory className="w-4 h-4 mr-2" />
              <span>{template.ram} GB RAM</span>
            </div>
            <div className="flex items-center text-sm">
              <FaHdd className="w-4 h-4 mr-2" />
              <span>{template.storage} GB Storage</span>
            </div>
            {template.totalMachines > 0 && (
              <Badge variant="secondary" className="mt-2">
                {template.totalMachines} machine{template.totalMachines !== 1 ? 's' : ''} using this template
              </Badge>
            )}
          </div>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem 
          className={`${template.totalMachines > 0 ? 'text-destructive/50 cursor-not-allowed' : 'text-destructive'}`}
          disabled={template.totalMachines > 0}
          onClick={() => !template.totalMachines && onDelete?.(template.id)}
        >
          <FaTrash className="w-4 h-4 mr-2" />
          Delete Template
          {template.totalMachines > 0 && (
            <span className="ml-2 text-xs">
              ({template.totalMachines} machine{template.totalMachines !== 1 ? 's' : ''} in use)
            </span>
          )}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
