import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients/entities/client.entity';
import { Company } from './companies/entities/company.entity';
import { CompaniesModule } from './companies/companies.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type:"better-sqlite3",
      database: process.env.DATABASE_URL ?? "database.sqlite",
      entities:[Client,Company],
      synchronize:true,
    }),
    CompaniesModule,
    ClientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
