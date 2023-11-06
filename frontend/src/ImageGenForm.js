import React, { useState, useEffect } from "react";
import { Container, Form, Button, Image } from 'react-bootstrap';
import picasso from './picasso.png';
import picassoGif from './picasso.gif';
import loadingGif from './loadingimage.gif';
import History from './History.js';
import getImageAPI from './getImageApi.js';


function ImageGenForm() {
  const [items, setItems] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [requestQueue, setRequestQueue] = useState([]);
  // Track the number of requests being processed for loading GIF
  const [processingRequests, setProcessingRequests] = useState(0); 

  // Adding new images to useState
  const addItem = (item) => {
    setItems((prevItems) => [...prevItems, item]);
  }

  // Handle Changes in input
  const handleChange = (e) => {
    setCurrentPrompt(e.target.value);
  };

  // Handle Submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPrompt.trim() === '') {
      alert('Please enter a valid prompt.');
    } else {
    const newItem = { prompt: currentPrompt, image: loadingGif };
    addItem(newItem)
    setRequestQueue((prevQueue) => [...prevQueue, { prompt: currentPrompt, newItem }]);
    setCurrentPrompt(""); 
  };
}

//Processing the requests in the queue.
  const processRequestQueue = async () => {
    if (requestQueue.length > 0 && processingRequests === 0) {
      const { prompt, newItem } = requestQueue.shift();
      setProcessingRequests(1); // Start processing the request
      try {
        await getImage(prompt, newItem);
      } finally {
        setProcessingRequests(0); // Request processing is finished
      }
    }
  };

  useEffect(() => {
    processRequestQueue();
  }, [requestQueue, processingRequests]);

  async function getImage(prompt, newItem) {
    console.log(`Prompt passed to getImage func is ${prompt}`);
    try {
      let response = await getImageAPI(prompt);
      newItem.image = response.image;
      // setItems((prevItems) => [...prevItems, newItem]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container className="text-center">

      <h3 className="mt-2">Welcome to PicassoAI</h3>
      {processingRequests > 0 ? (
        <Image src={picassoGif} width={225} height={300} alt='Picasso Gif' className="my-2" />
      ) : (
        <Image src={picasso} width={225} height={300} alt='Picasso' className="my-2" />
      )}

      {/* Form for propmpt submissions */}
      <Form onSubmit={handleSubmit} className="mb-3">
        <h1>Image Generator</h1>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="Enter Your Prompt Here"
            value={currentPrompt}
            onChange={handleChange}
            className="mb-1"
          />
        </Form.Group>
        <Button type="submit" className="mb-1">
          Generate Image
        </Button>
      </Form>

      {/* History section for the submitted prompts. */}
      <History items={items} />

    </Container>
  );
}

export default ImageGenForm;

