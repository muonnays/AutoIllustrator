param (
    [string]$JsxPath = ".\hello.jsx"
)

# Ensure the path is absolute for Illustrator
$fullPath = Convert-Path $JsxPath
Write-Host "Reading ExtendScript from: $fullPath"

$scriptContent = [System.IO.File]::ReadAllText($fullPath)

try {
    Write-Host "Connecting to Adobe Illustrator via COM..."
    # Connect to a running instance or start a new one
    $illustrator = New-Object -ComObject Illustrator.Application
    
    Write-Host "Executing ExtendScript..."
    $illustrator.DoJavaScript($scriptContent)
    
    Write-Host "Execution completed successfully!"
} catch {
    Write-Error "Failed to automate Illustrator. Ensure Illustrator is installed and running.`nError: $_"
}
