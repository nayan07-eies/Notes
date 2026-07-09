# AI Notes SaaS Frontend Guide for Backend Integration

This document explains the frontend of the AI Notes SaaS application in a backend-friendly way. It is written so that a backend engineer, API designer, or AI coding tool can understand what the UI expects, what state it holds, and which data flows need backend support.

---

## 1. Product Summary

AI Notes SaaS is a knowledge workspace application that helps users:
- upload documents, audio, video, and YouTube content,
- transform raw content into structured notes,
- generate study tools like flashcards, quizzes, mind maps, and tutor chat,
- manage account preferences and workspace settings.

The UI is designed as a modern, polished React application with a dark/light theme, animated components, and a study-focused workflow.

---

## 2. High-Level Frontend Architecture

### Core stack
- React 19
- Vite 8
- React Router DOM
- Redux Toolkit for app state
- TanStack React Query for async server state
- Tailwind CSS + shadcn-style UI primitives
- Framer Motion for animations
- Axios for API calls

### Architectural style
The project follows Feature-Sliced Design (FSD), which keeps the code organized by business concern:

- app/: global providers, routing, store
- pages/: full page-level screens
- widgets/: larger layout sections composed from features
- features/: user interactions and business flows
- entities/: domain logic such as notes
- shared/: reusable UI, API utilities, helpers

---

## 3. Entry Points and App Boot Flow

### Startup files
- src/main.jsx: bootstraps the app, wraps it in Redux and React Query providers, and mounts the router
- src/app/providers/RouterProvider.jsx: defines all routes

### Boot sequence
1. React renders the root application
2. Redux store is created
3. React Query provider is mounted
4. The router is initialized
5. The current route renders the relevant page

---

## 4. Routing Structure

The app has three major route groups:

### Public routes
- /: landing page
- /login: login page
- /signup: signup page
- /forgot-password: password recovery page

### Authenticated app routes
- /dashboard: main dashboard
- /dashboard/settings: settings page
- /dashboard/study: study workspace page

### Fallback route
- any unknown route redirects to /

### Important routing insight
The frontend uses a nested layout model:
- AuthLayout for authentication screens
- AppLayout for dashboard and study-related pages

This means the backend should be prepared to support protected routes and potentially JWT/auth state.

---

## 5. Main Pages and Their Purpose

### 5.1 HomePage
File: src/pages/HomePage.jsx

Purpose:
- public landing page
- introduces the product value proposition
- encourages sign-up or login

User-facing behavior:
- animated hero section
- CTA buttons for sign-up and login
- visual representation of content ingestion and structured output

Backend relevance:
- no complex business logic currently
- mostly marketing/UX content

### 5.2 Login / Signup / Forgot Password Pages
Files:
- src/pages/Auth/LoginPage.jsx
- src/pages/Auth/SignupPage.jsx
- src/pages/Auth/ForgotPasswordPage.jsx

Purpose:
- authentication UI
- likely to later connect to auth endpoints

Backend relevance:
- these pages will require auth endpoints such as:
  - POST /auth/login
  - POST /auth/signup
  - POST /auth/forgot-password

### 5.3 DashboardPage
File: src/pages/DashboardPage.jsx

Purpose:
- workspace overview page
- displays summary statistics and recent activity

Current behavior:
- uses static/mock data for cards and charts
- shows metrics like:
  - Total Documents
  - AI Insights Generated
  - Storage Used
  - System Status
- renders an area chart using Recharts
- shows recent activity feed

Backend relevance:
- this page is a strong candidate for analytics endpoints such as:
  - GET /dashboard/summary
  - GET /dashboard/activity
  - GET /dashboard/stats

### 5.4 SettingsPage
File: src/pages/SettingsPage.jsx

Purpose:
- account and preferences management
- includes account, appearance, notifications, and security sections

Current behavior:
- local state for profile data
- upload avatar image preview using FileReader
- save action with simulated delay
- dark mode toggle using Redux
- logout action

Backend relevance:
- likely needs endpoints like:
  - GET /users/me
  - PUT /users/me
  - POST /users/avatar
  - PUT /users/preferences
  - POST /auth/logout

### 5.5 StudyPage
File: src/pages/StudyPage.jsx

Purpose:
- hosts the study workspace experience

Current behavior:
- renders DocumentWorkspace, which becomes the main interactive study environment

Backend relevance:
- this is the most important page for AI/backend integration

---

## 6. Study Workspace Flow

The main study experience is implemented in src/features/Study/ui/DocumentWorkspace.jsx.

### Core user journey
The workflow moves through 4 pipeline states:
1. ingest
2. processing
3. editor
4. study

### Stage 1: Ingest
User can:
- paste a YouTube URL,
- upload a PDF or audio file,
- click a button to start content extraction

Frontend state involved:
- mediaUrl
- pipelineState
- documentTitle
- documentContent

Backend relevance:
- this is where content ingestion should happen
- likely endpoint examples:
  - POST /documents/upload
  - POST /documents/import-youtube
  - POST /documents/process

### Stage 2: Processing
UI shows a loading/processing spinner while AI work is happening.

Backend relevance:
- this stage should be backed by asynchronous job processing or streaming status updates
- useful endpoints:
  - POST /documents/:id/process
  - GET /documents/:id/status

### Stage 3: Editor
After processing completes, the UI shows:
- title input field
- editable rich text content area
- toolbox with study-generation options

This stage is effectively a content review and editing canvas.

Backend relevance:
- the editor content should be saved or updated through endpoints such as:
  - PUT /documents/:id
  - POST /documents/:id/summary
  - POST /documents/:id/derive

### Stage 4: Study
Once the user selects a study tool, the app switches to one of these modules:
- FlashcardModule
- QuizModule
- MindMapModule
- TutorChatModule

Each module represents a different output of AI processing.

---

## 7. Study Modules and What They Expect from the Backend

### 7.1 FlashcardModule
File: src/features/Study/ui/FlashcardModule.jsx

Purpose:
- display generated flashcards
- allow the user to mark cards as mastered or review
- track progress and allow reset

Current behavior:
- uses mock flashcard data in memory
- supports keyboard shortcuts and animated card flip

Backend relevance:
- should eventually receive flashcards from an endpoint like:
  - POST /documents/:id/flashcards
  - GET /documents/:id/flashcards

Suggested payload:
```json
{
  "flashcards": [
    {
      "id": "fc_1",
      "term": "Optimistic UI",
      "definition": "A UI pattern that updates immediately before the server confirms success."
    }
  ]
}
```

### 7.2 QuizModule
File: src/features/Study/ui/QuizModule.jsx

Purpose:
- generate quiz questions and evaluate answers
- show AI explanation after submission

Current behavior:
- uses mock quiz data in memory
- tracks score and progress
- simulates AI feedback word-by-word

Backend relevance:
- should eventually receive question sets from:
  - POST /documents/:id/quiz
  - GET /documents/:id/quiz

Suggested payload:
```json
{
  "questions": [
    {
      "id": "q1",
      "question": "What is optimistic UI?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "B",
      "explanation": "Optimistic UI makes the interface feel instant."
    }
  ]
}
```

### 7.3 MindMapModule
File: src/features/Study/ui/MindMapModule.jsx

Purpose:
- show a concept map / mind map of the document content
- supports zoom and node interaction

Current behavior:
- uses hardcoded graph nodes and edges

Backend relevance:
- should receive structured graph data:
  - POST /documents/:id/mindmap
  - GET /documents/:id/mindmap

Suggested payload:
```json
{
  "nodes": [
    { "id": "root", "label": "Modern AI Architecture", "type": "core" },
    { "id": "frontend", "label": "Optimistic UI", "type": "concept" }
  ],
  "edges": [
    { "source": "root", "target": "frontend" }
  ]
}
```

### 7.4 TutorChatModule
File: src/features/Study/ui/TutorChatModule.jsx

Purpose:
- AI tutor conversation experience
- user asks questions and receives streamed replies

Current behavior:
- uses mock messages and simulated streaming response

Backend relevance:
- needs chat endpoints that can support:
  - POST /chat/messages
  - GET /chat/conversations/:id
  - streaming or SSE responses for real-time AI output

Suggested payload:
```json
{
  "conversationId": "conv_123",
  "message": "Explain optimistic UI"
}
```

---

## 8. State Management

### 8.1 Redux Toolkit
The app uses Redux for global UI state.

#### UI slice
File: src/app/store/uiSlice.js

State fields:
- isSidebarOpen
- isDarkMode
- isAuthenticated
- user

Important actions:
- toggleSidebar
- toggleDarkMode
- logout

#### Note UI slice
File: src/entities/note/model/slice.js

State fields:
- searchQuery
- selectedNoteId
- sortBy

This is a small slice for note-related UI state.

### 8.2 React Query
The project uses React Query for remote data and mutations.

Relevant file:
- src/entities/note/model/queries.js

It provides hooks for:
- fetching notes
- fetching a single note
- creating notes
- updating notes
- deleting notes
- generating AI summaries
- uploading media
- importing YouTube content

Backend relevance:
- these hooks are the clearest source of the expected CRUD and AI operations for notes and media

---

## 9. Notes Entity and API Expectations

### Notes API module
File: src/entities/note/api/noteApi.js

The frontend currently uses mock implementations for these actions:
- getAllNotes
- getNoteById
- createNote
- updateNote
- deleteNote
- generateAiSummary
- uploadMedia
- importYoutube

### Current mock note structure
```json
{
  "id": "1",
  "title": "Project Architecture",
  "content": "Long note content",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "hasSummary": false,
  "tags": ["Architecture", "Frontend"]
}
```

### Backend should support
- note creation and update
- note listing and detail retrieval
- AI summary generation
- media ingestion and YouTube import

---

## 10. Shared API Layer

File: src/shared/api/apiClient.js

The frontend uses a centralized Axios client with:
- base URL from VITE_API_BASE_URL or localhost:5000/api
- JWT bearer header injection from localStorage
- response interceptor that handles 401 errors

Backend relevance:
- this is the integration point for all API requests
- auth tokens should be expected in the Authorization header

### Expected header style
```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 11. UI/UX Patterns Important for API Design

### 11.1 Loading states
The UI uses animated loading states for:
- ingestion
- AI processing
- study tool generation
- chat responses

Backend should support asynchronous operations and ideally return job IDs or progress-state info.

### 11.2 Empty and fallback states
The app uses friendly empty states in several features:
- no note selected
- no study tool active yet
- placeholder tabs for future features

### 11.3 Responsive design
The app is designed to work on:
- desktop
- tablet
- mobile

Backend APIs should not depend on a specific viewport.

### 11.4 Dark mode support
The UI uses CSS classes and a dark-mode state. This should not affect API design directly, but it matters for UI expectations.

---

## 12. Backend Integration Recommendations

The frontend is currently mock-driven, but the intended backend shape is clear. The most important backend endpoints to implement are:

### Authentication
- POST /auth/login
- POST /auth/signup
- POST /auth/logout
- POST /auth/forgot-password

### User profile
- GET /users/me
- PUT /users/me
- POST /users/avatar
- PUT /users/preferences

### Notes
- GET /notes
- GET /notes/:id
- POST /notes
- PUT /notes/:id
- DELETE /notes/:id

### AI generation
- POST /notes/:id/summary
- POST /documents/upload
- POST /documents/import-youtube
- POST /documents/:id/flashcards
- POST /documents/:id/quiz
- POST /documents/:id/mindmap
- POST /chat/messages

### Status / processing
- GET /documents/:id/status
- GET /documents/:id/process-result

---

## 13. What the Backend Should Return

To match the current UI behavior, the backend should return:
- structured text content
- generated summaries
- flashcards with term/definition pairs
- quiz objects with options and explanations
- mind map nodes and edges
- chat responses that can stream incrementally

### Example response shape for a processed document
```json
{
  "id": "doc_123",
  "title": "AI Summary",
  "content": "Processed content from the uploaded source",
  "status": "ready",
  "summary": "Short AI-generated summary",
  "tags": ["Study", "AI"]
}
```

---

## 14. Important Frontend TODOs for Backend Alignment

The current frontend still contains mock data and simulated delays. The backend should eventually replace these behaviors:
- replace mock note API with real server endpoints,
- replace mock flashcard generation with real AI results,
- replace simulated quiz generation with real questions,
- replace mock tutor responses with real model inference,
- support upload progress and processing status,
- persist user profile updates,
- support authenticated sessions.

---

## 15. Practical Summary for Backend Engineers

If you are building the backend for this project, the main mental model is:

1. The app is a knowledge workspace with document ingestion and AI study generation.
2. The core user flow is: upload/import content → process → edit → generate study tools.
3. The most important data entities are:
   - User
   - Document/Note
   - Study artifact (flashcards, quiz, mind map, tutor chat)
4. The UI expects both CRUD operations and AI-driven generation endpoints.
5. The frontend is already structured around a clear separation of UI state and server state, so the backend can be integrated cleanly.

---

## 16. Suggested First Backend Priorities

If you want to implement the backend quickly, start with these in order:
1. authentication and user profile endpoints,
2. note CRUD endpoints,
3. document upload and YouTube import,
4. document processing and summary generation,
5. flashcard and quiz generation,
6. tutor chat endpoint.

This order matches the current frontend flow and will unlock the most visible user experience first.
