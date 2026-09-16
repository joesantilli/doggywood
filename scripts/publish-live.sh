#!/bin/bash
set -euo pipefail
export PATH="/opt/cpanel/ea-nodejs22/bin:$PATH"
cd /home/doggywood/doggywood
git pull origin main
npm install
npx prisma migrate deploy
npm run build
mkdir -p tmp
touch tmp/restart.txt
chown -R doggywood:doggywood /home/doggywood/doggywood
echo "Live."
