"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Case, PaginationInfo } from "@/types/case";

interface CaseTableProps {
  cases: Case[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onExportCase: (caseId: string) => void;
  loading?: boolean;
}

export function CaseTable({ cases, pagination, onPageChange, onExportCase, loading = false }: CaseTableProps) {
  const handleViewCase = (case_: Case) => {
    window.location.href = `/cases/${case_.id}`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'failed':
        return 'destructive';
      case 'completed':
        return 'success';
      case 'processing':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading cases...</div>
        </div>
      </Card>
    );
  }

  if (cases.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No cases found</h3>
          <p className="text-muted-foreground mb-4">
            No cases match your current search criteria. Try adjusting your filters or create a new case.
          </p>
          <Button onClick={() => window.location.href = '/cases/new'}>Create New Case</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Patient Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Case Summary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((case_) => (
                <TableRow key={case_.id}>
                  <TableCell className="font-medium">
                    {case_.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{case_.patient?.name || case_.patient_name || 'Unknown'}</TableCell>
                  <TableCell>{case_.patient?.gender || case_.patient_gender || 'N/A'}</TableCell>
                  <TableCell>{case_.patient?.age || case_.patient_age || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={case_.case_summary || case_.title || 'No summary'}>
                      {case_.case_summary || case_.title || 'No summary'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(case_.status)}>
                      {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(case_.created_at)}</div>
                      <div className="text-muted-foreground text-xs">
                        {formatTime(case_.created_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{formatDate(case_.updated_at)}</div>
                      <div className="text-muted-foreground text-xs">
                        {formatTime(case_.updated_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCase(case_)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onExportCase(case_.id)}
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-4">
          {cases.map((case_) => (
            <Card key={case_.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium text-sm text-muted-foreground">
                    #{case_.id.slice(0, 8)}...
                  </div>
                  <div className="font-semibold">{case_.patient?.name || case_.patient_name || 'Unknown'}</div>
                  <div className="text-sm text-muted-foreground">
                    Age: {case_.patient?.age || case_.patient_age || 'N/A'}
                  </div>
                </div>
                <Badge variant={getStatusVariant(case_.status)}>
                  {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">
                {case_.case_summary && (
                  <div className="line-clamp-2">{case_.case_summary}</div>
                )}
              </div>

              <div className="text-xs text-muted-foreground mb-3">
                <div>Created: {formatDate(case_.created_at)}</div>
                <div>Updated: {formatDate(case_.updated_at)}</div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewCase(case_)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExportCase(case_.id)}
                  className="flex-1"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
                {pagination.total} cases
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      const start = Math.max(1, pagination.page - 2);
                      const end = Math.min(pagination.totalPages, start + 4);
                      pageNum = start + i;
                      if (pageNum > end) return null;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        className="w-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
  );
} 