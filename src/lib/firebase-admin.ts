import * as admin from 'firebase-admin';
import { getApps, initializeApp, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const appName = 'admin-app';
let adminApp: admin.app.App;

if (!getApps().some(app => app?.name === appName)) {
  adminApp = initializeApp({
    credential: admin.credential.applicationDefault(),
  }, appName);
} else {
  adminApp = getApp(appName);
}

const db = getFirestore(adminApp);

export function getAdminDb() {
  return db;
}
