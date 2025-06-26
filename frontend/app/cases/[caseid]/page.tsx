"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Edit, Share, FileText, Image, Brain, Stethoscope, ClipboardList, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { Case, CaseFile } from "@/types/case";
import { caseApi, handleApiError } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

interface AIInsights {
  comprehensive_summary: string;
  key_findings: string[];
  patient_context: {
    name: string;
    age: number;
    gender: string;
  };
  doctor_notes: string;
  lab_summary: string;
  radiology_summary: string;
  case_summary_confidence_score: number;
  soap_subjective: string;
  soap_objective: string;
  soap_assessment: string;
  soap_plan: string;
  soap_confidence_score: number;
  primary_diagnosis: string;
  icd_code: string;
  diagnosis_description: string;
  diagnosis_confidence_score: number;
  supporting_evidence: string[];
  overall_confidence_score: number;
}

interface CaseWithInsights extends Case {
  ai_insights?: AIInsights;
}

export default function CaseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { userId, loading: authLoading } = useAuth();
  const [case_, setCase] = useState<CaseWithInsights | null>(null);
  const [files, setFiles] = useState<CaseFile[]>([]);
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
        
        // Transform the backend case data to match frontend format
        const transformedCase: CaseWithInsights = {
          id: response.case.case_id || response.case.id,
          patient_name: response.case.patient_name,
          patient_age: response.case.patient_age,
          patient_gender: response.case.patient_gender,
          case_summary: response.case.case_summary,
          status: response.case.status,
          created_at: response.case.created_at,
          updated_at: response.case.updated_at,
          title: response.case.case_summary?.substring(0, 50) + "..." || "Case Summary",
          patient: {
            id: `patient-${response.case.id}`,
            name: response.case.patient_name,
            age: response.case.patient_age,
            gender: response.case.patient_gender,
          },
          ai_insights: response.ai_insights,
        };
        
        setCase(transformedCase);
        setFiles(response.files || []);
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
        return 'default';
      case 'processing':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseAISummary = (aiSummary: string) => {
    try {
      return JSON.parse(aiSummary);
    } catch {
      return null;
    }
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
              {case_.patient_name}'s Case
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={getStatusVariant(case_.status)}>
                {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
              </Badge>
              {case_.ai_insights && (
                <Badge className={`${getConfidenceBadge(case_.ai_insights.overall_confidence_score)}`}>
                  <Brain className="h-3 w-3 mr-1" />
                  AI Confidence: {Math.round(case_.ai_insights.overall_confidence_score * 100)}%
                </Badge>
              )}
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

      {/* AI Insights Section - Prominent Display */}
      {case_.ai_insights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Diagnosis Card */}
          <Card className="p-6 border-l-4 border-l-blue-500 dark:border-l-blue-400">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold">Primary Diagnosis</h3>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{case_.ai_insights.primary_diagnosis}</p>
              <p className="text-sm text-muted-foreground">ICD-10: {case_.ai_insights.icd_code}</p>
              <Badge className={`${getConfidenceBadge(case_.ai_insights.diagnosis_confidence_score)} text-xs`}>
                {Math.round(case_.ai_insights.diagnosis_confidence_score * 100)}% confidence
              </Badge>
              <p className="text-sm mt-3">{case_.ai_insights.diagnosis_description}</p>
            </div>
          </Card>

          {/* Key Findings */}
          <Card className="p-6 border-l-4 border-l-orange-500 dark:border-l-orange-400">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-semibold">Key Findings</h3>
            </div>
            <div className="space-y-2">
              {case_.ai_insights.key_findings.slice(0, 3).map((finding, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{finding}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Overall Summary */}
          <Card className="p-6 border-l-4 border-l-green-500 dark:border-l-green-400">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold">AI Summary</h3>
            </div>
            <p className="text-sm leading-relaxed line-clamp-6">{case_.ai_insights.comprehensive_summary}</p>
            <Badge className={`${getConfidenceBadge(case_.ai_insights.case_summary_confidence_score)} text-xs mt-3`}>
              {Math.round(case_.ai_insights.case_summary_confidence_score * 100)}% confidence
            </Badge>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOAP Notes - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {case_.ai_insights && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold">SOAP Notes</h3>
                <Badge className={`${getConfidenceBadge(case_.ai_insights.soap_confidence_score)} text-xs ml-auto`}>
                  {Math.round(case_.ai_insights.soap_confidence_score * 100)}% confidence
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1">
                      <div className="w-1 h-4 bg-blue-600 dark:bg-blue-400 rounded"></div>
                      Subjective
                    </h4>
                    <p className="text-sm p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border-l-2 border-blue-200 dark:border-blue-800">
                      {case_.ai_insights.soap_subjective}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                      <div className="w-1 h-4 bg-green-600 dark:bg-green-400 rounded"></div>
                      Assessment
                    </h4>
                    <p className="text-sm p-3 bg-green-50 dark:bg-green-950/30 rounded-md border-l-2 border-green-200 dark:border-green-800">
                      {case_.ai_insights.soap_assessment}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-1">
                      <div className="w-1 h-4 bg-orange-600 dark:bg-orange-400 rounded"></div>
                      Objective
                    </h4>
                    <p className="text-sm p-3 bg-orange-50 dark:bg-orange-950/30 rounded-md border-l-2 border-orange-200 dark:border-orange-800">
                      {case_.ai_insights.soap_objective}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-1">
                      <div className="w-1 h-4 bg-purple-600 dark:bg-purple-400 rounded"></div>
                      Plan
                    </h4>
                    <p className="text-sm p-3 bg-purple-50 dark:bg-purple-950/30 rounded-md border-l-2 border-purple-200 dark:border-purple-800">
                      {case_.ai_insights.soap_plan}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Supporting Evidence */}
          {case_.ai_insights?.supporting_evidence && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold">Supporting Evidence</h3>
              </div>
              <div className="space-y-3">
                {case_.ai_insights.supporting_evidence.map((evidence, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-md">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{evidence}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Patient Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{case_.patient_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Age</label>
                <p className="font-medium">{case_.patient_age} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="font-medium">{case_.patient_gender}</p>
              </div>
                              {case_.ai_insights?.doctor_notes && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Doctor's Notes</label>
                    <p className="font-medium text-sm p-2 bg-muted/50 dark:bg-muted/20 rounded border border-muted dark:border-muted/30">{case_.ai_insights.doctor_notes}</p>
                  </div>
                )}
            </div>
          </Card>

          {/* Lab & Radiology Summary */}
          {case_.ai_insights && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Test Results Summary</h3>
              <div className="space-y-4">
                {case_.ai_insights.lab_summary && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Laboratory</h4>
                    <p className="text-sm p-3 bg-muted/50 dark:bg-muted/20 rounded-md border border-muted dark:border-muted/30">{case_.ai_insights.lab_summary}</p>
                  </div>
                )}
                {case_.ai_insights.radiology_summary && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Radiology</h4>
                    <p className="text-sm p-3 bg-muted/50 dark:bg-muted/20 rounded-md border border-muted dark:border-muted/30">{case_.ai_insights.radiology_summary}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Uploaded Files */}
          {files && files.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
              <div className="space-y-3">
                {files.map((file) => {
                  const aiSummary = file.ai_summary ? parseAISummary(file.ai_summary) : null;
                  return (
                    <div key={file.file_id} className="p-3 bg-muted rounded-md space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {file.file_type.startsWith('image/') ? (
                              <Image className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.file_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {(file.file_size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                {file.file_category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(file.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {aiSummary && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-1">AI Analysis:</p>
                          <div className="space-y-1">
                            {aiSummary.findings && (
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Findings:</span> {aiSummary.findings}
                              </p>
                            )}
                            {aiSummary.impressions && (
                              <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Impressions:</span> {aiSummary.impressions}
                              </p>
                            )}
                            {aiSummary.confidence_score && (
                              <Badge className={`${getConfidenceBadge(aiSummary.confidence_score)} text-xs`}>
                                {Math.round(aiSummary.confidence_score * 100)}% confidence
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 