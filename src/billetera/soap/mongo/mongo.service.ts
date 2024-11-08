import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cliente } from '../entitys/client.model';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<Cliente>,
  ) {}

  async crearCliente(
    documento: string,
    nombres: string,
    email: string,
    celular: string,
  ) {
    ('entro aca');
    const cliente = new this.clienteModel({
      documento,
      nombres,
      email,
      celular,
    });
    return cliente.save();
  }

  async recargarBilletera(documento: string, valor: number) {
    const cliente = await this.clienteModel.findOne({ documento });
    if (cliente) {
      cliente.billetera += Number(valor);
      await cliente.save();
      return { success: true, saldo: cliente.billetera };
    } else {
      return { success: false, error: 'Cliente no encontrado' };
    }
  }

  async buscarPorDocumento(documento: string): Promise<Cliente | null> {
    const cliente = await this.clienteModel.findOne({ documento });
    return cliente;
  }

  async actualizarBilletera(documento: string, nuevoSaldo: number) {
    const cliente = await this.clienteModel.findOne({ documento });
    if (cliente) {
      cliente.billetera = nuevoSaldo;
      await cliente.save();
      return { success: true, saldo: cliente.billetera };
    } else {
      return { success: false, error: 'Cliente no encontrado' };
    }
  }

  async actualizarTokenYSessionId(
    documento: string,
    token: string,
    session_id: string,
  ) {
    const cliente = await this.clienteModel.findOne({ documento });
    if (cliente) {
      cliente.token = token;
      cliente.session_id = session_id;
      await cliente.save();
      return { success: true, message: 'Token y session_id actualizados' };
    } else {
      return { success: false, error: 'Cliente no encontrado' };
    }
  }
}
