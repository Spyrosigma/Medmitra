from typing import Final

LAB_ANALYSIS_PROMPT: Final = '''
Analyze the provided laboratory document and extract structured information. Return STRICT JSON only.

Required JSON structure:
{
  "lab_values": {
    "<test_name>": {
      "value": "<numeric_value>",
      "unit": "<unit>",
      "reference_range": "<range>",
      "status": "<normal|abnormal|critical>"
    }
  },
  "summary": "<string>",
  "key_abnormalities": ["<string>"],
  "confidence_score": <number>
}

Guidelines:
- Extract all numerical lab values with units
- Identify abnormal values based on reference ranges
- Provide a concise medical summary
- Include confidence score (0-1)

Document text:
{document_text}
'''

RADIOLOGY_ANALYSIS_PROMPT: Final = '''
Analyze the provided radiology report and extract key findings. Return STRICT JSON only.

Required JSON structure:
{
  "findings": "<string>",
  "impressions": "<string>",
  "summary": "<string>",
  "key_abnormalities": ["<string>"],
  "confidence_score": <number>
}

Guidelines:
- Extract key radiological findings
- Summarize clinical impressions
- Identify significant abnormalities
- Provide overall summary

Document text:
{document_text}
'''

CASE_SUMMARY_PROMPT: Final = '''
Generate a comprehensive medical case summary based on all available information. Return STRICT JSON only.

Input Information:
- Patient: {patient_info}
- Doctor's Notes: {doctor_notes}
- Lab Summaries: {lab_summaries}
- Radiology Summaries: {radiology_summaries}

Required JSON structure:
{
  "summary": "<comprehensive_case_summary>",
  "key_findings": ["<key_finding_1>", "<key_finding_2>"],
  "confidence_score": <number>
}

Guidelines:
- Synthesize all available information
- Highlight key clinical findings
- Maintain medical accuracy
- Include confidence assessment
'''

SOAP_NOTE_PROMPT: Final = '''
Generate a SOAP note based on the case summary. Return STRICT JSON only.

Case Summary:
{case_summary}

Required JSON structure:
{
  "subjective": "<patient_reported_symptoms_and_history>",
  "objective": "<objective_findings_from_exams_and_tests>",
  "assessment": "<clinical_assessment_and_working_diagnosis>",
  "plan": "<treatment_and_management_plan>",
  "confidence_score": <number>
}

Guidelines:
- Follow standard SOAP format
- Base on available clinical information
- Ensure medical accuracy
- Include appropriate detail level
'''

DIAGNOSIS_PROMPT: Final = '''
Generate a primary diagnosis based on the SOAP note. Return STRICT JSON only.

SOAP Note:
{soap_note}

Required JSON structure:
{
  "diagnosis": "<primary_diagnosis>",
  "icd_code": "<icd_10_code>",
  "description": "<detailed_description>",
  "supporting_evidence": ["<evidence_1>", "<evidence_2>"],
  "confidence_score": <number>
}

Guidelines:
- Provide most likely primary diagnosis
- Include appropriate ICD-10 code if possible
- List supporting clinical evidence
- Assess diagnostic confidence
'''

DIFFERENTIAL_DIAGNOSIS_PROMPT: Final = '''
Generate differential diagnoses based on SOAP note and primary diagnosis. Return STRICT JSON only.

SOAP Note: {soap_note}
Primary Diagnosis: {primary_diagnosis}

Required JSON structure:
{
  "differential_diagnoses": [
    {
      "condition": "<condition_name>",
      "probability": <probability_0_to_1>,
      "reasoning": "<clinical_reasoning>",
      "distinguishing_factors": ["<factor_1>", "<factor_2>"]
    }
  ]
}

Guidelines:
- List 3-5 most relevant differential diagnoses
- Assign probability scores
- Provide clinical reasoning
- Include distinguishing factors
'''

RECOMMENDATIONS_PROMPT: Final = '''
Generate investigation and treatment recommendations based on clinical assessment. Return STRICT JSON only.

SOAP Note: {soap_note}
Primary Diagnosis: {diagnosis}

Required JSON structure:
{
  "investigations": [
    {
      "type": "<investigation_type>",
      "urgency": "<urgent|routine|follow-up>",
      "rationale": "<clinical_rationale>",
      "expected_findings": "<expected_results>"
    }
  ],
  "treatments": [
    {
      "type": "<treatment_type>",
      "description": "<treatment_description>",
      "dosage": "<dosage_if_applicable>",
      "duration": "<duration_if_applicable>",
      "precautions": ["<precaution_1>", "<precaution_2>"]
    }
  ]
}

Guidelines:
- Recommend appropriate investigations
- Suggest evidence-based treatments
- Include dosage and duration where relevant
- Consider patient safety and contraindications
''' 