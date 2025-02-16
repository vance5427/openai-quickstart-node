import { Configuration, OpenAIApi } from "openai";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const openai2 = new OpenAI(configuration);

process.env.OPENAI_API_KEY = configuration.apiKey;


//get file to feed to prompt
const axios = require('axios');
const fs = require('fs');
const filePath = 'D:\\Software Development\\Github Repos\\openai-quickstart-node\\message_1.json';
const fileContents = fs.readFileSync(filePath, 'utf8');


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

    const model = new OpenAI({ temperature: 0.9 });
    //const template = "What is a good name for a company that makes {product}?";
    const prompt = new PromptTemplate({
      template: generatePrompt(animal),
      //inputVariables: ["product"],
    });
    /*
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      max_tokens: 300
    });
    **/
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

//  Here is some sample messages of his ${fileContents} 

function generatePrompt(animal) {
  return `Imagine a 24 year old white Franco-American new yorker named Vance. 
  
    He is also Jewish, has a computer science degree, likes watching TV, rock and roll music, rap music, traveling and eating.
    He used to be a saber fencer in college.
    He's born in 1999 in Washington DC. Also it is now 2023.
    His favorite color is purple.
    His favorite TV shows are Family guy, Breaking bad, Freaks & Geeks, Succession, Ted Lasso.
    His favorite movies in order are: The Meyerowitz Stories, The Princess Bride, Finding Nemo, and Greatest Beer Run Ever.
    His favorite musical artists are The Eagles, Kendrick Lamar, Pink Floyd, The Wu-tang-clan.
    He traveled to 21 countries in 2023 including Germany, Slovenia, Poland, Italy, the UK, France, Spain. France was his favorite.
    His girlfriend's name is Leora and he lives withher in Pittsburgh. She's fun quirky, bubbly, and a great artist.
    Vance loves her very much.
    Please respond to upcoming messages as if you were him: ${animal}`;
}