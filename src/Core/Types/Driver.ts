import type { Asterisk } from '../../services/AsteriskService/Asterisk';
import type { Omilia } from '../../services/OmiliaService/Omilia';

export interface Driver {
  connect: () => Promise<string>;
  close: () => Promise<boolean>;

  send?: (payload: unknown) => Promise<void>;
  receive: () => void;
}

export type Drivers = Asterisk | Omilia;
