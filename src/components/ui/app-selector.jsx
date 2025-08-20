'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Grid3x3, 
  List, 
  Check, 
  Plus,
  Package,
  Star,
  Filter,
  X
} from 'lucide-react';
import { Input } from './input';
import { Badge } from './badge';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

/**
 * Enhanced application selector with search, filtering, and better UX
 */
export function AppSelector({
  apps = [],
  selectedApps = [],
  onSelect,
  onDeselect,
  className,
  viewMode: initialViewMode = 'grid',
  showCategories = true,
  maxSelection = null,
  placeholder = 'Search applications...',
  emptyMessage = 'No applications available'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extract unique categories from apps
  const categories = useMemo(() => {
    const cats = new Set(['all']);
    apps.forEach(app => {
      if (app.category) cats.add(app.category);
    });
    return Array.from(cats);
  }, [apps]);

  // Filter apps based on search and category
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = !searchQuery || 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [apps, searchQuery, selectedCategory]);

  // Group apps by category for display
  const groupedApps = useMemo(() => {
    if (selectedCategory !== 'all' || !showCategories) {
      return { 'Results': filteredApps };
    }

    const groups = {};
    filteredApps.forEach(app => {
      const category = app.category || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(app);
    });
    return groups;
  }, [filteredApps, selectedCategory, showCategories]);

  const isSelected = (appId) => selectedApps.includes(appId);

  const handleToggleApp = (app) => {
    if (isSelected(app.id)) {
      onDeselect?.(app);
    } else {
      if (maxSelection && selectedApps.length >= maxSelection) {
        return; // Don't select if max reached
      }
      onSelect?.(app);
    }
  };

  const handleClearSelection = () => {
    selectedApps.forEach(appId => {
      const app = apps.find(a => a.id === appId);
      if (app) onDeselect?.(app);
    });
  };

  const AppCard = ({ app }) => (
    <div
      onClick={() => handleToggleApp(app)}
      className={cn(
        'relative group cursor-pointer transition-all duration-200',
        'border rounded-lg p-4',
        'hover:shadow-md hover:border-primary/50',
        isSelected(app.id) && 'border-primary bg-primary/5 shadow-sm',
        !isSelected(app.id) && 'bg-card hover:bg-accent/50'
      )}
    >
      {/* Selection indicator */}
      <div className={cn(
        'absolute top-2 right-2 h-6 w-6 rounded-full',
        'border-2 flex items-center justify-center transition-all',
        isSelected(app.id) 
          ? 'bg-primary border-primary' 
          : 'border-muted-foreground/30 group-hover:border-primary'
      )}>
        {isSelected(app.id) && (
          <Check className="h-3 w-3 text-primary-foreground" />
        )}
      </div>

      {/* App icon */}
      <div className="mb-3">
        {app.icon ? (
          <img 
            src={app.icon} 
            alt={app.name}
            className="h-12 w-12 object-contain"
          />
        ) : (
          <Package className="h-12 w-12 text-muted-foreground" />
        )}
      </div>

      {/* App info */}
      <h4 className="font-medium text-sm mb-1 pr-8">{app.name}</h4>
      {app.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {app.description}
        </p>
      )}

      {/* App metadata */}
      <div className="mt-2 flex flex-wrap gap-1">
        {app.popular && (
          <Badge variant="secondary" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}
        {app.version && (
          <Badge variant="outline" className="text-xs">
            v{app.version}
          </Badge>
        )}
      </div>
    </div>
  );

  const AppListItem = ({ app }) => (
    <div
      onClick={() => handleToggleApp(app)}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer',
        'transition-all duration-200',
        'hover:bg-accent/50',
        isSelected(app.id) && 'bg-primary/5 border-l-2 border-primary'
      )}
    >
      {/* App icon */}
      {app.icon ? (
        <img 
          src={app.icon} 
          alt={app.name}
          className="h-8 w-8 object-contain flex-shrink-0"
        />
      ) : (
        <Package className="h-8 w-8 text-muted-foreground flex-shrink-0" />
      )}

      {/* App info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{app.name}</h4>
          {app.popular && (
            <Star className="h-3 w-3 text-yellow-500" />
          )}
        </div>
        {app.description && (
          <p className="text-xs text-muted-foreground truncate">
            {app.description}
          </p>
        )}
      </div>

      {/* Selection checkbox */}
      <div className={cn(
        'h-5 w-5 rounded border-2 flex items-center justify-center',
        'transition-all flex-shrink-0',
        isSelected(app.id) 
          ? 'bg-primary border-primary' 
          : 'border-muted-foreground/30'
      )}>
        {isSelected(app.id) && (
          <Check className="h-3 w-3 text-primary-foreground" />
        )}
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Category filter */}
        {showCategories && categories.length > 1 && (
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* View mode toggle */}
        <div className="flex gap-1 border rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'grid' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
            )}
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'list' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent'
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selection info bar */}
      {selectedApps.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium">
            {selectedApps.length} application{selectedApps.length !== 1 ? 's' : ''} selected
            {maxSelection && ` (max ${maxSelection})`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* Apps display */}
      <ScrollArea className="h-[400px] pr-4">
        {filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No applications match your search' : emptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedApps).map(([category, categoryApps]) => (
              <div key={category}>
                {showCategories && Object.keys(groupedApps).length > 1 && (
                  <h3 className="font-medium text-sm mb-3 text-muted-foreground">
                    {category} ({categoryApps.length})
                  </h3>
                )}
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categoryApps.map(app => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categoryApps.map(app => (
                      <AppListItem key={app.id} app={app} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default AppSelector;