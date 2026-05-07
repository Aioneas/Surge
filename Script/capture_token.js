let tokenFile = "/tmp/chatgpt_token_captured.txt";

function captureToken() {
    let auth = $request.headers["Authorization"] || $request.headers["authorization"] || "";
    let token = auth.replace(/^Bearer\s+/i, "").trim();
    if (token && token.length > 20) {
        let time = new Date().toISOString();
        let content = "CODEX_IMAGE_TOKEN=" + token + "\nCAPTURED_AT=" + time + "\n";
        $file.write({ string: content, path: tokenFile });
        console.log("Token captured: " + token.substring(0, 20) + "...");
    }
}

captureToken();
$done({});
