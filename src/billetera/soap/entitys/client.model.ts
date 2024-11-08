import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cliente extends Document {
  @Prop({ required: true })
  documento: string;

  @Prop({ required: true })
  nombres: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  celular: string;

  @Prop()
  token: string;

  @Prop()
  session_id: string;

  @Prop({ default: 0 })
  billetera: number;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
