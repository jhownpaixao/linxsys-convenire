export interface IXApiICall {
  duration: number;
  oringin: number;
  destiny: number;
  channel: string;
  status: {
    id: number;
    description: string;
  };
}
