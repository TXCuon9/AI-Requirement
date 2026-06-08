class SkillNormalizer:

    skill_map = {

        "js":"JavaScript",
        "javascript":"JavaScript",

        "reactjs":"React",
        "react":"React",

        "py":"Python",
        "python":"Python",

        "github":"Git",
        "git":"Git",

        "html":"HTML",
        "css":"CSS",

        "bootstrap":"Bootstrap"
    }


    @classmethod
    def normalize(cls,skill:str):
        skill = skill.lower().strip()
        return cls.skill_map.get(skill,skill)