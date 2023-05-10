import moment from 'moment';
import path from 'path';

export class LoggerConfig {
  /**
   * Define a data atual pelo moment
   * @date 24/03/2023 - 20:19:19
   *
   */
  private static today: string = moment().format('DD-MM-YYYY');
  /**
   * Define a hora atual pelo moment
   * @date 24/03/2023 - 20:19:18
   *
   */
  private static hour: string = moment().format('HH_mm');
  /**
   * Diretório pardrão de logs
   * @date 24/03/2023 - 20:19:18
   *
   */
  public static path = path.resolve(__dirname, '../../../logs', this.today, this.hour);

  /**
   * Formato de saída dos arquivos de logs
   * @date 24/03/2023 - 20:19:18
   *
   */
  public static fileformat = '.json';

  /**
   * Transportar logs para o console do prompt
   * @date 24/03/2023 - 20:19:18
   *
   */
  public static console = false;
}
