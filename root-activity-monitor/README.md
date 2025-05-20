# Root Activity Monitor

This project includes two implementations of a Lambda function that monitors AWS root user activity:

## File: RootActivityLambda.ts (TypeScript Implementation)

Purpose:
This is a TypeScript port of the Python implementation with the same functionality. It:

Retrieves the account alias (or falls back to the account ID if an alias is not defined).

Publishes an SNS notification with a subject indicating the type of API call detected and the account details.

The SNS message body contains the full event details in JSON format.

### Building the TypeScript Version

To build the TypeScript version of the Lambda function:

1. Install dependencies:
```
npm install
```

2. Compile the TypeScript code:
```
tsc --outDir dist RootActivityLambda.ts
```

3. Package Your Lambda Deployment::
```
zip -r lambda.zip dist node_modules package.json
```

This will create a `lambda.zip` file that can be uploaded to an S3 bucket for deploy via the CloudFormation template.

## File: RootAPIMonitor.json

Purpose:
This CloudFormation template provisions the AWS resources required by the solution, including:

An SNS Topic for notifications.

A CloudWatch Events rule that listens for API calls and console sign-ins by the root user.

A Lambda function that processes events and publishes notifications.

An IAM Role and Policy granting the Lambda function permissions to access CloudWatch Logs, SNS, and to list IAM account aliases.

Lambda permissions for CloudWatch Events to invoke the function.

## File: test.json

Purpose:
This file is a sample event used to test the Lambda function from the AWS Lambda console. It simulates a CloudTrail event where an API call is made by the root user.