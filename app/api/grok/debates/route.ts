import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get("region") || "global"
  const timeframe = searchParams.get("timeframe") || "24h"

  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      system: `You are PoliScope's Global Debate Intelligence System. Analyze current political debates worldwide with ideological neutrality. Return structured JSON data about active political debates.`,
      prompt: `Analyze current political debates in ${region} over the last ${timeframe}. For each debate, provide:

1. Topic title and description
2. Key stakeholders and their positions
3. Ideological spectrum mapping (left/center/right percentages)
4. Emotional intensity (anger/fear/hope scores 0-100)
5. Trending momentum (rising/stable/declining)
6. Geographic spread
7. Key phrases being used by each side
8. Predicted evolution over next 48 hours
9. Cultural context and regional nuances
10. Fact-check alerts for major claims

Focus on: AI regulation, climate policy, economic inequality, immigration, healthcare, digital rights, geopolitical tensions.

Return as valid JSON array with exactly this structure:
{
  "debates": [
    {
      "id": "unique-id",
      "title": "debate title",
      "description": "brief description",
      "region": "region",
      "participants": number,
      "trending": "rising|stable|declining",
      "lastActivity": "time ago",
      "ideologyBreakdown": {"left": 0-100, "center": 0-100, "right": 0-100},
      "emotionalProfile": {"anger": 0-100, "fear": 0-100, "hope": 0-100},
      "keyPhrases": {"left": ["phrase1", "phrase2"], "right": ["phrase1", "phrase2"]},
      "stakeholders": [{"name": "name", "position": "position", "ideology": "left|center|right"}],
      "factCheckAlerts": [{"claim": "claim", "status": "verified|disputed|false", "source": "source"}],
      "culturalContext": "cultural nuances",
      "prediction": "48h evolution prediction",
      "urgency": "low|medium|high|critical"
    }
  ]
}`,
    })

    const debateData = JSON.parse(text)
    return NextResponse.json(debateData)
  } catch (error) {
    console.error("Grok API Error:", error)
    return NextResponse.json({ error: "Failed to fetch debate data" }, { status: 500 })
  }
}
