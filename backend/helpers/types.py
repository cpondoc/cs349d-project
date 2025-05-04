from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass
from typing import Any, Dict, Sequence


@dataclass
class BaseTelemetryEvent(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    def properties(self) -> Dict[str, Any]:
        return {k: v for k, v in asdict(self).items() if k != "name"}


@dataclass
class RegisteredFunction:
    name: str
    params: dict[str, Any]


@dataclass
class AgentOverallStepTelemetryEvent(BaseTelemetryEvent):
    agent_id: str
    step: int
    step_error: list[str]
    consecutive_failures: int
    step_actions: list[dict]

    registered_functions: list[RegisteredFunction]

    previous_goal: str
    memory: str
    next_goal: str
    actions_response: list[str]

    name: str = "agent_overall_step"
