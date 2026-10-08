import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  const getResolvedApiKey = () => {
    const rawKey =
      process.env.GEMINI_API_KEY ||
      process.env.VITE_GEMINI_API_KEY ||
      '';
    if (!rawKey || rawKey === 'MY_GEMINI_API_KEY') {
      return '';
    }
    return rawKey;
  };

  const getAiClient = () => {
    const apiKey = getResolvedApiKey();
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health & Environment Check endpoint
  app.get('/api/health', (_req, res) => {
    const hasServerKey = Boolean(getResolvedApiKey());
    res.json({
      status: 'ok',
      aiConfigured: hasServerKey,
      edition: 'Aetheria 2027 Solarpunk Engine',
    });
  });

  // Environment-Aware AI Advisor & Eco-Financial Auditor endpoint
  app.post('/api/ai/advisor', async (req, res) => {
    const { prompt, context, consentGranted, mode } = req.body || {};

    if (!consentGranted) {
      return res.status(403).json({
        error: 'Privacy consent is required before Aetheria AI can inspect financial or carbon telemetry.',
      });
    }

    const ai = getAiClient();

    // Build fallback insight in case API key isn't injected yet or network fails
    const buildFallbackInsight = () => {
      const budgetRemaining = context?.monthlyBudget
        ? context.monthlyBudget - (context.monthlySpend || 0)
        : 640;
      const bossHp = context?.bossHp ?? 45;
      const activeLeeches = context?.activeSubCount ?? 3;
      const streak = context?.streakDays ?? 12;
      const carbonRatio = context?.carbonPer100 ?? 8.4;

      if (mode === 'audit') {
        return {
          headline: `Eco-Capital Audit: $${budgetRemaining.toFixed(0)} Buffer & ${carbonRatio} kg CO₂e/$100`,
          summary: `Your ecosystem is at Level ${context?.ecosystemLevel || 2} with a ${streak}-day sunlight streak. You currently have ${activeLeeches} active subscription leeches draining recurring capital (${bossHp}% Boss HP remaining).`,
          actionItems: [
            `Strike a critical hit on your highest unused subscription to divert recurring cash into your 5.1% Eco-Index Vault.`,
            `Route your next tempted non-essential purchase into the 24-Hour Cooldown Vault to earn +150 XP and +25 Sunlight.`,
            `Switch one high-carbon delivery meal this week to a local zero-waste market run to earn +2 Green Guild Tokens.`,
          ],
          suggestedFeature: 'Subscription Boss Arena & 24h Impulse Cooldown Vault',
          sourceMode: 'resilient-local-engine',
        };
      }

      return {
        headline: `Solarpunk Steward Insight · Day ${streak} Streak`,
        summary: prompt
          ? `Regarding "${prompt}": With $${budgetRemaining.toFixed(0)} remaining in your monthly allocation and a carbon intensity of ${carbonRatio} kg CO₂e per $100, prioritizing low-carbon habit loops compounds both your net worth and canopy growth.`
          : `Your floating terrarium is flourishing at ${context?.sunlightEnergy || 78}% Sunlight. Keep daily discretionary spend below $${Math.max(18, Math.round(budgetRemaining / 12))} to unlock the Hydro-Turbine upgrade.`,
        actionItems: [
          `Complete today's 60-Second Morning Blitz to categorize pending receipts and claim +40 XP.`,
          `Spin the Phantom Savings Roulette the next time you skip a $6 coffee or impulse snack.`,
          `Redeem accumulated Green Guild Tokens in the Canopy Co-Op to plant verified native saplings.`,
        ],
        suggestedFeature: 'Daily 60-Second Blitz & Phantom Savings Roulette',
        sourceMode: 'resilient-local-engine',
      };
    };

    if (!ai) {
      return res.json(buildFallbackInsight());
    }

    try {
      const systemInstruction = `You are Aetheria AI, an encouraging, razor-sharp 2027 Solarpunk Financial & Carbon-Budgeting Advisor inside the Aetheria web app.
Analyze the user's current state (budget health, streak length, subscription boss HP, active impulse cooldown vaults, carbon-to-capital score, and ecosystem level).
Provide concrete, quantitative, human-centric micro-savings advice, carbon-reduction swaps, and gentle nudges to use Aetheria's gamified vaults (24h Impulse Cooldown Vault, Subscription Boss Battles, 60-Second Morning Blitz, Phantom Savings Roulette, and Guild Co-Op Vaults).
Keep tone warm, empowering, and grounded in behavioral economics and environmental stewardship.`;

      const userMessage = `User Query / Mode: ${prompt || (mode === 'audit' ? 'Run a complete Carbon & Subscription Boss audit on my current state.' : 'Give me a proactive daily check-in tip.')}
Current User State Context:
${JSON.stringify(context || {}, null, 2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: {
                type: Type.STRING,
                description: 'Short, punchy title summarizing the financial/eco insight.',
              },
              summary: {
                type: Type.STRING,
                description: '2-3 sentence personalized analysis referencing specific numbers from the user state.',
              },
              actionItems: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 3 concrete, actionable micro-saving or carbon-offset steps.',
              },
              suggestedFeature: {
                type: Type.STRING,
                description: 'Name of the Aetheria feature the user should interact with next.',
              },
            },
            required: ['headline', 'summary', 'actionItems', 'suggestedFeature'],
          },
        },
      });

      const rawText = response.text;
      if (!rawText) {
        return res.json(buildFallbackInsight());
      }

      const parsed = JSON.parse(rawText.trim());
      return res.json({
        ...parsed,
        sourceMode: 'gemini-3.8-flash',
      });
    } catch (error) {
      console.error('Gemini API fallback triggered:', error);
      return res.json(buildFallbackInsight());
    }
  });

  const distPath = path.resolve(__dirname, 'dist');
  const hasBuiltDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (process.env.NODE_ENV !== 'development' && hasBuiltDist);

  if (isProduction && hasBuiltDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Aetheria server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
