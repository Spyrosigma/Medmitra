# 🩺 MedMitra: AI-Powered Medical Case Management

[![MedMitra Live Demo](https://img.shields.io/badge/Live%20Demo-medmitra.vercel.app-blue)](https://medmitra.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Google OAuth2](https://img.shields.io/badge/Google%20OAuth2-4285F4?style=for-the-badge&logo=google&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Koyeb](https://img.shields.io/badge/Koyeb-000000?style=for-the-badge&logo=koyeb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Supabase Storage](https://img.shields.io/badge/Supabase%20Storage-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Supabase Auth](https://img.shields.io/badge/Supabase%20Auth-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-FF4500?style=for-the-badge&logo=langchain&logoColor=white)
![Groq API](https://img.shields.io/badge/Groq%20API-FF4500?style=for-the-badge&logo=groq&logoColor=white)
![LlamaParse](https://img.shields.io/badge/LlamaParse-FF4500?style=for-the-badge&logo=llama&logoColor=white)
![LangGraph Python](https://img.shields.io/badge/LangGraph%20Python-FF4500?style=for-the-badge&logo=python&logoColor=white)
![Gladia STT](https://img.shields.io/badge/Gladia%20STT-FF4500?style=for-the-badge&logo=audio&logoColor=white)


MedMitra is an innovative AI-powered medical case management system designed to empower healthcare professionals. It streamlines the processing of patient data, intelligently analyzes diverse medical documents (including lab reports and radiology images), and generates comprehensive medical insights. By leveraging advanced AI agents for document parsing, image analysis, and diagnosis support, MedMitra optimizes clinical workflows and provides invaluable assistance in clinical decision-making.

---

[https://github.com/user-attachments/assets/239577af-7c07-4fa1-aac2-aef1ff86b484](https://github.com/user-attachments/assets/239577af-7c07-4fa1-aac2-aef1ff86b484)

---

## ✨ Key Features

MedMitra offers a robust set of features to enhance medical case management:

* **Patient Case Management**: Effortlessly create, view, and manage patient cases with comprehensive patient information.
* **Document Upload & Processing**: Securely upload various medical documents, including PDF lab reports and radiology images (JPG, PNG).
* **AI-Powered Lab Report Analysis**: Automatically extract and summarize key information, lab values, and findings from uploaded PDF lab reports.
* **AI-Powered Radiology Image Analysis**: Utilize a sophisticated vision AI agent to analyze radiology images, identifying and summarizing critical findings and impressions.
* **Comprehensive Case Summaries**: Generate AI-driven, holistic summaries of patient cases by seamlessly integrating doctor's notes, lab data, and radiology insights.
* **SOAP Note Generation**: Automatically generate structured Subjective, Objective, Assessment, and Plan (SOAP) notes based on the processed case data, ensuring standardized documentation.
* **Primary Diagnosis Support**: Receive suggested primary diagnoses, complete with ICD codes, detailed descriptions, confidence scores, and supporting evidence derived from the analyzed medical data.
* **Secure User Authentication**: Robust user authentication and authorization powered by Supabase Auth, ensuring data privacy and access control.
* **Responsive User Interface**: Experience a modern, intuitive, and fully responsive web interface built with Next.js and Tailwind CSS, optimized for seamless usability across all devices.

---

## 🤖 AI Agentic Workflow: The Core of MedMitra

MedMitra's advanced functionality is driven by a sophisticated, multi-agent system that intelligently analyzes and synthesizes medical data from various sources. This intricate workflow is orchestrated on the backend, involving several specialized AI agents and processes working in concert.

### 1. Initial Document Processing

Upon the creation of a new case and the upload of documents, the backend initiates a two-pronged processing approach:

* **PDF Lab Reports**: Lab reports in PDF format are meticulously processed using **LlamaParse**. This service intelligently parses the documents, extracting raw text while preserving crucial structural information for accurate analysis. The extracted text is then securely stored and linked to the corresponding case.
* **Radiology Images**: Radiology images (such as X-rays or MRIs) are stored, and their URLs are prepared for subsequent analysis by the Vision Agent.

### 2. The Vision Agent: Deep Radiology Image Analysis

The **Vision Agent** is specifically designed for the insightful analysis of uploaded radiology images. It leverages a powerful multimodal model (**LLaVA**) accessible via the Groq API. For each radiology image, the agent executes the following steps:

1.  **Receives Image URL**: The agent is provided with the URL of the radiology image.
2.  **Multimodal Model Interaction**: The image is sent to the multimodal model with a specialized prompt (`RADIOLOGY_ANALYSIS_PROMPT`) crafted to elicit a detailed and comprehensive analysis.
3.  **Structured Data Output**: The model returns a structured JSON object containing key findings, impressions, and a concise summary of the image.
4.  **Data Storage**: This structured data is then saved and associated with the specific radiology file within the patient's case.

### 3. The Medical Insights Agent: Comprehensive Medical Analysis

Once the initial document processing and vision analysis are complete, the **Medical Insights Agent** takes center stage. This agent utilizes **LangGraph** to execute a reliable, state-driven workflow that synthesizes all available data into a comprehensive medical analysis. The workflow progresses through the following key states:

1.  **Data Aggregation**: The agent meticulously gathers all pertinent data for the case, including the doctor's initial notes, the extracted text from lab reports, and the structured summaries provided by the Vision Agent.
2.  **Generate Case Summary**: It synthesizes all the gathered information into a comprehensive, holistic summary of the patient's condition, providing a 360-degree view.
3.  **Generate SOAP Note**: Based on the comprehensive case summary, it constructs a structured **SOAP (Subjective, Objective, Assessment, Plan)** note. This adheres to the standard format widely used by healthcare professionals for patient documentation.
4.  **Generate Primary Diagnosis**: Leveraging the SOAP note and the full case context, the agent intelligently proposes a primary diagnosis. This includes an **ICD-10 code**, a clear description, a confidence score, and supporting evidence meticulously extracted from the provided medical documents.
5.  **Save Results**: All the generated insights—the comprehensive case summary, the detailed SOAP note, and the proposed diagnosis—are securely saved back to the database, marked as "completed," and seamlessly made available to the user in the frontend.

This structured, multi-agent approach ensures that each piece of medical data is processed by a specialized AI, and the results are then intelligently combined to provide clinicians with reliable, actionable insights, ultimately enhancing diagnostic accuracy and treatment planning.

---

## 🚀 Technologies Used

MedMitra is built using a modern and robust tech stack, ensuring high performance, scalability, and maintainability.

### Backend

* **FastAPI**: A modern, high-performance web framework for building efficient and robust APIs with Python.
* **Python**: The core programming language powering the backend logic and sophisticated AI agents.
* **LangChain / LangGraph**: Powerful frameworks for developing applications driven by large language models, crucial for orchestrating complex AI workflows.
* **Groq**: Provides incredibly fast and efficient inference for large language models (LLMs), such as Llama 3, for real-time AI analysis.
* **LlamaParse**: An intelligent document parsing service from LlamaIndex, specifically utilized for extracting structured data from PDF lab reports.
* **Supabase**: The application leverages the `supabase-py` library for seamless interaction with a PostgreSQL database, secure user authentication, and efficient file storage.
* **Pydantic**: Used extensively for data validation and settings management, ensuring robust data models and API integrity.

### Frontend

* **Next.js**: A powerful React framework for building server-rendered and static web applications, offering exceptional performance. The development server is powered by **Turbopack** for maximum speed.
* **React**: A leading JavaScript library for building dynamic and interactive user interfaces.
* **TypeScript**: A strongly typed superset of JavaScript that compiles to plain JavaScript, significantly enhancing code quality, readability, and maintainability.
* **Tailwind CSS**: A utility-first CSS framework enabling rapid and efficient building of custom designs with minimal CSS.
* **Shadcn/ui**: A carefully curated collection of reusable UI components built with **Radix UI** and Tailwind CSS, providing a polished and consistent user experience.
* **Supabase**: The frontend seamlessly integrates with the Supabase backend using the `@supabase/ssr` and `@supabase/supabase-js` libraries for secure authentication and efficient data management.
* **Lucide React**: A comprehensive and aesthetically pleasing icon library for intuitive visual communication.
* **Next-Themes**: For easy and elegant implementation of dark/light mode theme switching, enhancing user comfort.
* **Gladia**: Integrated for robust real-time speech-to-text transcription capabilities.

---

## 📁 Directory Structure

The project follows a clear and organized directory structure to promote modularity and ease of development:

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

Follow these detailed steps to set up and run the MedMitra project locally on your machine.

### Prerequisites

Before you begin, ensure you have the following essential software and accounts:

* **Node.js**: LTS version (e.g., 18.x or 20.x). Download from [nodejs.org](https://nodejs.org/).
* **npm** or **yarn**: Package managers for Node.js (typically installed with Node.js).
* **Python**: Version 3.9 or higher. Download from [python.org](https://www.python.org/downloads/).
* **pip**: Python package installer (comes pre-installed with Python).
* **Supabase Project**:
    * Create a new project on [Supabase](https://supabase.com/).
    * Obtain your `Project URL` and `Service Role Key` (found under Project Settings -> API).
    * You will also need the `Anon Key` for the frontend.
* **Groq API Key**:
    * Sign up and obtain your API key from the [Groq Console](https://console.groq.com/keys).
* **LlamaParse API Key**:
    * Sign up and obtain your API key from [Llama Cloud](https://cloud.llamaindex.ai/).
* **Gladia API Key**:
    * Sign up at [gladia.io](https://gladia.io) and generate an API key from your dashboard.

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
    .\venv\Scripts\activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Create a `.env` file** in the `backend/` directory (at the same level as `app.py`) and add your environment variables. **Replace the placeholders with your actual keys and URLs.**

    ```ini
    SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
    LLAMAPARSE_API_KEY="YOUR_LLAMAPARSE_API_KEY"
    GROQ_API_KEY="YOUR_GROQ_API_KEY"
    # WEAVIATE_API_KEY="YOUR_WEAVIATE_API_KEY" # Uncomment and set if Weaviate is integrated
    # WEAVIATE_REST_URL="YOUR_WEAVIATE_REST_URL" # Uncomment and set if Weaviate is integrated
    ```

5.  **Run the backend application:**
    ```bash
    uvicorn app:app --host 0.0.0.0 --port 8000 --reload
    ```
    The backend API will now be accessible at `http://localhost:8000`.

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

3.  **Create a `.env.local` file** in the `frontend/` directory (at the same level as `package.json`) and add your environment variables for Supabase client-side, backend API URL, and Gladia API key. **Replace the placeholders with your actual keys and URLs.**

    ```ini
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    NEXT_PUBLIC_FASTAPI_BACKEND_URL="http://localhost:8000" # Use your deployed backend URL if applicable
    NEXT_PUBLIC_GLADIA_API_KEY="YOUR_GLADIA_API_KEY"
    ```
    *The `NEXT_PUBLIC_FASTAPI_BACKEND_URL` should point to where your FastAPI backend is running.*

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    # Or if you prefer yarn:
    # yarn dev
    ```
    The frontend utilizes **Turbopack**, the successor to Webpack, for a significantly faster development experience. The application will be accessible at `http://localhost:3000`.

---

## 🖥️ Usage Guide

1.  Open your web browser and navigate to `http://localhost:3000`.
2.  You will be prompted to sign up or log in. Use the secure authentication flow to create a new account or access an existing one.
3.  Once successfully logged in, you will be directed to the dashboard, where you can conveniently view and manage all your patient cases.
4.  To create a new case, simply click on the "New Case" button. You can then fill in detailed patient information and securely upload relevant medical documents, including PDF lab reports and radiology images.
5.  After uploading, the system will automatically initiate the document processing using its sophisticated AI agents. The generated medical insights, including comprehensive case summaries, structured SOAP notes, and primary diagnoses, will be intuitively displayed within the case details for your review.
