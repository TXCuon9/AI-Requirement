from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import re
from app.providers.local_provider import LocalProvider

router = APIRouter()

class CVData(BaseModel):
    parsedText: Optional[str] = ""
    skills: Optional[list] = []
    experiences: Optional[list] = []
    educationItemDTOS: Optional[list] = []
    projectItems: Optional[list] = []
    summary: Optional[str] = ""
    targetPosition: Optional[str] = ""

@router.post("/cv")
async def analyze_cv(cv_data: CVData):
    try:
        skills_list = cv_data.skills or []
        skills_str = ", ".join([s.get("name", str(s)) if isinstance(s, dict) else str(s) for s in skills_list])
        
        cv_text_representation = f"Vị trí ứng tuyển: {cv_data.targetPosition or ''}\n"
        cv_text_representation += f"Mục tiêu nghề nghiệp: {cv_data.summary or ''}\n"
        cv_text_representation += f"Kỹ năng: {skills_str}\n"
        
        cv_text_representation += "Học vấn:\n"
        for edu in (cv_data.educationItemDTOS or []):
            school = edu.get('schoolName') or edu.get('school') or ''
            degree = edu.get('degree') or ''
            gpa = edu.get('gpa') or ''
            
            edu_str = f"- {school}"
            if degree:
                edu_str += f" ({degree})"
            if edu.get('major'):
                edu_str += f" - Chuyên ngành: {edu.get('major')}"
            if gpa:
                edu_str += f" - GPA: {gpa}"
            if edu.get('description'):
                edu_str += f"\n  Mô tả: {edu.get('description')}"
            cv_text_representation += edu_str + "\n"
            
        cv_text_representation += "Kinh nghiệm làm việc:\n"
        for exp in (cv_data.experiences or []):
            cv_text_representation += f"- {exp.get('position') or ''} tại {exp.get('companyName') or ''}: {exp.get('description') or ''}\n"
            
        cv_text_representation += "Dự án:\n"
        for proj in (cv_data.projectItems or []):
            cv_text_representation += f"- {proj.get('projectName') or ''} ({proj.get('role') or ''}): {proj.get('description') or ''}\n"

        prompt = f"""
Bạn là một Chuyên gia Tuyển dụng (Recruitment Expert) cực kỳ khắt khe và có tiêu chuẩn rất cao. Hãy đánh giá chi tiết CV dưới đây dựa trên các tiêu chí: tính đầy đủ của thông tin, sự rõ ràng, tính chuyên nghiệp, và sự phù hợp với vị trí ứng tuyển.

Yêu cầu:
1. Đánh giá ĐIỂM SỐ thật khắt khe (từ 0 đến 100). Một CV bình thường chỉ nên đạt 40-60 điểm. Chỉ những CV thực sự xuất sắc, đầy đủ số liệu và dẫn chứng thành tích rõ ràng mới được trên 80 điểm. Nếu thông tin sơ sài, hãy chấm dưới 50 điểm.
2. Liệt kê TẤT CẢ các ưu điểm (ít nhất 3-5 ý chi tiết).
3. Liệt kê TẤT CẢ các nhược điểm (càng chi tiết và soi lỗi càng tốt, ít nhất 3-5 ý).
4. Đưa ra các lời khuyên thực tế để cải thiện (ít nhất 3-4 ý).

Trình bày phản hồi bằng tiếng Việt.
Bạn BẮT BUỘC phải trả về ĐÚNG MỘT khối JSON theo định dạng mẫu dưới đây (chỉ thay thế các giá trị, KHÔNG giải thích thêm):
{{
  "overall_score": [Điểm số nguyên từ 0-100],
  "pros": ["Ưu điểm 1", "Ưu điểm 2", "Ưu điểm 3", "..."],
  "cons": ["Nhược điểm 1", "Nhược điểm 2", "Nhược điểm 3", "..."],
  "recommendations": ["Lời khuyên 1", "Lời khuyên 2", "Lời khuyên 3", "..."]
}}

DỮ LIỆU CV THỰC TẾ:
{cv_text_representation}
"""
        provider = LocalProvider()
        llm_response = await provider.generate(prompt)

        # Trích xuất JSON từ LLM
        match = re.search(r'\{.*\}', llm_response, re.DOTALL)
        json_str = match.group(0) if match else llm_response
        
        result = json.loads(json_str)
        return result
        
    except Exception as e:
        print(f"Error analyzing CV: {e}")
        raise HTTPException(status_code=500, detail=str(e))
