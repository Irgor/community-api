import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount: any = {
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY
}

serviceAccount.privateKey = serviceAccount.privateKey.replace(/\\n/g, '\n')

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'comm-test-26f57.appspot.com'
});

const bucket = getStorage().bucket();


export const firbaseConfig = {
    bucket
}