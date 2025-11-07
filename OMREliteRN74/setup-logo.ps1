# PowerShell script to setup app logo for Android

$sourceLogo = "C:\Users\Asus\Downloads\app-logo.png"
$projectRoot = "C:\Users\Asus\Desktop\OMRElite\OMREliteRN74"

# Check if source logo exists
if (-not (Test-Path $sourceLogo)) {
    Write-Host "Error: Logo file not found at $sourceLogo" -ForegroundColor Red
    exit 1
}

Write-Host "Setting up app logo..." -ForegroundColor Green

# Load .NET assemblies for image processing
Add-Type -AssemblyName System.Drawing

# Define icon sizes for different densities
$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

# Load the source image
$sourceImage = [System.Drawing.Image]::FromFile($sourceLogo)

foreach ($folder in $sizes.Keys) {
    $size = $sizes[$folder]
    $targetFolder = Join-Path $projectRoot "android\app\src\main\res\$folder"
    
    # Create folder if it doesn't exist
    if (-not (Test-Path $targetFolder)) {
        New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
    }
    
    # Resize and save the image
    $targetPath = Join-Path $targetFolder "ic_launcher.png"
    $targetPathRound = Join-Path $targetFolder "ic_launcher_round.png"
    
    # Create a new bitmap with the target size
    $newImage = New-Object System.Drawing.Bitmap $size, $size
    $graphics = [System.Drawing.Graphics]::FromImage($newImage)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
    
    # Save both launcher icons
    $newImage.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $newImage.Save($targetPathRound, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $newImage.Dispose()
    
    Write-Host "Created $size x $size icon in $folder" -ForegroundColor Cyan
}

$sourceImage.Dispose()

Write-Host "`nLogo setup completed successfully!" -ForegroundColor Green
Write-Host "Icon files have been created for all Android densities." -ForegroundColor Green
