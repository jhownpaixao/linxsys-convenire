export enum ResourceTypes {
  PABX = 1,
  Omilia = 2,
  CRM = 3
}

export const ResourceExtensions: Record<string, any> = {
  [ResourceTypes.PABX]: {
    Predictive: 1,
    Extension: 2
  },
  [ResourceTypes.Omilia]: {
    Whatsapp: 1,
    Telegram: 2,
    Facebook: 3,
    Instagram: 4
  }
};
