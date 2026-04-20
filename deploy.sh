#!/bin/bash
set -e

echo "==> Building client..."
cd "$(dirname "$0")/fe"
npm run build

echo "==> Deploying to backend..."
cp -rf ./dist/* ../be/src/public/

echo "==> Reloading server..."
pm2 reload bo

echo "==> Done!"
