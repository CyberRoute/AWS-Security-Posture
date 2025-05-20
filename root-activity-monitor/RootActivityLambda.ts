
import { IAM, SNS, STS } from 'aws-sdk';
import { Handler } from 'aws-lambda';

export const handler: Handler = async (event: any): Promise<void> => {
  console.debug('Event is ---', event);

  // Retrieve details from the incoming event.
  const eventName: string = event.detail.eventName;
  const snsARN: string = process.env.SNSARN || '';
  const user: string = event.detail.userIdentity.type;

  console.debug('Event Name is ---', eventName);
  console.debug('SNSARN is ---', snsARN);
  console.debug('User Name is ---', user);

  const iam = new IAM();
  const sns = new SNS();

  try {
    // List the account aliases.
    const response = await iam.listAccountAliases().promise();
    console.debug('List Account Alias response ---', response);

    let accountAlias: string;
    try {
      if (!response.AccountAliases || response.AccountAliases.length === 0) {
        const sts = new STS();
        const identity = await sts.getCallerIdentity().promise();
        accountAlias = identity.Account || '';
        console.info('Account Alias is not defined. Account ID is', accountAlias);
      } else {
        accountAlias = response.AccountAliases[0];
        console.info('Account Alias is:', accountAlias);
      }
    } catch (innerError) {
      console.error('Client error occurred while retrieving account alias', innerError);
      return;
    }

    // Prepare SNS publish parameters.
    const subject = `Root API call-"${eventName}" detected in Account-"${accountAlias}"`.substring(0, 100);
    const message = JSON.stringify({ default: JSON.stringify(event) });

    try {
      const publishParams: SNS.PublishInput = {
        TargetArn: snsARN,
        Subject: subject,
        Message: message,
        MessageStructure: 'json'
      };

      const snsPublish = await sns.publish(publishParams).promise();
      console.debug('SNS publish response is ---', snsPublish);
    } catch (snsError) {
      console.error('An error occurred while publishing to SNS:', snsError);
    }
  } catch (error) {
    console.error('Client error occurred while listing account aliases:', error);
  }
};
