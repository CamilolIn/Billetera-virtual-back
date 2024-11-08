import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as xml2js from 'xml2js';

@Injectable()
export class BilleteraRestService {
  private soapUrl = 'http://localhost:3000/soap';

  constructor() {}

  async registrarClienteRest(
    documento: string,
    nombres: string,
    email: string,
    celular: string,
  ) {
    const soapRequest = this.buildRegistroClienteRequest(
      documento,
      nombres,
      email,
      celular,
    );

    try {
      const response = await axios.post(this.soapUrl, soapRequest, {
        headers: {
          'Content-Type': 'application/xml',
        },
      });
      const result = await this.parseSoapResponse(response.data);

      const transformedResponse = this.transformResponse(result);
      return { data: transformedResponse }; // Estructura con data
    } catch (error) {
      console.error('Error al registrar el cliente:', error);
      throw new Error(
        'Error al registrar el cliente a través del servicio SOAP',
      );
    }
  }

  // Método para recargar billetera
  async recargarBilleteraRest(
    documento: string,
    celular: string,
    valor: number,
  ) {
    const soapRequest = this.buildRecargaBilleteraRequest(
      documento,
      celular,
      valor,
    );

    try {
      const response = await axios.post(
        this.soapUrl + '/recargarBilletera',
        soapRequest,
        {
          headers: {
            'Content-Type': 'application/xml',
            SOAPAction: 'http://localhost/soap/billetera/recargarBilletera',
          },
        },
      );

      const result = await this.parseSoapResponse(response.data);

      const transformedResponse = this.transformResponse(result);
      return { data: transformedResponse }; // Estructura con data
    } catch (error) {
      console.error('Error al recargar la billetera:', error);
      throw new Error(
        'Error al recargar la billetera a través del servicio SOAP',
      );
    }
  }

  async pagarCompraRest(documento: string, monto: number) {
    const soapRequest = this.buildPagarCompraRequest(documento, monto);

    try {
      const response = await axios.post(
        this.soapUrl + '/pagarCompra',
        soapRequest,
        {
          headers: {
            'Content-Type': 'application/xml',
            SOAPAction: 'http://localhost/soap/billetera/pagarCompra',
          },
        },
      );

      const result = await this.parseSoapResponse(response.data);

      const transformedResponse = this.transformResponse(result);
      return { data: transformedResponse };
    } catch (error) {
      console.error('Error al pagar la compra:', error);
      throw new Error('Error al pagar la compra a través del servicio SOAP');
    }
  }

  async confirmarPago(
    documento: string,
    id_sesion: string,
    token: string,
    monto: number,
  ) {
    const soapRequest = this.buildConfirmarPagoRequest(
      documento,
      id_sesion,
      token,
      monto,
    );

    try {
      const response = await axios.post(
        this.soapUrl + '/confirmarPago',
        soapRequest,
        {
          headers: {
            'Content-Type': 'application/xml',
            SOAPAction: 'http://localhost/soap/billetera/confirmarPago',
          },
        },
      );
      const result = await this.parseSoapResponse(response.data);
      const transformedResponse = this.transformResponse(result);
      return { data: transformedResponse };
    } catch (error) {
      console.error('Error al confirmar el pago:', error);
      throw new Error('Error al confirmar el pago a través del servicio SOAP');
    }
  }

  async consultarSaldoRest(documento: string, celular: string) {
    const soapRequest = this.buildConsultarSaldoRequest(documento, celular);

    try {
      const response = await axios.post(
        this.soapUrl + '/consultarSaldo',
        soapRequest,
        {
          headers: {
            'Content-Type': 'application/xml',
            SOAPAction: 'http://localhost/soap/billetera/consultarSaldo',
          },
        },
      );

      const result = await this.parseSoapResponse(response.data);
      const transformedResponse = this.transformResponse(result);
      return { data: transformedResponse };
    } catch (error) {
      console.error(
        'Error al consultar el saldo:',
        error.response?.data || error.message,
      );
      throw new Error('Error al consultar el saldo a través del servicio SOAP');
    }
  }

  private buildRegistroClienteRequest(
    documento: string,
    nombres: string,
    email: string,
    celular: string,
  ): string {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bil="http://localhost/soap/billetera">
        <soapenv:Header/>
        <soapenv:Body>
          <bil:registroCliente>
            <documento>${documento}</documento>
            <nombres>${nombres}</nombres>
            <email>${email}</email>
            <celular>${celular}</celular>
          </bil:registroCliente>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  }

  private buildRecargaBilleteraRequest(
    documento: string,
    celular: string,
    valor: number,
  ): string {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bil="http://localhost/soap/billetera">
        <soapenv:Header/>
        <soapenv:Body>
          <bil:recargarBilletera>
            <documento>${documento}</documento>
            <celular>${celular}</celular>
            <valor>${valor}</valor>
          </bil:recargarBilletera>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  }

  private buildPagarCompraRequest(documento: string, monto: number): string {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bil="http://localhost/soap/billetera">
        <soapenv:Header/>
        <soapenv:Body>
          <bil:pagarCompra>
            <documento>${documento}</documento>
            <monto>${monto}</monto>
          </bil:pagarCompra>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  }

  private buildConfirmarPagoRequest(
    documento: string,
    id_sesion: string,
    token: string,
    monto: number,
  ): string {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bil="http://localhost/soap/billetera">
        <soapenv:Header/>
        <soapenv:Body>
          <bil:confirmarPago>
            <documento>${documento}</documento>
            <id_sesion>${id_sesion}</id_sesion>
            <token>${token}</token>
            <monto>${monto}</monto>
          </bil:confirmarPago>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  }

  private buildConsultarSaldoRequest(
    documento: string,
    celular: string,
  ): string {
    return `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:bil="http://localhost/soap/billetera">
        <soapenv:Header/>
        <soapenv:Body>
          <bil:consultarSaldo>
            <documento>${documento}</documento>
            <celular>${celular}</celular>
          </bil:consultarSaldo>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  }

  private parseSoapResponse(soapResponse: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const parser = new xml2js.Parser({
        explicitArray: false,
        tagNameProcessors: [xml2js.processors.stripPrefix],
      });

      parser.parseString(soapResponse, (err, result) => {
        if (err) {
          reject('Error al parsear la respuesta SOAP');
        } else {
          resolve(result);
        }
      });
    });
  }

  private transformResponse(soapResponse: any): any {
    const responseBody = soapResponse.Envelope.Body;
    if (responseBody.recargarBilleteraResponse) {
      const { success, cod_error, message_error, saldo } =
        responseBody.recargarBilleteraResponse;
      return {
        success,
        cod_error,
        message_error,
        saldo,
      };
    }

    if (responseBody.registroClienteResponse) {
      const { success, cod_error, message_error } =
        responseBody.registroClienteResponse;
      return {
        success,
        cod_error,
        message_error,
      };
    }
    if (responseBody.pagarCompraResponse) {
      const { success, cod_error, message_error, mensaje, id_sesion } =
        responseBody.pagarCompraResponse;
      return {
        success,
        cod_error,
        message_error,
        mensaje,
        id_sesion,
      };
    }

    if (responseBody.confirmarPagoResponse) {
      const { success, cod_error, message_error, mensaje, id_sesion } =
        responseBody.confirmarPagoResponse;
      return {
        success,
        cod_error,
        message_error,
        mensaje,
        id_sesion,
      };
    }

    if (responseBody.consultarSaldoResponse) {
      const { success, cod_error, message_error, saldo } =
        responseBody.consultarSaldoResponse;
      return {
        success,
        cod_error,
        message_error,
        saldo,
      };
    }

    throw new Error('Respuesta SOAP inesperada');
  }
}
