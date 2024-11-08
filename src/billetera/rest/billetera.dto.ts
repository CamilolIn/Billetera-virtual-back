import { ApiProperty } from '@nestjs/swagger';

export class RegistrarClienteDto {
  @ApiProperty({ description: 'Documento del cliente', example: '12345678' })
  documento: string;

  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Juan Perez',
  })
  nombres: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'juan.perez@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Número de celular del cliente',
    example: '987654321',
  })
  celular: string;
}

export class RecargarBilleteraDto {
  @ApiProperty({ description: 'Documento del cliente', example: '12345678' })
  documento: string;

  @ApiProperty({
    description: 'Número de celular del cliente',
    example: '987654321',
  })
  celular: string;

  @ApiProperty({ description: 'Monto a recargar', example: 100 })
  valor: number;
}

export class PagarCompraDto {
  @ApiProperty({ description: 'Documento del cliente', example: '12345678' })
  documento: string;

  @ApiProperty({ description: 'Monto de la compra', example: 50 })
  monto: number;
}

export class ConfirmarPagoDto {
  @ApiProperty({ description: 'Documento del cliente', example: '12345678' })
  documento: string;

  @ApiProperty({
    description: 'ID de la sesión de pago',
    example: 'session12345',
  })
  id_sesion: string;

  @ApiProperty({
    description: 'Token de confirmación del pago',
    example: 'token123',
  })
  token: string;

  @ApiProperty({ description: 'Monto del pago', example: 50 })
  monto: number;
}

export class ConsultarSaldoDto {
  @ApiProperty({ description: 'Documento del cliente', example: '12345678' })
  documento: string;

  @ApiProperty({
    description: 'Número de celular del cliente',
    example: '987654321',
  })
  celular: string;
}
