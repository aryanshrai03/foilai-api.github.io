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
    const API_KEY = "0000000000"; // Anonymous API key
    
    // Step 1: Submit generation request
    const generateResponse = await fetch("https://stablehorde.net/api/v2/generate/async", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": API_KEY
      },
      body: JSON.stringify({
        prompt: prompt,
        params: {
          steps: 20,
          width: 512,
          height: 512,
          sampler_name: "k_euler"
        },
        nsfw: false,
        trusted_workers: false,
        models: ["stable_diffusion"]
      })
    });

    if (!generateResponse.ok) {
      throw new Error('Failed to submit generation request');
    }

    const { id } = await generateResponse.json();

    // Return HTML that polls for the result
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
      flex-direction: column;
    }
    .loader {
      color: white;
      font-family: Arial, sans-serif;
      font-size: 18px;
      text-align: center;
    }
    .spinner {
      border: 4px solid #222;
      border-top: 4px solid #fff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    #status {
      margin-top: 10px;
      font-size: 14px;
      color: #888;
    }
    img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      display: none;
    }
    img.show { display: block; }
    .error {
      color: #ff6b6b;
      text-align: center;
      font-family: Arial, sans-serif;
    }
    .error a {
      color: skyblue;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="loader" id="loader">
    <div class="spinner"></div>
    <div>Generating your image...</div>
    <div id="status">Initializing...</div>
  </div>
  <img id="result" alt="Generated Image">
  
  <script>
    const loader = document.getElementById('loader');
    const status = document.getElementById('status');
    const img = document.getElementById('result');
    const requestId = "${id}";
    
    async function checkStatus() {
      try {
        const response = await fetch(\`https://stablehorde.net/api/v2/generate/check/\${requestId}\`);
        const data = await response.json();
        
        if (data.done) {
          // Get the final result
          const resultResponse = await fetch(\`https://stablehorde.net/api/v2/generate/status/\${requestId}\`);
          const result = await resultResponse.json();
          
          if (result.generations && result.generations.length > 0) {
            img.src = result.generations[0].img;
            img.classList.add('show');
            loader.style.display = 'none';
          } else {
            throw new Error('No image generated');
          }
        } else {
          // Update status
          const queuePos = data.queue_position || 0;
          const waitTime = data.wait_time || 0;
          status.textContent = \`Queue position: \${queuePos} | Wait time: ~\${waitTime}s\`;
          
          // Check again in 2 seconds
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        loader.innerHTML = '<div class="error">Generation failed<br><a href="">Try again</a></div>';
      }
    }
    
    checkStatus();
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
    <h2>Failed to start generation</h2>
    <p><a href="?">Try again</a></p>
  </div>
</body>
</html>`);
  }
}
