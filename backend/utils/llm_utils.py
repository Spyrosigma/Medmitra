from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser

class LLMManager:
    
    def __init__(self, model_name: str = "gpt-3.5-turbo", temperature: float = 0.2):
        self.llm = ChatOpenAI(model=model_name, temperature=temperature)
        self.parser = JsonOutputParser()

    async def generate_response(self, system_prompt: str, user_input: str) -> dict:
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_input)
        ]
        result = await self.llm.ainvoke(messages)
        return self.parser.parse(result.content)