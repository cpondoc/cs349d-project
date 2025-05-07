from langchain_openai import ChatOpenAI
from browser_use import Agent
from browser_use.telemetry.views import (
    BaseTelemetryEvent,
    AgentStepTelemetryEvent,
    ControllerRegisteredFunctionsTelemetryEvent,
    AgentStepResponseTelemetryEvent,
    AgentRunTelemetryEvent,
    AgentEndTelemetryEvent
)
import asyncio
from dotenv import load_dotenv

load_dotenv()

import json
import uuid
from typing import Sequence
from pathlib import Path

from helpers.types import AgentOverallStepTelemetryEvent
from collections import defaultdict
from typing import Sequence


def collapse_telemetry_events(
    events: Sequence[BaseTelemetryEvent],
) -> list[BaseTelemetryEvent]:
    from collections import defaultdict

    # Group by agent_id and step
    grouped_steps = defaultdict(
        lambda: {"agent_step": None, "step_response": None, "controller_functions": []}
    )

    agent_runs: dict[str, AgentRunTelemetryEvent] = {}
    agent_ends: list[AgentEndTelemetryEvent] = []

    # Iterate and populate buckets
    for event in events:
        if isinstance(event, AgentRunTelemetryEvent):
            agent_runs[event.agent_id] = event

        elif isinstance(event, AgentEndTelemetryEvent):
            agent_ends.append(event)

        elif isinstance(event, AgentStepTelemetryEvent):
            grouped_steps[(event.agent_id, event.step)]["agent_step"] = event

        elif isinstance(event, AgentStepResponseTelemetryEvent):
            grouped_steps[(event.agent_id, event.step)]["step_response"] = event

        elif isinstance(event, ControllerRegisteredFunctionsTelemetryEvent):
            # Assign to all open steps that haven't yet gotten a response
            for (agent_id, step), parts in grouped_steps.items():
                if parts["step_response"] is None:
                    parts["controller_functions"].extend(event.registered_functions)

    # Build collapsed results
    collapsed_events: list[BaseTelemetryEvent] = []

    for (agent_id, step), parts in sorted(grouped_steps.items(), key=lambda x: x[0][1]):
        step_ev = parts["agent_step"]
        resp_ev = parts["step_response"]
        if not resp_ev:
            continue  # incomplete

        # Step 1 special case: attach agent_run
        if step == 1 and agent_id in agent_runs:
            collapsed_events.append(agent_runs[agent_id])

        # Either step_ev (normal step) or just step_response (in step 1 pre-step case)
        collapsed_events.append(
            AgentOverallStepTelemetryEvent(
                agent_id=agent_id,
                step=step,
                step_error=step_ev.step_error if step_ev else [],
                consecutive_failures=step_ev.consecutive_failures if step_ev else 0,
                step_actions=step_ev.actions if step_ev else [],
                registered_functions=parts["controller_functions"],
                previous_goal=resp_ev.previous_goal,
                memory=resp_ev.memory,
                next_goal=resp_ev.next_goal,
                actions_response=resp_ev.actions,
                page_screenshot=getattr(step_ev, "page_screenshot", None),
            )
        )

    collapsed_events.extend(agent_ends)
    return collapsed_events



def serialize_telemetry_events(
    events: Sequence["BaseTelemetryEvent"], output_dir: str = "data"
):
    """
    Save to JSONL file
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    file_uuid = uuid.uuid4()
    output_path = output_dir / f"{file_uuid}.jsonl"

    with output_path.open("w", encoding="utf-8") as f:
        for event in events:
            obj = {"name": event.name, "properties": event.properties}
            f.write(json.dumps(obj) + "\n")

    print(f"✅ Saved {len(events)} events to {output_path.resolve()}")


async def main():
    agent = Agent(
        task="Compare the price of gpt-4o and DeepSeek-V3",
        llm=ChatOpenAI(model="gpt-4o"),
    )
    await agent.run()

    # Collect telemetry
    telemetry = agent.telemetry.private_log
    telemetry = collapse_telemetry_events(telemetry[2:])
    serialize_telemetry_events(telemetry)


asyncio.run(main())
