
//GetImage with API call to backend
async function getImageAPI(prompt) {
    const req = { prompt: prompt };
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    };
  
    try {
      const response = await fetch('http://localhost:4000/imagegen', requestOptions);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  export default getImageAPI;

  