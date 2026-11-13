export const config = { runtime: "nodejs" };

type QuizQuestion = { question: string; options: string[]; answer: number; explanation: string };

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const material = String(req.body?.material ?? "").trim();
  if (material.length < 40) return res.status(400).json({ error: "Please provide at least 40 characters of study material." });
  if (material.length > 12000) return res.status(413).json({ error: "Please keep the study material under 12,000 characters." });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "AI quiz is not configured yet. Add OPENAI_API_KEY in Vercel Project Settings → Environment Variables, then redeploy." });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a careful Islamic studies learning assistant. Generate questions only from the supplied source material. Do not invent religious rulings, hadith grading, Quran references, or facts not present in the material. Return exactly five beginner-to-intermediate multiple-choice questions, each with four concise options, one correct option index from 0 to 3, and a short explanation grounded in the source. Output JSON with the shape { questions: [{ question, options, answer, explanation }] }." },
          { role: "user", content: "Create a study quiz from this material. Source material:\n\n" + material }
        ]
      })
    });
    const payload = await response.json();
    if (!response.ok) return res.status(502).json({ error: payload.error?.message || "The AI quiz service could not complete the request." });
    const content = payload.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || "{}") as { questions?: QuizQuestion[] };
    if (!Array.isArray(parsed.questions) || parsed.questions.length !== 5 ||
        parsed.questions.some(q => !q.question || !Array.isArray(q.options) || q.options.length !== 4 || !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3 || !q.explanation)) {
      return res.status(502).json({ error: "The quiz service returned an invalid question set. Please try again." });
    }
    return res.status(200).json({ questions: parsed.questions });
  } catch (error) {
    console.error("Study quiz error:", error);
    return res.status(500).json({ error: "Quiz generation failed. Please try again." });
  }
}
