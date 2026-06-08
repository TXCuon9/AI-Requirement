class VectorBuilder:

    @staticmethod
    def build(profile):

        text=[]


        for skill in profile["skills"]:
            text.append(skill["normalized"])

        for edu in profile.get("education", []):
            if isinstance(edu, dict):
                text.append(edu.get("schoolName", "") + " " + edu.get("major", ""))
            else:
                text.append(str(edu))

        for project in profile.get("projects", []):
            if isinstance(project, dict):
                text.append(project.get("projectName", "") + " " + project.get("role", ""))
            else:
                text.append(str(project))

        for exp in profile.get("experience", []):
            if isinstance(exp, dict):
                text.append(exp.get("companyName", "") + " " + exp.get("position", ""))
            else:
                text.append(str(exp))

        # Filter out empty strings
        text = [t for t in text if t and t.strip()]
        return " ".join(text)