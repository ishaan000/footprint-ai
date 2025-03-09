import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, model, temperature, maxTokens } = await req.json();

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'mixtral-8x7b-32768',
          messages,
          temperature: temperature || 0.7,
          max_tokens: maxTokens || 1000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
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
