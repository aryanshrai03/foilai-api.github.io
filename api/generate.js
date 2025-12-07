export default function handler(req, res) {
  const { prompt } = req.query;

  // Show error page if no prompt
  if (!prompt || prompt.trim() === '') {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='UTF-8'>
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
          h2 {
            color: white;
            margin-bottom: 10px;
          }
          h3 {
            color: white;
            font-weight: normal;
            margin: 10px 0;
          }
          p {
            color: white;
          }
          a {
            color: skyblue;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h2>FoilAI - Free Image API</h2>
        <h3>Invalid URL. Use /api/generate?prompt=your%20text</h3>
        <p>Example: <a href="?prompt=cloudy%20mountain%20photo">cloudy mountain photo</a></p>
      </body>
      </html>
    `);
  }

  // Generate Pollinations AI image URL
  const seed = Math.floor(Math.random() * 900000) + 100000;
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;

  // Return HTML with image
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='UTF-8'>
      <title>FoilAI - Generated Image</title>
      <style>
        body {
          margin: 0;
          background: black;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          overflow: hidden;
        }
        img {
          max-width: 100%;
          max-height: 100vh;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <img src="${imageUrl}" alt="Generated AI Image" />
      <script>
        document.addEventListener('contextmenu', e => e.preventDefault());
      </script>
    </body>
    </html>
  `);
}
```

**Your project structure should be:**
```
/api/generate.js  ← This file
