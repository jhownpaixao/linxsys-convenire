enum RoutesName {
  assessment = '/assessments',
  attendant = '/attendants',
  auth = '/auth',
  chat = '/chats',
  client = '/customers',
  chatbot = '/chatbots',
  profile = '/profiles',
  connection = '/connections',
  contact = '/contacs',
  workflow = '/workflows',
  user = '/users',
  queue = '/queues',
  tags = '/tags',
  ticket = '/tickets',
  core = '/core'
}
export class ServerConfig {
  static HOST_ADDRESS = process.env.BACKEND_URL || 'http://localhost';
  static MAIN_PORT = process.env.BACKEND_PORT || 4000;
  static AUTH_PORT = process.env.BACKEND_AUTHENTICATOR_PORT || 3302;
  static ROUTES = RoutesName;
}
