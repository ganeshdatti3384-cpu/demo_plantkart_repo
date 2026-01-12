import { Collection, Document } from 'mongodb';
import clientPromise from './mongodb';

export async function logAudit(action: string, userId: string, details: object) {
  const client = await clientPromise;
  const db = client.db();
  const collection: Collection<Document> = db.collection('audit_logs');
  await collection.insertOne({
    action,
    adminId: userId,
    details,
    createdAt: new Date(),
    timestamp: new Date(),
  });
}

export async function createAuditLog({ userId, action, entity, entityId, details }: { 
  userId: string, 
  action: string, 
  entity: string, 
  entityId?: string, 
  details?: object 
}) {
  const client = await clientPromise;
  const db = client.db();
  await db.collection('audit_logs').insertOne({
    action,
    adminId: userId,
    entity,
    entityId,
    details,
    createdAt: new Date(),
    timestamp: new Date(),
  });
}

