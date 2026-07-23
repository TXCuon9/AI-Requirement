import fs from "node:fs/promises";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const OUT_DIR = "C:/Users/xcuon/OneDrive/Desktop/AI Requirement/AI-Requirement/outputs";
const PREVIEW_DIR = "C:/Users/xcuon/OneDrive/Desktop/AI Requirement/AI-Requirement/tmp/ai_workflow_preview";
const PPTX_PATH = `${OUT_DIR}/AI_Recruitment_AI_Workflow.pptx`;

async function writeBlob(path, blob) {
  await fs.mkdir(path.substring(0, path.lastIndexOf("/")), { recursive: true });
  await fs.writeFile(path, new Uint8Array(await blob.arrayBuffer()));
}

function addText(slide, name, text, position, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontFace: "Aptos",
    fontSize: 18,
    color: "#26354f",
    alignment: "center",
    verticalAlignment: "middle",
    ...style,
  };
  return shape;
}

function addPill(slide, name, text, x, y, w, color) {
  const pill = slide.shapes.add({
    geometry: "roundRect",
    name,
    position: { left: x, top: y, width: w, height: 28 },
    fill: color,
    line: { style: "solid", fill: color, width: 0 },
    borderRadius: "rounded-full",
  });
  addText(slide, `${name}-text`, text, { left: x + 4, top: y + 1, width: w - 8, height: 26 }, {
    fontSize: 12,
    bold: true,
    color: "#ffffff",
  });
  return pill;
}

function addCard(slide, cfg) {
  const card = slide.shapes.add({
    geometry: "roundRect",
    name: cfg.name,
    position: { left: cfg.x, top: cfg.y, width: cfg.w, height: cfg.h },
    fill: cfg.fill,
    line: { style: "solid", fill: cfg.accent, width: 2 },
    borderRadius: "rounded-2xl",
    shadow: "shadow-sm",
  });
  slide.shapes.add({
    geometry: "ellipse",
    name: `${cfg.name}-number-circle`,
    position: { left: cfg.x + 18, top: cfg.y + 18, width: 42, height: 42 },
    fill: cfg.accent,
    line: { style: "solid", fill: cfg.accent, width: 0 },
  });
  addText(slide, `${cfg.name}-number`, String(cfg.number), { left: cfg.x + 18, top: cfg.y + 18, width: 42, height: 42 }, {
    fontSize: 20, bold: true, color: "#ffffff",
  });
  addText(slide, `${cfg.name}-title`, cfg.title, { left: cfg.x + 18, top: cfg.y + 68, width: cfg.w - 36, height: 34 }, {
    fontSize: 18, bold: true, color: "#14213d", alignment: "left",
  });
  addText(slide, `${cfg.name}-body`, cfg.body, { left: cfg.x + 18, top: cfg.y + 106, width: cfg.w - 36, height: 78 }, {
    fontSize: 15, color: "#364260", alignment: "left", verticalAlignment: "top",
  });
  addPill(slide, `${cfg.name}-pill`, cfg.pill, cfg.x + 18, cfg.y + cfg.h - 44, cfg.pillW, cfg.accent);
  return card;
}

async function main() {
  const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  const slide = deck.slides.add();
  slide.background.fill = "#f7f9fc";

  addText(slide, "eyebrow", "AI RECRUITMENT PLATFORM  /  PROCESS FLOW", { left: 72, top: 38, width: 520, height: 24 }, {
    fontSize: 13, bold: true, color: "#4b82e8", alignment: "left",
  });
  addText(slide, "title", "Từ CV thô đến gợi ý việc làm có thể giải thích", { left: 72, top: 66, width: 1040, height: 56 }, {
    fontSize: 34, bold: true, color: "#111b35", alignment: "left",
  });
  addText(slide, "subtitle", "AI biến hồ sơ ứng viên thành dữ liệu chuẩn hóa, điểm phù hợp và khuyến nghị hành động cho recruiter.", { left: 72, top: 126, width: 1080, height: 34 }, {
    fontSize: 18, color: "#53627e", alignment: "left",
  });

  const y = 238;
  const w = 166;
  const h = 254;
  const xs = [72, 272, 472, 672, 872, 1072];
  const cards = [
    { name: "input", number: 1, x: xs[0], y, w, h, title: "Ứng viên", body: "Tạo hồ sơ hoặc tải CV lên hệ thống.\n\nPDF / DOCX", pill: "INPUT", pillW: 70, fill: "#eef4ff", accent: "#4b82e8" },
    { name: "parse", number: 2, x: xs[1], y, w, h, title: "Resume Parser", body: "Đọc nội dung và trích xuất:\n• học vấn\n• kinh nghiệm\n• thông tin liên hệ", pill: "FASTAPI", pillW: 76, fill: "#edf9f3", accent: "#38a878" },
    { name: "skills", number: 3, x: xs[2], y, w, h, title: "Skill Extraction", body: "Chuẩn hóa kỹ năng, chức danh và mức độ tự tin từ CV.", pill: "NLP", pillW: 58, fill: "#f8f2fc", accent: "#8a5a9d" },
    { name: "match", number: 4, x: xs[3], y, w, h, title: "Job Matching", body: "Tạo embedding và tìm việc tương đồng trong ChromaDB.", pill: "EMBEDDING", pillW: 92, fill: "#fff7ea", accent: "#d89235" },
    { name: "score", number: 5, x: xs[4], y, w, h, title: "Scoring", body: "Kết hợp skill match và rule engine để tính điểm job-fit.", pill: "RULES + AI", pillW: 86, fill: "#fff0f0", accent: "#d45c67" },
    { name: "recommend", number: 6, x: xs[5], y, w, h, title: "Gợi ý việc", body: "Trả về việc phù hợp, pros / cons và gợi ý cải thiện CV.", pill: "OUTPUT", pillW: 72, fill: "#eef4ff", accent: "#4b82e8" },
  ];
  const shapes = cards.map((c) => addCard(slide, c));
  for (let i = 0; i < shapes.length - 1; i++) {
    slide.shapes.connect(shapes[i], shapes[i + 1], {
      kind: "straight",
      fromSide: "right",
      toSide: "left",
      line: { style: "solid", fill: "#9aa8bf", width: 2 },
      tail: { type: "arrow", width: "sm", length: "sm" },
    });
  }

  const outputBand = slide.shapes.add({
    geometry: "roundRect",
    name: "output-band",
    position: { left: 72, top: 548, width: 1136, height: 82 },
    fill: "#14213d",
    line: { style: "solid", fill: "#14213d", width: 0 },
    borderRadius: "rounded-2xl",
  });
  addText(slide, "output-band-title", "Kết quả cuối", { left: 96, top: 567, width: 180, height: 28 }, {
    fontSize: 16, bold: true, color: "#9dc0ff", alignment: "left",
  });
  addText(slide, "output-band-body", "Recruiter thấy ngay ai phù hợp, vì sao phù hợp và nên hành động tiếp theo như thế nào.", { left: 280, top: 559, width: 880, height: 46 }, {
    fontSize: 20, bold: true, color: "#ffffff", alignment: "left",
  });
  addText(slide, "footer", "AI Recruitment Platform · Workflow view", { left: 72, top: 674, width: 1136, height: 18 }, {
    fontSize: 11, color: "#8b99ae", alignment: "right",
  });

  await writeBlob(`${PREVIEW_DIR}/slide-01.png`, await deck.export({ slide, format: "png", scale: 2 }));
  await writeBlob(`${PREVIEW_DIR}/deck-montage.webp`, await deck.export({ format: "webp", montage: true, scale: 1 }));
  await fs.writeFile(`${PREVIEW_DIR}/slide-01.layout.json`, await (await slide.export({ format: "layout" })).text());
  console.log((await deck.inspect({ kind: "slide,textbox,shape", maxChars: 12000 })).ndjson);
  const pptx = await PresentationFile.exportPptx(deck);
  await pptx.save(PPTX_PATH);
  console.log(`WROTE ${PPTX_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
