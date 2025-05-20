import { Handler } from 'aws-lambda';
import { EC2Client, RevokeSecurityGroupIngressCommand } from '@aws-sdk/client-ec2';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

/**
 * The Lambda handler checks if the event relates to one of the monitored security groups.
 * If the event is for AuthorizeSecurityGroupIngress on a monitored group, it revokes the ingress rule 
 * and publishes a notification.
 */
export const handler: Handler = async (event: any): Promise<any> => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (!event.detail || !event.detail.eventName) {
    return { result: "Failure", message: "Lambda not triggered by a valid event" };
  }

  const requestParams = event.detail.requestParameters;
  let groupId = requestParams.groupId;
  
  console.log(`Raw groupId: [${groupId}], length: ${groupId.length}`);

  groupId = groupId.trim();

  const monitoredGroups = process.env.MONITORED_SECURITY_GROUPS
    ? process.env.MONITORED_SECURITY_GROUPS.split(',').map(id => id.trim())
    : [];

  console.log("Monitored groups:", monitoredGroups.map(g => `[${g}]`));

  if (!groupId || !monitoredGroups.includes(groupId)) {
    console.log(`Security group [${groupId}] is not monitored. Monitored groups: ${monitoredGroups.join(', ')}`);
    return { result: "Ignored", message: "Event not applicable to monitored security groups" };
  }

  if (event.detail.eventName === 'AuthorizeSecurityGroupIngress') {
    const result = await revokeSecurityGroupIngress(event.detail);
    const message = `AUTO-MITIGATED: Ingress rule removed from security group: ${groupId} by ${result.userName}. Details: ${JSON.stringify(result.ipPermissions)}`;

    const snsClient = new SNSClient({});
    await snsClient.send(new PublishCommand({
      TargetArn: process.env.SNS_TOPIC_ARN,
      Message: message,
      Subject: "Auto-mitigation successful"
    }));

    return { result: "Success", message };
  }

  return { result: "Ignored", message: "Event did not match required criteria" };
};

/**
 * Revoke security group ingress rules as specified in the event.
 */
async function revokeSecurityGroupIngress(detail: any): Promise<any> {
  const requestParameters = detail.requestParameters;
  const ipPermissions = normalizeParameterNames(requestParameters.ipPermissions.items);

  const ec2Client = new EC2Client({});
  const command = new RevokeSecurityGroupIngressCommand({
    GroupId: requestParameters.groupId,
    IpPermissions: ipPermissions
  });
  await ec2Client.send(command);

  return {
    groupId: requestParameters.groupId,
    userName: detail.userIdentity.arn,
    ipPermissions: ipPermissions
  };
}

/**
 * Normalize the parameter names from the event structure so they match the expected format by the SDK.
 */
function normalizeParameterNames(ipItems: any[]): any[] {
  const newIpItems: any[] = [];

  for (const ipItem of ipItems) {
    const newIpItem: any = {
      IpProtocol: ipItem.ipProtocol,
      FromPort: ipItem.fromPort,
      ToPort: ipItem.toPort
    };

    let rangeKey = 'ipRanges';
    let permissionKey = 'IpRanges';
    let addressKey = 'cidrIp';
    let addressKeyCapitalized = 'CidrIp';

    if (ipItem.ipv6Ranges && ipItem.ipv6Ranges.items && ipItem.ipv6Ranges.items.length > 0) {
      rangeKey = 'ipv6Ranges';
      permissionKey = 'Ipv6Ranges';
      addressKey = 'cidrIpv6';
      addressKeyCapitalized = 'CidrIpv6';
    }

    const ipRanges: any[] = [];
    for (const item of ipItem[rangeKey].items) {
      ipRanges.push({ [addressKeyCapitalized]: item[addressKey] });
    }
    newIpItem[permissionKey] = ipRanges;

    newIpItems.push(newIpItem);
  }

  return newIpItems;
}
