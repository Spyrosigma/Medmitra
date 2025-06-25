"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { CaseFilters } from "@/types/case";

interface CaseFiltersProps {
  filters: CaseFilters;
  onFiltersChange: (filters: CaseFilters) => void;
  onClearFilters: () => void;
}

export function CaseFiltersComponent({ filters, onFiltersChange, onClearFilters }: CaseFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilter = (key: keyof CaseFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const updateDateRange = (field: 'from' | 'to', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  const updateAgeRange = (field: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      ageRange: {
        ...filters.ageRange,
        [field]: value,
      },
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.status || 
    filters.dateRange.from || 
    filters.dateRange.to ||
    filters.ageRange.min > 0 ||
    filters.ageRange.max < 120;

  return (
    <Card className="p-4 mb-6">
      <div className="space-y-4">
        {/* Main search and status filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by patient name, case ID, or keywords..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={filters.status || "all"} onValueChange={(value) => updateFilter('status', value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Advanced filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="date-from" className="text-xs text-muted-foreground">From</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateRange.from}
                    onChange={(e) => updateDateRange('from', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="date-to" className="text-xs text-muted-foreground">To</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateRange.to}
                    onChange={(e) => updateDateRange('to', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Age Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Patient Age Range</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="age-min" className="text-xs text-muted-foreground">Min Age</Label>
                  <Input
                    id="age-min"
                    type="number"
                    min="0"
                    max="120"
                    value={filters.ageRange.min || ''}
                    onChange={(e) => updateAgeRange('min', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="age-max" className="text-xs text-muted-foreground">Max Age</Label>
                  <Input
                    id="age-max"
                    type="number"
                    min="0"
                    max="120"
                    value={filters.ageRange.max === 120 ? '' : filters.ageRange.max}
                    onChange={(e) => updateAgeRange('max', parseInt(e.target.value) || 120)}
                    placeholder="120"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 