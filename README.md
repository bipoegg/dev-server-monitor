<h1 align="center">dev-server-monitor</h1>
<h5 align="center">A Node.js package monitor if develop branch expired</h5>

<br />

## Requirements
Node.js 8.9.1 or greater

## Assumption
1. Chat bot will publish message to the topic 'v1/feature' through MQTT,
   it will have the message format as {feature: branchName}, it needs to setup mqtt path/username/password.
2. After receive MQTT message it will save featureBranch info to the DB with name: featureBranch,
   it needs to setup DB path.
3. Create new feature (Server) instance if it doesn't exist. Run it if it has generated.
   (For now, it only support awsServer, it needs to setup accessKeyId/secretAccessKey)
4. Periodically check AWS server health, needs to setup period.healthCheck
5. Need to setup the feature repository folder, it is used to check last commit time over three days.
   (Not the best solution, it will describe later.)
6. Stop AWS instance if last commit expired three days and update the DB.
7. Further statistics can also access featureBranch DB to get those monitor server status.
8. Can add more realInstance with different kinds of Server.


## Reasons
1. Why MQTT: It is easy to implement for setup and test.
   ex: mosquitto_pub -h localhost -p 1883 -u "cloud" -P "cloud" -t "v1/feature" -m '{"feature":"dev_add_function"}'
2. Why Save featureBranch info: Keep those state to help us tracking those expired featureBranch instance,
   and it can also do further analysis.
3. Why Check featureBranch repository folder: It's not a good idea to check a specific folder. It will be better to
   implement github webhooks for each commit of the repository and add lastCommitTime within the DB.

## Config
1. db: needs to setup path and option
2. mqtt: needs to setup path, userName and password
3. aws: needs to setup accessKeyId and secretAccessKey
4. featureBranch: needs to setup featureBranch repository folder
5. period: needs to setup check interval of health and featureBranch

## Run
```js
npm start
```

## TODO
1. Needs to implement real aws server part, it doesn't fully tested for the EC2 createion.
2. Search //TODO, to complete it for the real usage.
3. aws start/stop not really sync with DB under current designed.