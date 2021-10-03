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
  console.info("Script completed.");
}

function setPutPayload(player) {
  return {
    TableName: "players",
    Item: {
      "id": uuidv4(),
      "Player": player.Player,
      "Team": player.Team,
      "Pos": player.Pos,
      "Att": player.Att,
      "AttG": player['Att/G'],
      "Yds": player.Yds.toString(),
      "Avg": player.Avg,
      "YdsG": player['Yds/G'],
      "TD": player.TD.toString(),
      "Lng": player.Lng.toString(),
      "First": player['1st'],
      "FirstPercent": player['1st%'],
      "TwentyPlus": player['20+'],
      "FortyPlus": player['40+'],
      "FUM": player.FUM,
      "PlayerStatus": player.Status
    }
  };
}

main();
