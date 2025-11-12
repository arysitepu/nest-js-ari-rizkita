import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegisterModule } from './master/register/register.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, RegisterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
