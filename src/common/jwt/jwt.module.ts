import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    NestJwtModule.register({
      secret: 'your_jwt_secret_key', // Replace with environment variable in production
      signOptions: { expiresIn: '23h' },
    }),
  ],
  providers: [JwtStrategy], // Register JwtStrategy as a provider
  exports: [NestJwtModule], // Export NestJwtModule so JwtService is available
})
export class JwtModule {}
