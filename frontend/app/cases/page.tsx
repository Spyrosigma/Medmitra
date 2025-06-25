"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Case, CaseFilters, PaginationInfo } from "@/types/case";
import { CaseFiltersComponent } from "@/components/cases/case-filters";
import { CaseTable } from "@/components/cases/case-table";
import { caseApi } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export default function CasesPage() {
  const { userId, loading: authLoading } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filters, setFilters] = useState<CaseFilters>({
    search: "",
    status: "",
    gender: "",
    dateRange: {
      from: "",
      to: "",
    },
    ageRange: {
      min: 0,
      max: 120,
    },
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 0,
  });

  const fetchCases = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError("");
    try {
      const result = await caseApi.getAll({}, userId);
      
      let filteredCases = result.cases;
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredCases = filteredCases.filter(case_ => 
          case_.patient_name?.toLowerCase().includes(searchTerm) ||
          case_.case_summary?.toLowerCase().includes(searchTerm) ||
          case_.id.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.status) {
        filteredCases = filteredCases.filter(case_ => case_.status === filters.status);
      }
      
      if (filters.ageRange.min > 0 || filters.ageRange.max < 120) {
        filteredCases = filteredCases.filter(case_ => 
          case_.patient_age !== undefined &&
          case_.patient_age >= filters.ageRange.min && 
          case_.patient_age <= filters.ageRange.max
        );
      }
      
      if (filters.dateRange.from || filters.dateRange.to) {
        filteredCases = filteredCases.filter(case_ => {
          const caseDate = new Date(case_.created_at);
          const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
          const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
          
          if (fromDate && caseDate < fromDate) return false;
          if (toDate && caseDate > toDate) return false;
          return true;
        });
      }
      
      const total = filteredCases.length;
      const totalPages = Math.ceil(total / pagination.pageSize);
      const startIndex = (pagination.page - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedCases = filteredCases.slice(startIndex, endIndex);
      
      setCases(paginatedCases);
      setPagination(prev => ({ 
        ...prev, 
        total, 
        totalPages 
      }));
    } catch (error) {
      console.error("Failed to fetch cases:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userId) {
      fetchCases();
    }
  }, [filters, pagination.page, userId, authLoading]);

  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [filters.search, filters.status, filters.dateRange, filters.ageRange]);

  const handleFiltersChange = (newFilters: CaseFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      gender: "",
      dateRange: {
        from: "",
        to: "",
      },
      ageRange: {
        min: 0,
        max: 120,
      },
    });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleExportCase = (caseId: string) => {
    console.log(`Exporting case ${caseId} as PDF`);
    alert(`Exporting case ${caseId} as PDF... (Feature coming soon)`);
  };

  const handleCreateCase = () => {
    window.location.href = '/cases/new';
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">
            Manage and review patient cases with AI-powered insights
          </p>
        </div>
        <Button onClick={handleCreateCase} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-md">
          <p className="font-medium">Error loading cases:</p>
          <p className="text-sm">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={fetchCases}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Filters */}
      <CaseFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Cases Table */}
      <CaseTable
        cases={cases}
        pagination={pagination}
        onPageChange={handlePageChange}
        onExportCase={handleExportCase}
        loading={loading}
      />
    </div>
  );
} 