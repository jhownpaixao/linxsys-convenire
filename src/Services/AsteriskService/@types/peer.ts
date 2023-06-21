export interface PeerState {
  exten: string;
  name?: string;
  context: string;
  hint: string;
  status: number;
  statustext: string;
}

export interface Peer {
  channeltype: string;
  objectname: string;
  chanobjecttype: string;
  ipaddress: number | false;
  ipport: number;
  dynamic: boolean;
  autoforcerport: boolean;
  forcerport: boolean;
  autocomedia: boolean;
  comedia: boolean;
  videosupport: boolean;
  textsupport: boolean;
  acl: boolean;
  status: string;
  state?: PeerState;
  realtimedevice: boolean;
  description: string;
  accountcode: string;
}

export interface XApiExtension {
  ramal: string;
  apelido: string;
}
