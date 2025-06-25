# MedMitra

A medical case management system with AI-powered analysis capabilities.

## Architecture

MedMitra uses a clean, simplified architecture:

```
Frontend (Next.js) ──────► Backend (FastAPI)
                 HTTP/JSON
```

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: FastAPI with Python (separate repository)
- **Database**: PostgreSQL (managed by FastAPI backend)
- **Authentication**: Supabase Auth
- **File Storage**: Handled by FastAPI backend

## Key Features

- 📋 Patient case management
- 🤖 AI-powered case analysis
- 📁 Lab report and radiology image uploads
- 🔍 Advanced case filtering and search
- 🔐 Secure authentication with Supabase
- 📱 Responsive design

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── cases/             # Case management pages
│   ├── dashboard/         # Dashboard page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── cases/            # Case-specific components
├── lib/                  # Core utilities
│   ├── api-client.ts     # FastAPI client
│   └── api-config.ts     # API configuration
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Setup

### Prerequisites

- Node.js 18+ 
- FastAPI backend running on port 8000
- Supabase project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd medmitra
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# FastAPI Backend
NEXT_PUBLIC_FASTAPI_BACKEND_URL=http://localhost:8000
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Integration

The frontend communicates directly with the FastAPI backend using a simple API client:

```typescript
import { caseApi } from '@/lib/api-client';

// Create a case
const response = await caseApi.create(caseData, userId);

// Get all cases
const cases = await caseApi.getAll(filters, userId);

// Upload files
const result = await fileApi.upload(files, 'lab', caseId, userId);
```

### Authentication

Authentication is handled by Supabase and the user ID is automatically passed to API calls:

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { userId, loading } = useAuth();
  
  // userId is automatically used in API calls
}
```

## File Upload Support

- **Lab Reports**: CSV, PDF files (max 10MB)
- **Radiology Images**: JPEG, PNG, DICOM files (max 10MB)

Files are validated on the frontend before upload and stored/processed by the FastAPI backend.

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for consistent UI components
- ESLint and Prettier for code formatting

## Backend Integration

Ensure your FastAPI backend implements these endpoints:

- `POST /cases/create_case` - Create new case
- `GET /cases` - Get cases with filtering
- `GET /cases/{id}` - Get specific case
- `PUT /cases/{id}` - Update case
- `DELETE /cases/{id}` - Delete case
- `POST /cases/{id}/analyze` - AI analysis
- `POST /upload` - File upload

See `docs/api-structure.md` for detailed API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
