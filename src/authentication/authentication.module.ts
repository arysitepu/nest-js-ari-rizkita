import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { GeneralService } from 'src/general/general-service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'Samudera1',
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy, GeneralService],
  exports: [AuthenticationService, JwtModule, PassportModule],
})
export class AuthenticationModule {}
