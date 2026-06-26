/**
 * ============================================
 * TELEGRAM PM2 MONITORING BOT
 * Single File Implementation
 * ============================================
 */

const TelegramBot = require('node-telegram-bot-api');
const pm2 = require('pm2');

// ============================================
// KONFIGURASI & SECURITY
// ============================================

// Token dari BotFather (@BotFather di Telegram)
const BOT_TOKEN = '';

// ID Admin (dapatkan dari: forward pesan ke @userinfobot)
const ADMIN_ID = ["12345678"]; // Ganti dengan ID Telegram Anda

// Buat instance bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ============================================
// MIDDLEWARE - Validasi User
// ============================================

/**
 * Middleware untuk validasi hanya ADMIN_ID yang bisa mengakses
 */
const isAuthorized = (userId) => {
  return ADMIN_ID.includes(userId.toString());
};

/**
 * Helper untuk menolak akses unauthorized
 */
const sendUnauthorized = (chatId) => {
  bot.sendMessage(
    chatId,
    '❌ Anda tidak berhak mengakses bot ini. Hanya admin yang diizinkan.'
  );
};

// ============================================
// PM2 INITIALIZATION
// ============================================

/**
 * Connect ke PM2 pada startup
 */
pm2.connect((err) => {
  if (err) {
    console.error('❌ Gagal connect ke PM2:', err);
    process.exit(2);
  }
  console.log('✅ PM2 connected successfully');
});

// Handle graceful shutdown
process.on('exit', () => {
  pm2.disconnect();
});

// ============================================
// HELPER FUNCTIONS - PM2 OPERATIONS
// ============================================

/**
 * Ambil daftar instance PM2
 */
const getProcessList = () => {
  return new Promise((resolve, reject) => {
    try {
      pm2.list((err, processes) => {
        if (err) reject(err);
        resolve(processes || []);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Ambil detail instance spesifik
 */
const getProcessDetails = (processName) => {
  return new Promise((resolve, reject) => {
    try {
      pm2.describe(processName, (err, processDescription) => {
        if (err) reject(err);
        
        // 👇 TAMBAH INI - DEBUG LOG
        if (processDescription && processDescription.length > 0) {
          console.log('🔍 DEBUG - Semua field process:');
          console.log(JSON.stringify(processDescription[0], null, 2));
        }
        // 👆 SELESAI
        
        resolve(processDescription && processDescription.length > 0 ? processDescription[0] : null);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Restart process
 */
const restartProcess = (processName) => {
  return new Promise((resolve, reject) => {
    try {
      pm2.restart(processName, (err, proc) => {
        if (err) reject(err);
        resolve(proc);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Stop process
 */
const stopProcess = (processName) => {
  return new Promise((resolve, reject) => {
    try {
      pm2.stop(processName, (err, proc) => {
        if (err) reject(err);
        resolve(proc);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Start process
 */
const startProcess = (processName) => {
  return new Promise((resolve, reject) => {
    try {
      pm2.start(processName, (err, proc) => {
        if (err) reject(err);
        resolve(proc);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Format bytes ke human-readable
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format uptime
 */
const formatUptime = (ms) => {
  if (!ms) return '0s';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Dapatkan emoji status
 */
const getStatusEmoji = (status) => {
  switch (status) {
    case 'online':
      return '🟢';
    case 'stopped':
      return '⚫';
    case 'stopping':
      return '🟡';
    case 'one-launch-status':
      return '🔴';
    default:
      return '⚪';
  }
};

// ============================================
// UI BUILDERS - Keyboard & Messages
// ============================================

/**
 * Main Menu Keyboard
 */
const getMainMenuKeyboard = () => {
  return {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📋 Daftar Instance', callback_data: 'list_instances:0' }],
        [{ text: '🔄 Restart Semua', callback_data: 'restart_all' }],
        [{ text: '⚠️ Cek Error Global', callback_data: 'check_errors' }],
      ],
    },
  };
};

/**
 * List Instances Keyboard (dengan pagination)
 */
const getInstancesListKeyboard = (processes, page = 0) => {
  const itemsPerPage = 5;
  const totalPages = Math.ceil(processes.length / itemsPerPage);
  const startIdx = page * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageProcesses = processes.slice(startIdx, endIdx);

  const keyboard = pageProcesses.map((proc) => [
    {
      text: `${getStatusEmoji(proc.pm2_env.status)} ${proc.name}`,
      callback_data: `view_instance:${proc.name}`,
    },
  ]);

  // Pagination buttons
  const paginationRow = [];
  if (page > 0) {
    paginationRow.push({ text: '⬅️ Sebelumnya', callback_data: `list_instances:${page - 1}` });
  }
  if (page < totalPages - 1) {
    paginationRow.push({ text: 'Selanjutnya ➡️', callback_data: `list_instances:${page + 1}` });
  }

  if (paginationRow.length > 0) {
    keyboard.push(paginationRow);
  }

  keyboard.push([{ text: '🔙 Kembali ke Menu', callback_data: 'main_menu' }]);

  return {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  };
};

/**
 * Instance Detail Keyboard
 */
const getInstanceDetailKeyboard = (processName) => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔄 Restart', callback_data: `action:restart:${processName}` },
          { text: '🛑 Stop', callback_data: `action:stop:${processName}` },
        ],
        [{ text: '▶️ Start', callback_data: `action:start:${processName}` }],
        [{ text: '📝 Lihat Logs', callback_data: `action:logs:${processName}` }],
        [{ text: '🚨 Error Logs', callback_data: `action:error_logs:${processName}` }],
        [{ text: '🔙 Kembali ke Daftar', callback_data: 'list_instances:0' }],
      ],
    },
  };
};

/**
 * Back Button Keyboard
 */
const getBackKeyboard = (backAction) => {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: '🔙 Kembali', callback_data: backAction }]],
    },
  };
};

/**
 * Format Instance Detail Message
 */
const formatInstanceDetail = (proc) => {
  const status = proc.pm2_env.status;
  const memory = proc.monit?.memory || 0;
  const cpu = proc.monit?.cpu || 0;
  const uptime = proc.pm2_env.exp_backoff_restart_delay
    ? formatUptime(Date.now() - proc.pm2_env.restart_time)
    : formatUptime(proc.pm2_env.created_at ? Date.now() - proc.pm2_env.created_at : 0);

  return (
    `📊 <b>Info Instance: ${proc.name}</b>\n\n` +
    `<b>Status:</b> ${getStatusEmoji(status)} ${status}\n` +
    `<b>CPU:</b> ${cpu}%\n` +
    `<b>Memory:</b> ${formatBytes(memory)}\n` +
    `<b>Path:</b> <code>${proc.pm2_env.pm_exec_path || 'N/A'}</code>\n` +
    `<b>Uptime:</b> ${uptime}\n` +
    `<b>Restart Count:</b> ${proc.pm2_env.restart_time || 0}\n` +
    `<b>User:</b> ${proc.pm2_env.USER || 'root'}\n`

  );
};

// ============================================
// BOT COMMAND HANDLERS
// ============================================

/**
 * Handler untuk /start dan /menu
 */
bot.onText(/^\/start$|^\/menu$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Validasi user
  if (!isAuthorized(userId)) {
    sendUnauthorized(chatId);
    return;
  }

  try {
    await bot.sendMessage(
      chatId,
      '👋 Halo! Saya asisten monitoring PM2 Anda.\nPilih menu di bawah ini:',
      getMainMenuKeyboard()
    );
  } catch (error) {
    console.error('❌ Error /start:', error);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menampilkan menu.');
  }
});

/**
 * Handler untuk /help
 */
bot.onText(/^\/help$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAuthorized(userId)) {
    sendUnauthorized(chatId);
    return;
  }

  const helpText = `
<b>📖 Bantuan PM2 Bot</b>

<b>Perintah Tersedia:</b>
/start - Tampilkan menu utama
/menu - Sama dengan /start
/help - Tampilkan bantuan ini
/status - Status semua instance

<b>Menu Interaktif:</b>
• 📋 Daftar Instance - Lihat semua process
• 🔄 Restart Semua - Restart semua process
• ⚠️ Cek Error Global - Cek error semua process

<b>Aksi Instance:</b>
• Restart - Restart instance terpilih
• Stop - Hentikan instance
• Start - Jalankan instance yang terhenti
• Lihat Logs - Tampilkan log terbaru
• Error Logs - Tampilkan error log

<b>⚠️ Perhatian:</b>
Bot ini hanya dapat diakses oleh admin yang authorized.
  `;

  bot.sendMessage(chatId, helpText, { parse_mode: 'HTML' });
});

/**
 * Handler untuk /status (quick status check)
 */
bot.onText(/^\/status$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAuthorized(userId)) {
    sendUnauthorized(chatId);
    return;
  }

  try {
    const processes = await getProcessList();
    const onlineCount = processes.filter((p) => p.pm2_env.status === 'online').length;
    const stoppedCount = processes.filter((p) => p.pm2_env.status === 'stopped').length;

    let statusText = `<b>🔍 Status Global PM2</b>\n\n`;
    statusText += `Total Process: ${processes.length}\n`;
    statusText += `🟢 Online: ${onlineCount}\n`;
    statusText += `⚫ Stopped: ${stoppedCount}\n\n`;

    processes.forEach((proc) => {
      statusText += `${getStatusEmoji(proc.pm2_env.status)} <b>${proc.name}</b> - ${proc.pm2_env.status}\n`;
    });

    bot.sendMessage(chatId, statusText, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('❌ Error /status:', error);
    bot.sendMessage(chatId, `❌ Gagal mengambil status: ${error.message}`);
  }
});

// ============================================
// CALLBACK QUERY HANDLERS
// ============================================

/**
 * Handle semua callback queries
 */
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;
  const data = query.data;

  // Validasi user
  if (!isAuthorized(userId)) {
    bot.answerCallbackQuery(query.id, {
      text: '❌ Anda tidak authorized',
      show_alert: true,
    });
    return;
  }

  try {
    // Acknowledge callback query
    bot.answerCallbackQuery(query.id);

    // ===== MAIN MENU =====
    if (data === 'main_menu') {
      await bot.editMessageText(
        '👋 Halo! Saya asisten monitoring PM2 Anda.\nPilih menu di bawah ini:',
        {
          chat_id: chatId,
          message_id: messageId,
          ...getMainMenuKeyboard(),
          parse_mode: 'HTML',
        }
      );
    }
    // ===== LIST INSTANCES =====
    else if (data.startsWith('list_instances:')) {
      const page = parseInt(data.split(':')[1]) || 0;
      const processes = await getProcessList();

      if (processes.length === 0) {
        await bot.editMessageText('❌ Tidak ada process yang tersedia.', {
          chat_id: chatId,
          message_id: messageId,
          ...getBackKeyboard('main_menu'),
        });
        return;
      }

      const text = `📋 <b>Daftar Instance PM2</b>\n\nPilih instance untuk kelola:`;
      await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        ...getInstancesListKeyboard(processes, page),
        parse_mode: 'HTML',
      });
    }
    // ===== VIEW INSTANCE DETAILS =====
    else if (data.startsWith('view_instance:')) {
      const processName = data.split(':')[1];

      try {
        const procDetails = await getProcessDetails(processName);

        if (!procDetails) {
          await bot.editMessageText(`❌ Instance "${processName}" tidak ditemukan.`, {
            chat_id: chatId,
            message_id: messageId,
            ...getBackKeyboard('list_instances:0'),
          });
          return;
        }

        const detailText = formatInstanceDetail(procDetails);
        await bot.editMessageText(detailText, {
          chat_id: chatId,
          message_id: messageId,
          ...getInstanceDetailKeyboard(processName),
          parse_mode: 'HTML',
        });
      } catch (error) {
        console.error(`❌ Error viewing instance ${processName}:`, error);
        await bot.editMessageText(`❌ Gagal mengambil detail: ${error.message}`, {
          chat_id: chatId,
          message_id: messageId,
          ...getBackKeyboard('list_instances:0'),
        });
      }
    }
    // ===== RESTART INSTANCE =====
    else if (data.startsWith('action:restart:')) {
      const processName = data.split(':')[2];

      try {
        await bot.editMessageText(`⏳ Restart instance "${processName}"...`, {
          chat_id: chatId,
          message_id: messageId,
        });

        await restartProcess(processName);

        const procDetails = await getProcessDetails(processName);
        const detailText = formatInstanceDetail(procDetails);

        await bot.editMessageText(`✅ Berhasil merestart instance "${processName}"!\n\n${detailText}`, {
          chat_id: chatId,
          message_id: messageId,
          ...getInstanceDetailKeyboard(processName),
          parse_mode: 'HTML',
        });
      } catch (error) {
        console.error(`❌ Error restarting ${processName}:`, error);
        await bot.editMessageText(
          `❌ Gagal restart instance: ${error.message}\n\n<i>Pastikan instance ada di PM2 list</i>`,
          {
            chat_id: chatId,
            message_id: messageId,
            ...getBackKeyboard(`view_instance:${processName}`),
            parse_mode: 'HTML',
          }
        );
      }
    }
    // ===== STOP INSTANCE =====
    else if (data.startsWith('action:stop:')) {
      const processName = data.split(':')[2];

      try {
        await bot.editMessageText(`⏳ Stop instance "${processName}"...`, {
          chat_id: chatId,
          message_id: messageId,
        });

        await stopProcess(processName);

        const procDetails = await getProcessDetails(processName);
        const detailText = formatInstanceDetail(procDetails);

        await bot.editMessageText(`✅ Berhasil menghentikan instance "${processName}"!\n\n${detailText}`, {
          chat_id: chatId,
          message_id: messageId,
          ...getInstanceDetailKeyboard(processName),
          parse_mode: 'HTML',
        });
      } catch (error) {
        console.error(`❌ Error stopping ${processName}:`, error);
        await bot.editMessageText(`❌ Gagal stop instance: ${error.message}`, {
          chat_id: chatId,
          message_id: messageId,
          ...getBackKeyboard(`view_instance:${processName}`),
        });
      }
    }
    // ===== START INSTANCE =====
    else if (data.startsWith('action:start:')) {
      const processName = data.split(':')[2];

      try {
        await bot.editMessageText(`⏳ Start instance "${processName}"...`, {
          chat_id: chatId,
          message_id: messageId,
        });

        await startProcess(processName);

        const procDetails = await getProcessDetails(processName);
        const detailText = formatInstanceDetail(procDetails);

        await bot.editMessageText(`✅ Berhasil menjalankan instance "${processName}"!\n\n${detailText}`, {
          chat_id: chatId,
          message_id: messageId,
          ...getInstanceDetailKeyboard(processName),
          parse_mode: 'HTML',
        });
      } catch (error) {
        console.error(`❌ Error starting ${processName}:`, error);
        await bot.editMessageText(`❌ Gagal start instance: ${error.message}`, {
          chat_id: chatId,
          message_id: messageId,
          ...getBackKeyboard(`view_instance:${processName}`),
        });
      }
    }
    // ===== VIEW LOGS =====

// ===== VIEW LOGS (Hanya Output Normal) =====
else if (data.startsWith('action:logs:')) {
    const processName = data.split(':')[2];
    const { exec } = require('child_process');
    
    // Gunakan flag --out agar hanya mengambil standard output (bukan error)
    exec(`pm2 logs "${processName}" --out --nostream --lines 30`, (error, stdout, stderr) => {
        const logContent = error ? "Gagal ambil logs" : (stdout || '[No logs available]');
        
        const escapeHtml = (text) => {
          return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        };
        
        // Terus di logs:
        bot.editMessageText(`📝 <b>Logs - ${processName}</b>\n\n<pre>${escapeHtml(logContent.substring(0, 3000))}</pre>`, {
            chat_id: chatId,
            message_id: messageId,
            ...getBackKeyboard(`view_instance:${processName}`),
            parse_mode: 'HTML',
        });
    });
}

// ===== VIEW ERROR LOGS (Hanya Error) =====
else if (data.startsWith('action:error_logs:')) {
    const processName = data.split(':')[2];
    const { exec } = require('child_process');


    // Gunakan flag --err agar hanya mengambil error output saja
    exec(`pm2 logs "${processName}" --err --nostream --lines 30`, (error, stdout, stderr) => {
        // Pada flag --err, output akan muncul di stdout dari command exec tersebut
        const errorContent = error ? "Gagal ambil error logs" : (stdout || '[No error logs]');
        
        const escapeHtml = (text) => {
          return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        };
        
        const errorMessage = `🚨 <b>Error Logs - ${processName}</b> (Last 30 lines)\n\n<pre>${escapeHtml(errorContent.substring(0, 3000) || '[No errors]')}</pre>`;

        bot.editMessageText(errorMessage, {
            chat_id: chatId,
            message_id: messageId,
            ...getBackKeyboard(`view_instance:${processName}`),
            parse_mode: 'HTML',
        });
    });
}


    // ===== RESTART ALL =====
    else if (data === 'restart_all') {
      try {
        await bot.editMessageText(`⏳ Merestart semua instance...`, {
          chat_id: chatId,
          message_id: messageId,
        });

        const processes = await getProcessList();
        for (const proc of processes) {
          try {
            await restartProcess(proc.name);
          } catch (e) {
            console.warn(`⚠️ Gagal restart ${proc.name}:`, e.message);
          }
        }

        await bot.editMessageText(`✅ Berhasil merestart ${processes.length} instance!`, {
          chat_id: chatId,
          message_id: messageId,
          ...getBackKeyboard('main_menu'),
        });
      } catch (error) {
        console.error('❌ Error restarting all:', error);
        await bot.editMessageText(`❌ Gagal restart semua: ${error.message}`, {
          chat_id: chatId,
          message_id: messageId,
          ...getBackKeyboard('main_menu'),
        });
      }
    }
    // ===== CHECK ERRORS =====
    else if (data === 'check_errors') {
      try {
        const processes = await getProcessList();
        const fs = require('fs');
        let errorReport = `<b>🚨 Error Report Global</b>\n\n`;

        let totalErrors = 0;

        processes.forEach((proc) => {
          const errPath = proc.pm2_env.pm_err_log_file_path;
          if (fs.existsSync(errPath)) {
            const content = fs.readFileSync(errPath, 'utf8');
            const lines = content.split('\n').filter((line) => line.trim().length > 0);
            if (lines.length > 0) {
              errorReport += `<b>${proc.name}</b>: ${lines.length} error(s)\n`;
              totalErrors += lines.length;
            }
          }
        });

        if (totalErrors === 0) {
          errorReport += '✅ Tidak ada error terdeteksi di semua instance!';
        }

        await bot.editMessageText(errorReport, {
          chat_id: chatId,
          message_id: messageId,
          ...getBackKeyboard('main_menu'),
          parse_mode: 'HTML',
        });
      } catch (error) {
        console.error('❌ Error checking errors:', error);
        await bot.editMessageText(`❌ Gagal cek error: ${error.message}`, {
          chat_id: chatId,
          message_id: messageId,
          ...getBackKeyboard('main_menu'),
        });
      }
    }
  } catch (error) {
    console.error('❌ Error in callback_query:', error);
    bot.answerCallbackQuery(query.id, {
      text: `❌ Error: ${error.message}`,
      show_alert: true,
    });
  }
});

// ============================================
// ERROR HANDLER & STARTUP
// ============================================

/**
 * Handle uncaught bot errors
 */
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message);
});

/**
 * Handle webhook errors
 */
bot.on('webhook_error', (error) => {
  console.error('❌ Webhook error:', error.message);
});

/**
 * Startup message
 */
console.log('🚀 PM2 Monitoring Bot started!');
console.log(`✅ Authorized Admin ID: ${ADMIN_ID}`);
console.log('Waiting for commands...');
