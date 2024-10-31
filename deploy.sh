#!/bin/bash

echo "Menginstall PM2..."

npm install -g pm2 || { echo "Gagal menginstall PM2"; exit 1; }
echo "PM2 berhasil diinstall."

CONFIG_FILE="fe/src/lib/config.js"

sed -i 's|export const BASE_URL = "http://localhost:5000/";|export const BASE_URL = "/";|' "$CONFIG_FILE" || 
{ echo "Gagal mengubah file config.js"; exit 1; }

echo "Menghapus isi folder be/views..."
rm -rf be/views/*
mkdir -p be/views 

echo "Menginstall module React JS..."
cd fe || exit
npm install &&
npm run build &&
mv dist/* ../be/views || { echo "Gagal memindahkan build ke folder views"; exit 1; }

cd ..
sed -i 's|export const BASE_URL = "/";|export const BASE_URL = "http://localhost:5000/";|' "$CONFIG_FILE" || 
{ echo "Gagal mengembalikan file config.js ke pengaturan semula"; exit 1; }

echo "Menginstall module Express..."
cd be || exit
npm install || { echo "Gagal menginstall dependencies Express"; exit 1; }

npm install -g nodemon concurrently

pm2 start server.js || { echo "Gagal memulai server dengan PM2"; exit 1; }

echo "Mendapatkan IP Address..."
IP_ADDRESS=$(hostname -I | awk '{print $1}')
echo "Deployment berhasil. Buka browser di http://$IP_ADDRESS:5000"