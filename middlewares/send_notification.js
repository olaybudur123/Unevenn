import dotenv from 'dotenv';
import admin from 'firebase-admin';
dotenv.config({ path: "./config.env" });
export function sendNoti(title, body, pushToken, data) {
  const messaging = admin.messaging();
  var message = {
    token: pushToken,
    notification: {
      title: title,
      body: body
    }
  };


  messaging.send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}
export async function sendNotiWithTopic(title, body, topic, data, channelId, sound) {
  const messaging = admin.messaging();

  const message = {
    notification: {
      title: title,
      body: body,
    },
    android: {
      notification: {
        channelId: channelId, // Android channel ID
      }
    }, apns: {
      payload: {
        aps: {
          sound: sound, // iOS sound
          contentAvailable: true,
        },
      },
    },
    topic: topic
  }
  console.log(message.notification);
  await messaging.send(message)

    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch(async (error) => {
      console.log('Error sending message:', error);
      await sendNotiWithTopic(title, body, topic, data)
    });
}
export default { sendNoti, sendNotiWithTopic };