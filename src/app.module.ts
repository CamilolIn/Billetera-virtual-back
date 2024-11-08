import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BilleteraModule } from './billetera/soap/billetera.soap.module';
import { BilleteraRestModule } from './billetera/rest/billetera.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://camilo:camilo123456@pruebastecnicas.f8dro.mongodb.net/billetera',
    ),
    BilleteraModule,
    BilleteraRestModule,
  ],
})
export class AppModule {}
