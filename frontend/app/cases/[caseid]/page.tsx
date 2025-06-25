"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Edit, Share } from "lucide-react";
import { Case } from "@/types/case";
import { caseApi, handleApiError } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

export default function CaseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { userId, loading: authLoading } = useAuth();
  const [case_, setCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      if (!userId || authLoading) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await caseApi.getById(params.caseid as string, userId);
        
        if (!response.case) {
          setError("Case not found");
          return;
        }
        
        setCase(response.case);
      } catch (err) {
        setError(handleApiError(err));
        console.error("Error fetching case:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.caseid && !authLoading) {
      fetchCase();
    }
  }, [params.caseid, userId, authLoading]);

  const handleExportPDF = () => {
    if (case_) {
      console.log(`Exporting case ${case_.id} as PDF`);
      alert("PDF export functionality coming soon!");
    }
  };

  const handleEditCase = () => {
    if (case_) {
      console.log(`Editing case ${case_.id}`);
      alert("Edit case functionality coming soon!");
    }
  };

  const handleShareCase = () => {
    if (case_) {
      console.log(`Sharing case ${case_.id}`);
      alert("Share case functionality coming soon!");
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading case details...</div>
        </div>
      </div>
    );
  }

  if (error || !case_) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              {error || "Case not found"}
            </h2>
            <p className="text-muted-foreground mb-4">
              The case you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/cases')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cases
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/cases')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cases
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Case #{case_.id.slice(0, 8)}...
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusVariant(case_.status)}>
                {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Updated {formatDate(case_.updated_at)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShareCase}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={handleEditCase}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Case Details - using the existing modal component logic inline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          <Card className="p-6">
            {/* <h3 className="text-lg font-semibold mb-4">Patient Information</h3> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{case_.patient?.name || case_.patient_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Age</label>
                <p className="font-medium">{case_.patient?.age || case_.patient_age || 'N/A'} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="font-medium">{case_.patient?.gender || case_.patient_gender || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Case Title</label>
                <p className="font-medium">{case_.title || case_.case_summary?.substring(0, 50) + "..." || 'N/A'}</p>
              </div>
            </div>

            {case_.chief_complaint && (
              <div className="mt-6">
                <label className="text-sm font-medium text-muted-foreground">Chief Complaint</label>
                <p className="mt-2 p-4 bg-muted rounded-md">{case_.chief_complaint}</p>
              </div>
            )}

            {case_.medical_history && (
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">Medical History</label>
                <p className="mt-2 p-4 bg-muted rounded-md">{case_.medical_history}</p>
              </div>
            )}

            {case_.current_medications && (
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">Current Medications</label>
                <p className="mt-2 p-4 bg-muted rounded-md">{case_.current_medications}</p>
              </div>
            )}
          </Card>

          {/* SOAP Notes */}
          {case_.soap_note && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">SOAP Notes</h3>
              <div className="space-y-4">
                {case_.soap_note.subjective && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Subjective</h4>
                    <p className="p-4 bg-muted rounded-md">{case_.soap_note.subjective}</p>
                  </div>
                )}
                {case_.soap_note.objective && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Objective</h4>
                    <p className="p-4 bg-muted rounded-md">{case_.soap_note.objective}</p>
                  </div>
                )}
                {case_.soap_note.assessment && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Assessment</h4>
                    <p className="p-4 bg-muted rounded-md">{case_.soap_note.assessment}</p>
                  </div>
                )}
                {case_.soap_note.plan && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Plan</h4>
                    <p className="p-4 bg-muted rounded-md">{case_.soap_note.plan}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Uploaded Files */}
          {case_.uploaded_files && case_.uploaded_files.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
              <div className="space-y-3">
                {case_.uploaded_files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* AI Suggestions */}
          {case_.ai_suggestions && case_.ai_suggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
              <div className="space-y-4">
                {case_.ai_suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{suggestion.type}</Badge>
                      <span className={`text-sm font-medium ${
                        suggestion.confidence >= 80 ? 'text-green-600' : 
                        suggestion.confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {suggestion.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm mb-2">{suggestion.suggestion}</p>
                    {suggestion.evidence && (
                      <p className="text-xs text-muted-foreground">{suggestion.evidence}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 