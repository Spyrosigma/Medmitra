# API Structure

MedMitra uses a simplified API architecture where the Next.js frontend directly communicates with the FastAPI backend, eliminating the need for Next.js API routes as middleware.

## Architecture Overview

```
Frontend (Next.js) ──────► Backend (FastAPI)
                 HTTP/JSON
```

- **Frontend**: Next.js application with TypeScript
- **Backend**: FastAPI server with Python
- **Communication**: Direct HTTP requests from frontend to backend
- **Authentication**: JWT tokens passed via Authorization headers

## Configuration

The API configuration is centralized in `lib/api-config.ts`:

```typescript
export const API_CONFIG = {
  BACKEND_URL: process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};
```

## Backend Endpoints

All endpoints are on the FastAPI backend (default: `http://localhost:8000`)

### Cases

#### `POST /cases/create_case`
Create a new medical case with patient information and file uploads.

**Request**: Multipart form data
- `user_id`: string (required)
- `patient_name`: string (required)
- `patient_age`: int (required)  
- `patient_gender`: string (required)
- `case_summary`: string (optional)
- `lab_files`: File[] (optional)
- `radiology_files`: File[] (optional)

**Response**: 
```json
{
  "message": "Case created successfully",
  "case": {
    "case_id": "uuid",
    "patient_name": "string",
    "patient_age": number,
    "patient_gender": "string",
    "case_summary": "string",
    "status": "string",
    "created_at": "ISO date",
    "updated_at": "ISO date"
  },
  "uploaded_files": [
    {
      "file_id": "uuid",
      "file_name": "string",
      "file_type": "string",
      "file_category": "lab|radiology"
    }
  ]
}
```

#### `GET /cases/cases`
Retrieve all cases with optional filtering and pagination.

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: string (optional)
- `search`: string (optional)
- `start_date`: ISO date string (optional)
- `end_date`: ISO date string (optional)
- `min_age`: number (optional)
- `max_age`: number (optional)
- `sort_by`: string (default: 'created_at')
- `sort_order`: 'asc' | 'desc' (default: 'desc')

**Response**:
```json
{
  "cases": [
    {
      "case_id": "uuid",
      "patient_name": "string",
      "patient_age": number,
      "patient_gender": "string",
      "case_summary": "string",
      "status": "string",
      "created_at": "ISO date",
      "updated_at": "ISO date"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

#### `GET /cases/cases/{case_id}`
Get a specific case by ID.

#### `PUT /cases/cases/{case_id}`
Update a case.

#### `DELETE /cases/cases/{case_id}`
Delete a case.

#### `POST /cases/analyze/{case_id}`
Analyze a case with AI.

**Request Body**:
```json
{
  "includeDifferentialDiagnosis": boolean,
  "includeTreatmentSuggestions": boolean,
  "includeLabInterpretation": boolean,
  "includeImagingAnalysis": boolean,
  "confidenceThreshold": number
}
```

### File Management

#### `POST /cases/upload`
Upload files for a case.

**Request**: Multipart form data
- `files`: File[]
- `category`: 'lab' | 'radiology'
- `case_id`: string (optional)

#### `GET /cases/files/{case_id}`
Get all files for a specific case.

#### `GET /cases/file/{file_id}`
Get a specific file by ID.

#### `DELETE /cases/file/{file_id}`
Delete a specific file.

## Frontend API Client

The frontend uses `lib/api-client.ts` for making API calls:

```typescript
import { caseApi, fileApi } from '@/lib/api-client';

// Create a case
const response = await caseApi.create(caseData, userId);

// Get all cases
const cases = await caseApi.getAll(filters, userId);

// Upload files
const result = await fileApi.upload(files, 'lab', caseId, userId);
```

## Error Handling

All API functions throw errors that can be caught and handled:

```typescript
try {
  const cases = await caseApi.getAll();
} catch (error) {
  console.error('API Error:', error.message);
}
```

## Authentication

- User ID is passed as `userId` parameter to API functions
- Backend receives it as `Authorization: Bearer {userId}` header
- Authentication is handled by Supabase on the frontend

## File Validation

Files are validated before upload:
- **Lab files**: CSV, PDF (max 10MB)
- **Radiology files**: JPEG, PNG, DICOM (max 10MB)

## Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_FASTAPI_BACKEND_URL=http://localhost:8000

# Backend
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
```

## Development Setup

1. Start FastAPI backend: `uvicorn main:app --reload --port 8000`
2. Start Next.js frontend: `npm run dev`
3. Frontend will connect to backend on `http://localhost:8000` 