import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserProfile {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  displayName?: string;

  @ApiProperty({ required: false })
  photoURL?: string;

  @ApiProperty()
  emailVerified: boolean;
}

export class GoogleLoginDto {
  @ApiProperty()
  @IsString()
  idToken: string;
}

export class ValidateTokenDto {
  @ApiProperty()
  @IsString()
  token: string;
}
