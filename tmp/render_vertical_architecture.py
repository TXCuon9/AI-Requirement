from PIL import Image, ImageDraw, ImageFont
import math

W, H = 1600, 1200
img = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(img)
FONT = r"C:\Windows\Fonts\segoeui.ttf"
BOLD = r"C:\Windows\Fonts\segoeuib.ttf"

def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)

def text_center(x, y, value, ft, fill="#17233f"):
    b = d.textbbox((0, 0), value, font=ft)
    d.text((x-(b[2]-b[0])/2, y-(b[3]-b[1])/2), value, font=ft, fill=fill)

def arrow(x1, y1, x2, y2, color="#27364f"):
    d.line((x1, y1, x2, y2), fill=color, width=5)
    angle = math.atan2(y2-y1, x2-x1)
    size = 16
    pts = [(x2, y2), (x2-size*math.cos(angle-.5), y2-size*math.sin(angle-.5)), (x2-size*math.cos(angle+.5), y2-size*math.sin(angle+.5))]
    d.polygon(pts, fill=color)

def card(x, y, w, h, fill, stroke, title, subtitle, number):
    d.rounded_rectangle((x, y, x+w, y+h), radius=22, fill=fill, outline=stroke, width=3)
    cx = x+w/2
    text_center(cx, y+55, title, font(25, True), "#14213e")
    text_center(cx, y+88, subtitle, font(17), "#32415d")

def section(y, label, color):
    d.text((80, y), label, font=font(18, True), fill=color)
    d.line((80, y+34, 1520, y+34), fill="#d9e0eb", width=2)

text_center(800, 48, "Software Deployment Architecture", font(42, True), "#101b35")
text_center(800, 88, "AI Recruitment Platform - top-down deployment view", font(23), "#46536d")
section(136, "REQUEST FLOW", "#265bc7")

card(540, 165, 520, 145, "#f5f8ff", "#4b82e8", "Browser", "User accesses the platform", "1")
arrow(800, 320, 800, 390)
card(540, 415, 520, 145, "#f4fcf8", "#38a878", "Next.js", "Web Application - React", "2")
arrow(800, 570, 800, 650)

section(605, "APPLICATION SERVICES", "#168052")
card(180, 675, 500, 125, "#eefafa", "#35a8b0", "Spring Boot Container", "Auth - jobs - profiles - applications", "3")
card(920, 675, 500, 125, "#faf6ff", "#8b63d6", "FastAPI AI Container", "Parser - scoring - recommendation", "4")
arrow(800, 650, 430, 660)
arrow(800, 650, 1170, 660, "#7c65bd")

d.rounded_rectangle((80, 895, 760, 1080), radius=22, fill="#f5fcfb", outline="#35a8b0", width=2)
d.rounded_rectangle((840, 895, 1520, 1080), radius=22, fill="#faf7ff", outline="#8b63d6", width=2)
text_center(420, 920, "SPRING BOOT DATA", font(18, True), "#197f89")
text_center(1180, 920, "FASTAPI AI DEPENDENCIES", font(18, True), "#643eb2")

for x, title, desc, color in [
    (145, "PostgreSQL", "Users - jobs - CVs", "#e1a43b"),
    (455, "Secret Manager", "JWT, DB and SMTP keys", "#7363d0"),
    (905, "ChromaDB", "Vector embeddings", "#8b63d6"),
    (1215, "Gemini API", "AI generation", "#e1a43b"),
]:
    d.rounded_rectangle((x, 945, x+260, 1040), radius=14, fill="white", outline=color, width=2)
    text_center(x+130, 970, title, font(20, True), "#14213e")
    text_center(x+130, 1005, desc, font(15), "#53627e")

arrow(430, 800, 275, 900)
arrow(430, 800, 585, 900)
arrow(1170, 800, 1035, 900, "#7c65bd")
arrow(1170, 800, 1345, 900, "#7c65bd")

text_center(800, 1120, "Spring Boot owns business data and secrets - FastAPI owns vector search and Gemini integration", font(16), "#5c6982")
img.save(r"C:\Users\xcuon\OneDrive\Desktop\AI Requirement\AI-Requirement\output\AI_Recruitment_Deployment_Architecture_Vertical.png", dpi=(150, 150))
