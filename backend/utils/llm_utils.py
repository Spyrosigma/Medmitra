from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import json
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv
load_dotenv()

from utils.extractjson import extract_json_from_string


parser = JsonOutputParser(pydantic_object={
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "price": {"type": "number"},
        "features": {
            "type": "array",
            "items": {"type": "string"}
        }
    }
})

class LLMManager:
    
    def __init__(self, model_name: str = "llama-3.3-70b-versatile", temperature: float = 0.7):
        self.llm = ChatGroq(model_name=model_name, temperature=temperature)

    async def generate_response(self, system_prompt: str, user_input: str, prompt_variables: Optional[Dict[str, Any]] = None) -> dict:
        """Generate response with optional prompt variable substitution"""
        
        # If we have prompt variables, use Python string formatting first
        if prompt_variables:
            formatted_system_prompt = system_prompt.format(**prompt_variables)
        else:
            formatted_system_prompt = system_prompt
            
        prompt = ChatPromptTemplate.from_messages([
            ("system", formatted_system_prompt),
            ("user", "{input}")
        ])
        
        chain = prompt | self.llm 
        result = chain.invoke({"input": user_input})
        result = extract_json_from_string(result.content)
        return result
