# NotelyAI: Privacy-First AI Knowledge Workspace

NotelyAI is a high-velocity, intelligent SaaS workspace designed to help students, researchers, and professionals synthesize, store, and scale their knowledge base. 

Unlike traditional cloud-based AI note-taking applications, NotelyAI is built with a **privacy-first** approach, leveraging local AI inference models to ensure your sensitive data never leaves your environment. It processes audio, PDFs, images, and video content into highly structured notes, active recall flashcards, quizzes, and mind maps.

---

## ✨ Core Features

* **Multi-Modal Data Ingestion:** Seamlessly upload and process PDFs, text, lecture recordings, meeting audio, and YouTube video URLs.
* **Privacy-First AI Processing:** Powered by edge-deployed local AI models (Ollama for LLMs, Whisper.cpp for audio transcription) allowing for zero-paywall, offline-capable inference.
* **Human-in-the-Loop Curation:** An interactive Google Docs/Notion-style editor that allows users to review and correct AI-generated transcripts before generating study tools.
* **Derivative Study Engines:** Automatically transform your curated notes into:
  * 🃏 **Smart Flashcards** (Interactive 3D-flippable cards)
  * 📝 **Knowledge Quizzes** (Multiple choice checks with AI feedback)
  * 🧠 **Concept Mind Maps** (Visual node graphs)
  * 📄 **Practice Papers**
* **Smart Templates:** Instantly reformat unstructured data into Meeting Minutes, Revision Summaries, or Lecture Notes.
* **Premium UX/UI:** A sleek, glassmorphic dark-mode interface featuring Framer Motion animations, command-palette search (⌘K), and a highly responsive layout inspired by Linear and Notion.

---

## 🚀 Tech Stack

### Frontend Ecosystem
* **Core Framework:** React 19 (JavaScript)
* **Build System:** Vite 8 (Sub-millisecond HMR)
* **Styling:** Tailwind CSS v4 & shadcn/ui
* **State Management:** Redux Toolkit (v2)
* **Data Synchronization:** React Query (TanStack Query v5)
* **Routing:** React Router v7
* **Animations & Icons:** Framer Motion, Lucide React
* **Visualizations:** Recharts for analytics dashboards

### Backend & AI Core (Local Inference)
* **LLM Engine:** Ollama (for on-device text synthesis & structuring)
* **Audio Processing:** Whisper.cpp (for fast, local speech-to-text)
* **Vector Database:** ChromaDB (for semantic search and contextual AI assistance)

---

## 📂 Architecture: Feature-Sliced Design (FSD)

This project strictly follows the **Feature-Sliced Design (FSD)** architectural methodology. By decoupling complex codebases into highly modular business layers, we ensure the application remains maintainable and easily scalable.

```text
src/
├── app/          # Global configurations, Redux store, Providers, App Router
├── pages/        # Composition of features into full views (Dashboard, Notes, Settings)
├── widgets/      # Composition of features into large blocks (e.g., Master Sidebar, Navbar)
├── features/     # User-centric business logic (e.g., Upload, Generate Flashcards, Auth)
├── entities/     # Business entities and models (e.g., Note, User, Quiz)
└── shared/       # Reusable UI primitives (shadcn), API clients, and helper functions