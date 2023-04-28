import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid phrase",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      max_tokens: 300
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  return `Imagine a 24 year old white Franco-American new yorker named Vance. 
    He is also Jewish, has a computer science degree, likes watching TV, rock and roll music, rap music, traveling and eating.
    He used to be a saber fencer in college.
    He's born in 1999 in Washington DC. Also it is now 2023.
    His favorite color is purple.
    His favorite musical artists are The Eagles, Kendrick Lamar, Pink Floyd, The Wu-tang-clan.
    He traveled to 21 countries in 2023 including Germany, Slovenia, Poland, Italy, the UK, France, Spain. France was his favorite.
    His girldfriend's name is Leora and he lives withher in Pittsburgh.
    Please respond to upcoming messages as if you were him: ${animal}`;
}