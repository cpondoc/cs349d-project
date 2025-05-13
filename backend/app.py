from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from main import main
from helpers.supabase_client import supabase, get_all_logs, get_log_by_id

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
            "/run-agent": "POST endpoint to run the browser agent with a task",
            "/logs": "GET endpoint to fetch all logs",
            "/logs/{log_id}": "GET endpoint to fetch a single log by ID"
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

@app.get("/logs")
async def get_logs():
    """
    Fetch all entries from the logs table.
    Returns a list of log entries with their query and file URL.
    """
    try:
        logs = get_all_logs()
        return {
            "status": "success",
            "data": logs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/logs/{log_id}")
async def get_log(log_id: str):
    """
    Fetch a single log entry by its ID.
    
    Args:
        log_id: The ID of the log entry to fetch
        
    Returns:
        dict: The log entry if found
        
    Raises:
        HTTPException: If the log is not found or there's an error
    """
    try:
        log = get_log_by_id(log_id)
        if not log:
            raise HTTPException(status_code=404, detail=f"Log with ID {log_id} not found")
        return {
            "status": "success",
            "data": log
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 