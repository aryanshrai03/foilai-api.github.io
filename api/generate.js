export default async function handler(req, res) {
  const { prompt } = req.query;

  // Show error page if no prompt
  if (!prompt || prompt.trim() === '') {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head><title>FoilAI - Free Image API</title></head>
      <body style='background:black;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;margin:0;'>
          <h2 style='color:white;font-family:Arial;'>FoilAI - Free Image API</h2>
          <h3 style='color:white;font-family:Arial;'>Invalid URL. Use /api/generate?prompt=your%20text</h3>
          <p style='color:white;font-family:Arial;'>Example: <a href="?prompt=cloudy%20mountain%20photo" style='color:skyblue;'>cloudy mountain photo</a></p>
      </body></html>
    `);
  }

  try {
    // Generate Pollinations AI image URL
    const seed = Math.floor(Math.random() * 900000) + 100000;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;

    // Fetch the image to ensure it exists
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error('Failed to generate image');
    }

    // Get image as buffer
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Return HTML with embedded base64 image
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset='UTF-8'>
          <title>FoilAI - Generated Image</title>
          <style>
              body { 
                  margin:0; 
                  background:black; 
                  display:flex; 
                  justify-content:center; 
                  align-items:center; 
                  height:100vh; 
                  overflow:hidden;
              }
              img { 
                  max-width:100%; 
                  max-height:100vh; 
                  object-fit:contain;
              }
          </style>
          <script>
              document.addEventListener('contextmenu', e => e.preventDefault());
          </script>
      </head>
      <body>
          <img src="data:image/png;base64,${base64Image}" alt="Generated AI Image" />
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Error - FoilAI</title></head>
      <body style='background:black;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;'>
          <h2 style='color:white;font-family:Arial;'>Failed to generate image. Please try again.</h2>
      </body></html>
    `);
  }
}
