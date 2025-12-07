export default function handler(req, res) {
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

  const seed = Math.floor(Math.random() * 900000) + 100000;
  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

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
      font-family: Arial, sans-serif;
    }
    #loader {
      color: white;
      font-size: 18px;
      text-align: center;
    }
    img {
      max-width: 100%;
      max-height: 100vh;
      object-fit: contain;
      display: none;
    }
    img.loaded { display: block; }
    .error {
      color: #ff6b6b;
      text-align: center;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div id="loader">Loading image...</div>
  <img id="img" alt="Generated AI Image">
  
  <script>
    const img = document.getElementById('img');
    const loader = document.getElementById('loader');
    const imageUrl = "${imageUrl}";
    
    // Timeout after 15 seconds
    const timeout = setTimeout(() => {
      loader.innerHTML = '<div class="error">Image generation timed out.<br>Please <a href="" style="color: skyblue;">refresh</a> to try again.</div>';
    }, 15000);
    
    img.onload = function() {
      clearTimeout(timeout);
      loader.style.display = 'none';
      img.classList.add('loaded');
    };
    
    img.onerror = function() {
      clearTimeout(timeout);
      loader.innerHTML = '<div class="error">Failed to load image.<br>Please <a href="" style="color: skyblue;">refresh</a> to try again.</div>';
    };
    
    // Start loading
    img.src = imageUrl;
    
    // Disable right-click
    document.addEventListener('contextmenu', e => e.preventDefault());
  </script>
</body>
</html>`);
}
