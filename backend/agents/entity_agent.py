from typing import List, Dict, Optional, Any
import json
from utils.base_agent import BaseAgent
from models.state_models import AnalysisState
from utils.prompts import (
    DOMAIN_ANALYSIS_PROMPT,
    DYNAMIC_PROMPT_GENERATOR,
    ENTITY_EXTRACTOR_PROMPT
)
from langgraph.graph import StateGraph, END
from utils.llm_utils import LLMManager

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MedMitraAgent(BaseAgent):

    def __init__(self, model_name: str = "gpt-3.5-turbo", temperature: float = 0.2):
        self.llm_manager = LLMManager(model_name=model_name, temperature=temperature)
        self.workflow = self.build_workflow()

    def build_workflow(self) -> StateGraph:
        """Construct parallel processing workflow"""
        builder = StateGraph(AnalysisState)

        
        builder.add_node("labdoc_extraction", self._labdoc_extraction)
        builder.add_node("radiology_extraction", self._radiology_extraction)
        builder.add_node("summary_generation", self._summary_generation)

        
        builder.set_entry_point("labdoc_extraction")
        builder.add_edge("labdoc_extraction", "radiology_extraction")
        builder.add_edge("radiology_extraction", "summary_generation")
        builder.add_edge("summary_generation", END)

        return builder.compile()

    async def _labdoc_extraction(self, state: AnalysisState) -> AnalysisState:
        """Analyze the domain of the document"""
        domain = await self.llm_manager.generate_response(
            system_prompt=DOMAIN_ANALYSIS_PROMPT,
            user_input=state["document_text"][:5000]
        )
        logger.info(f"Domain analysis---------->: {domain}")
        state["domain_analysis"] = domain
        return state

    async def _radiology_extraction(self, state: AnalysisState) -> AnalysisState:
        """Generate the extraction prompt based on domain analysis and schema"""
        entity_schema = json.dumps([item.model_dump() for item in state["schema_items"]])
        domain_analysis = json.dumps(state["domain_analysis"])
        
        prompt_generation = await self.llm_manager.generate_response(
            system_prompt=DYNAMIC_PROMPT_GENERATOR.format(
                domain_analysis=domain_analysis,
                entity_schema=entity_schema
            ),
            user_input=""
        )
        logger.info(f"Prompt generation---------->: {prompt_generation}")
        state["extraction_rules"] = prompt_generation
        return state

    async def _summary_generation(self, state: AnalysisState) -> AnalysisState:
        """Extract entities from the document based on the generated prompt"""
        extraction_rules = json.dumps(state["extraction_rules"]) 
        document_text = state["document_text"]
        schema = json.dumps([item.model_dump() for item in state["schema_items"]])

        logger.info("STARTING EXTRACTION---------->")
        # logger.info(f"Extraction rules: {extraction_rules}")
        # logger.info("Document text: ", document_text[:50])
        # logger.info(f"Schema: {schema}")

        entity_extraction = await self.llm_manager.generate_response(
            system_prompt=ENTITY_EXTRACTOR_PROMPT.format(extraction_rules=extraction_rules, schema=schema),
            user_input=document_text
        )
        logger.info(f"--------------EXTRACTEDD Entities ---------->: {entity_extraction}")
        state["extracted_entities"] = entity_extraction
        return state


    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the document through the workflow"""
        return await self.workflow.ainvoke(input_data)
    