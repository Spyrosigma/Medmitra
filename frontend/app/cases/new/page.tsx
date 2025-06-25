"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, FlaskConical } from "lucide-react";
import PatientInfoForm from "@/components/forms/patient-info-form";
import CaseSummaryForm from "@/components/forms/case-summary-form";
import FileUpload, { UploadedFile } from "@/components/forms/file-upload";
import CaseActions from "@/components/forms/case-actions";
import { Button } from "@/components/ui/button";
import { caseApi, handleApiError } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";

interface PatientInfo {
  name: string;
  age: string;
  gender: string;
  caseTitle: string;
}

export default function NewCasePage() {
  const router = useRouter();
  const { userId, loading: authLoading } = useAuth();
  
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "",
    age: "",
    gender: "",
    caseTitle: ""
  });
  
  const [caseSummary, setCaseSummary] = useState("");
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePatientInfoChange = (field: keyof PatientInfo, value: string) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null, category: string) => {
    if (!files) return;

    const allowedTypes = category === 'lab' 
      ? ['text/csv', 'application/pdf']
      : ['image/jpeg', 'image/png', 'application/dicom', 'image/dicom'];

    Array.from(files).forEach(file => {
      if (allowedTypes.includes(file.type) || 
          (category === 'radiology' && (file.name.toLowerCase().endsWith('.dcm') || file.name.toLowerCase().endsWith('.dicom')))) {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          file: file,
          category: category
        };
        setUploadedFiles(prev => [...prev, newFile]);
      } else {
        alert(`Invalid file type for ${category}. Please upload the correct file formats.`);
      }
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const isFormValid = patientInfo.name.trim() !== "" && 
                      patientInfo.age.trim() !== "" &&
                      patientInfo.gender.trim() !== "";

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert("Please fill in all required fields (Patient Name and Age)");
      return;
    }

    if (!userId) {
      alert("You must be logged in to create a case");
      return;
    }

    setIsSubmitting(true);

    try {
      const caseData = {
        patientInfo,
        caseSummary,
        uploadedFiles: uploadedFiles.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type,
          size: f.size,
          category: f.category,
          file: f.file
        }))
      };

      const result = await caseApi.create(caseData, userId);
      
      const caseId = result.case_id || result.case?.case_id;
      if (caseId) {
        // alert(`Case created successfully! Case ID: ${caseId}`);
        // router.push(`/cases/${caseId}`);
        router.push(`/cases`);
      } 
      else {
        // alert('Case created successfully!');
        router.push('/cases');
      }

    } catch (error) {
      alert(`Failed to create case: ${handleApiError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    alert("Preview functionality would show a formatted preview of the case");
  };


  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Case</h1>
        </div>
        <Button 
          onClick={() => router.push('/cases')}
          variant="outline" 
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cases
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PatientInfoForm 
            patientInfo={patientInfo}
            onChange={handlePatientInfoChange}
          />

          <CaseSummaryForm
            content={caseSummary}
            onChange={setCaseSummary}
          />
        </div>

        <div className="space-y-6">
          <FileUpload
            category="lab"
            title="Lab Reports"
            acceptedTypes={['.csv', '.pdf', 'application/pdf', 'text/csv']}
            acceptedExtensions={['csv', 'pdf']}
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            icon={<FlaskConical className="h-4 w-4" />}
          />

          <FileUpload
            category="radiology"
            title="Radiology Images"
            acceptedTypes={['.jpg', '.jpeg', '.png', '.dcm', '.dicom', 'image/jpeg', 'image/png']}
            acceptedExtensions={['jpg', 'jpeg', 'png', 'dcm', 'dicom']}
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            icon={<FileText className="h-4 w-4" />}
          />

          <CaseActions
            onPreview={handlePreview}
            onSubmit={handleSubmit}
            onBack={() => router.push('/cases')}
            isSubmitting={isSubmitting}
            isFormValid={isFormValid}
            submitText="Create Case"
            submitingText="Creating Case..."
          />
        </div>
      </div>
    </div>
  );
} 