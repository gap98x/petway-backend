import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GoogleLoginDto, UserProfile, ValidateTokenDto } from './auth.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with Google',
    description: 'Authenticates a user using a Google ID token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User authenticated successfully',
    type: UserProfile,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async googleLogin(@Body() { idToken }: GoogleLoginDto): Promise<UserProfile> {
    try {
      return await this.authService.verifyGoogleIdToken(idToken);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new UnauthorizedException(
        `Error to login with Google: ${errorMessage}`,
      );
    }
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate token',
    description: 'Validates an authentication token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token is valid',
    type: UserProfile,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token is invalid',
  })
  async validateToken(
    @Body() { token }: ValidateTokenDto,
  ): Promise<UserProfile> {
    try {
      return await this.authService.validateToken(token);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid authentication token';
      throw new UnauthorizedException(errorMessage);
    }
  }
}
