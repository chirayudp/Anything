import { AiExplanationRequest, AiExplanationResponse, AiHintRequest, AiHintResponse } from '../types';

export class AiService {
  /**
   * Retrieves the configured Gemini API key from window, localStorage, or environment.
   */
  public static getApiKey(): string | null {
    if (typeof window !== 'undefined') {
      const winKey = (window as any).__GEMINI_API_KEY__;
      if (winKey && typeof winKey === 'string' && winKey.trim().length > 0) {
        return winKey.trim();
      }
      try {
        const stored = localStorage.getItem('gemini_api_key');
        if (stored && stored.trim().length > 0) return stored.trim();
      } catch {}
    }
    return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || null;
  }

  /**
   * Request contextual explanation.
   * Tries the backend proxy first; if unavailable (such as on GitHub Pages),
   * calls the Gemini API directly if a client key is configured,
   * and seamlessly falls back to high-quality deterministic curriculum pedagogy.
   */
  static async getExplanation(req: AiExplanationRequest): Promise<AiExplanationResponse> {
    // 1. Try backend API proxy if available (local dev or full-stack server)
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 0) {
          const data = JSON.parse(text);
          return {
            ...data,
            isAiGenerated: true,
          };
        }
      }
    } catch {
      // Backend offline or running on static hosting (e.g. GitHub Pages)
    }

    // 2. Direct client-side Gemini API fallback for GitHub Pages
    const apiKey = this.getApiKey();
    if (apiKey) {
      try {
        const prompt = `You are an empathetic, encouraging financial educator for Class 11-12 students in Hyderabad, India.
Scenario: "${req.scenarioTitle}"
Situation: ${req.scenarioContext}
Learning Pillar: ${req.pillar}
Student's Choice: "${req.chosenOptionText}" (Evaluated tier: ${req.tier})
Outcome Impact: ₹${req.financialImpact.walletDelta} wallet, ₹${req.financialImpact.emergencyDelta} savings.
Language: ${req.language || 'en'}

Provide a brief, supportive explanation (under 3 sentences) explaining why this financial decision led to this outcome. Give one practical relatable tip for a student living in Hyderabad. Do NOT give real-world investment advice.

Format as JSON:
{
  "explanation": "...",
  "pedagogicalTakeaway": "...",
  "relatableHyderabadStudentContext": "...",
  "encouragingTip": "..."
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              ...parsed,
              isAiGenerated: true,
            };
          }
        }
      } catch (clientErr) {
        console.warn('Client Gemini explanation call failed, using curriculum fallback', clientErr);
      }
    }

    // 3. Deterministic Curriculum Fallback
    return this.getFallbackExplanation(req);
  }

  /**
   * Request context-sensitive hint for the active scenario.
   */
  static async getHint(req: AiHintRequest): Promise<AiHintResponse> {
    // 1. Try backend proxy
    try {
      const response = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (response.ok) {
        const text = await response.text();
        if (text && text.trim().length > 0) {
          const data = JSON.parse(text);
          return {
            hint: data.hint,
            isAiGenerated: true,
          };
        }
      }
    } catch {
      // Backend offline or static site
    }

    // 2. Direct client-side Gemini fallback
    const apiKey = this.getApiKey();
    if (apiKey) {
      try {
        const prompt = `Provide a single, clever, encouraging hint (maximum 20 words) for a Class 11 student in Hyderabad facing the scenario: "${req.scenarioTitle}" on the topic of ${req.pillar}. Do NOT give away the exact answer. Language: ${req.language || 'en'}.`;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const hint = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (hint) {
            return { hint, isAiGenerated: true };
          }
        }
      } catch (e) {
        console.warn('Client Gemini hint call failed, using curriculum fallback', e);
      }
    }

    return {
      hint: this.getFallbackHint(req),
      isAiGenerated: false,
    };
  }

  /**
   * Ask any custom financial literacy or gameplay question using the Gemini API.
   * Usable across GitHub Pages and local environments.
   */
  static async askCustomQuestion(
    question: string,
    context?: string,
    language: string = 'en'
  ): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error(
        'Gemini API key is not configured. Please set window.__GEMINI_API_KEY__ or localStorage.setItem("gemini_api_key", "YOUR_KEY").'
      );
    }

    const systemPrompt = `You are a supportive, knowledgeable financial literacy mentor for Class 11-12 students in Hyderabad, India.
Explain concepts simply, with relatable student examples (hostel living, monthly scholarship stipends, digital payment safety, UPI, compound interest).
Language: ${language}.
${context ? `Context: ${context}` : ''}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\nStudent Question: ${question}` }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API request failed (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  }

  /**
   * High-quality deterministic curriculum fallback explanation.
   */
  private static getFallbackExplanation(req: AiExplanationRequest): AiExplanationResponse {
    const isVeryBad = req.tier === 'very_bad';

    let takeaway = '';
    let hyderabadContext = '';
    let tip = '';

    switch (req.pillar) {
      case 'budget':
        takeaway = isVeryBad
          ? 'Spending on non-essentials before paying mandatory hostel and food fees creates immediate financial distress.'
          : 'Allocating your stipend across Needs (50%), Savings (20%), and Wants (30%) guarantees you never run out of money before month-end.';
        hyderabadContext = 'In Hyderabad student areas like Ameerpet, Koti, and Gachibowli, daily chai and cafe treats can secretly deplete ₹1,500 every month if untracked.';
        tip = 'Write down your fixed expenses the day your scholarship hits your account.';
        break;

      case 'save':
        takeaway = isVeryBad
          ? 'Borrowing from high-interest instant loan apps for sudden expenses leads to an aggressive debt spiral.'
          : 'A dedicated emergency fund turns an unexpected crisis into a manageable routine expense.';
        hyderabadContext = 'Repairs at local markets like Abids or CTC can be negotiated or handled smoothly if you hold even ₹1,000 in reserve.';
        tip = 'Treat your emergency fund like an insurance policy: only touch it when urgent and replenish it immediately.';
        break;

      case 'invest':
        takeaway = isVeryBad
          ? 'Unregulated "crypto doubler" bots and get-rich-quick offers are guaranteed scams designed to steal student savings.'
          : 'Compound interest rewards time and patience. Starting small in Class 11 gives your capital years of geometric growth.';
        hyderabadContext = 'A simple ₹500/month recurring deposit started in higher secondary school builds both financial confidence and strong banking habits.';
        tip = 'Consistency matters far more than the initial amount. Small regular deposits compound significantly.';
        break;

      case 'safety':
        takeaway = isVeryBad
          ? 'Entering your UPI PIN authorizes money to leave your account. PIN is never required to receive funds!'
          : 'You shielded your stipend by recognizing that legitimate payment systems never ask for a PIN to receive incoming credits.';
        hyderabadContext = 'Telangana Cyber Crime Helpline (1930) receives hundreds of student complaints daily about fake QR codes and OLX buyer traps.';
        tip = 'Always remember: "PIN is for Paying, not Receiving". If someone says otherwise, it is a scam.';
        break;
    }

    return {
      explanation: isVeryBad
        ? `Caution: Your choice caused immediate financial strain. ${takeaway}`
        : `Well reasoned! ${takeaway}`,
      pedagogicalTakeaway: takeaway,
      relatableHyderabadStudentContext: hyderabadContext,
      encouragingTip: tip,
      isAiGenerated: false,
    };
  }

  private static getFallbackHint(req: AiHintRequest): string {
    switch (req.pillar) {
      case 'budget':
        return 'Ask yourself: Will I still have food, shelter, and study materials next week if I make this choice? Needs come before Wants!';
      case 'save':
        return 'Never take high-interest short-term loans. Use your emergency reserves and replenish them over subsequent months.';
      case 'invest':
        return 'Look for steady, regulated growth with compound interest. Reject any scheme offering overnight double returns.';
      case 'safety':
        return 'Golden Rule of Digital Payments: Never enter your PIN or OTP to receive money from anyone!';
    }
  }
}
