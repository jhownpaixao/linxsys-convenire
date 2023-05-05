/**
 * Tipos de Usuários e levels
 * @date 05/05/2023 - 18:36:43
 *
 * @export
 * @enum {number}
 */
export enum UserType {
    Administrator = 1,
    Default = 2,
    Operator = 3,
    Company = 4,
    Attendant = 5
}

export const AccessLevel = {
    readonly: ['read'],
    modify: ['read', 'update'],
    create: ['create', 'read', 'update'],
    all: ['create', 'read', 'update', 'delete']
};
