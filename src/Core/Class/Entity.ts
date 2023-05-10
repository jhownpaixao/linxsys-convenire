import { HTTPResponseCode } from '@core/config';
import type { AssociationFunctions, EntityType, ModelType } from '@core/types';
import { AppProcessError } from '@core/utils';
import type { InferAttributes, Model, ModelStatic, WhereOptions } from 'sequelize';

/**
 * Classe abstrata de funções básicas das entidades
 * @remarks
 * @author {jhownpaixao}
 *
 * Usada na criação de Services que necessitam da integração com banco de dados (Entidades)
 *
 * * Esta classe destina seu uso exclusivo para a criação dos Services em modo Entidade
 *
 * * Para uso apenas extenda esta classe
 *
 * @example
 * ```typescript
 *    //Para uso extenda esta classe
 *    class MyEntity extends Entity{
 *    model = MyModel
 *    }
 * ```
 *
 * @beta @abstract @class
 */
export abstract class Entity {
  // !Private (and/or readonly) Properties

  // !Constructor Function
  //constructor() {}

  // !Static Methods
  protected static model: ModelType<never>;

  /**
   * Encontra a entidade baseado no model atual
   * @date 09/05/2023 - 20:27:26
   *
   * @protected
   * @static
   * @async
   * @template M
   */
  protected static async getEntity<M extends Model>(model: ModelStatic<M>, id: string | number) {
    return (await model.findByPk(id)) as unknown as EntityType<M>;
  }

  /**
   * Base da função associação 'HAS' usado para deterinar se um model pertence à este
   * @date 09/05/2023 - 20:27:29
   *
   * @protected
   * @static
   * @async
   * @template M
   * @template Associated
   */
  protected static async handleHas<M extends Model, Associated extends Model>(
    model: ModelStatic<M>,
    id: string | number,
    associated_model: ModelStatic<Associated>,
    assoc_id: string | number,
    association: string
  ) {
    const assoc = await associated_model.findByPk(assoc_id);
    const entity = await this.getEntity(model, id);
    if (!assoc)
      throw new AppProcessError(
        `Registro não encontrado(${association})`,
        HTTPResponseCode.informationNotFound
      );
    return (await entity[`has${association}`](assoc)) as boolean;
  }

  /**
   * Base da função de associação 'GET' usado para encontrar uma entidade apartir deste model
   * @date 09/05/2023 - 20:27:33
   *
   * @protected
   * @static
   * @async
   * @template M
   * @template Associated
   */
  protected static async handleGet<M extends Model, Associated extends Model>(
    model: ModelStatic<M>,
    id: string | number,
    association: string,
    params: WhereOptions<InferAttributes<Associated, { omit: never }>>
  ) {
    const entity = await this.getEntity(model, id);
    const result = await entity[`get${association}`]({
      where: params
    });
    return result;
  }

  /**
   * Base da função associação 'LIST' usado para listar entitys baseados no model atual
   * @date 09/05/2023 - 20:27:35
   *
   * @protected
   * @static
   * @async
   * @template M
   * @template Associated
   */
  protected static async handleList<M extends Model, Associated extends Model>(
    model: ModelStatic<M>,
    id: string | number,
    association: string,
    sub_association?: [ModelStatic<Associated>, string]
  ) {
    const associations = {
      association: model.associations[association]
    };
    if (sub_association)
      Object.assign(associations, {
        include: [sub_association[0].associations[sub_association[1]]]
      });

    const list = await model.findByPk(id, {
      include: [associations]
    });
    const f: AssociationFunctions = {};
    const r = Object.assign(list, f);
    return r[association];
  }

  // !Getters and Setters
  //TODO: À desenvolver

  // !Public Instance Methods
  //TODO: À desenvolver

  // !Private Subroutines
  //TODO: À desenvolver
}
