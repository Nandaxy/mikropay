# MikroPay

MikroPay adalah sebuah aplikasi yang berfungsi sebagai gateway pembayaran untuk integrasi dengan perangkat **MikroTik v7** menggunakan API Tripay. Aplikasi ini memungkinkan pengguna untuk mengelola pengguna hotspot, profil PPPoE, dan pembayaran dengan cara yang sederhana dan aman.

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**:  React.js, TailwindCSS, ShadcnUI
- **Integrasi Pembayaran**: API Tripay
- **RouterOS API**: Fitur Rest API Bawaan ROS V.7
- **Autentikasi**: JWT (JSON Web Token)
- **Database**: MongoDB untuk menyimpan data pengguna, profil PPPoE, profil Hotspot dan transaksi.

## Persyaratan Sistem

- **Node.js**: v16 atau lebih baru
- **MongoDB**: v4.4 atau lebih baru
- **MikroTik RouterOS**: v7 atau lebih baru
- **Tripay API**: Akun Tripay

## Instalasi

1. **Clone repository**:
    ```bash
    git clone https://github.com/Nandaxy/mikropay
    cd mikropay
    ```


2. **Konfigurasi environment**:
   Masuk ke folder be dan buat file `.env` dengan menggunakan file `.env.example`.
   ```
   cd be
   cp env.example .env
   nano .env
   ```

   Masukan data berikut ke dalam file `.env`:
   
    ```
    MONGO_URI=
    ADMIN_USERNAME=
    ADMIN_PASSWORD=
    # ---Opsional untuk JWT---
    ACCESS_TOKEN_SECRET=free_palestine
    REFRESH_TOKEN_SECRET=cat
    ```


3. **Deploy aplikasi**:
    ```bash
    cd ..
    bash deploy.sh

    ```
    Instalasi Selesai , Buka http://localhost:3000
