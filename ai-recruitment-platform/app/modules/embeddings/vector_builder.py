class VectorBuilder:

    @staticmethod
    def build(profile):

        text=[]


        for skill in profile["skills"]:

            text.append(
                skill["normalized"]
            )


        for edu in profile["education"]:

            text.append(
                edu
            )


        for project in profile["projects"]:

            text.append(
                project
            )

        return " ".join(text)