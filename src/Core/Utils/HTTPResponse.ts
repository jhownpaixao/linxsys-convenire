import { NextFunction, Response } from 'express';
import { HTTPResponseCode, ResponseType, THTTPResponse } from '..';
import { logger } from '../../services/Logger';
/**
 * Responsável por elaborar uma resposta para a requisição, bem como envia-la
 * @remarks
 *
 * * Use caso seja necessário criar uma resposta mais elaborada e seguindo o padrão a api
 
 *
 * @example
 * ```typescript
 *    //example of how to use this class here
 *     const Response = new HTTPResponse(res);
 *      Response.setParams({
 *          message:'isto é uma resposta'    
 *      }).send();
 * ```
 *
 * @alpha @beta @eventProperty @experimental @internal @override @packageDocumentation @public @readonly @sealed @virtual
 */
class HTTPResponse {
  // !Private (and/or readonly) Properties
  private response: Response;
  private nextFunction: NextFunction | null;

  private message: string;
  private type: ResponseType;
  private data: unknown | null;
  private status: boolean;
  private location: string;
  private code: HTTPResponseCode;
  private timestamp: number;
  private responseFormulation = process.env.RESPONSE_FORMULATION_TYPE || 'standart';

  // !Constructor Function
  constructor(response: Response, nextFunction?: NextFunction) {
    this.response = response;
    this.nextFunction = nextFunction ?? null;
  }

  // !Getters and Setters
  public setParams(objResponse: THTTPResponse) {
    this.code = objResponse.code;
    this.location = objResponse.location;
    this.message = objResponse.message;
    this.data = objResponse.data;
    this.status = objResponse.status;
    this.type = objResponse.type;
    return this;
  }

  // !Public Instance Methods
  public async send() {
    await this.prepare();

    const FormulatedResponse = this.formulateResponse();

    if (this.nextFunction) {
      this.response.write(JSON.stringify(FormulatedResponse));
      this.nextFunction();
    } else {
      this.response.send(JSON.stringify(FormulatedResponse));
    }
  }

  // !Private Subroutines
  private async prepare() {
    this.timestamp = Date.now();
    if (!this.code) this.code = HTTPResponseCode.successfullyProcessedInformation;
    this.response.status(this.code);

    if (this.location) this.response.location(this.location);

    let FormulatedResponse: unknown;
    const response = this.formulateResponse();
    this.registerLogger(response);

    switch (this.responseFormulation) {
      case 'direct':
        if (response.data) response.data;
        break;
      case 'standart':
        FormulatedResponse = response;
        break;
      default:
        FormulatedResponse = response;
        break;
    }
    return FormulatedResponse;
  }

  private formulateResponse() {
    const response: THTTPResponse = {
      status: this.status,
      message: this.message,
      type: this.type,
      data: this.data,
      timestamp: this.timestamp,
      location: this.location,
      code: this.code
    };
    return response;
  }

  private registerLogger(response: THTTPResponse) {
    switch (this.type) {
      case 'success':
        logger.info({ loggerObj: response }, response.message);
        break;
      case 'warning':
        logger.warn({ loggerObj: response }, response.message);
        break;
      case 'error':
        logger.error({ loggerObj: response }, response.message);
        break;
      default:
        logger.debug({ loggerObj: response }, response.message);
        break;
    }
  }
}

export default HTTPResponse;
