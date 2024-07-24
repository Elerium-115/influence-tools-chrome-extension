$working_directory = Get-Location

$ele_github = "https://github.com/Elerium-115/"
$github_zip = $ele_github + "influence-tools-chrome-extension/archive/refs/heads/main.zip"
$local_zip = Join-Path $working_directory "influence-tools-chrome-extension-main.zip"
$local_unpack = Join-Path $working_directory "influence-tools-chrome-extension-main"

Write-Host "This script will download Elerium's extension for Influence from $ele_github . Once downloaded, it will need to be installed manually in your browser."
Write-Host ""
Write-Host "The manual installation (as opposed to the Chrome store) ensures that the extension will not be updated automatically without your consent."
Write-Host ""
Write-Host "The extension package will be downloaded to ""$working_directory""."
Write-Host ""
Write-Host -NoNewline "Press Y to continue or any key to abort: "

$keyInfo = [Console]::ReadKey()
if ($keyInfo.KeyChar.ToString().ToUpper() -ne "Y") {
    exit
}
Write-Host ""
Write-Host ""

# Download extension zip file from Github main branch
Write-Host -NoNewline "Downloading extension package..."
Invoke-WebRequest -Uri $github_zip -OutFile $local_zip

# Extract the zip into an extension folder that can be imported in the browser
Expand-Archive -Path $local_zip -DestinationPath $working_directory -Force

Write-Host " Done."
Write-Host ""
Write-Host "Open your browser to the extension management page (navigate to chrome://extensions/ or edge://extensions/)  and enable developer mode."
Write-Host "- For a first installation, choose ""Load unpacked extension"" and select the download folder ""$local_unpack"""
Write-Host "- To update an existing installation, locate the extension in the list and click ""Reload""."
Write-Host ""


Write-Output "Press any key to quit."
$keyInfo = [Console]::ReadKey()
