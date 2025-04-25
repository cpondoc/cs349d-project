from langchain_openai import ChatOpenAI
from browser_use import Agent
from browser_use.telemetry.views import BaseTelemetryEvent
import asyncio
from dotenv import load_dotenv
load_dotenv()

import json
from typing import Sequence
from pathlib import Path

def serialize_telemetry_events(events: Sequence[BaseTelemetryEvent], output_path: str = "events.jsonl"):
    output_file = Path(output_path)
    with output_file.open("w", encoding="utf-8") as f:
        for event in events:
            obj = {
                "name": event.name,
                "properties": event.properties
            }
            f.write(json.dumps(obj) + "\n")
    print(f"✅ Saved {len(events)} events to {output_file.resolve()}")

async def main():
    agent = Agent(
        task="Compare the price of gpt-4o and DeepSeek-V3",
        llm=ChatOpenAI(model="gpt-4o"),
    )
    await agent.run()

    # Collect telemetry
    telemetry = agent.telemetry.private_log
    serialize_telemetry_events(telemetry)

asyncio.run(main())