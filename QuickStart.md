# ⚡ Quick Start Guide

Panduan setup cepat PM2-Telegram Bot dalam 5 menit.

---

## 🎯 Prerequisites

Sebelum mulai, pastikan Anda punya:
- ✅ Node.js versi 14+ installed
- ✅ PM2 installed globally: `npm install -g pm2`
- ✅ Telegram account
- ✅ Terminal/Command prompt access

---

## 📱 Step 1: Create Telegram Bot (2 menit)

### 1.1 Get Bot Token

1. Buka **Telegram** app atau web
2. Cari user **@BotFather**
3. Kirim command: `/newbot`

```
Alright a new bot. How are we going to call it? 
Please choose a name for your bot.

(user sends bot name)
→ "pm2-telegram-bot"

Good. Now let's choose a username for your bot. 
It must end in `bot`. For example, my name is 
userinfobot but you probably want something more 
creative. Just saying. If you can't think of 
anything, just add some random numbers.

(user sends username)
→ "my_pm2_bot"
```

4. **Copy the token** yang diberikan:
```
Done! Congratulations on your new bot. You will find it at t.me/my_pm2_bot. 
You can now add a description, about section and profile picture for your bot, 
see /help for a list of commands.

Here's your token, keep it safe and store it securely:
123456789:ABCdefGHIjklmnoPQRstuvWXYZabcdefg
```

### 1.2 Get Your User ID

1. Cari user **@userinfobot**
2. Kirim any message
3. **Copy your User ID**:
```
👤 User Information:

You: @yourname
Name: Your Full Name
User ID: 987654321
...
```

---

## 💻 Step 2: Clone & Install (2 menit)

### 2.1 Clone Repository

```bash
git clone https://github.com/yourusername/pm2-telegram.git
cd pm2-telegram
```

Atau download ZIP dan extract.

### 2.2 Install Dependencies

```bash
npm install
```

Akan menginstall:
- `node-telegram-bot-api`
- `pm2`

### 2.3 Setup Configuration

**Option A: Direct Edit (Fastest)**

Buka `index.js` dan cari section ini:

```javascript
const BOT_TOKEN = '';
const ADMIN_ID = ["12345678"];
```

Ganti dengan:

```javascript
const BOT_TOKEN = '123456789:ABCdefGHIjklmnoPQRstuvWXYZabcdefg';
const ADMIN_ID = ["987654321"];
```

**Option B: Environment Variables (Recommended)**

1. Create file `.env`:
```bash
cp .env.example .env
```

2. Edit `.env`:
```
BOT_TOKEN=123456789:ABCdefGHIjklmnoPQRstuvWXYZabcdefg
ADMIN_ID=987654321
```

3. Update `index.js` untuk gunakan env:
```javascript
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ADMIN_ID = (process.env.ADMIN_ID || '').split(',');
```

---

## 🚀 Step 3: Start the Bot (1 menit)

### Option 1: Direct Start

```bash
node index.js
```

Output:
```
✅ PM2 connected successfully
🚀 PM2 Monitoring Bot started!
✅ Authorized Admin ID: 987654321
Waiting for commands...
```

### Option 2: Start with PM2 (Recommended)

```bash
pm2 start index.js --name "pm2-telegram"
```

Verify:
```bash
pm2 status
```

View logs:
```bash
pm2 logs pm2-telegram
```

---

## 🎮 Step 4: Test the Bot (In Telegram)

### 4.1 Open Telegram

1. Search for bot username: `@my_pm2_bot` (ganti dengan username Anda)
2. Atau open link: `t.me/my_pm2_bot`
3. Click **Start** button atau send `/start`

### 4.2 Verify It Works

Kirim command:
```
/start
```

Expected response:
```
👋 Halo! Saya asisten monitoring PM2 Anda.
Pilih menu di bawah ini:

[📋 Daftar Instance] [🔄 Restart Semua] [⚠️ Cek Error Global]
```

Kirim:
```
/status
```

Expected response:
```
🔍 Status Global PM2

Total Process: X
🟢 Online: X
⚫ Stopped: X

(list of processes)
```

---

## ✅ You're Done!

Bot Anda sekarang aktif dan siap digunakan. 🎉

---

## 🎯 Next Steps

### 1. Add More Admin Users

Edit `.env` atau `index.js`:

```javascript
// Sebelum:
const ADMIN_ID = ["987654321"];

// Sesudah (untuk 3 admin):
const ADMIN_ID = ["987654321", "111111111", "222222222"];
```

Restart bot:
```bash
pm2 restart pm2-telegram
```

### 2. Monitor Processes

Kirim `/status` setiap hari untuk cek kesehatan.

### 3. Setup PM2 Startup

Agar bot auto-start saat server reboot:

```bash
pm2 startup
pm2 save
```

### 4. Enable Bot Error Logging

```bash
pm2 logs pm2-telegram
```

---

## 🆘 Troubleshooting

### Bot tidak merespons

**Check 1: Token valid?**
```bash
# Test token (replace YOUR_TOKEN)
curl "https://api.telegram.org/botYOUR_TOKEN/getMe"
```

Should return:
```json
{"ok":true,"result":{"id":123456789,"is_bot":true,...}}
```

**Check 2: Bot running?**
```bash
ps aux | grep "node index.js"
```

**Check 3: Admin ID correct?**
- Verify user ID dengan @userinfobot
- Pastikan ID dalam quotes: `"987654321"`

### "Unauthorized" Error

Bot: `❌ Anda tidak berhak mengakses bot ini. Hanya admin yang diizinkan.`

**Solution:**
1. Double-check admin ID
2. Make sure ID is string not number
3. Restart bot after config change

### Bot crashes

**Check logs:**
```bash
pm2 logs pm2-telegram
```

**Common issues:**
- PM2 not running: `pm2 start your_app.js`
- Invalid config: Check token and admin ID
- Port conflict: Change polling settings

---

## 📚 Learn More

- Full documentation: [README.md](README.md)
- All features: [FEATURES.md](FEATURES.md)
- Commands reference: [README.md#commands](README.md#-commands)
- Security tips: [README.md#security](README.md#-security-best-practices)

---

## 🔗 Useful Links

- [Telegram BotFather](https://t.me/botfather)
- [Telegram userinfobot](https://t.me/userinfobot)
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- [PM2 Documentation](https://pm2.keymetrics.io)
- [PM2 API Reference](https://pm2.keymetrics.io/docs/usage/api/)

---

## 💡 Tips & Tricks

### Quick Commands
```bash
# View bot status
pm2 info pm2-telegram

# Stop bot
pm2 stop pm2-telegram

# Restart bot
pm2 restart pm2-telegram

# Delete bot
pm2 delete pm2-telegram

# View real-time logs
pm2 logs pm2-telegram --lines 100 --follow
```

### Environment Variables Best Practice
```bash
# Create .env file
echo "BOT_TOKEN=your_token" > .env
echo "ADMIN_ID=your_id" >> .env

# Add to .gitignore
echo ".env" >> .gitignore

# Never commit .env file!
```

### Multiple Environments
```bash
# Production
BOT_TOKEN=prod_token pm2 start index.js --name "pm2-telegram-prod"

# Staging
BOT_TOKEN=staging_token pm2 start index.js --name "pm2-telegram-staging"
```

---

## 🎊 Congratulations!

Your PM2 Monitoring Bot is live! 🚀

Now you can monitor your servers directly from Telegram anywhere, anytime.

---

**Need help?** Check [FEATURES.md](FEATURES.md) untuk complete feature guide atau buka issue di GitHub.
