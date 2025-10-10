import os
from typing import List, Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI


class IntakeItem(Dict[str, str]):
    id: str
    question: str
    answer: str


class IntakePayload(Dict[str, List[IntakeItem]]):
    intake: List[IntakeItem]


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable must be set")

client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title="POP! AgentKit Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"]
)


@app.post("/api/chatkit/session")
def create_chatkit_session(payload: IntakePayload | None = None):
    try:
        session = client.chatkit.sessions.create({
            "metadata": {
                "source": "pop-lite-intake",
                "intake": payload.get("intake") if payload else None,
            }
        })
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=502, detail=str(exc))

    return {"client_secret": session.client_secret}
