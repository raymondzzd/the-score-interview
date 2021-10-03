import {DynamoDB} from "aws-sdk";
import * as AWS from 'aws-sdk';
import {PlayerDataModel} from "../model/PlayerDataModel";
import {DocumentClient} from "aws-sdk/clients/dynamodb";

class DynamoDBClient {
  constructor() {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: 'xxxx',
      secretAccessKey: 'xxxx'
    });
  }

  getDynamoDBClient = (): DynamoDB => {
    const ddb: DynamoDB = new DynamoDB({
      endpoint: 'http://localhost:4566'
    });
    return ddb;
  };

  getDynamoDBDocumentClient = (): DynamoDB.DocumentClient => {
    const ddb: DynamoDB.DocumentClient = new DynamoDB.DocumentClient({
      endpoint: 'http://localhost:4566'
    });
    return ddb;
  };

  /**
   * Query all data. Iterate by LastEvaluatedKey when needed, to overcome 1MB result size limit
   *
   * @param params query parameters
   * @param allData use null to start new request
   */
  async queryAllData(params: any, allData: any[]): Promise<any[]> {
    console.debug("Querying Table");
    try {
      const data = await this.getDynamoDBDocumentClient().query(params).promise();
      if (allData == null) {
        allData = [];
      }
      if (data && data['Items'] && data['Items'].length > 0) {
        allData = [...allData, ...data['Items']];
      }
      if (data && data.LastEvaluatedKey) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        return await this.queryAllData(params, allData);
      }

      return allData;
    } catch (error) {
      console.error("Failed when query Dynamodb", error);
      throw error;
    }
  }

  async getAllData(gsi: string, sortOrder: boolean): Promise<PlayerDataModel[]> {
    const params: DocumentClient.QueryInput = {
      TableName: "players",
      IndexName: gsi,
      KeyConditionExpression: "PlayerStatus = :PlayerStatus",
      ExpressionAttributeValues: {
        ":PlayerStatus": "ACTIVE"
      },
      ScanIndexForward: sortOrder
    };
    try {
      console.debug(`Params: ${JSON.stringify(params)}`);
      const result = await this.queryAllData(params, null);
      return result.length > 0 ? result as PlayerDataModel[] : [];
    } catch (error) {
      return [];
    }
  }

  async getByPlayerName(gsi: string, sortOrder: boolean, filter: string): Promise<PlayerDataModel[]> {
    const params: DocumentClient.QueryInput = {
      TableName: "players",
      IndexName: gsi,
      KeyConditionExpression: "PlayerStatus = :PlayerStatus",
      ExpressionAttributeValues: {
        ":PlayerStatus": "ACTIVE",
        ":PlayerName": filter
      },
      FilterExpression: 'contains (Player, :PlayerName)',
      ScanIndexForward: sortOrder
    };
    try {
      console.debug(`Params: ${JSON.stringify(params)}`);
      const result = await this.queryAllData(params, null);
      return result.length > 0 ? result as PlayerDataModel[] : [];
    } catch (error) {
      return [];
    }
  }
}

export const dynamoDBClient = new DynamoDBClient();
