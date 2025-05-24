# AWS Credentials Exposed Monitor

This serverless application monitors and responds to AWS Health events for exposed credentials. When AWS detects that your credentials have been exposed, this application will automatically:

1. Report on exposed access key pair
2. Send notifications to your security team

### Compilation and Deployment

1. Clone the repository
   ```
   git clone <repository-url>
   cd credentials-exposed
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Compile TypeScript to JavaScript
   ```
   npx tsc
   ```
   This compiles the TypeScript files from the `lambda_functions` directory to the `dist` directory.

4. Deploy
   ```
   sls deploy
   ```
   
## Architecture

This application consists of two Lambda functions:

- `report_access_keys.ts`: Identifies and reports exposed access key pair
- `notify_security.ts`: Sends notifications to security teams via SNS

The workflow is orchestrated by an AWS Step Function defined in the serverless.yml.

Note: this typescript version was ported from the original in python that lives here https://github.com/aws/aws-health-tools/tree/master/automated-actions/AWS_RISK_CREDENTIALS_EXPOSED