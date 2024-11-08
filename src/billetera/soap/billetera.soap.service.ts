import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
import * as path from 'path';
import { MongoService } from './mongo/mongo.service';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';

@Injectable()
export class BilleteraSoapService {
  private soapClient: any;

  constructor(private mongoService: MongoService) {
    const wsdlPath = path.join(
      process.cwd(),
      'src',
      'billetera',
      'wsdl',
      'billetera.wsdl',
    );
    soap.createClient(wsdlPath, (err, client) => {
      if (err) {
        console.error('Error creando el cliente SOAP:', err);
      } else {
        this.soapClient = client;
      }
    });
  }

  public async registroCliente(
    documento: string,
    nombres: string,
    email: string,
    celular: string,
  ) {
    try {
      const result = await this.mongoService.crearCliente(
        documento,
        nombres,
        email,
        celular,
      );
      return {
        success: true,
        cod_error: '00',
        message_error: JSON.stringify(result),
      };
    } catch (error) {
      return {
        success: false,
        cod_error: '500',
        message_error: 'Error en el registro del cliente',
      };
    }
  }

  public async recargarBilletera(
    documento: string,
    celular: string,
    valor: number,
  ) {
    try {
      const result = await this.mongoService.recargarBilletera(
        documento,
        valor,
      );
      if (result.success) {
        return {
          success: true,
          cod_error: '',
          message_error: '',
          saldo: result.saldo,
        };
      }
      return { success: false, cod_error: '404', message_error: result.error };
    } catch (error) {
      return {
        success: false,
        cod_error: '500',
        message_error: 'Error al recargar billetera',
      };
    }
  }

  generateToken(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  generateSessionId(): string {
    return crypto.randomUUID();
  }

  async sendConfirmationEmail(email: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'camilolindarte1992@gmail.com',
        pass: 'akhz rpdr uxjj hsfp',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: 'camilolindarte1992@gmail.com',
      to: email,
      subject: 'Confirmación de pago',
      text: `Tu código de confirmación es: ${token}`,
    };

    await transporter.sendMail(mailOptions);
  }

  async pagarCompra(documento: string, monto: number): Promise<any> {
    const usuario = await this.mongoService.buscarPorDocumento(documento);

    if (!usuario) {
      return {
        success: false,
        cod_error: '01',
        message_error: 'Usuario no encontrado',
        mensaje: 'No se encontró al usuario',
        id_sesion: '',
      };
    }

    if (usuario.billetera < Number(monto)) {
      return {
        success: false,
        cod_error: '02',
        message_error: 'Saldo insuficiente',
        mensaje: `El usuario no tiene saldo suficiente para realizar una compra de ${monto}`,
        id_sesion: '',
      };
    }

    const tokenGenerado = this.generateToken();
    const idSesion = this.generateSessionId();

    await this.sendConfirmationEmail(usuario.email, tokenGenerado);

    const updateResult = await this.mongoService.actualizarTokenYSessionId(
      documento,
      tokenGenerado,
      idSesion,
    );

    if (!updateResult.success) {
      return {
        success: false,
        cod_error: '500',
        message_error:
          'Error al guardar el token y session_id en la base de datos',
        id_sesion: '',
      };
    }

    return {
      success: true,
      cod_error: '00',
      message_error: '',
      mensaje: `Correo con el token enviado al usuario.`,
      id_sesion: idSesion,
    };
  }

  async confirmarPago(
    documento: string,
    idSesion: string,
    token: string,
    monto: number,
  ): Promise<any> {
    const usuario = await this.mongoService.buscarPorDocumento(documento);

    if (!usuario) {
      return {
        success: false,
        cod_error: '01',
        message_error: 'Usuario no encontrado',
        mensaje: 'No se encontró al usuario',
      };
    }

    if (usuario.session_id !== idSesion) {
      return {
        success: false,
        cod_error: '02',
        message_error: 'ID de sesión inválido',
        mensaje: 'El ID de sesión proporcionado no es válido',
      };
    }

    if (usuario.token !== token) {
      return {
        success: false,
        cod_error: '03',
        message_error: 'Token inválido',
        mensaje: 'El token proporcionado no es válido',
      };
    }

    if (usuario.billetera < monto) {
      return {
        success: false,
        cod_error: '04',
        message_error: 'Saldo insuficiente',
        mensaje: `El usuario no tiene saldo suficiente para completar la compra de ${monto}`,
      };
    }

    usuario.billetera -= monto;
    usuario.token = null;
    usuario.session_id = null;

    try {
      await usuario.save();
      return {
        success: true,
        cod_error: '00',
        message_error: '',
        mensaje: `Pago confirmado. El saldo restante en la billetera es ${usuario.billetera}`,
      };
    } catch (error) {
      return {
        success: false,
        cod_error: '500',
        message_error: 'Error al actualizar la billetera',
        mensaje: 'Hubo un error al procesar el pago',
      };
    }
  }

  public async consultarSaldo(
    documento: string,
    celular: string,
  ): Promise<any> {
    try {
      const cliente = await this.mongoService.buscarPorDocumento(documento);

      if (!cliente) {
        return {
          success: false,
          cod_error: '01',
          message_error: 'Usuario no encontrado',
          mensaje: 'No se encontró al usuario con el documento proporcionado.',
        };
      }

      if (cliente.celular !== celular) {
        return {
          success: false,
          cod_error: '02',
          message_error: 'Celular incorrecto',
          mensaje:
            'El número de celular proporcionado no coincide con el registrado.',
        };
      }

      return {
        success: true,
        cod_error: '00',
        message_error: '',
        saldo: cliente.billetera,
      };
    } catch (error) {
      console.error('Error al consultar el saldo:', error);
      return {
        success: false,
        cod_error: '500',
        message_error: 'Error al consultar el saldo',
        mensaje: 'Hubo un error al procesar la consulta del saldo.',
      };
    }
  }
}
