export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt || prompt.trim() === '') {
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>FoilAI - Free Image API</title>
  <style>
    body {
      margin: 0;
      background: black;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: Arial, sans-serif;
    }
    h2 { color: white; margin-bottom: 10px; }
    h3 { color: white; font-weight: normal; margin: 10px 0; }
    p { color: white; }
    a { color: skyblue; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h2>FoilAI - Free Image API</h2>
  <h3>Invalid URL. Use /api/generate?prompt=your text</h3>
  <p>Example: <a href="?prompt=cloudy mountain photo">cloudy mountain photo</a></p>
</body>
</html>`);
  }

  try {
    const API_KEY = "754f3e01226bc754629ae84f33e7cd3440744e921acf9b3a56b03014d1401b68";
    
    // Generate image using ImageRouter
    const response = await fetch("https://imagerouter.promptlayer.com/image/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "black-forest-labs/FLUX.1-schnell-Free",
        n: 1
      })
    });

    if (!response.ok) {
      throw new Error('Generation failed');
    }

    const data = await response.json();
    
    // Get the image URL from response
    const imageUrl = data.data[0].url;

    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Return HTML with embedded image
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FoilAI - Generated Image</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    img {
      max-width: 100%;
      max-height: 100vh;
      object-fit: contain;
    }
  </style>
</head>
<body>
  <img src="data:image/png;base64,${base64Image}" alt="Generated AI Image">
  <script>
    document.addEventListener('contextmenu', e => e.preventDefault());
  </script>
</body>
</html>`);

  } catch (error) {
    console.error('Error:', error);
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Error - FoilAI</title>
  <style>
    body {
      margin: 0;
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: Arial, sans-serif;
      color: white;
      text-align: center;
    }
    a { color: skyblue; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div>
    <h2>Failed to generate image</h2>
    <p><a href="?">Try again</a></p>
  </div>
</body>
</html>`);
  }
}
