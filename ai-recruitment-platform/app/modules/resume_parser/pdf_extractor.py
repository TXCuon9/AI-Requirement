from pypdf import PdfReader


class PDFExtractor:

    @staticmethod
    def extract(file_path: str):

        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            text += page.extract_text()

        return text