# Lambda Report Security Group

This AWS Lambda function automatically reports unused security groups and tracks via CloudWatch metrics.

## Features

- Identifies unused security groups by checking:
  - EC2 instances
  - Network interfaces
  - Lambda functions using VPCs
- Report unused security groups and logs with the names and ids.
- Pushes metrics to CloudWatch for tracking.

## Setup

1. Install dependencies:
```sh
npm install
```

## Deploy the Lambda function:
```sh
serverless deploy 
```


