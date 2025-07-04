import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { topic, currentArguments, timeframe } = await request.json()

  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      system: `You are PoliScope's Debate Evolution Predictor. Use advanced political science, psychology, and social dynamics to predict how debates will evolve.`,
      prompt: `Predict the evolution of this political debate:

TOPIC: "${topic}"
CURRENT ARGUMENTS: ${JSON.stringify(currentArguments)}
TIMEFRAME: ${timeframe}

Provide detailed predictions as JSON:

{
  "evolutionPrediction": {
    "phase1": {
      "timeframe": "0-24h",
      "expectedDevelopments": ["development1", "development2"],
      "newActors": ["actor1", "actor2"],
      "shiftingPositions": [{"actor": "name", "from": "position", "to": "position", "probability": 0-100}]
    },
    "phase2": {
      "timeframe": "24-72h",
      "expectedDevelopments": ["development1", "development2"],
      "newActors": ["actor1", "actor2"],
      "shiftingPositions": [{"actor": "name", "from": "position", "to": "position", "probability": 0-100}]
    },
    "phase3": {
      "timeframe": "72h-1week",
      "expectedDevelopments": ["development1", "development2"],
      "newActors": ["actor1", "actor2"],
      "shiftingPositions": [{"actor": "name", "from": "position", "to": "position", "probability": 0-100}]
    }
  },
  "catalystEvents": [
    {"event": "potential event", "probability": 0-100, "impact": "low|medium|high", "timeframe": "when"}
  ],
  "ideologicalShifts": {
    "leftMovement": {"direction": "more/less extreme", "probability": 0-100, "drivers": ["driver1"]},
    "centerMovement": {"direction": "left/right", "probability": 0-100, "drivers": ["driver1"]},
    "rightMovement": {"direction": "more/less extreme", "probability": 0-100, "drivers": ["driver1"]}
  },
  "emergingNarratives": [
    {"narrative": "new narrative", "ideology": "source", "virality": 0-100, "factualBasis": 0-100}
  ],
  "resolutionScenarios": [
    {"scenario": "scenario description", "probability": 0-100, "timeline": "timeframe", "winners": ["actor1"], "losers": ["actor2"]}
  ],
  "wildCardFactors": [
    {"factor": "unexpected factor", "probability": 0-100, "impact": "description"}
  ],
  "mediaInfluence": {
    "keyOutlets": ["outlet1", "outlet2"],
    "framingShifts": ["shift1", "shift2"],
    "viralPotential": 0-100
  },
  "internationalImpact": {
    "affectedRegions": ["region1", "region2"],
    "diplomaticImplications": ["implication1"],
    "economicEffects": ["effect1"]
  }
}`,
    })

    const prediction = JSON.parse(text)
    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Grok Prediction Error:", error)
    return NextResponse.json({ error: "Failed to predict debate evolution" }, { status: 500 })
  }
}
