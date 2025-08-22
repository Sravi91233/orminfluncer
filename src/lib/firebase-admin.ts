import * as admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';

const appName = 'admin-app';
if (!getApps().some(app => app?.name === appName)) {
  initializeApp({
    credential: admin.credential.applicationDefault(),
  }, appName);
}

const db = admin.firestore();

export function getAdminDb() {
  return db;
}
