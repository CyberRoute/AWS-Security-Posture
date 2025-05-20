import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});
const TOPIC = process.env.TOPIC_ARN!;

export const lambdaHandler = async (event: any): Promise<void> => {
  console.log("Publishing security notification:", JSON.stringify(event));
  await sns.send(
    new PublishCommand({
      TopicArn: TOPIC,
      Subject: `Exposed IAM Key for ${event.username}`,
      Message: JSON.stringify(event, null, 2),
    }),
  );
};
