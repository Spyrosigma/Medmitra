import { BackendCase, Case } from "@/types/case";
import { API_CONFIG, makeBackendRequest, validateFile } from "./api-config";

export interface CaseData {
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    caseTitle: string;
  };
  caseSummary: string;
  uploadedFiles: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    category: string;
    file?: File;
  }>;
}

export interface CaseFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  minAge?: number;
  maxAge?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  case_id?: string;
  case?: T;
  uploaded_files?: any[];
}

class ApiClient {
  
  async createCase(caseData: CaseData, userId?: string): Promise<ApiResponse> {
    const formData = new FormData();
    
    if (userId) {
      formData.append('user_id', userId);
    }
    
    formData.append('patient_name', caseData.patientInfo.name);
    formData.append('patient_age', caseData.patientInfo.age);
    formData.append('patient_gender', caseData.patientInfo.gender);
    
    if (caseData.caseSummary) {
      formData.append('case_summary', caseData.caseSummary);
    }

    const labFiles = caseData.uploadedFiles.filter(f => f.category === 'lab' && f.file);
    const radiologyFiles = caseData.uploadedFiles.filter(f => f.category === 'radiology' && f.file);

    labFiles.forEach(fileData => {
      if (fileData.file && fileData.file.size > 0) {
        const validation = validateFile(fileData.file, 'lab');
        if (validation) throw new Error(validation);
        formData.append('lab_files', fileData.file);
      }
    });

    radiologyFiles.forEach(fileData => {
      if (fileData.file && fileData.file.size > 0) {
        const validation = validateFile(fileData.file, 'radiology');
        if (validation) throw new Error(validation);
        formData.append('radiology_files', fileData.file);
      }
    });

    const response = await fetch(`${API_CONFIG.BACKEND_URL}/cases/create_case`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  async getCases(filters: CaseFilters = {}, userId?: string): Promise<{ cases: Case[] }> {
    const queryParams = new URLSearchParams();
    if (userId) {
      queryParams.append('user_id', userId);
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/cases/all_cases${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const data = await makeBackendRequest(endpoint, {});
    
    const transformedCases: Case[] = data.cases.map((backendCase: BackendCase) => ({
      id: backendCase.case_id,
      patient_name: backendCase.patient_name,
      patient_age: backendCase.patient_age,
      patient_gender: backendCase.patient_gender,
      case_summary: backendCase.case_summary,
      status: backendCase.status,
      created_at: backendCase.created_at,
      updated_at: backendCase.updated_at,
      patient: {
        id: `patient-${backendCase.id}`,
        name: backendCase.patient_name,
        age: backendCase.patient_age,
        gender: backendCase.patient_gender,
      },
      patient_id: `patient-${backendCase.id}`,
      title: backendCase.case_summary?.substring(0, 50) + "..." || "Case Summary",
    }));

    return { cases: transformedCases };
  }

  async getCase(caseId: string, userId?: string): Promise<ApiResponse> {
    return makeBackendRequest(`/cases/cases/${caseId}`, { userId });
  }

  async updateCase(caseId: string, updateData: Partial<CaseData>, userId?: string): Promise<ApiResponse> {
    return makeBackendRequest(`/cases/cases/${caseId}`, {
      method: 'PUT',
      body: updateData,
      userId,
    });
  }

  async deleteCase(caseId: string, userId?: string): Promise<ApiResponse> {
    return makeBackendRequest(`/cases/cases/${caseId}`, {
      method: 'DELETE',
      userId,
    });
  }

  async analyzeCase(caseId: string, options: {
    includeDifferentialDiagnosis?: boolean;
    includeTreatmentSuggestions?: boolean;
    includeLabInterpretation?: boolean;
    includeImagingAnalysis?: boolean;
    confidenceThreshold?: number;
  } = {}, userId?: string): Promise<ApiResponse> {
    return makeBackendRequest(`/cases/analyze/${caseId}`, {
      method: 'POST',
      body: options,
      userId,
    });
  }

  async uploadFiles(
    files: File[],
    category: 'lab' | 'radiology',
    caseId?: string,
    userId?: string
  ): Promise<ApiResponse> {
    const formData = new FormData();
    
    files.forEach(file => {
      const validation = validateFile(file, category);
      if (validation) throw new Error(validation);
      formData.append('files', file);
    });
    
    formData.append('category', category);
    if (caseId) formData.append('case_id', caseId);

    const response = await fetch(`${API_CONFIG.BACKEND_URL}/cases/upload`, {
      method: 'POST',
      headers: userId ? { 'Authorization': `Bearer ${userId}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  async getCaseFiles(caseId: string, userId?: string): Promise<ApiResponse> {
    return makeBackendRequest(`/cases/files/${caseId}`, { userId });
  }

  async getFileById(fileId: string, userId?: string): Promise<ApiResponse> {
    return makeBackendRequest(`/cases/file/${fileId}`, { userId });
  }

  async deleteFile(fileId: string, userId?: string): Promise<ApiResponse> {
    return makeBackendRequest(`/cases/file/${fileId}`, {
      method: 'DELETE',
      userId,
    });
  }
}

export const apiClient = new ApiClient();

export const caseApi = {
  create: (caseData: CaseData, userId?: string) => apiClient.createCase(caseData, userId),
  getAll: (filters?: CaseFilters, userId?: string) => apiClient.getCases(filters, userId),
  getById: (id: string, userId?: string) => apiClient.getCase(id, userId),
  update: (id: string, data: Partial<CaseData>, userId?: string) => apiClient.updateCase(id, data, userId),
  delete: (id: string, userId?: string) => apiClient.deleteCase(id, userId),
  analyze: (id: string, options?: Parameters<typeof apiClient.analyzeCase>[1], userId?: string) => 
    apiClient.analyzeCase(id, options, userId),
};

export const fileApi = {
  upload: (files: File[], category: 'lab' | 'radiology', caseId?: string, userId?: string) =>
    apiClient.uploadFiles(files, category, caseId, userId),
  getCaseFiles: (caseId: string, userId?: string) => apiClient.getCaseFiles(caseId, userId),
  getById: (fileId: string, userId?: string) => apiClient.getFileById(fileId, userId),
  delete: (fileId: string, userId?: string) => apiClient.deleteFile(fileId, userId),
};

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
} 