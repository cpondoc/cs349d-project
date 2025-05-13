from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from main import main

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Browser Agent API",
        "endpoints": {
            "/": "This welcome message",
            "/run-agent": "POST endpoint to run the browser agent with a task"
        }
    }

class UserRequest(BaseModel):
    task: str

@app.post("/run-agent")
async def run_agent(request: UserRequest):
    try:
        # Run the main function with the provided task
        await main(request.task)
        return {"status": "success", "message": "Agent task completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 