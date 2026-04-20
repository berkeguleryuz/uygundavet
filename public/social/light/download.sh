#!/usr/bin/env bash
# UygunDavet - Acik Tema Seti / Light Theme Set
# 8 Instagram posts (1080x1350) exported from Canva.
#
# Canva sandbox blokladigi icin PNG'ler dogrudan indirilemedi.
# Bu scripti lokal makinende calistirarak PNG'leri bu klasore indir:
#
#   cd /Users/berke/Desktop/Developer/web/davetiye/public/social/light
#   bash download.sh
#
# NOT: URL imzalari ~12-24 saat sonra suresi dolar. Eger 403 alirsan,
# Cowork oturumundan yeniden export iste veya Canva UI'den manuel indir
# (her tasarimin view linki asagidadir).

set -euo pipefail

cd "$(dirname "$0")"

download() {
  local name="$1"
  local url="$2"
  echo "→ $name"
  curl -fsSL -o "$name" "$url"
}

download "marka-intro-light.png" \
  "https://export-download.canva.com/FvRbI/DAHHYKFvRbI/-1/0/0001-3723851689363431965.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260419%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260419T204419Z&X-Amz-Expires=53322&X-Amz-Signature=774cbc54e36b0b0a057ef72a3d16f15a204ed297b0ad67980f65c785ece56678&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Mon%2C%2020%20Apr%202026%2011%3A33%3A01%20GMT"

download "dijital-davetiye-light.png" \
  "https://export-download.canva.com/ZDUMw/DAHHYHZDUMw/-1/0/0001-2689149672862361571.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260419%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260419T100344Z&X-Amz-Expires=89691&X-Amz-Signature=1d539b46f05fb684d45cfb05605e67763f356bab5144537484cecbe62027d8c4&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Mon%2C%2020%20Apr%202026%2010%3A58%3A35%20GMT"

download "fiyatlar-light.png" \
  "https://export-download.canva.com/ybiHo/DAHHYPybiHo/-1/0/0001-5789878018504515751.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260419%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260419T204801Z&X-Amz-Expires=50540&X-Amz-Signature=faf84c60ec5b3105955c9104ede694ca92e004a9bba64f138a2c33327c46ada1&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Mon%2C%2020%20Apr%202026%2010%3A50%3A21%20GMT"

download "tek-platform-light.png" \
  "https://export-download.canva.com/39vsE/DAHHYH39vsE/-1/0/0001-423839061721489902.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260420%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260420T081016Z&X-Amz-Expires=11035&X-Amz-Signature=fdc02e18111125ac8ade9c558cae30ce7921db10db8c50142997c9ae39661fba&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Mon%2C%2020%20Apr%202026%2011%3A14%3A11%20GMT"

download "ani-defteri-light.png" \
  "https://export-download.canva.com/zFsZw/DAHHYPzFsZw/-1/0/0001-1322307186125884186.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260419%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260419T142506Z&X-Amz-Expires=73411&X-Amz-Signature=1336e02deab411131dcd4008c79239ab70a7c26c6fcaef83b9275328f4eac5f9&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Mon%2C%2020%20Apr%202026%2010%3A48%3A37%20GMT"

download "8-tema-light.png" \
  "https://export-download.canva.com/AdJ4U/DAHHYPAdJ4U/-1/0/0001-5247194263186225656.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260419%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260419T221506Z&X-Amz-Expires=44964&X-Amz-Signature=66bd6a5c669314af2d675324c3caf84ac5b6f42865bc3e92f51049fe72ac6352&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Mon%2C%2020%20Apr%202026%2010%3A44%3A30%20GMT"

download "her-cift-light.png" \
  "https://export-download.canva.com/ZoHjY/DAHHYOZoHjY/-1/0/0001-3527945105288484336.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260419%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260419T150843Z&X-Amz-Expires=72778&X-Amz-Signature=b92ef529a3eb02bc2e415749a41c4cbd756b4cf49de52c6dee49e8f15d81c3eb&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Mon%2C%2020%20Apr%202026%2011%3A21%3A41%20GMT"

download "davetiye-deneyimi-light.png" \
  "https://export-download.canva.com/blrpY/DAHHYIblrpY/-1/0/0001-190777782201364941.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQYCGKMUH5AO7UJ26%2F20260419%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260419T235417Z&X-Amz-Expires=39699&X-Amz-Signature=716f9500214af9e6119f82f9ec8c1fa26276c66e956e6f7c4546efc9c160670f&X-Amz-SignedHeaders=host%3Bx-amz-expected-bucket-owner&response-expires=Mon%2C%2020%20Apr%202026%2010%3A55%3A56%20GMT"

echo ""
echo "Tamam, 8 PNG indirildi."
ls -lh *.png
