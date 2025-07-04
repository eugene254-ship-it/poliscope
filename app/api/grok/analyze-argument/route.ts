import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { argument, context } = await request.json()

  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      system: `You are PoliScope's Advanced Argument Analyzer. Provide deep, multi-dimensional analysis of political arguments with complete ideological neutrality.`,
      prompt: `Analyze this political argument in context:

ARGUMENT: "${argument}"
CONTEXT: "${context}"

Provide comprehensive analysis as JSON:

{
  "ideologicalMapping": {
    "primaryIdeology": "specific ideology",
    "secondaryInfluences": ["ideology1", "ideology2"],
    "spectrumPosition": {"economic": -100 to 100, "social": -100 to 100},
    "confidence": 0-100
  },
  "rhetoricalAnalysis": {
    "techniques": ["technique1", "technique2"],
    "fallacies": [{"type": "fallacy", "severity": "low|medium|high", "explanation": "why"}],
    "persuasionTactics": ["tactic1", "tactic2"],
    "targetAudience": "audience description"
  },
  "emotionalProfile": {
    "primaryEmotion": "emotion",
    "intensity": 0-100,
    "triggers": ["trigger1", "trigger2"],
    "manipulation": {"detected": true/false, "techniques": ["technique1"]}
  },
  "factualAssessment": {
    "verifiableClaims": [{"claim": "claim", "status": "verified|disputed|unverifiable"}],
    "statisticalAccuracy": 0-100,
    "sourceCredibility": 0-100,
    "missingContext": ["context1", "context2"]
  },
  "counterArguments": [
    {"position": "counter position", "strength": 0-100, "ideology": "ideology"},
    {"position": "counter position", "strength": 0-100, "ideology": "ideology"}
  ],
  "culturalBiases": {
    "detected": ["bias1", "bias2"],
    "culturalFramework": "framework",
    "universalApplicability": 0-100
  },
  "predictiveInsights": {
    "likelyResponses": ["response1", "response2"],
    "debateEvolution": "how this will evolve",
    "polarizationRisk": 0-100
  },
  "recommendations": {
    "strengthenArgument": ["suggestion1", "suggestion2"],
    "addressWeaknesses": ["weakness1", "weakness2"],
    "bridgeBuilding": ["bridge1", "bridge2"]
  }
}`,
    })

    const analysis = JSON.parse(text)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Grok Analysis Error:", error)
    return NextResponse.json({ error: "Failed to analyze argument" }, { status: 500 })
  }
}
