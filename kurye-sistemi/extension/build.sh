#!/bin/bash
# Paketçi Extension Build Script

echo "🔨 Paketçi Extension Build Başlıyor..."

# Create dist directory
mkdir -p dist

# Copy all extension files
cp -r extension/* dist/

# Remove development files from dist
rm -f dist/README.md
rm -f dist/build.sh

# Create icons from SVG (requires ImageMagick)
if command -v convert &> /dev/null; then
    echo "🎨 İkonlar oluşturuluyor..."
    convert -background none extension/assets/icon.svg -resize 16x16 dist/assets/icon16.png
    convert -background none extension/assets/icon.svg -resize 48x48 dist/assets/icon48.png
    convert -background none extension/assets/icon.svg -resize 128x128 dist/assets/icon128.png
else
    echo "⚠️  ImageMagick bulunamadı. İkonlar SVG olarak kalacak."
    cp extension/assets/icon.svg dist/assets/icon16.png
    cp extension/assets/icon.svg dist/assets/icon48.png
    cp extension/assets/icon.svg dist/assets/icon128.png
fi

# Create zip
cd dist
zip -r ../paketci-extension-v1.0.0.zip .
cd ..

echo "✅ Build tamamlandı: paketci-extension-v1.0.0.zip"
echo ""
echo "📦 Kurulum:"
echo "1. Chrome → Uzantılar → Geliştirici modu AÇIK"
echo "2. 'Paketlenmemiş öğe yükle' → dist/ klasörünü seç"
