import type { Driver } from '@core/types/Driver';

export class Omilia implements Driver {
  connect: () => Promise<string>;
  close: () => Promise<boolean>;
  send?: (payload: unknown) => Promise<void>;
  receive: () => void;
}
