import re


class SectionDetector:

    @staticmethod
    def extract_sections(text:str):

        sections = {}

        patterns = {

            "skills":
            r"KỸ NĂNG(.*?)(HỌC VẤN|KINH NGHIỆM|DỰ ÁN|CHỨNG CHỈ)",

            "education":
            r"HỌC VẤN(.*?)(KINH NGHIỆM|DỰ ÁN|CHỨNG CHỈ)",

            "projects":
            r"DỰ ÁN(.*?)(CHỨNG CHỈ|NGƯỜI GIỚI THIỆU)",

            "certificates":
            r"CHỨNG CHỈ(.*?)(NGƯỜI GIỚI THIỆU|SỞ THÍCH)"
        }

        for key, pattern in patterns.items():

            match = re.search(
                pattern,
                text,
                re.DOTALL
            )

            if match:

                content = match.group(1)

                sections[key] = [

                    x.strip()

                    for x in content.split("\n")

                    if x.strip()
                ]

            else:

                sections[key]=[]

        return sections