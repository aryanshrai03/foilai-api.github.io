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

  const escapedPrompt = prompt.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, '\\`');

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FoilAI - Generating Image</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      flex-direction: column;
      color: white;
      font-family: Arial, sans-serif;
    }
    #status {
      text-align: center;
      margin-bottom: 20px;
    }
    .spinner {
      border: 4px solid #222;
      border-top: 4px solid #fff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    img {
      max-width: 90%;
      max-height: 80vh;
      object-fit: contain;
      display: none;
      border-radius: 8px;
    }
    img.show { display: block; }
    .error { color: #ff6b6b; text-align: center; }
    .error a { color: skyblue; }
  </style>
</head>
<body>
  <div id="status">
    <div class="spinner"></div>
    <div>Creating your image...</div>
    <div style="font-size: 12px; color: #888; margin-top: 10px;">This may take 10-20 seconds</div>
  </div>
  <img id="result" alt="Generated Image">
  
  <script>
    const prompt = \`${escapedPrompt}\`;
    const status = document.getElementById('status');
    const img = document.getElementById('result');
    
    // Use a truly free API - ImgBB via their public endpoint
    // Or use Dezgo which is actually free
    async function generate() {
      try {
        const response = await fetch('https://api.dezgo.com/text2image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'prompt': prompt,
            'model': 'epic_realism',
            'width': '512',
            'height': '512',
            'steps': '20',
            'guidance': '7',
            'sampler': 'euler_a'
          })
        });

        if (!response.ok) throw new Error('Generation failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        img.src = url;
        img.classList.add('show');
        status.style.display = 'none';
      } catch (error) {
        status.innerHTML = '<div class="error">Generation failed.<br><a href="">Try again</a></div>';
      }
    }
    
    generate();
    document.addEventListener('contextmenu', e => e.preventDefault());
  </script>
</body>
</html>`);
}
