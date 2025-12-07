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

  const escapedPrompt = prompt.replace(/'/g, "\\'").replace(/"/g, '\\"');

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FoilAI</title>
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
      font-family: Arial;
    }
    .spinner {
      border: 4px solid #222;
      border-top: 4px solid #fff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
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
    }
    img.show { display: block; }
    #loader.hide { display: none; }
  </style>
</head>
<body>
  <div id="loader">
    <div class="spinner"></div>
    <div>Generating your image...</div>
  </div>
  <img id="result" alt="Generated Image">
  
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script>
    const prompt = "${escapedPrompt}";
    const loader = document.getElementById('loader');
    const img = document.getElementById('result');
    
    async function generate() {
      try {
        // Using pollinations.ai endpoint (it's actually still free for this use)
        const seed = Math.floor(Math.random() * 1000000);
        const url = \`https://image.pollinations.ai/prompt/\${encodeURIComponent(prompt)}?width=1024&height=1024&seed=\${seed}&nologo=true\`;
        
        img.src = url;
        img.onload = () => {
          loader.classList.add('hide');
          img.classList.add('show');
        };
        img.onerror = () => {
          loader.innerHTML = '<div style="color:#f66">Failed. <a href="" style="color:skyblue">Retry</a></div>';
        };
      } catch (err) {
        loader.innerHTML = '<div style="color:#f66">Error. <a href="" style="color:skyblue">Retry</a></div>';
      }
    }
    
    generate();
    document.addEventListener('contextmenu', e => e.preventDefault());
  </script>
</body>
</html>`);
}
