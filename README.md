# AWS Security

A comprehensive collection of Lambda functions for strengthening AWS account security through automated detection, notification, and remediation.

<p align="center">
  <img src="https://img.shields.io/badge/AWS-Security%20Controls-orange" alt="AWS Security Banner" />
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/Node.js-20.x-green" alt="NodeJS" />
</p>

## Overview

This repository contains a suite of AWS Lambda-based security controls designed to enhance your AWS infrastructure security posture. Each component follows security best practices and addresses specific AWS security concerns:

- 🔒 **Automated Security Controls**: Detect and respond to security misconfigurations
- 🚨 **Proactive Notifications**: Receive alerts about potential security issues
- 🛡️ **Remediation Capabilities**: Automatic or guided remediation options
- 📊 **Compliance Support**: Help maintain compliance with security standards

## Security Controls Included

| Control | Description |
|---------|-------------|
| **VPC Security Group Auto-Response** | Automatically revokes unauthorized ingress rules from monitored security groups
| **Root Account Activity Monitor** | Monitors and alerts on any activity performed by the AWS account root user
| **Unused Security Group Reporter** | Identifies and reports security groups that are not attached to any resources
| **AWS Credentials Exposed Monitor** | Automatically responds to AWS Health events for exposed credentials 

## Control Descriptions

### VPC Security Group Auto-Response

Automatically monitors and revokes unauthorized ingress rules from specified security groups. Helps prevent security group misconfigurations that could expose resources to unauthorized access.

**Key Features:**
- Real-time monitoring of security group changes via EventBridge
- Automatic revocation of unauthorized ingress rules
- Notification of security incidents via SNS

### Root Account Activity Monitor

Monitors any activity performed using the AWS account root user and immediately sends alerts. Helps enforce the AWS security best practice of not using the root user for day-to-day operations.

**Key Features:**
- Real-time detection of root user activity via CloudTrail
- Immediate notifications via SNS for security team response
- Detailed logging of all root account actions
- Optional automatic IP blocking via WAF for suspicious root logins

### Unused Security Group Reporter

Identifies security groups that are not attached to any resources, helping to maintain a clean AWS environment and reduce potential attack surface.

**Key Features:**
- Regular scanning of all security groups across all VPCs
- Identification of orphaned or unused security groups
- Detailed reports with age and rule information
- Optional automatic cleanup of unused groups

### AWS Credentials Exposed Monitor

Automatically responds to AWS Health events when AWS detects that your credentials have been exposed publicly (e.g., in GitHub repositories, public forums, etc.).

**Key Features:**
- Integration with AWS Health API to detect exposed credentials
- Automatic disabling of compromised IAM access keys
- Detailed notifications including affected resources and exposure source
- Comprehensive incident response guidance

## Customization

Each control includes configuration options in the `serverless.yml` file:

- **Notification Settings**: Configure SNS topics and endpoints
- **Schedule Frequency**: Adjust the frequency of scheduled checks
- **Custom Parameters**: Modify thresholds, resource targets, etc.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-control`)
3. Commit your changes (`git commit -m 'Add some amazing control'`)
4. Push to the branch (`git push origin feature/amazing-control`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- AWS Security Best Practices documentation
- AWS Well-Architected Framework
- Serverless Framework team

---

**Note:** These security controls are designed to enhance your security posture but should be part of a comprehensive security strategy. Always test controls in a non-production environment before deploying to production.