# PM2-Telegram 🤖

> **Interactive Telegram Bot for Real-Time PM2 Process Monitoring and Management**

An easy-to-use Telegram bot that integrates seamlessly with PM2, enabling you to monitor, manage, and receive real-time notifications for all your server processes directly from Telegram.

---

## ✨ Features

### 📋 Process Management
- **View All Instances** - Display list of all PM2 processes with status indicators
- **Instance Details** - Check detailed information including CPU, memory usage, uptime, and more
- **Start/Stop/Restart** - Control individual processes directly from Telegram
- **Restart All** - Restart all processes with a single command
- **Pagination Support** - Navigate through large process lists easily

### 🔍 Monitoring & Logs
- **Real-Time Status** - Check the current status of all your processes
- **View Logs** - Display standard output logs (last 30 lines)
- **Error Logs** - View error logs for debugging purposes
- **Global Error Report** - Check errors across all instances at once

### 🛡️ Security
- **Admin Authorization** - Only authorized users can access the bot
- **User ID Validation** - Whitelist specific Telegram users
- **Secure Token Management** - Protect your bot token with environment variables

### 💡 User Experience
- **Inline Keyboards** - Easy-to-use interactive buttons (no need to memorize commands)
- **Status Emojis** - Visual indicators for process status
- **Formatted Output** - Clean and readable message formatting
- **Error Handling** - Comprehensive error messages and feedback

### ⚡ Commands
- `/start` - Launch the main menu
- `/menu` - Open control panel
- `/status` - Quick status overview of all processes
- `/help` - Display help and command information

---

## 📋 Requirements

- **Node.js** `>=14.x`
- **PM2** `>=5.x` (installed globally)
- **Telegram Account** with BotFather bot token
- **Admin ID** from Telegram (your user ID)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/vandwi20/pm2-telegram
cd pm2-telegram
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- `node-telegram-bot-api` - Telegram bot API client
- `pm2` - PM2 process manager

### 3. Get Your Telegram Bot Token

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the **HTTP API Token** provided

### 4. Get Your Telegram User ID

1. Forward any message to **@userinfobot**
2. Copy your **User ID** from the response

---

## ⚙️ Configuration

### 1. Edit the Configuration

Open `index.js` and update these values:

```javascript
// Token dari BotFather
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';

// ID Admin (dapatkan dari @userinfobot)
const ADMIN_ID = ["123456789", "987654321"]; // Tambahkan lebih banyak ID jika diperlukan
```

**💡 Pro Tip:** Use environment variables for better security:

```javascript
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ADMIN_ID = (process.env.ADMIN_ID || '').split(',');
```

Then create a `.env` file:
```bash
BOT_TOKEN=your_token_here
ADMIN_ID=123456789,987654321
```

### 2. PM2 Configuration

Ensure PM2 is properly configured:

```bash
# Make sure PM2 is running
pm2 status

# If not started, you may need to start PM2 first
pm2 start your_app.js
```

---

## 🎮 Usage

### Starting the Bot

```bash
# Simple start
node index.js

# Or with PM2 itself
pm2 start index.js --name "pm2-telegram"

# Start with logs
pm2 start index.js --name "pm2-telegram" --watch
```

### Using the Bot

1. **Open Telegram** and find your bot by its username
2. **Send `/start`** to open the main menu
3. **Use inline buttons** to navigate and control processes

### Menu Navigation

```
👋 Main Menu
├── 📋 Daftar Instance → List all processes
│   ├── (Select instance)
│   │   ├── 🔄 Restart
│   │   ├── 🛑 Stop
│   │   ├── ▶️ Start
│   │   ├── 📝 View Logs
│   │   └── 🚨 Error Logs
│   └── Pagination (Previous/Next)
│
├── 🔄 Restart Semua → Restart all processes
└── ⚠️ Cek Error Global → View all errors
```

---

## 📊 Instance Details

When viewing instance details, you'll see:

- **Status** - Current state (online, stopped, etc.)
- **CPU Usage** - Real-time CPU percentage
- **Memory Usage** - RAM consumption in human-readable format
- **File Path** - Location of the executable
- **Uptime** - How long the process has been running
- **Restart Count** - Number of restarts
- **User** - Process owner

Example:
```
📊 Info Instance: api-server

Status: 🟢 online
CPU: 12%
Memory: 145.5 MB
Path: /home/user/projects/api/server.js
Uptime: 5d 8h
Restart Count: 2
User: root
```

---

## 🔐 Security Best Practices

### 1. Protect Your Bot Token
- **Never commit** your bot token to version control
- Use `.env` file or environment variables
- Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

### 2. Whitelist Admin IDs
- Only add trusted Telegram user IDs
- Test with your own ID first
- Remove IDs when employees leave

### 3. Regular Updates
- Keep `node-telegram-bot-api` and `pm2` updated
- Subscribe to security advisories

### 4. Log Monitoring
- Monitor bot logs for suspicious activity
- Check PM2 logs for crashes

---

## 📁 File Structure

```
pm2-telegram/
├── index.js              # Main bot file (single file implementation)
├── package.json          # Project dependencies
├── README.md             # This file
├── .env.example          # Example environment variables
└── .gitignore            # Git ignore rules
```

### Code Organization in `index.js`

```javascript
// Configuration & Security
// - BOT_TOKEN setup
// - ADMIN_ID whitelist
// - Authorization middleware

// PM2 Initialization
// - Connection to PM2
// - Graceful shutdown

// Helper Functions
// - getProcessList()
// - getProcessDetails()
// - restartProcess()
// - stopProcess()
// - startProcess()
// - formatBytes()
// - formatUptime()

// UI Builders
// - getMainMenuKeyboard()
// - getInstancesListKeyboard()
// - getInstanceDetailKeyboard()
// - formatInstanceDetail()

// Command Handlers
// - /start & /menu
// - /help
// - /status

// Callback Handlers
// - List instances
// - View details
// - Control actions
// - View logs

// Error Handlers & Startup
```

---

## 🛠️ Troubleshooting

### Bot doesn't respond to commands

**Problem:** Bot is running but not responding
- Verify bot token is correct in code
- Check Telegram bot @BotFather for the right token
- Ensure internet connection is stable

```bash
# Test token
curl "https://api.telegram.org/bot<BOT_TOKEN>/getMe"
```

### "Unauthorized" message appears

**Problem:** User ID is not in whitelist
- Verify your Telegram ID using @userinfobot
- Make sure ID is added to `ADMIN_ID` array as string
- Restart the bot after changing config

```javascript
// ❌ Wrong
const ADMIN_ID = [123456789];

// ✅ Correct
const ADMIN_ID = ["123456789"];
```

### Cannot connect to PM2

**Problem:** PM2 is not responding
- Check if PM2 is running:
  ```bash
  pm2 status
  ```
- Ensure PM2 is installed globally:
  ```bash
  npm install -g pm2
  ```
- Check PM2 logs:
  ```bash
  pm2 logs
  ```

### Logs are empty or not showing

**Problem:** Cannot retrieve process logs
- Make sure the process exists in PM2:
  ```bash
  pm2 list
  ```
- Check log file permissions:
  ```bash
  ls -la ~/.pm2/logs/
  ```
- Verify log file path in PM2 config

### Instance actions fail (restart, stop, start)

**Problem:** Action buttons don't work
- Verify process name is correct
- Check if process is managed by PM2:
  ```bash
  pm2 describe <process-name>
  ```
- Review bot logs for detailed errors

---

## 📈 Monitoring Tips

### Regular Health Checks
- Use `/status` command daily to monitor overall health
- Check error logs weekly for issues
- Monitor CPU and memory trends

### Process Management
- Set up PM2 ecosystem file for auto-restart
- Use PM2's watch mode for development
- Implement proper error logging in your apps

### Bot Health
- Monitor bot polling for errors:
  ```bash
  pm2 logs pm2-telegram
  ```
- Set up uptime monitoring for the bot itself
- Keep logs clean by rotating them

---

## 🔄 Updating PM2 Processes

To update process information in the bot:

```bash
# Restart the bot to refresh PM2 connection
pm2 restart pm2-telegram

# Or stop and start fresh
pm2 delete pm2-telegram
pm2 start index.js --name "pm2-telegram"
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) - Telegram bot API wrapper
- [PM2](https://pm2.keymetrics.io/) - Node.js process manager
- Telegram for providing an excellent bot API

---

## 📞 Support & Contact

- **Issues:** Report bugs via GitHub Issues
- **Discussions:** Start a discussion for questions
- **Email:** contact@example.com (optional)

---

## 🎯 Roadmap

Future features planned:

- [ ] Metrics history/graphing
- [ ] Webhook alerts for critical events
- [ ] Multiple environment support
- [ ] Custom alert thresholds
- [ ] Docker support
- [ ] Web dashboard
- [ ] Multi-language support
- [ ] Rate limiting for actions

---

## ⚡ Quick Start Cheatsheet

```bash
# Installation
git clone <repo> && cd pm2-telegram
npm install

# Configuration
# Edit index.js: BOT_TOKEN and ADMIN_ID

# Start
node index.js

# Or with PM2
pm2 start index.js --name "pm2-telegram"

# View logs
pm2 logs pm2-telegram

# Test bot
# Send /start to your Telegram bot
```

---

**Made with ❤️ for DevOps engineers and developers**
