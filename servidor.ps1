$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://*:8080/")
$listener.Start()
Write-Host "Servidor en http://localhost:8080 - Ctrl+C para parar" -ForegroundColor Green

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $path = $req.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    $file = Join-Path (Get-Location) $path.TrimStart("/")

    if (Test-Path $file -PathType Leaf) {
      $ext = [IO.Path]::GetExtension($file).ToLower()
      switch ($ext) {
        ".html" { $res.ContentType = "text/html; charset=utf-8" }
        ".css"  { $res.ContentType = "text/css; charset=utf-8" }
        ".js"   { $res.ContentType = "application/javascript; charset=utf-8" }
        ".json" { $res.ContentType = "application/json; charset=utf-8" }
        ".png"  { $res.ContentType = "image/png" }
        ".jpg"  { $res.ContentType = "image/jpeg" }
        ".jpeg" { $res.ContentType = "image/jpeg" }
        ".gif"  { $res.ContentType = "image/gif" }
        ".svg"  { $res.ContentType = "image/svg+xml" }
        ".pdf"  { $res.ContentType = "application/pdf" }
        default { $res.ContentType = "application/octet-stream" }
      }
      $bytes = [IO.File]::ReadAllBytes($file)
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $msg = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
    $res.OutputStream.Close()
  }
} finally {
  if ($listener -and $listener.IsListening) { $listener.Stop() }
}