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
    // Use Replicate's free SDXL model via their public API
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024
        }
      })
    });

    const data = await response.json();
    
    // For Replicate, we need to poll for results
    // Let's use a simpler approach - Hugging Face Spaces
    
    // Actually, let's use the SIMPLEST free option: Craiyon (formerly DALL-E mini)
    const craiyonResponse = await fetch("https://api.craiyon.com/v3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "art",
        negative_prompt: "",
        token: null,
        version: "c",
      })
    });

    if (!craiyonResponse.ok) {
      throw new Error('Generation failed');
    }

    const craiyonData = await craiyonResponse.json();
    
    // Craiyon returns base64 images
    const base64Image = craiyonData.images[0];

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
    <p>${error.message}</p>
    <p><a href="?">Try again</a></p>
  </div>
</body>
</html>`);
  }
}
