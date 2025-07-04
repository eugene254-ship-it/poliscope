import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const topics = searchParams.get("topics")?.split(",") || []

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await streamText({
          model: xai("grok-3"),
          system: `You are PoliScope's Real-Time Global Political Monitor. Continuously analyze and report on political developments worldwide as they happen.`,
          prompt: `Monitor these political topics in real-time: ${topics.join(", ")}

Provide continuous updates in this JSON format, one per line:
{"type": "update", "topic": "topic", "development": "what happened", "impact": "significance", "ideology": "affected ideologies", "urgency": "low|medium|high|breaking", "timestamp": "ISO timestamp", "sources": ["source1"], "predictions": ["what happens next"]}

{"type": "sentiment_shift", "topic": "topic", "from": {"anger": 0-100, "fear": 0-100, "hope": 0-100}, "to": {"anger": 0-100, "fear": 0-100, "hope": 0-100}, "cause": "reason for shift", "timestamp": "ISO timestamp"}

{"type": "new_actor", "topic": "topic", "actor": "name", "position": "their stance", "ideology": "ideology", "influence": 0-100, "timestamp": "ISO timestamp"}

{"type": "fact_check", "topic": "topic", "claim": "claim being made", "status": "verified|disputed|false", "evidence": "evidence", "impact": "how this affects debate", "timestamp": "ISO timestamp"}

Continue monitoring and provide updates every 30 seconds...`,
        })

        for await (const chunk of result.textStream) {
          controller.enqueue(new TextEncoder().encode(`data: ${chunk}\n\n`))
        }
      } catch (error) {
        controller.error(error)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
