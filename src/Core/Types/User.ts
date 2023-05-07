/**
 * Tipos de Usuários e levels
 * @date 05/05/2023 - 18:36:43
 * * Estes ENUM contem o nível de acesso à rotas determinados pelo type do usuário
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
