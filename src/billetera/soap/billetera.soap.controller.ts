import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as xml2js from 'xml2js';
import { BilleteraSoapService } from './billetera.soap.service';

@Controller('soap')
export class BilleteraController {
  constructor(private readonly soapService: BilleteraSoapService) {}

  @Post('/')
  async handleRequest(@Req() req: Request, @Res() res: Response) {
    await this.handleSoapRequest(req, res, 'registroCliente');
  }

  @Post('/recargarBilletera')
  async recargarBilletera(@Req() req: Request, @Res() res: Response) {
    await this.handleSoapRequest(req, res, 'recargarBilletera');
  }

  @Post('/pagarCompra')
  async pagarCompra(@Req() req: Request, @Res() res: Response) {
    await this.handleSoapRequest(
      req,
      res,
      'pagarCompra',
      'pagarCompraResponse',
    );
  }

  @Post('/confirmarPago')
  async confirmarPago(@Req() req: Request, @Res() res: Response) {
    await this.handleSoapRequest(
      req,
      res,
      'confirmarPago',
      'confirmarPagoResponse',
    );
  }

  @Post('/consultarSaldo')
  async consultarSaldo(@Req() req: Request, @Res() res: Response) {
    await this.handleSoapRequest(
      req,
      res,
      'consultarSaldo',
      'consultarSaldoResponse',
    );
  }

  private async handleSoapRequest(
    req: Request,
    res: Response,
    method: string,
    responseType: string = `${method}Response`,
  ) {
    try {
      const xmlData = req.body;
      const parsedData = await this.parseXml(xmlData);

      const { documento, ...params } = parsedData.Envelope.Body[method];

      const result = await this.soapService[method](
        documento,
        ...Object.values(params),
      );

      res.set('Content-Type', 'text/xml');
      res.send(this.createSoapResponse(result, responseType));
    } catch (error) {
      console.error(
        `Error procesando la solicitud SOAP para ${method}:`,
        error,
      );
      res.status(500).send('Error interno del servidor');
    }
  }

  private async parseXml(xmlData: string): Promise<any> {
    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    });

    return new Promise((resolve, reject) => {
      parser.parseString(xmlData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  private createSoapResponse(
    data: any,
    responseType: string = 'recargarBilleteraResponse',
  ): string {
    return `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <${responseType}>
            <success>${data.success}</success>
            <cod_error>${data.cod_error}</cod_error>
            <message_error>${data.message_error}</message_error>
            <mensaje>${data.mensaje || ''}</mensaje>
            <saldo>${data.saldo}</saldo>
            <id_sesion>${data.id_sesion || ''}</id_sesion>
          </${responseType}>
        </soap:Body>
      </soap:Envelope>
    `;
  }
}
