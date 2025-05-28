import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { firebaseProvider } from '../config/firebase/firebase.config';

@Module({
  imports: [ConfigModule],
  providers: [AuthService, firebaseProvider],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
