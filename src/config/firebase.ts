import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = require('../../.secret/comm-test-26f57-firebase-adminsdk-6qx8k-dc29f4f90b.json');

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'comm-test-26f57.appspot.com'
});

const bucket = getStorage().bucket();


export const firbaseConfig = {
    bucket
}