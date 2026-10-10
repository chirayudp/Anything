import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json());

// In-memory store for server-side NGO analytics aggregation
const decisionEventsStore: any[] = [];

/**
 * Health check
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'MoneyQuest Backend Engine',
    geminiConfigured: !!GEMINI_API_KEY,
    totalEventsLogged: decisionEventsStore.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * AI Explanation Proxy endpoint (Gemini API with secure server-side key)
 */
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  const { scenarioTitle, scenarioContext, pillar, chosenOptionText, tier, financialImpact, language } = req.body;

  if (!GEMINI_API_KEY) {
    // Return flag so client uses pedagogical fallback
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured on server. Use fallback.',
      isAiGenerated: false,
    });
  }

  try {
    const prompt = `You are an empathetic, encouraging financial educator for Class 11-12 students in Hyderabad, India.
Scenario: "${scenarioTitle}"
Situation: ${scenarioContext}
Learning Pillar: ${pillar}
Student's Choice: "${chosenOptionText}" (Evaluated tier: ${tier})
Outcome Impact: ₹${financialImpact.walletDelta} wallet, ₹${financialImpact.emergencyDelta} savings.
Language: ${language || 'English'}

Provide a brief, supportive explanation (under 3 sentences) explaining why this financial decision led to this outcome. Give one practical relatable tip for a student living in Hyderabad. Do NOT give real-world investment advice.

Format as JSON:
{
  "explanation": "...",
  "pedagogicalTakeaway": "...",
  "relatableHyderabadStudentContext": "...",
  "encouragingTip": "..."
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);

    return res.json({
      ...parsed,
      isAiGenerated: true,
    });
  } catch (error: any) {
    console.error('Gemini explanation error:', error.message);
    return res.status(500).json({
      error: 'Failed to generate AI explanation',
      isAiGenerated: false,
    });
  }
});

/**
 * AI Hint Proxy endpoint
 */
app.post('/api/ai/hint', async (req: Request, res: Response) => {
  const { scenarioTitle, pillar, language } = req.body;

  if (!GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured. Use fallback.',
      isAiGenerated: false,
    });
  }

  try {
    const prompt = `Provide a single, clever, encouraging hint (maximum 20 words) for a Class 11 student in Hyderabad facing the scenario: "${scenarioTitle}" on the topic of ${pillar}. Do NOT give away the exact answer. Language: ${language || 'English'}.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    const hint = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return res.json({ hint, isAiGenerated: true });
  } catch (error: any) {
    console.error('Gemini hint error:', error.message);
    return res.status(500).json({ error: 'Failed to generate hint', isAiGenerated: false });
  }
});

/**
 * Decision event logging endpoint for centralized NGO reporting
 */
app.post('/api/analytics/events', (req: Request, res: Response) => {
  const event = req.body;
  if (!event || !event.eventId) {
    return res.status(400).json({ error: 'Invalid event payload' });
  }

  decisionEventsStore.push(event);
  return res.status(201).json({ status: 'recorded', count: decisionEventsStore.length });
});

/**
 * NGO Aggregate reports endpoint
 */
app.get('/api/analytics/overview', (_req: Request, res: Response) => {
  return res.json({
    totalEvents: decisionEventsStore.length,
    events: decisionEventsStore,
  });
});

app.listen(PORT, () => {
  console.log(`MoneyQuest backend engine running on http://localhost:${PORT}`);
});
