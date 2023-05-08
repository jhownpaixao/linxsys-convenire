export enum EMessageLevel {
    default = 'default',
    system = 'system',
    other = 'other'
}
export enum EMessageType {
    default = 'default',
    media = 'media',
    link = 'link',
    action = 'action'
}
export enum EMessageStatus {
    waiting = 'waiting',
    sent = 'sent',
    received = 'received',
    deleted = 'deleted',
    error = 'error'
}
export enum EMessageAction {
    default = 'default',
    forwarded = 'forwarded'
}
export enum EChatType {
    private = 'private',
    group = 'group'
}

export type TMessageUserTrace = {
    id: number;
    name: string;
    timestamp: number;
    model: string;
};

export type TMessageFile = {
    filename: string;
    original: string;
    filepath: string;
    size: number;
    mimetype: string;
    duration?: number;
    autoplay?: boolean;
};

export type TMessageReaction = {
    uniqtoken: number;
    name: string;
    timestamp: number;
    from?: TMessageUserTrace;
};

export interface IMessageMeta {
    level: EMessageLevel;
    status: EMessageStatus;
    type: EMessageType;
    action: EMessageAction;
    receivedby: TMessageUserTrace[];
    readby: TMessageUserTrace[];
}

export interface IMessageContent {
    body: string;
    attachments: TMessageFile[];
    reaction: TMessageReaction[];
}

export interface IMessage {
    uniqkey: string;
    from: number;
    meta: IMessageMeta;
    message: IMessageContent;
}

export interface IChat {
    uniqkey: string;
    owners: TMessageUserTrace[];
    participants: TMessageUserTrace[];
    channel: string;
    type: EChatType;
    title?: string;
    params?: object;
    messages?: IMessage[];

    //* Mensagens
    sendMessage(message: IMessage): Promise<boolean>;
    receiveMessage(message: IMessage): Promise<IMessage>;
    reactToMessage(message: IMessage): Promise<IMessage>;
    forwardMessage(message: IMessage): Promise<IMessage>;
    deleteMessage(message: IMessage): Promise<void>;

    //* Chat
    rename(name: string): Promise<boolean>;
    delete(): Promise<void>;
    create(): Promise<this>;

    //admins
    getOwner(): Promise<void>;
    setOwner(): Promise<void>;
    removeOwner(): Promise<void>;

    //participants
    join(participant: TMessageUserTrace): Promise<this>;
    left(participant: TMessageUserTrace): Promise<void>;
    getParticipant(): Promise<TMessageUserTrace>;
    listParticipants(): Promise<TMessageUserTrace[]>;
}
