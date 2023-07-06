import EventEmitter from 'events';
import Net from 'net';
import { defaultCallback, removeSpaces, stringHasLength } from './Utils';
import { logger } from '../Logger';
import { Peer, PeerState } from './@types/peer';
import { IAsmConnectionProps } from './@types/connection';
import { IXApiICall } from './@types/call';

export type ActionRequest = {
  action: string;
  actionid?: string;
} & Record<any, any>;

type Held = {
  action: ActionRequest;
  callback: () => void;
};

type AsteriskEvent = {
  response: string;
  actionid: any;
  content: any;
  event: string;
  userevent: string;
};

class AsteriskManager {
  port: number;
  host: string;
  username: string;
  password: string;
  emitter = new EventEmitter();
  events: boolean;
  backoff = 10000;

  held: Held[] = [];
  debug: true;
  connection: Net.Socket;
  authenticated: boolean;

  lines: any[];
  leftOver: string;
  follow: boolean;

  reconnect: any;

  lastid: string;

  constructor(options: IAsmConnectionProps, events?: boolean) {
    this.host = options.host;
    this.port = options.port;
    this.username = options.username;
    this.password = options.password;
    this.events = events ?? false;
    // this.connect();
  }

  // #Event Functions
  on = this.emitter.on;
  off = this.emitter.off;
  once = this.emitter.once;
  addListener = this.emitter.addListener;
  removeListener = this.emitter.removeListener;
  removeAllListeners = this.emitter.removeAllListeners;
  listeners = this.emitter.listeners;
  setMaxListeners = this.emitter.setMaxListeners;
  emit = this.emitter.emit;

  init() {
    this.on('rawevent', this.event);
    this.on('connect', this.resetBackoff);
    this.on('error', function (err: Error) {
      logger.error(err, 'Ocorreu um erro no AMI');
    });

    // this.connect();
    // this.keepConnected();
  }

  // #Asterisk Functions
  syncConnect(cb?: (...args: any[]) => void) {
    const callback = defaultCallback(cb);

    this.connection =
      this.connection && this.connection.readyState != 'closed' ? this.connection : undefined;

    if (this.connection) return callback(null);

    this.authenticated = false;
    this.connection = Net.createConnection(this.port, this.host, this.login.bind(this));
    this.connection.setKeepAlive(true);
    this.connection.setNoDelay(true);
    this.connection.setEncoding('utf-8');

    this.connection.on('connect', this.emit.bind(this, 'connect'));
    this.connection.on('close', this.emit.bind(this, 'close'));
    this.connection.on('end', this.emit.bind(this, 'end'));
    this.connection.on('data', this.reader.bind(this));
    this.connection.on('error', this.error.bind(this));
  }

  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      this.connection =
        this.connection && this.connection.readyState != 'closed' ? this.connection : undefined;

      if (this.connection) resolve(true);

      this.authenticated = false;
      this.createConnection(this.port, this.host).then(async (conn) => {
        if (!conn) return resolve(false);
        this.init();
        this.connection = conn;
        this.connection.setKeepAlive(true);
        this.connection.setNoDelay(true);
        this.connection.setEncoding('utf-8');

        this.connection.on('connect', this.emit.bind(this, 'connect'));
        this.connection.on('close', this.emit.bind(this, 'close'));
        this.connection.on('end', this.emit.bind(this, 'end'));
        this.connection.on('data', this.reader.bind(this));
        this.connection.on('error', this.error.bind(this));

        const login = await this.login(this.username, this.password, this.events);

        if (login) {
          this.authenticated = true;
          return resolve(true);
        }

        this.disconnect();
        resolve(false);
      });
    });
  }

  createConnection(port: number, host: string): Promise<Net.Socket | false> {
    return new Promise((resolve) => {
      const connection = Net.createConnection(port, host, () => {
        resolve(connection);
      });
      connection.setKeepAlive(true);
      connection.setNoDelay(true);
      connection.setEncoding('utf-8');

      connection.once('close', () => {
        resolve(false);
      });
      connection.once('error', () => {
        resolve(false);
      });
    });
  }

  disconnect(cb?: (...args: any[]) => void) {
    if (this.reconnect) {
      this.removeListener('close', this.reconnect);
    }

    if (this.connection && this.connection.readyState === 'open') {
      this.connection.end();
    }

    delete this.connection;

    if ('function' === typeof cb) {
      setImmediate(cb);
    }
  }

  keepConnected() {
    if (this.reconnect) return;
    if (this.isConnected() === false) {
      this.reconnect = this.connReconnect;
      this.on('close', this.reconnect);
    }
  }

  connReconnect() {
    console.log('Tentando se reconectar ao AMI em ' + this.backoff / 1000 + ' segundos');

    setTimeout(this.connect.bind(this), this.backoff);
    if (this.backoff < 60000) {
      //The maximum reconection time is 60 seconds
      this.backoff += 10000; //Increase reconnection time by 10 seconds
    }
  }

  isConnected() {
    return (this.connection && this.connection.readyState === 'open') ?? false;
  }

  resetBackoff() {
    this.backoff = 10000;
  }

  syncLogin(cb?: (...args: any[]) => void) {
    const callback = defaultCallback(cb);
    this.request(
      {
        action: 'login',
        username: this.username,
        secret: this.password,
        event: this.events ? 'on' : 'off'
      },
      (err: Error) => {
        if (err) return callback(err);

        process.nextTick(callback);
        this.authenticated = true;

        const held = this.held;
        this.held = [];
        held.forEach((held) => {
          this.request(held.action, held.callback);
        });
      }
    );

    return;
  }

  async login(user: string, password: string, events: boolean) {
    const req = await this.action('login', {
      username: user,
      secret: password,
      event: events ? 'on' : 'off'
    });

    return req['response'] == 'Success';
  }

  reader(data: Buffer) {
    this.lines = this.lines || [];
    this.leftOver = this.leftOver || '';
    this.leftOver += String(data);
    this.lines = this.lines.concat(this.leftOver.split(/\r?\n/));
    this.leftOver = this.lines.pop();

    let lines = [];
    let follow = 0;
    let item: Record<any, any> = {};

    while (this.lines.length) {
      let line = this.lines.shift();
      if (!lines.length && line.substr(0, 21) === 'Asterisk Call Manager') {
        // Ignore Greeting
      } else if (
        !lines.length &&
        line.substr(0, 9).toLowerCase() === 'response:' &&
        line.toLowerCase().indexOf('follow') > -1
      ) {
        follow = 1;
        lines.push(line);
      } else if (follow && (line === '--END COMMAND--' || line === '--END SMS EVENT--')) {
        follow = 2;
        lines.push(line);
      } else if (follow > 1 && !line.length) {
        follow = 0;
        lines.pop();
        item = {
          response: 'follows',
          content: lines.join('\n')
        };

        const matches = item.content.match(/actionid: ([^\r\n]+)/i);
        item.actionid = matches ? matches[1] : item.actionid;

        lines = [];
        this.emit('rawevent', item);
      } else if (!follow && !line.length) {
        // Have a Complete Item
        lines = lines.filter(stringHasLength);
        item = {};
        while (lines.length) {
          line = lines.shift();
          line = line.split(': ');
          const key = removeSpaces(line.shift()).toLowerCase();
          line = line.join(': ');

          if (key === 'variable' || key === 'chanvariable') {
            // Handle special case of one or more variables attached to an event and
            // create a variables subobject in the event object
            if (typeof item[key] !== 'object') item[key] = {};
            line = line.split('=');
            const subkey = line.shift();
            item[key][subkey] = line.join('=');
          } else {
            // Generic case of multiple copies of a key in an event.
            // Create an array of values.
            if (key in item) {
              if (Array.isArray(item[key])) item[key].push(line);
              else item[key] = [item[key], line];
            } else item[key] = line;
          }
        }
        this.follow = false;
        lines = [];
        this.emit('rawevent', item);
      } else {
        lines.push(line);
      }
    }

    this.lines = lines;
  }

  error(err: Error) {
    this.emit('error', err);

    if (this.debug) {
      let error = String(err.stack).split(/\r?\n/);
      const msg = error.shift();
      error = error.map(function (line) {
        return ' ↳ ' + line.replace(/^\s*at\s+/, '');
      });
      error.unshift(msg);
      error.forEach(function (line) {
        process.stderr.write(line + '\n');
      });
    }
  }

  request(action: ActionRequest, cb: (...args: any[]) => void) {
    const callback = defaultCallback(cb);
    let id: string = action.actionid || String(new Date().getTime());

    while (this.listeners(id).length) id += String(Math.floor(Math.random() * 9));

    if (action.actionid) delete action.actionid;

    if (!this.authenticated && action.action !== 'login') {
      this.held = this.held || [];
      action.actionid = id;
      this.held.push({
        action: action,
        callback: callback
      });
      return id;
    }

    try {
      if (!this.connection) {
        throw new Error('Não há conectividade com o asterisk');
      }

      this.connection.write(this.makeRequest(action, id), 'utf-8');
    } catch (e) {
      console.log('ERROR: ', e);
      logger.error(e, 'Erro ao enviar a requisição para o asterisk');

      this.held = this.held || [];
      action.actionid = id;
      this.held.push({
        action: action,
        callback: callback
      });

      return id;
    }

    this.once(id, callback);

    return (this.lastid = id);
  }

  asyncRequest(action: ActionRequest): Promise<any> {
    return new Promise((resolve) => {
      let id: string = action.actionid || String(new Date().getTime());

      while (this.listeners(id).length) id += String(Math.floor(Math.random() * 9));

      if (action.actionid) delete action.actionid;

      if (!this.authenticated && action.action !== 'login') resolve(false);

      if (!this.connection) resolve(new Error('Não há conectividade com o asterisk'));

      this.connection.write(this.makeRequest(action, id), 'utf-8');

      this.once(id, (err: Error, res: any) => {
        resolve(res);
      });
    });
  }

  makeRequest(req: ActionRequest, id: string) {
    const msg = [];
    msg.push('ActionID: ' + id);

    Object.keys(req).forEach(function (key) {
      let nkey = removeSpaces(key).toLowerCase();
      if (!nkey.length || 'actionid' == nkey) return;

      let nval = req[key];

      nkey = nkey.substr(0, 1).toUpperCase() + nkey.substr(1);

      switch (typeof nval) {
        case 'undefined':
          return;
        case 'object':
          if (!nval) return;
          if (nval instanceof Array) {
            nval = nval
              .map(function (e) {
                return String(e);
              })
              .join(',');
          } else if (nval instanceof RegExp === false) {
            Object.keys(nval).forEach(function (name) {
              msg.push(nkey + ': ' + name + '=' + nval[name].toString());
            });
            return;
          }
          break;
        default:
          nval = String(nval);
          break;
      }

      msg.push([nkey, nval].join(': '));
    });

    msg.sort();

    return msg.join('\r\n') + '\r\n\r\n';
  }

  action(action: string, params?: Record<string, any>): Promise<any> {
    return new Promise((resolve) => {
      const req: ActionRequest = {
        action,
        ...params
      };

      logger.info('Enviando requisição ao asterisk');

      this.request(req, (err: Error, res: any) => {
        resolve(res);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  command(command: string, _actionid?: string | number | null) {
    const params = {
      Command: command
    };

    return this.action('Command', params);
  }

  event(evt: AsteriskEvent) {
    const emits = [];

    if (evt.response && evt.actionid && typeof evt.response == 'string') {
      // This is the response to an Action
      emits.push(
        this.emit.bind(
          this,
          evt.actionid,
          evt.response.toLowerCase() == 'error' ? evt : undefined,
          evt
        )
      );
      emits.push(this.emit.bind(this, 'response', evt));
    } else if (evt.response && evt.content) {
      // This is a follows response
      emits.push(this.emit.bind(this, this.lastid, undefined, evt));
      emits.push(this.emit.bind(this, 'response', evt));
    }

    if (evt.event) {
      // This is a Real-Event
      evt.event = Array.isArray(evt.event) ? evt.event.shift() : evt.event;
      evt.event += ''; // Make Sure that this is always a string
      emits.push(this.emit.bind(this, 'managerevent', evt));
      emits.push(this.emit.bind(this, evt.event.toLowerCase(), evt));
      if ('userevent' === evt.event.toLowerCase() && evt.userevent)
        emits.push(this.emit.bind(this, 'userevent-' + evt.userevent.toLowerCase(), evt));
    } else {
      // Ooops I dont know what this is
      emits.push(this.emit.bind(this, 'asterisk', evt));
    }
    emits.forEach(process.nextTick.bind(process));
  }

  // #Utils
  ToBoolean(val: 'yes' | 'no') {
    const convert = {
      yes: true,
      no: false
    };

    return convert[val];
  }

  // #Interface Functions

  async Queues() {
    return new Promise((resolve) => {
      const queues: any[] = [];
      const members: any[] = [];
      const listener = (evt: any) => {
        if (evt.event == 'QueueParams') queues.push(evt);
        if (evt.event == 'QueueMember') members.push(evt);
        if (evt.event == 'QueueStatusComplete') {
          this.off('managerevent', listener);
          resolve({ queue: queues, members });
        }
      };

      this.on('managerevent', listener);
      this.action('QueueStatus');
    });
  }

  async SIPPeers(type: 'tronco' | 'atendente'): Promise<Peer[] | Error> {
    return new Promise((resolve, reject) => {
      const ramais: Peer[] = [];

      const listener = async (evt: any) => {
        if (evt.event == 'PeerEntry' && evt.description == type)
          ramais.push({
            channeltype: evt.channeltype,
            objectname: evt.objectname,
            chanobjecttype: evt.chanobjecttype,
            ipaddress: evt.ipaddress == '-none-' ? false : evt.ipaddress,
            ipport: parseInt(evt.ipport),
            dynamic: this.ToBoolean(evt.dynamic),
            autoforcerport: this.ToBoolean(evt.autoforcerport),
            forcerport: this.ToBoolean(evt.forcerport),
            autocomedia: this.ToBoolean(evt.autocomedia),
            comedia: this.ToBoolean(evt.comedia),
            videosupport: this.ToBoolean(evt.videosupport),
            textsupport: this.ToBoolean(evt.textsupport),
            acl: this.ToBoolean(evt.acl),
            status: evt.status,
            realtimedevice: this.ToBoolean(evt.realtimedevice),
            description: evt.description,
            accountcode: evt.accountcode
          });
        if (evt.event == 'PeerlistComplete') {
          this.off('managerevent', listener);
          resolve(ramais);
        }
      };

      this.on('managerevent', listener);

      this.once('error', function (err: Error) {
        this.off('managerevent', listener);
        reject(err);
      });

      this.action('SIPpeers');
    });
  }

  async ActiveCalls(): Promise<IXApiICall[]> {
    return new Promise((resolve, reject) => {
      const calls: IXApiICall[] = [];
      const processed: string[] = [];
      const listener = (evt: any) => {
        if (evt.event == 'CoreShowChannel') {
          if (
            (evt.channelstatedesc == 'Ring' && evt.application != 'Dial') ||
            (evt.channelstatedesc == 'Up' &&
              (evt.application != 'Dial' ||
                evt.application != 'AppQueue' ||
                evt.application != 'ChanSpy' ||
                evt.application != 'BackGround')) ||
            (evt.channelstatedesc == 'Ringing' && evt.application != 'AppQueue')
          )
            return;

          calls.push({
            channel: evt.channel,
            destiny: parseInt(evt.connectedlinenum),
            duration: evt.duration,
            oringin: parseInt(evt.calleridnum),
            status: {
              description: evt.channelstatedesc,
              id: parseInt(evt.channelstate)
            }
          });
          processed.push(evt.connectedlinenum);
        }
        if (evt.event == 'CoreShowChannelsComplete') {
          this.off('managerevent', listener);

          resolve(calls);
        }
      };

      this.on('managerevent', listener);
      this.once('error', function (err: Error) {
        this.off('managerevent', listener);
        reject(err);
      });
      this.action('CoreShowChannels');
    });
  }

  AgentLogoff(agent: string, soft: string) {
    return this.action('AgentLogoff', { Agent: agent, Soft: soft });
  }

  async Originate(
    channel: string,
    ext: string,
    context: string,
    variables?: Record<string, string>,
    async = false
  ) {
    const params = new URLSearchParams(variables);
    const vrs = params.toString().replace('&', ',');

    return await this.action('Originate', {
      Channel: 'SIP/' + channel,
      Exten: ext,
      Context: context,
      Priority: '1',
      CallerID: ext,
      Variable: vrs,
      Async: async
    });
  }

  async ExtensionState(exten: string, context: string, actionid?: string): Promise<PeerState> {
    const params: Record<string, string> = {
      Exten: exten,
      Context: context
    };

    if (actionid) {
      params['ActionID'] = actionid;
    }

    this.on('error', function (err: Error) {
      return err;
    });

    return await this.action('ExtensionState', params);
  }
}

export default AsteriskManager;
