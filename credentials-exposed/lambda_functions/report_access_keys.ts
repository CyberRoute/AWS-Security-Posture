import { IAMClient, GetAccessKeyLastUsedCommand } from "@aws-sdk/client-iam";

const iam = new IAMClient({});

export const lambdaHandler = async (event: any): Promise<any> => {
  console.log("Received AWS Health event:", JSON.stringify(event));
  const accountId = event.account as string;
  const timeDiscovered = event.time as string;
  const exposedKey = event.detail.affectedEntities[0].entityValue as string;

  console.log(`Looking up username for key ${exposedKey}…`);
  const resp = await iam.send(
    new GetAccessKeyLastUsedCommand({ AccessKeyId: exposedKey }),
  );
  if (!resp.UserName) {
    throw new Error(`No IAM username found for access key ${exposedKey}`);
  }

  return {
    account_id: accountId,
    time_discovered: timeDiscovered,
    username: resp.UserName,
    exposed_key: exposedKey,
  };
};
