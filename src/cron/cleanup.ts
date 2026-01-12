import clientPromise from '../lib/mongodb';

export async function cleanupOldRecords() {
  const client = await clientPromise;
  const db = client.db();
  const collections = ['airport_pickup', 'accommodation', 'car', 'consultant_booking', 'loan', 'events'];
  const terminalStatuses = ['COMPLETED', 'REJECTED', 'CANCELLED'];
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  for (const name of collections) {
    await db.collection(name).deleteMany({
      status: { $in: terminalStatuses },
      updatedAt: { $lt: cutoff },
    });
  }
}
