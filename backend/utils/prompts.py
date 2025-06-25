from typing import Final

DOMAIN_ANALYSIS_PROMPT: Final = '''
Analyze the provided document to identify its domain characteristics and structure. Return your analysis as STRICT JSON only.

Required JSON structure:
{{
  "document_type": "<string>",      // The type of document (e.g., "Invoice", "Medical Report", "Legal Contract")
  "primary_domain": "<string>",     // Main subject domain (e.g., "Healthcare", "Finance", "Legal")
  "sub_domains": ["<string>"],      // Related subject areas or specialties
  "document_structure": {{
    "sections": ["<string>"],       // Main document sections or components
    "data_patterns": ["<string>"]   // Common data patterns found (e.g., "dates", "monetary values", "medical codes")
  }}
}}

Guidelines:
- Examine document format, terminology, and content organization
- Identify domain-specific patterns and conventions
- Note any standardized formats or coding systems used
- Consider regulatory or compliance contexts

Respond with STRICT JSON only in the above structure.
'''

DYNAMIC_PROMPT_GENERATOR: Final = '''
Generate an optimized extraction prompt based on the domain analysis and provided schema. Return STRICT JSON format only.

Input:
- Domain Analysis: {domain_analysis}
- Entity Schema: {entity_schema}

Required JSON structure:
{{
  "extraction_strategy": {{
    "context_setup": "<string>",    // How to approach this specific document type
    "focus_areas": ["<string>"],    // Sections/elements to prioritize based on schema
    "special_rules": ["<string>"]   // Domain-specific extraction rules
  }}
}}

Guidelines:
- Align extraction approach with document type and domain
- Consider schema requirements and constraints
- Include domain-specific validation rules
- Optimize for accuracy in target domain

Respond with STRICT JSON only in the above structure.
'''

ENTITY_EXTRACTOR_PROMPT: Final = '''
Extract entities according to schema definitions and extraction rules. Return STRICT JSON only.

Context:
- Schema: {schema}
- Extraction Rules: {extraction_rules}

Required JSON structure:
{{
  "entities": {{
    <entity_name>,      // Schema entity name 
    [{{
      "value": "<string>",
      "confidence": <number>,      // Accurate Confidence Score (0 - 1)
      "confidence_reason": "<string>",  // Short Explanation of confidence score, why it was assigned
      "evidence": "<string>"      // Supporting text evidence
    }}]
  }}
}}

Guidelines:
- Extract all instances of each schema entity
- Validate against provided rules
- Include supporting evidence
- Score confidence based on context quality

Respond with STRICT JSON only.
'''