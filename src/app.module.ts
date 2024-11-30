import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from './common/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
      envFilePath: '.env', // Path to the .env file (default is .env)
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: "berry.db.elephantsql.com",
      port: 5432,
      username: "nyaqviwt",
      password: "wLT_gg2YR9juDTRi_X3PtShCEDsD0gsn",
      database: "nyaqviwt",
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
    JwtModule,
    AdminModule,
    UserModule
  ],
})
export class AppModule {}
