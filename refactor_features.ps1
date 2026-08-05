$files = Get-ChildItem -Path 'client/src/components/features', 'client/src/common' -Recurse -Include *.jsx

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw

    # Backgrounds & Cards
    $content = $content -replace 'bg-\[#e6edf5\]', 'bg-md-surface'
    $content = $content -replace 'bg-\[#dbe5f0\]', 'bg-md-surface-container-high'
    $content = $content -replace 'bg-\[#F6F8FB\]', 'bg-md-background'
    $content = $content -replace 'bg-white', 'bg-md-surface'

    # Remove neumorphic drop shadows
    $content = $content -replace 'shadow-\[\d+px_\d+px_\d+px_#[a-zA-Z0-9]+,-\d+px_-\d+px_\d+px_#[a-zA-Z0-9]+\]', 'shadow-md rounded-2xl border border-md-surface-variant'
    
    # Remove neumorphic inset shadows (inputs, inner containers, selects)
    $content = $content -replace 'shadow-\[inset_\d+px_\d+px_\d+px_#[a-zA-Z0-9]+,inset_-\d+px_-\d+px_\d+px_#[a-zA-Z0-9]+\]', 'border border-md-outline-variant'
    $content = $content -replace 'focus:shadow-\[inset_\d+px_\d+px_\d+px_#[a-zA-Z0-9]+,inset_-\d+px_-\d+px_\d+px_#[a-zA-Z0-9]+\]', 'focus:border-md-primary focus:ring-1 focus:ring-md-primary'

    # Remove hover neumorphic inset shadows (buttons)
    $content = $content -replace 'hover:shadow-\[inset_\d+px_\d+px_\d+px_#[a-zA-Z0-9]+,inset_-\d+px_-\d+px_\d+px_#[a-zA-Z0-9]+\]', 'hover:bg-md-surface-container-highest hover:shadow-none'
    
    # Text colors
    $content = $content -replace 'text-\[#1A1A1A\]', 'text-md-on-surface'
    $content = $content -replace 'text-\[#6B7280\]', 'text-md-on-surface-variant'
    $content = $content -replace 'text-\[#4F46E5\]', 'text-md-primary'
    $content = $content -replace 'text-\[#111827\]', 'text-md-on-surface'
    $content = $content -replace 'text-gray-600', 'text-md-on-surface-variant'
    $content = $content -replace 'text-gray-700', 'text-md-on-surface'
    $content = $content -replace 'text-gray-800', 'text-md-on-surface'
    
    # Radii updates for MD3
    $content = $content -replace 'rounded-xl', 'rounded-2xl'
    $content = $content -replace 'rounded-2xl', 'rounded-3xl'

    Set-Content -Path $file.FullName -Value $content
}
Write-Output "Refactored UI classes across all features."
