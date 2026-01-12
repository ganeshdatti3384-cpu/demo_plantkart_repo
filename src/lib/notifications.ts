import clientPromise from './mongodb';

export async function createNotification({ userId, title, message, type = 'info' }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('notifications').insertOne({
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date()
    });
    
    return true;
  } catch (err) {
    console.error('Failed to create notification:', err);
    return false;
  }
}
