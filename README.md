# TutorAI — Personalized AI Learning Assistant

TutorAI is an AI-powered learning platform designed to make learning more personalized and interactive. It helps students explore concepts through generated explanations, assess their understanding, and track learning progress.

The V1 prototype focuses on text-based tutoring, student onboarding, diagnostic assessment, and knowledge mastery tracking.

## Features

- **AI-Powered Lessons** — Generate explanations for student learning queries.
- **Student Onboarding** — Capture learning interests, preferred styles, and difficulty preferences.
- **Diagnostic Engine** — Assess a student's readiness for a target concept and identify prerequisite knowledge.
- **Knowledge Model** — Track concept mastery and learning attempts.
- **Personalized Dashboard** — Display student information, learning preferences, and progress.
- **Interactive Quizzes** — Practice concepts through quiz-based assessment.
- **Student Authentication** — Signup and login functionality.
- **Adaptive Learning Foundation** — Use student understanding and mastery data to support personalized learning.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- Python
- JSON-based local data storage

### AI / Learning Components
- Qwen through Ollama for local language-model inference
- Diagnostic and concept-mastery logic
- Lesson planning and visual-routing components

## Project Structure

```text
TutorAI/
├── backend/
│   ├── data/
│   ├── diagnostic-engine/
│   ├── knowledge-model/
│   ├── lesson-engine/
│   ├── student-model/
│   ├── server.js
│   ├── tutor.py
│   └── tutorai.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
└── .gitignore
