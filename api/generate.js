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

  // Use Segmind API (free, no auth required)
  const seed = Math.floor(Math.random() * 999999);
  const imageUrl = `https://segmind-sd1-5.hf.space/run/predict?data=[%22${encodeURIComponent(prompt)}%22,%22%22,7,20,512,512,${seed}]`;

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
      font-family: Arial, sans-serif;
    }
    #status {
      color: white;
      font-size: 18px;
      margin-bottom: 20px;
    }
    img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      display: none;
    }
    img.show { display: block; }
  </style>
</head>
<body>
  <div id="status">Generating your image...</div>
  <img id="result" alt="Generated Image">
  
  <script>
    const status = document.getElementById('status');
    const img = document.getElementById('result');
    const prompt = "${prompt.replace(/"/g, '\\"')}";
    
    async function generate() {
      try {
        status.textContent = 'Creating your image...';
        
        const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs: prompt })
        });
        
        if (!response.ok) throw new Error('Generation failed');
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        img.src = url;
        img.classList.add('show');
        status.style.display = 'none';
      } catch (error) {
        status.innerHTML = 'Generation failed. <a href="" style="color: skyblue;">Try again</a>';
      }
    }
    
    generate();
    document.addEventListener('contextmenu', e => e.preventDefault());
  </script>
</body>
</html>`);
}
