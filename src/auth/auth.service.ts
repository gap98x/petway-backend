import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';

import * as admin from 'firebase-admin';
import { FIREBASE_APP } from '../config/firebase/firebase.config';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

type FirebaseUser = admin.auth.UserRecord & {
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(FIREBASE_APP)
    private readonly firebaseApp: admin.app.App,
  ) {}

  private mapFirebaseUserToProfile(user: FirebaseUser): UserProfile {
    if (!user.email) {
      throw new Error('User email is required');
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      emailVerified: user.emailVerified || false,
    };
  }

  async validateToken(token: string): Promise<UserProfile> {
    try {
      const auth = this.firebaseApp.auth();
      const decodedToken = await auth.verifyIdToken(token, true);
      const user = (await auth.getUser(decodedToken.uid)) as FirebaseUser;
      return this.mapFirebaseUserToProfile(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(
          `Invalid authentication token: ${error.message}`,
        );
      }
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  async createCustomToken(
    uid: string,
    additionalClaims?: Record<string, any>,
  ): Promise<string> {
    try {
      return await this.firebaseApp
        .auth()
        .createCustomToken(uid, additionalClaims);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Error creating custom token: ${errorMessage}`);
    }
  }

  async verifyGoogleIdToken(idToken: string): Promise<UserProfile> {
    try {
      const auth = this.firebaseApp.auth();
      const decodedToken = await auth.verifyIdToken(idToken);

      if (decodedToken.firebase?.sign_in_provider !== 'google.com') {
        throw new UnauthorizedException(
          'Authentication provider must be Google',
        );
      }

      const user = (await auth.getUser(decodedToken.uid)) as FirebaseUser;
      return this.mapFirebaseUserToProfile(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }
}
