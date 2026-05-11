const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');

let clientReady = false;
let lastQr = null;
let connectionStatus = 'initializing'; // initializing, waiting_for_qr, connecting, ready, disconnected

// Use a persistent path for authentication if provided (useful for Render/Docker)
const PERSISTENT_DIR = process.env.PERSISTENT_STORAGE_DIR || '.';
const authPath = path.join(PERSISTENT_DIR, '.wwebjs_auth');

// Initialize WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: authPath
    }),
    puppeteer: {
        headless: true,
        // Detect if we are on Render or in Production
        executablePath: (process.env.NODE_ENV === 'production' || process.env.RENDER)
            ? (process.env.CHROME_PATH || '/usr/bin/google-chrome-stable') 
            : undefined,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--hide-scrollbars',
            '--disable-notifications',
            '--disable-extensions',
            '--single-process'
        ]
    }
});

client.on('qr', (qr) => {
    lastQr = qr;
    connectionStatus = 'waiting_for_qr';
    console.log('\n======================================================');
    console.log('📱 SCAN THIS QR CODE IN WHATSAPP TO LINK YOUR SERVER');
    console.log('======================================================\n');
    qrcode.generate(qr, { small: true });

    // Fallback for cloud logs where terminal QR codes get mangled
    console.log('\n======================================================');
    console.log('⚠️ IF THE QR CODE ABOVE IS BROKEN OR SCRAMBLED:');
    console.log('Click this link to view a clean version in your browser:');
    console.log(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`);
    console.log('======================================================\n');
});

client.on('loading_screen', (percent, message) => {
    connectionStatus = 'connecting';
    console.log(`⏳ Loading WhatsApp: ${percent}% - ${message}`);
});

client.on('ready', () => {
    clientReady = true;
    lastQr = null;
    connectionStatus = 'ready';
    console.log('✅ WhatsApp Web Client is successfully connected and ready to send messages!');
});

client.on('authenticated', () => {
    connectionStatus = 'connecting';
    console.log('✅ WhatsApp Authenticated!');
});

client.on('auth_failure', msg => {
    connectionStatus = 'disconnected';
    console.error('❌ WhatsApp Authentication failure:', msg);
});

client.on('disconnected', (reason) => {
    clientReady = false;
    connectionStatus = 'disconnected';
    console.log('❌ WhatsApp Web Client disconnected:', reason);
});

// Start the client with a small delay to ensure the environment is ready
setTimeout(() => {
    console.log('⏳ Initializing WhatsApp client...');
    console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Render Detected: ${process.env.RENDER ? 'Yes' : 'No'}`);
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
        console.log(`   Chrome Path: ${process.env.CHROME_PATH || '/usr/bin/google-chrome-stable'}`);
    }

    client.initialize().then(() => {
        console.log('🏁 client.initialize() call completed (awaiting ready event)');
    }).catch(err => {
        console.error('🔴 [WHATSAPP FATAL ERROR] Failed to initialize client:', err.message);
        console.log('Check if Chrome/Chromium is installed and the executablePath is correct.');
    });
}, 5000); // 5 second delay

const sendWhatsAppMessage = async (to, message) => {
  if (!clientReady) {
    console.log(`[WhatsApp Not Ready] Attempted to send to ${to}, but client is not linked or ready yet.`);
    console.log(`Message was:\n${message}`);
    return false;
  }
  
  try {
    // Format the phone number correctly for whatsapp-web.js
    let number = to.replace(/[^0-9]/g, '');
    if (number.length === 10) {
        number = `91${number}`; // Default to Indian country code +91
    }
    const chatId = `${number}@c.us`;
    
    await client.sendMessage(chatId, message);
    console.log(`🟢 [WHATSAPP MESSAGE SENT] Successfully sent to: ${number}`);
    return true;
  } catch (error) {
    console.error(`🔴 [WHATSAPP ERROR] Failed to send message to ${to}:`, error);
    return false;
  }
};

const sendEnrollmentAdminAlert = async (details) => {
  const adminPhone = "+918469139655";
  const msg = `🚨 *New Enrollment Inquiry!*\n\n*Student:* ${details.studentName}\n*Grade:* ${details.grade}\n*Course:* ${details.course}\n*Parent:* ${details.parentName}\n*Phone:* ${details.phone}\n*Message:* ${details.message || 'None'}`;
  await sendWhatsAppMessage(adminPhone, msg);
};

const sendEnrollmentUserAck = async (details) => {
  const msg = `Hello ${details.parentName},\n\nThank you for choosing Educating Minds for ${details.studentName}'s academic journey! We have received your inquiry for ${details.grade} (${details.course}).\n\nOur academic counsellor will contact you shortly to schedule your FREE demo class.\n\nWarm Regards,\nEducating Minds Team`;
  await sendWhatsAppMessage(details.phone, msg);
};

const sendFeeReminder = async (student) => {
  const balance = student.total_fees - student.paid_fees;
  const paymentLink = `http://localhost:5173/payment?enrollmentId=${student.id}&amount=${balance}`;
  const msg = `Hello ${student.student_name},\n\nThis is an automated reminder that your fee balance of ₹${balance} is pending.\n\nPlease complete your payment securely using this link:\n${paymentLink}\n\nThank you!`;
  await sendWhatsAppMessage(student.phone, msg);
};

const sendPaymentConfirmationToAdmin = async (paymentDetails) => {
  const adminPhone = "+918469139655";
  const msg = `💰 *Payment Received!*\n\n*Student:* ${paymentDetails.studentName} (ID: ${paymentDetails.enrollmentId})\n*Amount:* ₹${paymentDetails.amount}\n\nPlease confirm this payment and update the records in the Admin Dashboard.`;
  await sendWhatsAppMessage(adminPhone, msg);
};

const getStatus = () => ({
  ready: clientReady,
  status: connectionStatus,
  qrLink: lastQr ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(lastQr)}` : null
});

module.exports = {
  sendEnrollmentAdminAlert,
  sendEnrollmentUserAck,
  sendFeeReminder,
  sendPaymentConfirmationToAdmin,
  getStatus
};
