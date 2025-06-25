from llama_cloud_services import LlamaParse

parser = LlamaParse(
    api_key="llx-VglYRh3pejjuCHcyF8naFI4sHAEijRnnyijthZJNzTcNZ6WL",
    num_workers=4,
    verbose=False,
    language="en",
    result_type="markdown",
)

async def process_pdf_async(file_path) -> dict:
    """
    Async function to process a single PDF file and extract page-wise content.

    Args:
        file_path: Single file path as string

    Returns:
        Dictionary containing document and page information
    """
    try:
        results = await parser.aparse(file_path)
        text = ""
        for page in results.pages:
            text += page.md + "\n"
            text += "=" * 80 + "\n"
        return {"text": text, "status": "success"}

    except Exception as e:
        error_result = {"text": "", "status": "error", "error": str(e)}
        return error_result
