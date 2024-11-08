import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cliente, ClienteSchema } from './entitys/client.model';
import { BilleteraSoapService } from './billetera.soap.service';
import { BilleteraController } from './billetera.soap.controller';
import { MongoService } from './mongo/mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cliente.name, schema: ClienteSchema }]),
  ],
  providers: [BilleteraSoapService, MongoService],
  controllers: [BilleteraController],
})
export class BilleteraModule {}
