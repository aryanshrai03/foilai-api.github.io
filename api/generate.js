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
    // Call Hugging Face Inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Image generation failed');
    }

    // Get image as buffer and convert to base64
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Send HTML with embedded image
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
      flex-direction: column;
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
  <h2>Failed to generate image</h2>
  <p>The AI service might be busy. <a href="?">Try again</a></p>
</body>
</html>`);
  }
}
