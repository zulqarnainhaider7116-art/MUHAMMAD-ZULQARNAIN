# ZXH OFFICIAL — Islamic Student Portfolio

Vercel-ready React + Vite project for Muhammad ZULQARNAIN.

## Included
- Existing Islamic student portfolio sections: Home, About, Education, Skills, Achievements, Projects, Amd Books Library, AI Study Quiz and Contact.
- User-supplied portrait used for favicon: `public/favicon.ico`, PNG favicon sizes, and Apple touch icon.
- No custom install popup, no PWA install banner, no service worker, and automatic `beforeinstallprompt` suppressed.
- Vercel serverless AI quiz endpoint at `api/study-quiz.ts`.

## Deploy to Vercel
1. Extract this ZIP.
2. Import the extracted project into GitHub, or use Vercel CLI from this folder.
3. In Vercel Project Settings → Environment Variables, add `OPENAI_API_KEY`.
4. Optional: add `OPENAI_MODEL` (defaults to `gpt-4o-mini`).
5. Deploy. The AI Study Quiz requires the API key; the rest of the portfolio works without it.

## Local development
```bash
npm install
npm run dev
```
Build:
```bash
npm run build
```

## Hero image
`public/resources/student-mosque-hero.png` is included so the hero never has a missing image. It currently uses the supplied portrait photo as a local fallback. If you want the exact wide student-at-the-mosque artwork from the hosted AppDeploy version, replace this file with that original wide PNG while keeping the same filename.

## Notes
- The WhatsApp contact form opens a prefilled WhatsApp message; it does not send automatically.
- The listed Amd Books titles are illustrative study references, not a verified official syllabus.
- Verify religious rulings and scholarly references with qualified teachers.
