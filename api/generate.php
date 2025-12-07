<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// --- CONFIGURATION ---
$publicKey = "public_sVfze8xTv+ZNnpTKV0Q7xB+/LeE=";
$imagekitEndpoint = "https://upload.imagekit.io/api/v1/files/upload";

// --- Load private key from secure txt file ---
$privateKeyFile = __DIR__ . '/privatedat/a/theimagestoragekey.txt';
if (!file_exists($privateKeyFile)) {
    die("Private key file not found.");
}
$privateKey = trim(file_get_contents($privateKeyFile));

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
$prompt = '';
if (isset($_GET['prompt'])) {
    $prompt = $_GET['prompt'];
} elseif (isset($_SERVER['QUERY_STRING']) && $_SERVER['QUERY_STRING'] !== '') {
    $prompt = $_SERVER['QUERY_STRING'];
}

$prompt = trim(urldecode($prompt));
if ($prompt === '') showError();

// --- Step 1: Get Pollinations AI image ---
$seed = rand(100000, 999999);
$pollinationsUrl = "https://image.pollinations.ai/prompt/" . urlencode($prompt) . "?width=1024&height=1024&seed=$seed&nologo=true";

$imageData = @file_get_contents($pollinationsUrl);
if (!$imageData) {
    showError();
}

// --- Step 2: Upload to ImageKit ---
$boundary = uniqid();
$filename = substr(md5(uniqid()), 0, 12) . ".png";

$payload = "--$boundary\r\n";
$payload .= "Content-Disposition: form-data; name=\"file\"; filename=\"$filename\"\r\n";
$payload .= "Content-Type: image/png\r\n\r\n";
$payload .= $imageData . "\r\n";
$payload .= "--$boundary\r\n";
$payload .= "Content-Disposition: form-data; name=\"fileName\"\r\n\r\n";
$payload .= "$filename\r\n";
$payload .= "--$boundary--\r\n";

$headers = [
    "Authorization: Basic " . base64_encode($privateKey . ":"),
    "Content-Type: multipart/form-data; boundary=$boundary"
];

$ch = curl_init($imagekitEndpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    showError();
}
curl_close($ch);

$json = json_decode($response, true);
if (!isset($json['url'])) {
    showError();
}

$imageUrl = $json['url'];

// --- Step 3: Display the image ---
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
