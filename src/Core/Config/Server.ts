export class ServerConfig {
    static HOST_ADDRESS = process.env.BACKEND_URL || 'http://localhost';
    static MAIN_PORT = process.env.BACKEND_PORT || 4000;
    static AUTH_PORT = process.env.BACKEND_AUTHENTICATOR_PORT || 3302;
}
