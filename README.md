# theScore "the Rush" Interview Challenge
At theScore, we are always looking for intelligent, resourceful, full-stack developers to join our growing team. To help us evaluate new talent, we have created this take-home interview question. This question should take you no more than a few hours.

**All candidates must complete this before the possibility of an in-person interview. During the in-person interview, your submitted project will be used as the base for further extensions.**

### Why a take-home challenge?
In-person coding interviews can be stressful and can hide some people's full potential. A take-home gives you a chance work in a less stressful environment and showcase your talent.

We want you to be at your best and most comfortable.

### A bit about our tech stack
As outlined in our job description, you will come across technologies which include a server-side web framework (like Elixir/Phoenix, Ruby on Rails or a modern Javascript framework) and a front-end Javascript framework (like ReactJS)

### Challenge Background
We have sets of records representing football players' rushing statistics. All records have the following attributes:
* `Player` (Player's name)
* `Team` (Player's team abbreviation)
* `Pos` (Player's position)
* `Att/G` (Rushing Attempts Per Game Average)
* `Att` (Rushing Attempts)
* `Yds` (Total Rushing Yards)
* `Avg` (Rushing Average Yards Per Attempt)
* `Yds/G` (Rushing Yards Per Game)
* `TD` (Total Rushing Touchdowns)
* `Lng` (Longest Rush -- a `T` represents a touchdown occurred)
* `1st` (Rushing First Downs)
* `1st%` (Rushing First Down Percentage)
* `20+` (Rushing 20+ Yards Each)
* `40+` (Rushing 40+ Yards Each)
* `FUM` (Rushing Fumbles)

In this repo is a sample data file [`rushing.json`](/rushing.json).

##### Challenge Requirements
1. Create a web app. This must be able to do the following steps
    1. Create a webpage which displays a table with the contents of [`rushing.json`](/rushing.json)
    2. The user should be able to sort the players by _Total Rushing Yards_, _Longest Rush_ and _Total Rushing Touchdowns_
    3. The user should be able to filter by the player's name
    4. The user should be able to download the sorted data as a CSV, as well as a filtered subset
    
2. The system should be able to potentially support larger sets of data on the order of 10k records.

3. Update the section `Installation and running this solution` in the README file explaining how to run your code

### Submitting a solution
1. Download this repo
2. Complete the problem outlined in the `Requirements` section
3. In your personal public GitHub repo, create a new public repo with this implementation
4. Provide this link to your contact at theScore

We will evaluate you on your ability to solve the problem defined in the requirements section as well as your choice of frameworks, and general coding style.

### Help
If you have any questions regarding requirements, do not hesitate to email your contact at theScore for clarification.

### Installation and running this solution
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Run localstack in Docker. Forward port 4566. Disable CORS check.
    ```bash
    docker run -d --rm -it -p 4566:4566 -p 4571:4571 -e DISABLE_CORS_CHECKS=1 localstack/localstack
    ```
3. Install [node.js v14.x](https://nodejs.org/en/download/)
4. Change directory to root of this project.
5. Upgrade npm to v7.x, then install the project packages specified in `package.json`.
    ```bash
    npm install -g npm@latest
    npm install
    ```
6. Install [aws-cli v2](https://aws.amazon.com/cli/) and run `aws configure`, input the config as the following
    ```bash
    $ aws configure
    AWS Access Key ID [None]: foo
    AWS Secret Access Key [None]: bar
    Default region name [None]: us-east-1
    Default output format [None]: json
    
    // This step will create ~/.aws direcotry, with config and credentials file inside
    // These two file contains the aws-cli default
    // localstack does not care about the key/secret pair
    ```
7. Create DynamoDB table as specified in `scripts/rushing-schema.json`. When list table, you should see table with the name `players`.
    ```bash
    aws --endpoint-url=http://localhost:4566 dynamodb create-table --cli-input-json file://scripts/rushing-schema.json
    aws --endpoint-url=http://localhost:4566 dynamodb list-tables
    ```
8. Load data from `rushing.json` into DDB using my script. You should see "Script completed." with no error messages after.
    ```bash
    npm run loadData
    ```
9. Start local angular server and start using the webapp in your browser at http://localhost:4200/
    ```bash
    npm run start
    ```

Known limitations
1. An API server is always required for access control and to protect the database/backend. However due to time limitation and no data transformation or calculation required, it was not implemented for this interview. 
2. Filter by name is case sensitive. Ideally it should not be. A solution is to store name in all lower cases (maybe even alternative spell) in a separate attribute and use for searching purpose.
3. Lazy loading is not implemented. May affect old devices, browsers, and/or slow network.  One way to implement this is utilize DynamoDB's 1MB payload limit. Extra DynamoDB request can be made when needed. (Download feature would still require query all)
4. During data loading, UUID collision is not handled. It did not happen during my 20k load test. But it should be handled by retry for production work.

Tested with 10106 (10k+) records, by loading the provided data 31 times over. Data payloads are 4MB. 

Tested with 19886 (~20k) records, by loading the provided data 61 times over. Data payloads are 8MB. 

In Chrome, Edge, Firefox and Safari. UI is very responsive. All features work as intended.

As a result, the author has determined that lazy loading is not required here for modern browser/network to support 10k records. While the database design can easily support over 1 million lines.

