#!/bin/bash

echo "Menginstall PM2..."
if command -v pm2 &>/dev/null; then
    echo "PM2 sudah terinstall."
else
    npm install -g pm2 || { echo "Gagal menginstall PM2"; exit 1; }
    echo "PM2 berhasil diinstall."
fi


CONFIG_FILE="fe/src/lib/config.js"
if [ -f "$CONFIG_FILE" ]; then
    sed -i 's|export const BASE_URL = "http://localhost:5000/";|export const BASE_URL = "/";|' "$CONFIG_FILE" ||
    { echo "Gagal mengubah file config.js"; exit 1; }
    
else
    echo "File config.js tidak ditemukan."
    exit 1
fi

echo "Menghapus isi folder be/views..."
rm -rf be/views/

echo "Menginstall module React JS..."
(
    cd fe || exit
    npm install &&
    npm run build &&
    mv dist/ ../be/views || { echo "Gagal memindahkan build ke folder views"; exit 1; }
)


if [ -f "$CONFIG_FILE" ]; then
    sed -i 's|export const BASE_URL = "/";|export const BASE_URL = "http://localhost:5000/";|' "$CONFIG_FILE" ||
    { echo "Gagal mengembalikan file config.js ke pengaturan semula"; exit 1; }
    
fi

echo "Menginstall module Express..."
cd be || exit
npm install || { echo "Gagal menginstall dependencies Express"; exit 1; }


npm install nodemon concurrently

pm2 start server.js || { echo "Gagal memulai server dengan PM2"; exit 1; }

echo "Mendapatkan IP Address..."
IP_ADDRESS=$(hostname -I | awk '{print $1}')
if [ -z "$IP_ADDRESS" ]; then
    echo "Gagal mendapatkan IP Address, Tetapi Deployment berhasil dan bejalan pada port 5000"
    exit 1
else
    echo "Deployment berhasil. Buka browser di http://$IP_ADDRESS:5000"
fi
