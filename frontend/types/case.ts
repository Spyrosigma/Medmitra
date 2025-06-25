export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  email?: string;
}

export interface BackendCase {
  id: number;
  doctor_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  case_summary: string;
  status: "failed" | "completed" | "processing";
  created_at: string;
  updated_at: string;
  case_id: string;
}

export interface Case {
  id: string;
  patient_id?: string;
  patient?: Patient;
  patient_name?: string;
  patient_age?: number;
  patient_gender?: string;
  title?: string;
  case_summary?: string;
  status: "failed" | "completed" | "processing";
  created_at: string;
  updated_at: string;
  chief_complaint?: string;
  symptoms?: string;
  medical_history?: string;
  current_medications?: string;
  soap_note?: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
  };
  uploaded_files?: UploadedFile[];
  ai_suggestions?: AISuggestion[];
  feedback?: Feedback[];
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploaded_at: string;
}

export interface AISuggestion {
  id: string;
  type: "diagnosis" | "treatment" | "investigation";
  suggestion: string;
  confidence: number;
  evidence?: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  type: "helpful" | "not_helpful";
  comment?: string;
  created_at: string;
}

export interface CaseFilters {
  search: string;
  status: string;
  gender: string;
  dateRange: {
    from: string;
    to: string;
  };
  ageRange: {
    min: number;
    max: number;
  };
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
} 