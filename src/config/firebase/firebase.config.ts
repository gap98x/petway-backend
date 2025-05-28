import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

export const FIREBASE_APP = 'FIREBASE_APP';

export const firebaseProvider = {
  provide: FIREBASE_APP,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const privateKey = configService.get<string>('FIREBASE_PRIVATE_KEY');
    if (!privateKey) {
      throw new Error(
        'FIREBASE_PRIVATE_KEY is not defined in environment variables',
      );
    }

    const firebaseConfig = {
      type: 'service_account',
      project_id: configService.get<string>('FIREBASE_PROJECT_ID'),
      private_key_id: configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
      private_key: privateKey.replace(/\\n/g, '\n'),
      client_email: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      client_id: configService.get<string>('FIREBASE_CLIENT_ID'),
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: configService.get<string>(
        'FIREBASE_CLIENT_CERT_URL',
      ),
      universe_domain: 'googleapis.com',
    };

    const app = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
    });

    return app;
  },
};
