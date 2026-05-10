const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let clientReady = false;

// Initialize WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('\n======================================================');
    console.log('📱 SCAN THIS QR CODE IN WHATSAPP TO LINK YOUR SERVER');
    console.log('======================================================\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    clientReady = true;
    console.log('✅ WhatsApp Web Client is successfully connected and ready to send messages!');
});

client.on('disconnected', (reason) => {
    clientReady = false;
    console.log('❌ WhatsApp Web Client disconnected:', reason);
});

// Start the client with error handling
client.initialize().catch(err => {
    console.error('🔴 [WHATSAPP FATAL ERROR] Failed to initialize client. Please restart the server or delete .wwebjs_auth folder if it persists.', err.message);
});

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

module.exports = {
  sendEnrollmentAdminAlert,
  sendEnrollmentUserAck,
  sendFeeReminder,
  sendPaymentConfirmationToAdmin
};
