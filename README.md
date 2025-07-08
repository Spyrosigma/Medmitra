# 🩺 MedMitra

MedMitra is an AI-powered medical case management system designed to assist healthcare professionals in processing patient data, analyzing medical documents (lab reports, radiology images), and generating comprehensive medical insights. It leverages advanced AI agents for document parsing, image analysis, and medical diagnosis support, streamlining the clinical workflow and providing valuable assistance in clinical decision-making.

---



https://github.com/user-attachments/assets/239577af-7c07-4fa1-aac2-aef1ff86b484



---

## ✨ Features

* **Patient Case Management**: Create, view, and manage patient cases with detailed patient information.
* **Document Upload & Processing**: Securely upload various medical documents, including PDF lab reports and radiology images (JPG, PNG).
* **AI-Powered Lab Report Analysis**: Automatically extract and summarize key information, lab values, and findings from uploaded PDF lab reports.
* **AI-Powered Radiology Image Analysis**: Analyze radiology images using a vision AI agent to identify and summarize critical findings and impressions.
* **Comprehensive Case Summaries**: Generate AI-driven, holistic summaries of patient cases by integrating doctor's notes, lab data, and radiology insights.
* **SOAP Note Generation**: Automatically generate structured Subjective, Objective, Assessment, and Plan (SOAP) notes based on the processed case data.
* **Primary Diagnosis Support**: Suggest a primary diagnosis, including ICD codes, descriptions, confidence scores, and supporting evidence derived from the analyzed medical data.
* **User Authentication**: Secure user authentication and authorization powered by Supabase Auth.
* **Responsive User Interface**: A modern, intuitive, and fully responsive web interface built with Next.js and Tailwind CSS, ensuring usability across devices.

---

## 🚀 Technologies Used

### Backend

* **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.7+.
* **Python**: The core programming language for the backend logic and AI agents.
* **LangChain / LangGraph**: Frameworks for developing applications powered by language models, used here for orchestrating complex AI workflows.
* **Groq**: Provides fast and efficient inference for large language models (LLMs), such as Llama 3, for AI analysis.
* **LlamaParse**: An intelligent document parsing service used for extracting structured data from PDF lab reports.
* **Supabase**: An open-source Firebase alternative, providing PostgreSQL database, authentication, and file storage services.
* **Pydantic**: Used for data validation and settings management, ensuring robust data models.

### Frontend

* **Next.js**: A React framework for building server-rendered and static web applications with excellent developer experience.
* **React**: A JavaScript library for building user interfaces.
* **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
* **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs directly in your markup.
* **Shadcn/ui**: A collection of reusable UI components built with Tailwind CSS and Radix UI.

---

## 📁 Directory Structure

```
spyrosigma-medmitra/
├── backend/                  \# FastAPI backend application
│   ├── agents/               \# Contains AI agents (Medical Insights Agent, Vision Agent)
│   ├── models/               \# Pydantic data models for API requests and internal state
│   ├── parsers/              \# Logic for parsing documents (e.g., PDFs)
│   ├── routes/               \# Defines API endpoints for case management
│   ├── supabase\_client/      \# Handles interactions with the Supabase database
│   └── utils/                \# General utility functions (LLM interaction, prompt definitions, JSON extraction)
└── frontend/                 \# Next.js frontend application
├── app/                  \# Next.js pages, layouts, and API routes
├── components/           \# Reusable React components (e.g., forms, UI elements, layout components)
├── docs/                 \# Project-specific documentation (e.g., API structure, setup guides)
├── hooks/                \# Custom React hooks for shared logic
├── lib/                  \# Frontend utility functions, API clients, and third-party integrations (e.g., Gladia STT)
├── types/                \# TypeScript type definitions for frontend data structures
└── utils/                \# Frontend-specific utilities (e.g., Supabase client setup for client/server)

````

---

## 🛠️ Setup and Installation

Follow these steps to set up and run the MedMitra project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js**: LTS version (e.g., 18.x or 20.x). You can download it from [nodejs.org](https://nodejs.org/).
* **npm** or **yarn**: Package managers for Node.js (usually installed with Node.js).
* **Python**: Version 3.9 or higher. Download from [python.org](https://www.python.org/downloads/).
* **pip**: Python package installer (comes with Python).
* **Supabase Project**:
    * Create a new project on [Supabase](https://supabase.com/).
    * Obtain your `Project URL` and `Service Role Key` (found under Project Settings -> API).
    * You will also need the `Anon Key` for the frontend.
* **Groq API Key**:
    * Sign up and get your API key from [Groq Console](https://console.groq.com/keys).
* **LlamaParse API Key**:
    * Sign up and get your API key from [Llama Cloud](https://cloud.llamaindex.ai/).

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd spyrosigma-medmitra/backend
    ```

2.  **Create a Python virtual environment and activate it:**
    ```bash
    python -m venv venv
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows:
    .\venv\Scripts\activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Create a `.env` file** in the `backend/` directory (at the same level as `app.py`) and add your environment variables:

    ```ini
    SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
    LLAMAPARSE_API_KEY="YOUR_LLAMAPARSE_API_KEY"
    GROQ_API_KEY="YOUR_GROQ_API_KEY"
    # WEAVIATE_API_KEY="YOUR_WEAVIATE_API_KEY" # Uncomment and set if Weaviate is integrated
    # WEAVIATE_REST_URL="YOUR_WEAVIATE_REST_URL" # Uncomment and set if Weaviate is integrated
    ```
    *Replace placeholders with your actual keys and URLs.*

5.  **Run the backend application:**
    ```bash
    uvicorn app:app --host 0.0.0.0 --port 8000 --reload
    ```
    The backend API will be accessible at `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd spyrosigma-medmitra/frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    # Or if you prefer yarn:
    # yarn install
    ```

3.  **Create a `.env.local` file** in the `frontend/` directory (at the same level as `package.json`) and add your environment variables for Supabase client-side and backend API URL:

    ```ini
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    NEXT_PUBLIC_BACKEND_API_URL="http://localhost:8000" # Use your deployed backend URL if applicable
    ```
    *Replace placeholders with your actual Supabase URL and Anon Key. The `NEXT_PUBLIC_BACKEND_API_URL` should point to where your FastAPI backend is running.*

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    # Or if you prefer yarn:
    # yarn dev
    ```
    The frontend application will be accessible at `http://localhost:3000`.

---

## 🖥️ Usage

1.  Open your web browser and navigate to `http://localhost:3000`.
2.  You will be prompted to sign up or log in. Use the authentication flow to create an account or access an existing one.
3.  Once logged in, navigate to the dashboard where you can view and manage patient cases.
4.  To create a new case, click on the "New Case" button. You can then fill in patient details and upload relevant medical documents (PDF lab reports, radiology images).
5.  After uploading, the system will automatically process the documents using the AI agents. The generated medical insights, including case summaries, SOAP notes, and diagnoses, will be displayed within the case details.
