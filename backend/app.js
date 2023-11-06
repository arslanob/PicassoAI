/** Application for runpod */
const express = require('express');
const app = express();
const ExpressError = require("./expressError");
const cors = require('cors');
const rateLimit = require('express-rate-limit');

app.use(express.json());

let APIKEY = ''

// Use the cors middleware to allow requests from specific origins (e.g., your React app's origin)
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your actual React app's origin
}));

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 30 requests per IP per hour
});

app.use(limiter);

//Image Generation route to send requests to runpod API.
app.post('/imagegen', async (request, response, next) => {
  try {
    if (!request.body) {
      return response.status(400).json({ error: 'Request body is missing' });
    }

    const { prompt } = request.body;
    if (!prompt) {
      return response.status(400).json({ error: 'Missing "prompt" property in the request body' });
    }

    // Check if "prompt" is a non-empty string
    if (typeof prompt !== 'string' || prompt.trim() === '') {
      return response.status(400).json({ error: 'Invalid "prompt" value. It should be a non-empty string.' });
    }

    const newItem = await runPodRequest(prompt);
    response.json(newItem);

  } catch (err) {
    return next(err);
  }
});

/** 404 handler */
app.use(function(req, res, next) {
  const err = new ExpressError("Page Not Found", 404);
  return next(err);
});

/** general error handler */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    status: err.status,
    message: err.message
  });
});




//API Requests for RunPod
async function runPodRequest(prompt){
  console.log(`Prompt passed to backend getImage func is ${prompt}`)

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `${APIKEY}`
    },
    body: JSON.stringify({
      input: {
        prompt: prompt,
        width: 512,
        height: 512,
        guidance_scale: 7.5,
        num_inference_steps: 50,
        num_outputs: 1,
        prompt_strength: 1,
        scheduler: 'KLMS'
      }
    })
  };
  try {
    const response = await fetch('https://api.runpod.ai/v2/stable-diffusion-v1/runsync', options);
    if (response.status >= 200 && response.status < 300) {
      const responseData = await response.json();
      const newItem = { prompt: prompt, image: responseData.output[0].image };
      return newItem;
    } else {
      // Handle API errors here
      console.error(`API request failed with status code ${response.status}`);
      return { error: 'API request failed', status: response.status };
    }
  } catch (err) {
    console.error(err);
    return { error: 'API request failed', status: 500 }; // Internal server error
  }
}


module.exports = app;