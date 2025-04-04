import webpush from 'web-push';

webpush.setVapidDetails(
  `mailto:${process.env.EMAIL_ADDRESS}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { subscription, title, body } = req.body;

    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({ title, body })
      );
      res.status(200).json({ message: 'Notification sent' });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
