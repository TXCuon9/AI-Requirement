from app.modules.scoring.rules_engine import RulesEngine

from app.modules.scoring.score_calculator import (
    ScoreCalculator
)


class ScoringService:


    @staticmethod
    def score(
        candidate_profile,
        job_data
    ):


        skill_result=RulesEngine.skill_match_score(
            candidate_profile["skills"],
            job_data["required_skills"]
        )


        overall=ScoreCalculator.calculate(skill_result["score"])


        return {

            "overall_score":overall,

            "skill_match_score":
            skill_result["score"],

            "missing_skills":
            skill_result["missing_skills"]
        }