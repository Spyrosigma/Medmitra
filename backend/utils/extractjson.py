import re
import json
from typing import Optional, Dict, Any


def extract_json_from_string(input_string: str) -> Optional[Dict[Any, Any]]:
    """
    Extract JSON from a string using regex patterns.
    
    This function handles various input formats:
    - JSON wrapped in code blocks (```json ... ``` or ``` ... ```)
    - Plain JSON strings
    - Mixed content with JSON embedded
    
    Args:
        input_string (str): The input string that may contain JSON
        
    Returns:
        Optional[Dict[Any, Any]]: Parsed JSON as dictionary, or None if no valid JSON found
    """
    if not input_string or not isinstance(input_string, str):
        return None
    
    # Clean the input string
    cleaned_string = input_string.strip()
    
    # Pattern 1: JSON wrapped in code blocks with optional language specifier
    # Matches: ```json {...} ``` or ``` {...} ```
    code_block_pattern = r'```(?:json)?\s*(\{.*?\})\s*```'
    code_block_match = re.search(code_block_pattern, cleaned_string, re.DOTALL | re.IGNORECASE)
    
    if code_block_match:
        try:
            json_str = code_block_match.group(1).strip()
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    
    # Pattern 2: Look for JSON object that starts with { and ends with }
    # This handles cases where JSON is embedded in other text
    json_pattern = r'\{.*\}'
    json_match = re.search(json_pattern, cleaned_string, re.DOTALL)
    
    if json_match:
        try:
            json_str = json_match.group(0).strip()
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    
    # Pattern 3: Try to parse the entire string as JSON
    try:
        return json.loads(cleaned_string)
    except json.JSONDecodeError:
        pass
    
    # Pattern 4: Look for JSON array that starts with [ and ends with ]
    array_pattern = r'\[.*\]'
    array_match = re.search(array_pattern, cleaned_string, re.DOTALL)
    
    if array_match:
        try:
            json_str = array_match.group(0).strip()
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    
    return None


def extract_json_strict(input_string: str) -> Optional[Dict[Any, Any]]:
    """
    Extract JSON with stricter validation - only returns valid, complete JSON objects.
    
    Args:
        input_string (str): The input string that may contain JSON
        
    Returns:
        Optional[Dict[Any, Any]]: Parsed JSON as dictionary, or None if no valid JSON found
    """
    extracted = extract_json_from_string(input_string)
    
    # Additional validation for strict mode
    if extracted and isinstance(extracted, dict):
        return extracted
    
    return None


# Example usage and test function
def test_extraction():
    """Test the JSON extraction function with various input formats."""
    
    # Test cases
    test_cases = [
        # Code block with json specifier
        '```json\n{"key": "value", "number": 42}\n```',
        
        # Code block without specifier
        '```\n{"key": "value", "number": 42}\n```',
        
        # Plain JSON
        '{"key": "value", "number": 42}',
        
        # JSON embedded in text
        'Here is some data: {"key": "value", "number": 42} and some more text.',
        
        # Complex JSON like your output.json
        '''```json
{
    "lab_values": {
        "test": {
            "value": 78,
            "unit": "mg/dl"
        }
    },
    "summary": "Test summary"
}
```''',
        
        # Invalid cases
        'No JSON here',
        '```\nNot JSON content\n```',
        ''
    ]
    
    print("Testing JSON extraction:")
    for i, test_case in enumerate(test_cases, 1):
        result = extract_json_from_string(test_case)
        print(f"\nTest {i}:")
        print(f"Input: {test_case[:50]}...")
        print(f"Result: {result}")


if __name__ == "__main__":
    test_extraction()
