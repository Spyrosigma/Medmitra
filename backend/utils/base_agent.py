from abc import ABC, abstractmethod
from typing import Any, Dict
from langgraph.graph import StateGraph

class BaseAgent(ABC):
    @abstractmethod
    def build_workflow(self) -> StateGraph:
        pass

    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        pass