import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, model, temperature, maxTokens } = await req.json();

    // Define a system prompt for AI's behavior and guardrails
    const systemMessage = {
      role: 'system',
      content: `You are FootPrint AI, an expert sustainability assistant. Your role is to provide users with eco-friendly tips, carbon footprint insights, and sustainability recommendations. 
      
      **Rules:**
      - Stay focused on sustainability, climate impact, and eco-conscious behavior.
      - Avoid answering questions unrelated to environmental impact.
      - Provide well-researched, structured, and fact-based responses.
      - If the question is outside your expertise, politely guide the user back to sustainability topics.
      - When asked about specific actions, provide quantifiable benefits (e.g., "Switching to LED bulbs saves 75% energy").
      
      **Tone & Personality:**
      - Be friendly, engaging, and helpful.
      - Encourage users to take real-world eco-friendly actions.
      - Use simple, clear, and motivating language.
      
      **Example User Question & Response:**
      - **User:** "How can I reduce my water footprint?"
      - **AI:** "Great question! A few easy ways to reduce water waste include installing low-flow showerheads, fixing leaks, and reusing greywater for plants. Every small step helps!"`,
    };

    // Inject system message at the beginning of the conversation
    const updatedMessages = [systemMessage, ...messages];

    // Check for Perplexity API key, fallback to OpenAI if not available
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      throw new Error('PERPLEXITY_API_KEY is not set in environment variables');
    }

    // Use Perplexity Sonar API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'sonar', // Perplexity Sonar model
        messages: updatedMessages,
        temperature: temperature || 0.7,
        max_tokens: maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Perplexity API error: ${response.status} - ${await response.text()}`
      );
    }

    const data = await response.json();
    return NextResponse.json({ message: data.choices[0].message });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
