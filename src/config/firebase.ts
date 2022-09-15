import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount: any = {
    projectId: process.env.PROJECT_ID || '',
    clientEmail: process.env.CLIENT_EMAIL || '',
    privateKey: process.env.PRIVATE_KEY || '',
    type: process.env.TYPE || '',
    privateKeyId: process.env.PRIVATE_KEY_ID || '',
    clientId: process.env.CLIENT_ID || '',
    authUri: process.env.AUTH_URI || '',
    tokenUri: process.env.TOKEN_URI || '',
    authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL || '',
    clientX509CertUrl: process.env.CLIENT_X509_CERT_URL || '',
}

serviceAccount.privateKey = serviceAccount.privateKey.replace(/\\n/g, '\n');

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'comm-test-26f57.appspot.com'
});

const bucket = getStorage().bucket();


const apiUrl = 'https://identitytoolkit.googleapis.com/v1'

export const firbaseConfig = {
    bucket,
    apiUrl
}