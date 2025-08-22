import * as admin from 'firebase-admin';
import { getApps, initializeApp, getApp } from 'firebase-admin/app';

const appName = 'admin-app';
if (!getApps().some(app => app?.name === appName)) {
  initializeApp({
    credential: admin.credential.applicationDefault(),
  }, appName);
}

const adminApp = getApp(appName);
const db = admin.firestore(adminApp);

export function getAdminDb() {
  return db;
}
