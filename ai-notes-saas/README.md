# NotelyAI: AI-Powered Knowledge Workspace

NotelyAI is a high-velocity, intelligent workspace designed to help teams synthesize, store, and scale their knowledge base. Built with a modern, scalable architecture, this platform leverages AI to process audio, PDF, images, and video content into searchable notes.

## 🚀 Tech Stack

- **Framework**: React (JavaScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query
- **Routing**: React Router
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📂 Architecture: Feature Sliced Design (FSD)

This project follows the **Feature Sliced Design (FSD)** architectural methodology to ensure modularity and scalability.

```text
src/
├── app/          # Global configurations, Redux store, Providers
├── entities/     # Business entities (e.g., Note, User)
├── features/     # User-centric features (e.g., Upload, Edit Note)
├── pages/        # Composition of features into pages
├── shared/       # Reusable shared components, API clients, helpers
└── widgets/      # Composition of features into large blocks (e.g., Sidebar)