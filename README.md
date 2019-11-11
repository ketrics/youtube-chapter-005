## Create a Serverless Api in AWS using Serverless Framework

### Create Command
Create sls sample files based in the aws-nodejs sample:
    sls create -t aws-nodejs -n myapi

### serverless.yml
After removing all the comments we will have the following code:

    service: myapi

    provider:
    name: aws
    runtime: nodejs10.x

    environment:
        variable1: value1

    functions:
    hello:
        handler: handler.hello

### Deploy command
    sls deploy

### Remove command
    sls remove

