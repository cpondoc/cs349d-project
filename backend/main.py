from langchain_openai import ChatOpenAI
from browser_use import Agent
from browser_use.telemetry.views import (
    BaseTelemetryEvent,
    AgentRunTelemetryEvent,
    AgentEndTelemetryEvent,
    AgentInitializationTelemetryEvent,
    AgentDetermineActionTelemetryEvent,
    AgentTakeActionTelemetryEvent,
    AgentFinishActionTelemetryEvent
)
import asyncio
from dotenv import load_dotenv
import jsonpickle

load_dotenv()

import json
import uuid
from typing import Sequence
from pathlib import Path

from helpers.types import AgentOverallStepTelemetryEvent
from collections import defaultdict
from typing import Sequence
from helpers.supabase_client import upload_to_reports_bucket


def collapse_telemetry_events(
    events: Sequence[BaseTelemetryEvent],
) -> list[BaseTelemetryEvent]:

    # Build collapsed results
    collapsed_events: list[BaseTelemetryEvent] = []

    main_event_types = (
        AgentInitializationTelemetryEvent,
        AgentRunTelemetryEvent,
        AgentDetermineActionTelemetryEvent,
        AgentTakeActionTelemetryEvent,
        AgentFinishActionTelemetryEvent,
        AgentEndTelemetryEvent,
    )

    # Iterate and populate buckets
    for event in events:
        if isinstance(event, main_event_types):
            collapsed_events.append(event)

    print("Got all the events!")
    return collapsed_events

def serialize_telemetry_events(
    events: Sequence["BaseTelemetryEvent"], output_dir: str = "data", task: str = None
):
    """
    Save to JSONL file and upload to Supabase

    Args:
        events: Sequence of telemetry events to serialize
        output_dir: Directory to save the output file (default: "data")
        task: The task that generated these events (optional)
    """
    print("Serializing telemetry events...")
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    file_uuid = uuid.uuid4()
    output_path = output_dir / f"{file_uuid}.jsonl"

    successful_count = 0
    failed_count = 0

    print("Writing to file...")
    try:
        with output_path.open("w", encoding="utf-8") as f:
            for i, event in enumerate(events):
                try:
                    obj = {"name": event.name, "properties": event.properties}
                    json_line = jsonpickle.encode(obj, unpicklable=False)
                    f.write(json_line + "\n")
                    successful_count += 1
                except Exception as e:
                    print(f"Skipping event {i} due to serialization error: {e}")
                    failed_count += 1
    except Exception as e:
        print(f"Failed to write to file: {e}")
        return

    print(f"Saved {successful_count} events to {output_path.resolve()}")
    if failed_count > 0:
        print(f"{failed_count} events were skipped due to serialization issues.")

    # Upload to Supabase
    try:
        public_url = upload_to_reports_bucket(str(output_path), query=task)
        print(f"Uploaded {output_path.name} to Supabase 'reports' bucket.")
        print(f"Public URL: {public_url}")
    except Exception as e:
        print(f"Failed to upload to Supabase: {e}")

async def main(task: str = "Compare the price of gpt-4o and DeepSeek-V3"):
    print(f"Running agent with task: {task}")
    agent = Agent(
        task=task,
        llm=ChatOpenAI(model="gpt-4o"),
    )
    await agent.run()
    print(f"Agent run completed. Telemetry events: {len(agent.telemetry.private_log)}")

    # Collect telemetry
    telemetry = agent.telemetry.private_log
    telemetry = collapse_telemetry_events(telemetry)
    serialize_telemetry_events(telemetry, task=task)
    agent.telemetry.private_log = []


if __name__ == "__main__":
    asyncio.run(main())
