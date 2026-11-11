Infrastructure Decision Tool

This program lets you choose between two tools:

1. Subnet Host Checker
2. Compute Environment Selector

How to run:
- npm install
- node index.js

Example where the subnet is sufficient:
VPC CIDR: /16
Subnet CIDR: /24
Devices needed: 100
Result: Subnet is consistent with the VPC. The subnet is sufficient. Unused IP addresses: 151

Example where the subnet is not sufficient:
VPC CIDR: /20
Subnet CIDR: /28
Devices needed: 20
Result: Subnet is consistent with the VPC. The subnet is not sufficient. Additional IPs needed: 9