import { Module } from '@nestjs/common';
import { BilleteraRestController } from './billetera.controller';
import { BilleteraRestService } from './billetera.service';

@Module({
  imports: [],
  providers: [BilleteraRestService],
  controllers: [BilleteraRestController],
})
export class BilleteraRestModule {}
