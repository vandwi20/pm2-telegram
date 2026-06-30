# PM2-Telegram Bot - Complete Features Guide

Dokumentasi lengkap semua fitur dan kemampuan bot PM2-Telegram.

---

## 📋 Daftar Fitur

### 1. **Main Menu** 🏠

Menu utama adalah starting point untuk semua interaksi dengan bot.

```
👋 Halo! Saya asisten monitoring PM2 Anda.
Pilih menu di bawah ini:

[📋 Daftar Instance]  [🔄 Restart Semua]  [⚠️ Cek Error Global]
```

**Cara Akses:**
- Kirim `/start`
- Kirim `/menu`
- Klik "🔙 Kembali ke Menu" dari halaman manapun

---

### 2. **📋 Daftar Instance (List All Processes)**

Menampilkan semua PM2 processes yang aktif dengan status indicator.

**Fitur:**
- ✅ Menampilkan nama process dengan emoji status
- ✅ Pagination otomatis (5 process per halaman)
- ✅ Navigasi prev/next untuk banyak processes
- ✅ Klik untuk melihat detail process

**Emoji Status:**
- 🟢 `online` - Process sedang berjalan
- ⚫ `stopped` - Process sudah dihentikan
- 🟡 `stopping` - Process sedang dihentikan
- 🔴 `one-launch-status` - Process error/restart
- ⚪ `unknown` - Status tidak diketahui

**Contoh:**
```
📋 Daftar Instance PM2

Pilih instance untuk kelola:

[🟢 api-server]
[🟢 websocket-app]
[⚫ backup-worker]
[🟢 cache-service]
[🟢 queue-handler]

[⬅️ Sebelumnya]  [Selanjutnya ➡️]
[🔙 Kembali ke Menu]
```

---

### 3. **📊 Instance Details (Lihat Detail Process)**

Menampilkan informasi lengkap tentang process tertentu.

**Informasi yang Ditampilkan:**

| Info | Keterangan |
|------|-----------|
| **Status** | Kondisi process (online/stopped) |
| **CPU** | Penggunaan CPU dalam persen (%) |
| **Memory** | Penggunaan RAM (Auto-format: B, KB, MB, GB) |
| **Path** | Lokasi file executable |
| **Uptime** | Lama process berjalan (format readable) |
| **Restart Count** | Berapa kali process di-restart |
| **User** | User yang menjalankan process |

**Contoh Output:**
```
📊 Info Instance: api-server

Status: 🟢 online
CPU: 24%
Memory: 342.5 MB
Path: /home/user/apps/api/server.js
Uptime: 15d 3h
Restart Count: 2
User: appuser

[🔄 Restart]  [🛑 Stop]
[▶️ Start]
[📝 Lihat Logs]  [🚨 Error Logs]
[🔙 Kembali ke Daftar]
```

**Format Uptime:**
- Detik: `45s`
- Menit: `12m 34s`
- Jam: `5h 23m`
- Hari: `3d 5h`

**Format Memory:**
- `1024 B` (Bytes)
- `512 KB` (Kilobytes)
- `256.5 MB` (Megabytes)
- `2.3 GB` (Gigabytes)

---

### 4. **🔄 Restart Process**

Restart process yang dipilih dan tampilkan status barunya.

**Cara Kerja:**
1. Klik tombol [🔄 Restart] di halaman detail process
2. Bot menampilkan status "⏳ Restart instance..."
3. Process di-restart via PM2
4. Detail process diupdate secara otomatis
5. Tampilkan pesan sukses dengan info terbaru

**Contoh:**
```
✅ Berhasil merestart instance "api-server"!

📊 Info Instance: api-server

Status: 🟢 online
CPU: 8%
Memory: 145.2 MB
...
```

---

### 5. **🛑 Stop Process**

Menghentikan process yang dipilih.

**Cara Kerja:**
1. Klik tombol [🛑 Stop] di halaman detail process
2. Bot menampilkan status "⏳ Stop instance..."
3. Process dihentikan via PM2
4. Status berubah menjadi ⚫ `stopped`
5. Proses masih bisa di-start ulang

**Contoh:**
```
✅ Berhasil menghentikan instance "cache-service"!

📊 Info Instance: cache-service

Status: ⚫ stopped
CPU: 0%
Memory: 0 B
...
```

---

### 6. **▶️ Start Process**

Menjalankan process yang sudah dihentikan.

**Cara Kerja:**
1. Klik tombol [▶️ Start] di halaman detail process
2. Bot menampilkan status "⏳ Start instance..."
3. Process dijalankan via PM2
4. Status berubah menjadi 🟢 `online`
5. Detail diupdate (CPU, Memory, Uptime reset)

**Contoh:**
```
✅ Berhasil menjalankan instance "cache-service"!

📊 Info Instance: cache-service

Status: 🟢 online
CPU: 5%
Memory: 89.3 MB
Uptime: 3s
...
```

---

### 7. **📝 Lihat Logs (View Standard Output)**

Menampilkan log output normal dari process (stdout).

**Fitur:**
- ✅ Menampilkan 30 baris log terakhir
- ✅ Hanya standard output (bukan error)
- ✅ Escape HTML untuk keamanan
- ✅ Max 3000 karakter (untuk kesesuaian Telegram)

**Contoh:**
```
📝 Logs - api-server

Server started on port 3000
Database connected
Ready to accept requests
[Request] GET /api/users
[Request] POST /api/users
[Response] 200 OK
...
```

---

### 8. **🚨 Error Logs (View Error Output)**

Menampilkan log error dari process (stderr).

**Fitur:**
- ✅ Menampilkan 30 baris error terakhir
- ✅ Hanya error output
- ✅ Membantu debugging masalah
- ✅ Jika tidak ada error: `[No error logs]`

**Contoh:**
```
🚨 Error Logs - api-server (Last 30 lines)

[Error] Connection timeout on DB
[Error] EADDRINUSE: address already in use :::3000
[Warning] Deprecation warning: ...
...
```

---

### 9. **🔄 Restart Semua (Restart All Processes)**

Restart semua process sekaligus dengan satu tombol.

**Cara Kerja:**
1. Klik [🔄 Restart Semua] dari main menu
2. Bot menampilkan "⏳ Merestarting all instances..."
3. Bot iterate semua process dan restart satu per satu
4. Error pada process individual tidak menghentikan operasi
5. Tampilkan jumlah process yang berhasil di-restart

**Contoh:**
```
✅ Berhasil merestart 5 instance!

[🔙 Kembali ke Menu]
```

---

### 10. **⚠️ Cek Error Global (Check All Errors)**

Menampilkan ringkasan error dari semua process.

**Fitur:**
- ✅ Scan error log dari semua process
- ✅ Hitung jumlah error per process
- ✅ Jika tidak ada error: `✅ Tidak ada error terdeteksi`
- ✅ List process dengan error count

**Contoh - Ada Errors:**
```
🚨 Error Report Global

api-server: 12 error(s)
worker-service: 3 error(s)
cache-service: 5 error(s)

[🔙 Kembali ke Menu]
```

**Contoh - No Errors:**
```
🚨 Error Report Global

✅ Tidak ada error terdeteksi di semua instance!

[🔙 Kembali ke Menu]
```

---

## 💬 Commands

### `/start`
Membuka main menu utama bot.

```
/start
↓
[Menu ditampilkan dengan 3 opsi utama]
```

### `/menu`
Alias dari `/start` - membuka menu utama.

```
/menu
↓
[Menu ditampilkan dengan 3 opsi utama]
```

### `/status`
Quick status check semua process tanpa menu.

```
/status
↓
Status Global PM2

Total Process: 5
🟢 Online: 4
⚫ Stopped: 1

🟢 api-server - online
🟢 websocket-app - online
⚫ backup-worker - stopped
🟢 cache-service - online
🟢 queue-handler - online
```

### `/help`
Menampilkan bantuan lengkap dan daftar command.

```
/help
↓
📖 Bantuan PM2 Bot

Perintah Tersedia:
/start - Tampilkan menu utama
/menu - Sama dengan /start
/help - Tampilkan bantuan ini
/status - Status semua instance

Menu Interaktif:
• 📋 Daftar Instance - Lihat semua process
• 🔄 Restart Semua - Restart semua process
• ⚠️ Cek Error Global - Cek error semua process

Aksi Instance:
• Restart - Restart instance terpilih
• Stop - Hentikan instance
• Start - Jalankan instance yang terhenti
• Lihat Logs - Tampilkan log terbaru
• Error Logs - Tampilkan error log
```

---

## 🛡️ Security Features

### Authorization & Authentication
- ✅ User ID whitelist (`ADMIN_ID` array)
- ✅ Setiap request divalidasi
- ✅ Pesan "Unauthorized" untuk non-admin
- ✅ No command logging of sensitive data

### Protected Operations
- ✅ Hanya admin yang bisa restart/stop/start
- ✅ Hanya admin yang bisa lihat logs
- ✅ Hanya admin yang bisa cek error

### Data Safety
- ✅ HTML escape untuk log output
- ✅ Safe handling of process names
- ✅ Error messages tidak expose system details

---

## 🎯 User Experience Features

### Pagination
- Otomatis split besar process list
- 5 process per halaman
- Previous/Next buttons untuk navigasi

### Status Indicators
- Emoji untuk quick visual status
- Color-coded information
- Clear action feedback

### Error Handling
- Graceful error messages
- Suggestion untuk troubleshooting
- Back button untuk recovery

### Responsive Design
- Works on mobile Telegram app
- Works on desktop Telegram
- Optimized button layout

---

## 📊 Information Display

### Process Metrics
| Metric | Source | Update |
|--------|--------|--------|
| CPU % | PM2 Monitor | Real-time |
| Memory | PM2 Monitor | Real-time |
| Status | PM2 | Real-time |
| Uptime | PM2 | Real-time |
| Path | PM2 Config | On request |
| User | PM2 Config | On request |

### Log Display
- Last 30 lines captured
- Auto-formatted untuk readability
- Max 3000 chars per message (Telegram limit)

---

## 🔄 State Management

Bot menggunakan callback queries untuk state management:
- Main Menu → List → Details → Actions
- Semua state embedded dalam callback_data
- Stateless design (tidak perlu database)
- Easy back navigation anytime

---

## ⚡ Performance Optimization

- ✅ Efficient PM2 polling
- ✅ Minimal API calls
- ✅ Cached process list dalam pagination
- ✅ Graceful timeout handling
- ✅ Non-blocking operations

---

## 🚀 Best Practices

### Monitoring Strategy
1. Daily `/status` check
2. Weekly error report review
3. Monitor restart counts
4. Check memory trends

### Process Management
1. Use descriptive process names
2. Set up log rotation
3. Monitor CPU usage patterns
4. Keep restart counts low

### Bot Maintenance
1. Keep bot running 24/7
2. Monitor bot health
3. Check polling errors
4. Update dependencies regularly

---

**Untuk pertanyaan lebih lanjut, silakan baca [README.md](README.md)**
