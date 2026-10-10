import { AiExplanationRequest, AiExplanationResponse, AiHintRequest, AiHintResponse } from '../types';

export class AiService {
  /**
   * Request contextual explanation. Tries the backend proxy first, falling back to deterministic educational pedagogy.
   */
  static async getExplanation(req: AiExplanationRequest): Promise<AiExplanationResponse> {
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          isAiGenerated: true,
        };
      }
    } catch {
      // Fallback seamlessly on network or server offline
    }

    return this.getFallbackExplanation(req);
  }

  /**
   * Request context-sensitive hint for the active scenario.
   */
  static async getHint(req: AiHintRequest): Promise<AiHintResponse> {
    try {
      const response = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          hint: data.hint,
          isAiGenerated: true,
        };
      }
    } catch {
      // Network offline fallback
    }

    return {
      hint: this.getFallbackHint(req),
      isAiGenerated: false,
    };
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
