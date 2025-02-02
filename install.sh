#!/bin/bash

echo "Memulai Instalasi MikroPay..."

apt update
apt install -y curl wget 

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

apt-get install gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update
apt-get install -y mongodb-org

systemctl start mongod

echo "Menginstall PM2..."

npm install -g pm2 
echo "PM2 berhasil diinstall."

CONFIG_FILE="fe/src/lib/config.js"

sed -i 's|export const BASE_URL = "http://localhost:5000/";|export const BASE_URL = "/";|' "$CONFIG_FILE" 

echo "Menghapus isi folder be/views..."
rm -rf be/views/*
mkdir -p be/views 

echo "Menginstall module React JS..."
cd fe 
npm install &&
npm run build &&
mv dist/* ../be/views 

cd ..
sed -i 's|export const BASE_URL = "/";|export const BASE_URL = "http://localhost:5000/";|' "$CONFIG_FILE" 

echo "Menginstall module Express..."
cd be 
cp .env.example .env 

cat <<EOF > .env
MONGO_URI=mongodb://localhost:27017/mikropay
# ---Opsional untuk JWT---
ACCESS_TOKEN_SECRET=free_palestine
REFRESH_TOKEN_SECRET=catisverycute
EOF

npm install 

npm install -g nodemon concurrently

pm2 start server.js 

echo "Mendapatkan IP Address..."
IP_ADDRESS=$(hostname -I | awk '{print $1}')
echo "Deployment berhasil. Buka browser di http://$IP_ADDRESS:5000"