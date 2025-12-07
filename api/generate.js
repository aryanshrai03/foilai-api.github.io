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
      font-family: Arial, sans-serif;
    }
    .error a {
      color: skyblue;
      text-decoration: none;
    }
    .error a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="loader" id="loader">
    <div class="spinner"></div>
    <div>Generating your image...</div>
    <div style="font-size: 14px; color: #888; margin-top: 10px;">This may take 10-30 seconds</div>
  </div>
  <img id="img" alt="Generated AI Image">
  
  <script>
    const img = document.getElementById('img');
    const loader = document.getElementById('loader');
    const imageUrl = "${imageUrl}";
    
    let timeout = setTimeout(() => {
      loader.innerHTML = '<div class="error">Taking longer than expected...<br><a href="">Refresh to try again</a></div>';
    }, 30000);
    
    img.onload = function() {
      clearTimeout(timeout);
      loader.style.display = 'none';
      img.classList.add('loaded');
    };
    
    img.onerror = function() {
      clearTimeout(timeout);
      loader.innerHTML = '<div class="error">Failed to generate image<br><a href="">Refresh to try again</a></div>';
    };
    
    img.src = imageUrl;
    
    document.addEventListener('contextmenu', e => e.preventDefault());
  </script>
</body>
</html>`);
}
