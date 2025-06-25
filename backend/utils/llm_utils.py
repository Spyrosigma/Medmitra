from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import json
import os
from dotenv import load_dotenv
load_dotenv()


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
        self.parser = parser

    async def generate_response(self, system_prompt: str, user_input: str) -> dict:
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", "{input}")
        ])
        
        chain = prompt | self.llm | self.parser
        result = chain.invoke({"input": user_input})
        return result



    # def parse_product(self, description: str) -> dict:
    #     prompt = ChatPromptTemplate.from_messages([
    #         ("system", """Extract product details into JSON with this structure:
    #             {{
    #                 "name": "product name here",
    #                 "price": number_here_without_currency_symbol,
    #                 "features": ["feature1", "feature2", "feature3"]
    #             }}"""),
    #         ("user", "{input}")
    #     ])

    #     chain = prompt | self.llm | self.parser
        
    #     result = chain.invoke({"input": description})
    #     print(json.dumps(result, indent=2))
    #     return result