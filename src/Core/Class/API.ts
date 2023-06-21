import axios, { AxiosInstance } from 'axios';

export type APIMethods = 'post' | 'get' | 'delete' | 'put';

export class API {
  // #Private Props
  axios: AxiosInstance;

  constructor(host: string) {
    this.axios = axios.create({
      baseURL: host,
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus(status) {
        return status < 500;
      }
    });
  }

  // #Methods
  request = async <T>(
    endpoint: string,
    method: APIMethods = 'get',
    data?: unknown,
    params?: unknown
  ) => {
    try {
      const res = await this.axios<T>({
        method,
        url: endpoint,
        data,
        params
      });
      return res.data;
    } catch (error) {
      return error;
    }
  };
  requestFormData = async <T>(
    endpoint: string,
    data?: any,
    method: APIMethods = 'post',
    params?: unknown
  ): Promise<T> => {
    try {
      const res = await this.axios<T>({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method,
        url: endpoint,
        data: new URLSearchParams(data).toString(),
        params
      });
      return res.data;
    } catch (error) {
      return error;
    }
  };
}
