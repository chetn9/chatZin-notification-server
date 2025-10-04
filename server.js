// server.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// ✅ Put your service account JSON file here
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Endpoint to send notification
app.post('/send-notification', async (req, res) => {
  try {
    const { fcmToken, title, body, data } = req.body;

    console.log("BODY", req.body);
    
    if (!fcmToken) {
      return res.status(400).json({ error: 'FCM token required' });
    }
    
    const message = {
    //   token: "d529HI_VScetB71icqLG9L:APA91bHmvEmryM2Ap6H-syfzoynd-Xbt_xLG4XU1hOUJ-dc7qimGvfu1k0RsazeF38kOCDaE_HNPDR06_CN7ZfxWb-30hLgOmrzZ_AXA2UlZSd2BjeUhRsQ",
    //  token: "f-esX_4zSNCJM3148yIlCc:APA91bERqxU3EU5RDdj48Lxrhj-xBIGddsAMRHpi5i2HbeSNtA3mGax8ihxqYDjKIF0lOhgwKaZ7AxvCMhxbgxqQ8l8yqywmvRIrk_PJ5_rKFNA-rAoquuE", 
    token: fcmToken,
    notification: {
        title: title || 'New Message',
        body: body || 'You have a new message',
      },
      data: data || {},
      android: {
        priority: 'high',
        notification: {
          channelId: 'chat_messages',
          sound: 'default',
        },
      },
    };
    
    const response = await admin.messaging().send(message);
    // console.log('✅ Notification sent:', response);
    
    res.json({ success: true, messageId: response });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
