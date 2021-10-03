const AWS = require("aws-sdk");
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

async function main() {
  AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:4566"
  });
  const docClient = new AWS.DynamoDB.DocumentClient();
  console.info("Script started...");
  const filePath = `./rushing.json`;
  const rawData = fs.readFileSync(filePath, 'utf-8');
  let allPlayers = JSON.parse(rawData);
  // 10k load
  for (let i = 0; i < 30; i++) {
    allPlayers.forEach(function (player) {
      // console.debug("Processing: " + player.Player);
      const params = setPutPayload(player);
      docClient.put(params, function (err, data) {
        if (err) {
          console.error("Unable to add player: " + player.Player);
          // console.debug("Error JSON: " + JSON.stringify(err));
        } else {
          // console.debug("PutItem succeeded: " + player.Player);
        }
      });
    });
  }
  console.info("Script completed.");
}

function setPutPayload(player) {
  const LngTD = player.Lng.toString().indexOf('T') > -1;
  return {
    TableName: "players",
    Item: {
      "id": uuidv4(), // TODO: need to checking collision and retry
      "Player": player.Player,
      "Team": player.Team,
      "Pos": player.Pos,
      "Att": player.Att,
      "AttG": player['Att/G'],
      "Yds": Number(player.Yds.toString().replace(",", "")),
      "Avg": player.Avg,
      "YdsG": player['Yds/G'],
      "TD": player.TD,
      "Lng": Number(player.Lng.toString().replace("T", "")),
      "LngTD": LngTD,
      "First": player['1st'],
      "FirstPercent": player['1st%'],
      "TwentyPlus": player['20+'],
      "FortyPlus": player['40+'],
      "FUM": player.FUM,
      "PlayerStatus": "ACTIVE"
    }
  };
}

main();
