/**
 * Defini os métodos permitidos para cada rota (forma individual).
 * Caso não exista uma configuração dos métodos permitidos para uma rota, o express retornara
 * a configuração padrão do CORS
 *
 * @nota A definição desta variavel posteriormente não irá alterar o contexto atual. Favor definir os metodos aqui
 *
 * @date 07/04/2023 - 15:31:42
 *
 */
export const AllowedMethods = {
  '/user': 'POST,GET'
};
