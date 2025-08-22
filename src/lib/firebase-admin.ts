import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

export function getAdminDb() {
  return db;
}
