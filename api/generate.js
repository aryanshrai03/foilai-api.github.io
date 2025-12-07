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
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>FoilAI - Generated Image</title>
  <style>
    body {
      margin: 0;
      background: black;
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
  <img src="${imageUrl}" alt="Generated AI Image">
  <script>
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  </script>
</body>
</html>`);
}
