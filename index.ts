import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: "https://2b1a93da1e5c.ngrok-free.app/v1", //attach local model here
    apiKey: "lm-studio",
});


try {
    const completion = await client.chat.completions.create({
      messages: [
        {"role": "system", "content": "You are a helpful AI assistant"},
        {"role": "user", "content": "Hello, What are you, and how are you doing today?"}
        ],
      model: 'hermes-3-llama-3.2-3b',
    });
    console.log(completion.choices[0].message.content);
} catch (error) {
    console.error('Error getting chat completion:', error);
}

