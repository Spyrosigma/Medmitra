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

## 🤖 AI Agentic Workflow

MedMitra's core functionality is powered by a sophisticated, multi-agent system designed to analyze and synthesize medical data from various sources. This workflow is orchestrated on the backend and involves several specialized agents and processes working in concert.

### 1. Initial Document Processing

When a new case is created and documents are uploaded, the backend initiates a two-pronged processing approach:

*   **PDF Lab Reports**: Lab reports in PDF format are processed using **LlamaParse**. This service intelligently parses the documents, extracting the raw text and preserving the structure, which is crucial for accurate analysis. The extracted text is then stored and linked to the case.
*   **Radiology Images**: Radiology images (such as X-rays or MRIs) are stored, and their URLs are prepared for analysis by the Vision Agent.

### 2. The Vision Agent: Analyzing Radiology Images

The **Vision Agent** is responsible for analyzing the uploaded radiology images. It leverages a powerful multimodal model (**LLaVA**) through the Groq API. For each radiology image, the agent:
1.  Receives the image URL.
2.  Sends the image to the multimodal model with a specialized prompt (`RADIOLOGY_ANALYSIS_PROMPT`) designed to elicit a detailed analysis.
3.  The model returns a structured JSON object containing key findings, impressions, and a summary of the image.
4.  This structured data is then saved and associated with the specific radiology file in the case.

### 3. The Medical Insights Agent: Generating Comprehensive Analysis

Once the initial document processing and vision analysis are complete, the **Medical Insights Agent** takes over. This agent uses **LangGraph** to execute a reliable, state-driven workflow that synthesizes all the available data into a comprehensive medical analysis. The workflow proceeds through the following key states:

1.  **Data Aggregation**: The agent gathers all the data for the case, including the doctor's initial notes, the text extracted from lab reports, and the structured summaries from the Vision Agent.
2.  **Generate Case Summary**: It synthesizes all the information into a comprehensive, holistic summary of the patient's condition.
3.  **Generate SOAP Note**: Based on the case summary, it constructs a structured **SOAP (Subjective, Objective, Assessment, Plan)** note. This is a standard format used by healthcare professionals to document patient information.
4.  **Generate Primary Diagnosis**: Using the SOAP note and the full case context, the agent proposes a primary diagnosis, complete with an **ICD-10 code**, a description, a confidence score, and the supporting evidence from the provided documents.
5.  **Save Results**: All the generated insights—the case summary, SOAP note, and diagnosis—are saved back to the database, marked as "completed," and made available to the user in the frontend.

This structured, multi-agent approach ensures that each piece of medical data is processed by a specialized AI, and the results are then intelligently combined to provide clinicians with reliable, actionable insights.

---

## 🚀 Technologies Used

### Backend

* **FastAPI**: A modern, high-performance web framework for building APIs with Python.
* **Python**: The core programming language for the backend logic and AI agents.
* **LangChain / LangGraph**: Frameworks for developing applications powered by language models, used for orchestrating complex AI workflows.
* **Groq**: Provides fast and efficient inference for large language models (LLMs), such as Llama 3, for AI analysis.
* **LlamaParse**: An intelligent document parsing service from LlamaIndex used for extracting structured data from PDF lab reports.
* **Supabase**: The application utilizes the `supabase-py` library to interact with a PostgreSQL database, manage authentication, and handle file storage.
* **Pydantic**: Used for data validation and settings management to ensure robust data models.

### Frontend

* **Next.js**: A React framework for building server-rendered and static web applications. The development server is powered by **Turbopack** for maximum speed.
* **React**: A JavaScript library for building user interfaces.
* **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
* **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
* **Shadcn/ui**: A collection of reusable UI components built with **Radix UI** and Tailwind CSS.
* **Supabase**: The frontend uses the `@supabase/ssr` and `@supabase/supabase-js` libraries for seamless and secure interaction with the Supabase backend for authentication and data management.
* **Lucide React**: A comprehensive and beautiful icon library.
* **Next-Themes**: For easy implementation of dark/light mode theme switching.
* **Gladia**: Integrated for real-time speech-to-text transcription.

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
    *Ensure you have Python 3.9+ installed.*
    ```bash
    python3 -m venv venv
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows:
    .\\venv\\Scripts\\activate
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
    NEXT_PUBLIC_FASTAPI_BACKEND_URL="http://localhost:8000" # Use your deployed backend URL if applicable
    NEXT_PUBLIC_GLADIA_API_KEY="YOUR_GLADIA_API_KEY"
    ```
    *Replace placeholders with your actual Supabase URL and Anon Key. The `NEXT_PUBLIC_FASTAPI_BACKEND_URL` should point to where your FastAPI backend is running.*
    *To get your `GLADIA_API_KEY`, sign up at [gladia.io](https://gladia.io) and generate an API key from your dashboard.*

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    # Or if you prefer yarn:
    # yarn dev
    ```
    The frontend uses **Turbopack**, the successor to Webpack, for a faster development experience. The application will be accessible at `http://localhost:3000`.

---

## 🖥️ Usage

1.  Open your web browser and navigate to `http://localhost:3000`.
2.  You will be prompted to sign up or log in. Use the authentication flow to create an account or access an existing one.
3.  Once logged in, navigate to the dashboard where you can view and manage patient cases.
4.  To create a new case, click on the "New Case" button. You can then fill in patient details and upload relevant medical documents (PDF lab reports, radiology images).
5.  After uploading, the system will automatically process the documents using the AI agents. The generated medical insights, including case summaries, SOAP notes, and diagnoses, will be displayed within the case details.
