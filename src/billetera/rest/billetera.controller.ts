import { Controller, Post, Body } from '@nestjs/common';
import { BilleteraRestService } from './billetera.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  RegistrarClienteDto,
  RecargarBilleteraDto,
  PagarCompraDto,
  ConfirmarPagoDto,
  ConsultarSaldoDto,
} from './billetera.dto';

@ApiTags('Billetera')
@Controller('api/billetera')
export class BilleteraRestController {
  constructor(private readonly billeteraRestService: BilleteraRestService) {}

  @Post('/registrar')
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  async registrarCliente(@Body() body: RegistrarClienteDto) {
    const { documento, nombres, email, celular } = body;
    return await this.billeteraRestService.registrarClienteRest(
      documento,
      nombres,
      email,
      celular,
    );
  }

  @Post('/recargar')
  @ApiOperation({ summary: 'Recargar saldo en la billetera' })
  @ApiResponse({ status: 200, description: 'Saldo recargado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  async recargarBilletera(@Body() body: RecargarBilleteraDto) {
    const { documento, celular, valor } = body;
    return await this.billeteraRestService.recargarBilleteraRest(
      documento,
      celular,
      valor,
    );
  }

  @Post('/pagar')
  @ApiOperation({ summary: 'Realizar una compra usando la billetera' })
  @ApiResponse({ status: 200, description: 'Compra realizada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  async pagarCompra(@Body() body: PagarCompraDto) {
    const { documento, monto } = body;
    return await this.billeteraRestService.pagarCompraRest(documento, monto);
  }

  @Post('/confirmarPago')
  @ApiOperation({ summary: 'Confirmar un pago pendiente' })
  @ApiResponse({ status: 200, description: 'Pago confirmado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  async confirmarPago(@Body() body: ConfirmarPagoDto) {
    const { documento, id_sesion, token, monto } = body;
    return await this.billeteraRestService.confirmarPago(
      documento,
      id_sesion,
      token,
      monto,
    );
  }

  @Post('/consultarSaldo')
  @ApiOperation({ summary: 'Consultar el saldo de la billetera' })
  @ApiResponse({ status: 200, description: 'Saldo consultado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida.' })
  async consultarSaldo(@Body() body: ConsultarSaldoDto) {
    const { documento, celular } = body;
    return await this.billeteraRestService.consultarSaldoRest(
      documento,
      celular,
    );
  }
}
