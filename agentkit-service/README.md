# AgentKit Session Service

This lightweight FastAPI service creates ChatGPT AgentKit sessions for POP! Lite. It exposes a
`POST /api/chatkit/session` endpoint that returns a `client_secret`, which the Next.js intake page
uses to launch an AI planning assistant.

## Requirements

- Python 3.10+
- `pip install fastapi uvicorn openai`
- Environment variable `OPENAI_API_KEY` (never commit it)

## Running locally

```bash
export OPENAI_API_KEY="your-openai-key"
uvicorn main:app --reload --port 8000
```

Then set the frontend environment variable:

```bash
echo "CHATKIT_SESSION_ENDPOINT=http://localhost:8000/api/chatkit/session" >> .env.local
```

## Deployment notes

- Keep the API key in your hosting provider’s secret manager.
- Lock down CORS if deploying publicly.
- Expand the payload handling (validation, conversation context) as AgentKit adoption widens.
