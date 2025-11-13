import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CountriesModule } from './master/countries/countries.module';


@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AuthenticationModule, CountriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
