import {PlayerDataModel} from "../model/PlayerDataModel";

export const PLAYER_DATA_KEYS = ['Player', 'Team', 'Pos', 'Att', 'AttG', 'Yds', 'Avg', 'YdsG', 'TD', 'Lng', 'LngTD', 'First', 'FirstPercent', 'TwentyPlus', 'FortyPlus', 'FUM'];
export const PLAYER_DATA_HUMAN_READABLE = ['Player', 'Team', 'Position', 'Rushing Attempts', 'Rushing Attempts/Game', 'Total Rushing Yards', 'Rushing Average Yards/Attempt', 'Rushing Yards/Game', 'Total Rushing Touchdowns', 'Longest Rush', '(touchdown?)', 'Rushing First Downs', 'Rushing First Down%', '20+ Yards Each', '40+ Yards Each', 'Rushing Fumbles'];

class CsvDataUtils {
  private static readonly separator = ',';
  private static readonly regexPattern = /[",]/g;

  /**
   * Query all data. Iterate by LastEvaluatedKey when needed, to overcome 1MB result size limit
   *
   * @param filename
   * @param data PlayerDataModel[]
   */
  generateCsv(filename: string, data: PlayerDataModel[]) {
    if (!data?.length) {
      return;
    }
    const keys = PLAYER_DATA_KEYS;
    const csvContent =
      PLAYER_DATA_HUMAN_READABLE.join(CsvDataUtils.separator) +
      '\n' +
      data.map(row => {
        return keys.map(k => {
          // @ts-ignore
          let cell = row[k];
          cell = cell.toString();
          if (cell.search(CsvDataUtils.regexPattern) > -1) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(CsvDataUtils.separator);
      }).join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}


export const CsvUtils: CsvDataUtils = new CsvDataUtils();
