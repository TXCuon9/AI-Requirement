from app.modules.skill_extraction.skill_normalizer import SkillNormalizer
from app.modules.skill_extraction.confidence_engine import ConfidenceEngine


class SkillDetector:

    @staticmethod
    def detect(skills):

        result=[]

        for skill in skills:

            normalized=SkillNormalizer.normalize(skill)

            confidence=ConfidenceEngine.calculate(normalized)

            result.append({
                    "original":skill,

                    "normalized":normalized,

                    "confidence":confidence
                }
            )

        return result