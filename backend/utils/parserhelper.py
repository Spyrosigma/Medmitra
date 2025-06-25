from io import BytesIO
import docx
import logging
from fastapi import HTTPException, UploadFile
import os
from parsers.simple import simple # PyMuPdf4LLM parser
from parsers.plumber import extract_tables # pdfplumber parser

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def parse_pdf(file: UploadFile, parser_type: str='simple'):
    """Extracts text from a PDF file."""
    logger.info(f"Extracting text from PDF file using {parser_type} parser")
    try:
        filename = file.filename 
        contents = await file.read()
        with open(filename, 'wb') as f:
            f.write(contents)
        if parser_type == 'simple':
            text = simple(filename)
        elif parser_type == 'pdfplumber':
            text = extract_tables(filename)
        else:
            raise ValueError("Invalid parser type. Choose 'simple' or 'PdfPlumber'")
        os.remove(filename)
        return text
    except Exception as e:
        logger.error(f"PDF extraction error: {e}, type(filename)={type(file)}, filename={file}")
        raise

def extract_text_from_docx(file):
    '''Extract text from DOCX file'''
    try:
        logger.info("Extracting text from DOCX file : ", file.filename)
        content = file.read()
        doc = docx.Document(BytesIO(content))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        logger.error(f"DOCX extraction error: {str(e)}")
        raise HTTPException(400, "Invalid DOCX file")



