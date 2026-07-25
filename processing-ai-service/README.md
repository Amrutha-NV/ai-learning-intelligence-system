# Processing AI Service

The **Processing AI Service** is the AI processing and classification layer of the **AI Learning Intelligence System**.

It receives learning activities from the Node.js backend, processes learning content asynchronously using **Celery**, orchestrates the AI workflow using **LangGraph**, uses **Groq** for LLM-based classification, caches reusable results in **Redis**, and sends completed results back to the Node.js backend.

---

## Features

- FastAPI-based AI processing API
- Asynchronous processing with Celery
- Redis-based caching and task messaging
- LangGraph workflow orchestration
- Groq LLM integration
- Learning-content fetching and recovery
- Content cleaning and normalization
- Chunk-based content processing
- Structured learning classification
- Automatic retry support for temporary processing failures
- Callback integration with the Node.js backend
- Docker Compose development environment

The classification pipeline identifies:

- Track
- Topic
- Subtopics
- Resource type
- Problem difficulty

---

## Architecture

```text
Browser Extension
        |
        v
Node.js Backend
        |
        v
MongoDB Activity
        |
        v
Processing AI Service (FastAPI)
        |
        v
Redis
        |
        v
Celery Worker
        |
        v
LangGraph Workflow
        |
        +------------------+
        |                  |
        v                  v
Content Processing     Classification
        |                  |
        +--------+---------+
                 |
                 v
               Groq
                 |
                 v
        Structured Classification
                 |
                 v
              Redis Cache
                 |
                 v
          Node.js Callback
                 |
                 v
        MongoDB Activity Update
                 |
                 v
       Dashboard Track / Topic
```

---

## Processing Flow

1. The browser extension captures a learning activity.
2. The Node.js backend stores the Activity in MongoDB.
3. The backend sends the learning activity to:

```http
POST /api/process/
```

4. The Processing AI Service checks Redis for an existing classification associated with the learning resource.
5. If a cached result exists, it can be returned immediately.
6. Otherwise, a Celery background task is created.
7. FastAPI immediately returns the Celery task ID.
8. The Celery worker executes the LangGraph processing workflow.
9. Learning content is fetched or recovered when necessary.
10. The content is validated, cleaned, normalized, and chunked.
11. Groq classifies the learning material.
12. The structured classification is stored in Redis.
13. The result is sent to the Node.js backend through a callback.
14. The backend updates the Activity in MongoDB.
15. The classification is used to organize dashboard Tracks and Topics.

---

## Classification Structure

Example:

```json
{
  "track": "Data Structures & Algorithms",
  "topic": "Graph Algorithms",
  "subtopics": [
    "Dijkstra's Algorithm",
    "Shortest Path",
    "Greedy Strategy",
    "Priority Queue"
  ],
  "resource_type": "Article",
  "problem_difficulty": null
}
```

---

# API

Local development base URL:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

---

## Health Check

### `GET /health`

Checks whether the Processing AI Service is running.

Example response:

```json
{
  "success": true,
  "service": "Processing AI Service",
  "version": "1.0.0",
  "status": "healthy"
}
```

---

## Process Learning Activity

### `POST /api/process/`

Accepts a learning activity and starts the classification pipeline.

### Example Request

```json
{
  "url": "https://www.geeksforgeeks.org/dsa/breadth-first-search-or-bfs-for-a-graph/",
  "title": "Breadth First Search",
  "content": "Breadth First Search is a graph traversal algorithm...",
  "platform": "GeeksForGeeks",
  "metadata": {
    "category": "Data Structures and Algorithms"
  }
}
```

### Processing Response

When processing is queued:

```json
{
  "success": true,
  "cached": false,
  "status": "PROCESSING",
  "task_id": "db5ab0ff-8fe5-4fdb-a28d-c0f77b4c2712"
}
```

### Cache Hit Response

```json
{
  "success": true,
  "cached": true,
  "status": "COMPLETED",
  "data": {
    "classification": {
      "track": "Data Structures & Algorithms",
      "topic": "Graph Traversal",
      "subtopics": [
        "Breadth First Search",
        "Graph Representation"
      ],
      "resource_type": "Tutorial",
      "problem_difficulty": null
    }
  }
}
```

---

## Get Processing Result

### `GET /api/process/{task_id}`

Checks the status of a Celery processing task.

Example:

```text
GET /api/process/db5ab0ff-8fe5-4fdb-a28d-c0f77b4c2712
```

Possible states:

```text
PENDING
PROCESSING
RETRYING
COMPLETED
FAILED
```

### Completed Response

```json
{
  "success": true,
  "task_id": "db5ab0ff-8fe5-4fdb-a28d-c0f77b4c2712",
  "status": "COMPLETED",
  "data": {
    "classification": {
      "track": "Data Structures & Algorithms",
      "topic": "Graph Traversal",
      "subtopics": [
        "Breadth First Search",
        "Graph Representation"
      ],
      "resource_type": "Tutorial",
      "problem_difficulty": null
    }
  }
}
```

---

# Node.js Backend Callback

After classification completes, the result is sent back to the Node.js backend.

### Endpoint

```http
POST /api/activities/ai-callback
```

### Example Payload

```json
{
  "activityId": "activity-mongodb-id",
  "taskId": "celery-task-id",
  "status": "COMPLETED",
  "classification": {
    "track": "Data Structures & Algorithms",
    "topic": "Graph Traversal",
    "subtopics": [
      "Breadth First Search",
      "Graph Representation"
    ],
    "resource_type": "Tutorial",
    "problem_difficulty": null
  }
}
```

### Callback Host

When the caller is running **inside Docker** and the Node.js backend is running on the Windows host:

```text
http://host.docker.internal:5000/api/activities/ai-callback
```

When the AI/Celery process itself is running directly on the host machine:

```text
http://127.0.0.1:5000/api/activities/ai-callback
```

Use the callback host appropriate for the environment in which the caller is running.

---

# Backend Activity State

Before processing:

```text
classificationStatus = PROCESSING
processed = false
```

After successful processing:

```text
classificationStatus = COMPLETED
processed = true
```

The classification and Celery task ID are stored with the Activity for organization, tracing, and debugging.

---

# Dashboard Integration

The backend uses AI classification to automatically organize learning activities.

Example:

```text
Data Structures & Algorithms
        |
        └── Graph Algorithms
                |
                ├── Breadth First Search
                ├── Depth First Search
                └── Dijkstra's Algorithm
```

This allows dashboard Tracks and Topics to be derived from classified learning activities.

---

# Redis

Redis is used for:

- Classification caching
- Celery broker
- Celery result backend

Inside Docker Compose:

```text
redis://redis:6379/0
```

Docker services should communicate using the Compose service hostname:

```text
redis
```

Do not use `localhost` for communication between separate Docker containers.

---

# Celery

Celery executes AI processing outside the FastAPI request lifecycle.

Main processing task:

```text
src.tasks.processing_task.process_learning_task
```

Flow:

```text
FastAPI
   |
   v
Redis
   |
   v
Celery Worker
   |
   v
LangGraph
   |
   v
Groq
   |
   v
Classification
```

This prevents long-running AI operations from blocking FastAPI requests.

---

# LangGraph Workflow

LangGraph controls the processing pipeline.

The main workflow consists of nodes responsible for:

```text
Fetch
  |
  v
Processing
  |
  v
Classification
```

The processing layer performs operations such as:

- Content recovery
- Validation
- Cleaning
- Normalization
- Metadata processing
- Chunking

The classification agent then converts the processed learning context into structured classification data.

---

# Error Handling and Retries

Temporary AI or network failures can be retried through Celery.

The original Activity remains stored in MongoDB even when AI processing fails.

Possible Activity processing states include:

```text
NOT_STARTED
PROCESSING
COMPLETED
FAILED
```

Failed callbacks or AI operations should be logged so that they can be traced using the Activity ID and Celery task ID.

---

# Docker

The Processing AI Service uses Docker Compose for its development infrastructure.

Services include:

```text
ai-processing-service
celery-worker
redis
```

Responsibilities:

```text
ai-processing-service → FastAPI
celery-worker         → Background AI processing
redis                 → Cache + Celery messaging/results
```

---

# Local Setup

## Prerequisites

Install:

- Git
- Docker Desktop

For development outside Docker:

- Python 3.11+
- uv

Check Python:

```bash
python --version
```

Check uv:

```bash
uv --version
```

---

## Install Dependencies

Move into the service:

```bash
cd processing-ai-service
```

Synchronize dependencies:

```bash
uv sync
```

Dependencies are defined in:

```text
pyproject.toml
```

and locked using:

```text
uv.lock
```

---

# Environment Variables

Create:

```text
processing-ai-service/.env
```

Use `.env.example` as the template.

Example:

```env
APP_NAME=Processing AI Service
APP_VERSION=1.0.0

DEBUG=true

GROQ_API_KEY=your_groq_api_key

MODEL_NAME=llama-3.3-70b-versatile
TEMPERATURE=0.0

CHUNK_SIZE=1200
CHUNK_OVERLAP=200

REDIS_URL=redis://redis:6379/0
```

Never commit the real `.env` file.

---

# Run With Docker

Make sure Docker Desktop is running.

Move into:

```bash
cd processing-ai-service
```

For the first run or after dependency/Docker changes:

```bash
docker compose up --build
```

For normal startup:

```bash
docker compose up
```

Run in the background:

```bash
docker compose up -d
```

---

## Check Containers

```bash
docker compose ps
```

---

## View Logs

All services:

```bash
docker compose logs -f
```

Celery:

```bash
docker compose logs -f celery-worker
```

FastAPI:

```bash
docker compose logs -f ai-processing-service
```

Redis:

```bash
docker compose logs -f redis
```

---

## Stop Services

```bash
docker compose down
```

---

## Rebuild Services

After changing dependencies, `pyproject.toml`, `uv.lock`, the Dockerfile, or other build configuration:

```bash
docker compose up --build
```

---

# Run Without Docker

Install dependencies:

```bash
uv sync
```

Start FastAPI:

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Redis must also be running.

The Celery worker must be started separately.

Docker Compose is recommended when running the complete processing stack.

---

# Test Redis

Open Redis CLI:

```bash
docker exec -it redis-server redis-cli
```

Run:

```text
PING
```

Expected response:

```text
PONG
```

Check keys:

```text
KEYS *
```

Exit:

```text
exit
```

---

# Test Classification

Start the Docker environment:

```bash
docker compose up
```

Open Swagger:

```text
http://localhost:8000/docs
```

Call:

```http
POST /api/process/
```

A new request should initially return:

```json
{
  "success": true,
  "cached": false,
  "status": "PROCESSING",
  "task_id": "celery-task-id"
}
```

Then call:

```http
GET /api/process/{task_id}
```

When processing finishes:

```text
status = COMPLETED
```

and the response should contain the generated classification.

---

# Example cURL Request

```bash
curl -X POST "http://localhost:8000/api/process/" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.geeksforgeeks.org/dsa/breadth-first-search-or-bfs-for-a-graph/",
    "title": "Breadth First Search",
    "content": "Breadth First Search is a graph traversal algorithm.",
    "platform": "GeeksForGeeks",
    "metadata": {}
  }'
```

---

# Project Structure

```text
processing-ai-service/
│
├── main.py
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
├── uv.lock
│
└── src/
    ├── celery_app.py
    │
    ├── api/
    │   ├── classification.py
    │   └── routes.py
    │
    ├── config/
    │   ├── redis.py
    │   └── settings.py
    │
    ├── graphs/
    │   └── learning_graph.py
    │
    ├── tasks/
    │   ├── processing_task.py
    │   └── test_task.py
    │
    ├── nodes/
    │   ├── fetch_node.py
    │   ├── processing_node.py
    │   ├── classification_node.py
    │   └── router_node.py
    │
    ├── processors/
    │   ├── chunker.py
    │   ├── cleaner.py
    │   ├── metadata.py
    │   ├── normalizer.py
    │   ├── recovery.py
    │   └── validator.py
    │
    ├── services/
    │   ├── cache_service.py
    │   ├── classification_service.py
    │   ├── llm_service.py
    │   └── url_fetch_service.py
    │
    └── agents/
        ├── classification/
        │   └── agent.py
        │
        └── processing/
            └── agent.py
```

---

# Summary and Quiz Integration

Summary and Quiz are separate AI workflows from the Processing AI Service's classification pipeline.

The broader system contains support for:

```text
LearningArtifact
Summary
Quiz
Quiz Attempts
```

These workflows can use their own asynchronous AI generation and callback mechanisms while consuming the classification and learning context produced by the overall system.

Keeping these responsibilities separated prevents the classification service from becoming tightly coupled to every AI feature.

---

# Current Limitations

- Classification caching currently relies primarily on the learning URL.
- Cached URLs may reuse an existing classification.
- Classification quality depends on the available learning content and metadata.
- Some websites may restrict automated content extraction.
- External LLM requests depend on Groq API availability.
- Callback URLs differ depending on whether the caller runs on the host or inside Docker.

---

# Security

Never commit:

```text
.env
Groq API keys
MongoDB credentials
JWT secrets
OAuth client secrets
service callback secrets
```

Commit only safe templates such as:

```text
.env.example
```

If a credential is accidentally exposed, rotate it immediately.