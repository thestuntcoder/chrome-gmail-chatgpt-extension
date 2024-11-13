document.getElementById('generate').addEventListener('click', async () => {
  const userInput = document.getElementById('userInput').value;

  chrome.runtime.sendMessage({ action: 'getEmailThread' }, async (response) => {
    const threadContent = response.thread;

    // Get OpenAI API key
    const { apiKey } = await chrome.storage.sync.get('apiKey');
    if (!apiKey) {
      alert('Please set your OpenAI API key in the extension popup.');
      return;
    }

    const generatedResponse = await fetchOpenAIResponse(apiKey, threadContent, userInput);
    document.getElementById('responseContainer').innerText = generatedResponse;
  });
});

async function fetchOpenAIResponse(apiKey, threadContent, userInput) {
  const prompt = `Email thread:\n${threadContent}\n\nUser guidance: ${userInput}\n\nSuggested response:`;

  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}
