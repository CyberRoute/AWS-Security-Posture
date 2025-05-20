# Automatically Revert and Receive Notifications About Changes to specific Amazon VPC Security Groups

1. Install dependencies
   ```
   npm install
   ```

3. Compile TypeScript to JavaScript
   ```
   npx tsc
   ```
4. Deploy using AWS SAM CLI
   
   sls deploy --stage <"prd|dev"> --param="securityGroups=sg-06d37a8ac35bb961b"
   ```