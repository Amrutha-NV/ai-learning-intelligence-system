# AI Learning Intelligence System — Backend

The Node.js backend is the central integration layer for the AI Learning Intelligence System.

It receives learning activities from the browser extension, stores them in MongoDB, sends activities to the AI processing service for classification, requests summary and quiz generation, and receives asynchronous AI callbacks.

## Architecture

Browser Extension
    |
    v
Node.js Backend
    |
    +----> Processing AI Service
    |          |
    |          +----> Redis + Celery
    |          |
    |          +----> Classification
    |                     |
    |                     v
    |                Backend Callback
    |
    +----> Summary / Quiz AI Service
               |
               +----> Redis + Celery
               |
               +----> Groq
                         |
                         v
                    Backend Callback

MongoDB stores Activities and LearningArtifacts.

## Main Features

- Learning activity storage
- JWT-protected activity APIs
- AI classification integration
- Asynchronous AI callback handling
- Summary generation integration
- Quiz generation integration
- LearningArtifact storage
- Processing status tracking
- Dashboard and analytics backend services

## Requirements

Install:

- Node.js
- npm
- MongoDB Atlas access
- Docker Desktop
- Python/uv for the AI services

Check Node.js:

```bash
node --version
npm --version
```

## Clone Repository

```bash
git clone <repository-url>
cd ai-learning-intelligence-system
```

## Backend Setup

Move into the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

AI_SERVICE_URL=http://localhost:8000
AI_CALLBACK_URL=http://host.docker.internal:5000/api/activities/ai-callback

SUMMARY_AI_SERVICE_URL=http://localhost:5001
SUMMARY_CALLBACK_URL=http://127.0.0.1:5000/api/summaries/ai-callback
QUIZ_CALLBACK_URL=http://127.0.0.1:5000/api/quizzes/ai-callback
```

Never commit the real `.env` file.

## Run Backend

From:

```text
ai-learning-intelligence-system/backend
```

run:

```bash
npm run dev
```

Expected:

```text
Server is running on port 5000
MongoDB Connected
```

Backend:

```text
http://localhost:5000
```

## Activity Processing Flow

The browser extension sends a learning activity to:

```http
POST /api/activities
```

The backend:

1. Authenticates the request.
2. Creates the Activity.
3. Sends it to the Processing AI Service.
4. Marks classification as processing.
5. Receives the asynchronous AI callback.
6. Stores classification in the Activity.

Classification callback:

```http
POST /api/activities/ai-callback
```

## Summary Flow

Generate:

```http
POST /api/summaries/generate/:activityId
```

Get summary:

```http
GET /api/summaries/:activityId
```

AI callback:

```http
POST /api/summaries/ai-callback
```

Generated summary data is stored under:

```text
LearningArtifact.summary
```

Possible states:

```text
NOT_STARTED
PROCESSING
COMPLETED
FAILED
```

## Quiz Flow

Generate:

```http
POST /api/quizzes/generate/:activityId
```

Get quiz:

```http
GET /api/quizzes/:activityId
```

AI callback:

```http
POST /api/quizzes/ai-callback
```

Generated questions are stored under:

```text
LearningArtifact.quiz
```

Possible states:

```text
NOT_STARTED
PROCESSING
COMPLETED
FAILED
```

## Main Models

### Activity

Stores the captured learning activity and AI classification.

### LearningArtifact

Stores generated learning content associated with an Activity:

```text
LearningArtifact
    |
    +-- summary
    |
    +-- quiz
    |
    +-- quizAttempts
```

## Running the Complete System

The complete development environment requires:

```text
Node Backend                  :5000
Summary / Quiz AI             :5001
Processing AI                 :8000
Redis                         :6379
MongoDB Atlas
```

Start all required services before testing the complete pipeline.