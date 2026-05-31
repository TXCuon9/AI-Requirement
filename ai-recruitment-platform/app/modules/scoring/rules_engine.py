class RulesEngine:

    @staticmethod
    def skill_match_score(
        candidate_skills,
        required_skills
    ):

        candidate = {

            x["normalized"].lower()

            for x in candidate_skills
        }


        required = {

            x.lower()

            for x in required_skills
        }


        matched = candidate.intersection(
            required
        )


        score = (

            len(matched)

            /

            len(required)

        ) * 100


        missing = list(

            required-candidate
        )


        return {

            "score":round(score,2),

            "missing_skills":missing
        }