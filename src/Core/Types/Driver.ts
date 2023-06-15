import type { AsteriskManager } from '../../services/AsteriskService/AsteriskManager';
import type { Omilia } from '../../services/OmiliaService/Omilia';

export interface Driver {
  connect: () => Promise<boolean>;
  close: () => Promise<boolean>;

  send?: (payload: unknown) => Promise<void>;
  receive: () => void;
}

export type Drivers = AsteriskManager | Omilia;
