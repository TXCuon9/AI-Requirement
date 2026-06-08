class ScoreCalculator:

    @staticmethod
    def calculate(
        skill_score,
        experience_score=70,
        education_score=70,
        project_score=70
    ):

        overall=(
            skill_score*0.5+
            experience_score*0.3+
            education_score*0.1+
            project_score*0.1
        )

        return round(overall,2)