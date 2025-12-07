<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// --- Function to show error page ---
function showError() {
    echo "<!DOCTYPE html>
    <html>
    <head><title>FoilAI - Free Image API</title></head>
    <body style='background:black;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;margin:0;'>
        <h2 style='color:white;font-family:Arial;'>FoilAI - Free Image API</h2>
        <h3 style='color:white;font-family:Arial;'>Invalid URL. Use https://foilai.in/api/generate.php?prompt=your%20text</h3>
        <p style='color:white;font-family:Arial;'>Example: <a href=\"?prompt=cloudy%20mountain%20photo\" style='color:skyblue;'>cloudy mountain photo</a></p>
    </body></html>";
    exit;
}

// --- Get prompt from URL ---
$prompt = isset($_GET['prompt']) ? trim($_GET['prompt']) : '';

if ($prompt === '') {
    showError();
}

// --- Generate Pollinations AI image URL ---
$seed = rand(100000, 999999);
$imageUrl = "https://image.pollinations.ai/prompt/" . urlencode($prompt) . "?width=1024&height=1024&seed=$seed&nologo=true";

// --- Display the image ---
echo "<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>FoilAI - Generated Image</title>
    <style>
        body { margin:0; background:black; display:flex; justify-content:center; align-items:center; height:100vh; }
        img { max-width:100%; max-height:100vh; object-fit:contain; }
    </style>
    <script>
        document.addEventListener('contextmenu', e => e.preventDefault());
    </script>
</head>
<body>
    <img src='$imageUrl' alt='Generated AI Image' />
</body>
</html>";
?>
