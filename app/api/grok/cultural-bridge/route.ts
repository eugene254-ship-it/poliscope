import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { argument, targetCulture, sourceCulture } = await request.json()

  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      system: `You are PoliScope's Cultural Bridge Builder. Help translate political arguments across cultural contexts while preserving meaning and identifying universal vs. culture-specific elements.`,
      prompt: `Translate this political argument across cultures:

ORIGINAL ARGUMENT: "${argument}"
SOURCE CULTURE: "${sourceCulture}"
TARGET CULTURE: "${targetCulture}"

Provide cultural translation as JSON:

{
  "culturalTranslation": {
    "directTranslation": "literal translation",
    "culturallyAdapted": "culturally appropriate version",
    "keyAdaptations": [{"original": "phrase", "adapted": "phrase", "reason": "cultural reason"}]
  },
  "culturalAnalysis": {
    "universalElements": ["element1", "element2"],
    "cultureSpecificElements": [
      {"element": "element", "culture": "source", "meaning": "meaning", "equivalent": "target equivalent"}
    ],
    "potentialMisunderstandings": [
      {"concept": "concept", "sourceInterpretation": "interpretation", "targetInterpretation": "interpretation"}
    ]
  },
  "bridgingStrategies": {
    "commonGround": ["shared value1", "shared value2"],
    "framingAdjustments": ["adjustment1", "adjustment2"],
    "examplesAndAnalogies": [
      {"concept": "concept", "sourceExample": "example", "targetExample": "example"}
    ]
  },
  "respectfulEngagement": {
    "culturalSensitivities": ["sensitivity1", "sensitivity2"],
    "appropriateLanguage": ["guideline1", "guideline2"],
    "avoidanceTopics": ["topic1", "topic2"]
  },
  "effectivenessMetrics": {
    "persuasionPotential": 0-100,
    "offenseRisk": 0-100,
    "clarityScore": 0-100,
    "culturalAuthenticity": 0-100
  },
  "recommendations": {
    "beforeEngaging": ["step1", "step2"],
    "duringDiscussion": ["guideline1", "guideline2"],
    "followUp": ["action1", "action2"]
  }
}`,
    })

    const bridge = JSON.parse(text)
    return NextResponse.json(bridge)
  } catch (error) {
    console.error("Grok Cultural Bridge Error:", error)
    return NextResponse.json({ error: "Failed to build cultural bridge" }, { status: 500 })
  }
}
