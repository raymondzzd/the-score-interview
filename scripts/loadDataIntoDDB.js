const AWS = require("aws-sdk");
const fs = require('fs');
async function main() {
    AWS.config.update({
        region: "us-east-1",
        endpoint: "http://localhost:4566"
    });
    const docClient = new AWS.DynamoDB.DocumentClient();
    const filePath = `./rushing.json`;
    const rawData = fs.readFileSync(filePath, 'utf-8');
    let allPlayers = JSON.parse(rawData);
    allPlayers.forEach(function (player) {
        console.info("Processing: " + player.Player);
        let params = {
            TableName: "players",
            Item: {
                "Player": player.Player,
                "Team": player.Team,
                "Pos": player.Pos,
                "Att": player.Att,
                "AttG": player['Att/G'],
                "Yds": player.Yds,
                "Avg": player.Avg,
                "YdsG": player['Yds/G'],
                "TD": player.TD,
                "Lng": player.Lng,
                "First": player['1st'],
                "FirstPercent": player['1st%'],
                "TwentyPlus": player['20+'],
                "FortyPlus": player['40+'],
                "FUM": player.FUM,
                "Status": player.Status
            }
        };
        docClient.put(params, function (err, data) {
            if (err) {
                console.info("Unable to add player: " + player.Player);
                console.error("Error JSON: " + JSON.stringify(err));
            }
            else {
                console.info("PutItem succeeded: " + player.Player);
            }
        });
    });
}
main();
