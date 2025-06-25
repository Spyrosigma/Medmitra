export const API_CONFIG = {
  BACKEND_URL: process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL || 'http://localhost:8000',  
  TIMEOUT: 30000,
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  
  ALLOWED_FILE_TYPES: {
    lab: ['text/csv', 'application/pdf'],
    radiology: ['image/jpeg', 'image/png', 'application/dicom', 'image/dicom'],
  },
};

export async function makeBackendRequest(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    userId?: string;
  } = {}
) {
  const { method = 'GET', body, headers = {}, userId } = options;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  
  if (userId) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${userId}`,
    };
  }
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  const url = `${API_CONFIG.BACKEND_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Request failed',
        status: response.status 
      }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Backend request failed for ${endpoint}:`, error);
    throw error;
  }
}

export function validateFile(file: File, category: 'lab' | 'radiology'): string | null {
  if (file.size > API_CONFIG.MAX_FILE_SIZE) {
    return `File size exceeds maximum allowed size of ${API_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`;
  }
  
  const allowedTypes = API_CONFIG.ALLOWED_FILE_TYPES[category];
  const isValidType = allowedTypes.includes(file.type) || 
    (category === 'radiology' && (
      file.name.toLowerCase().endsWith('.dcm') || 
      file.name.toLowerCase().endsWith('.dicom')
    ));
  
  if (!isValidType) {
    return `Invalid file type for ${category}. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  return null;
} 