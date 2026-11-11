const readlineSync = require('readline-sync');

function getValidCidr(promptText) {
  while (true) {
    let input = readlineSync.question(promptText);
    input = input.trim().replace('/', '');
    let num = parseInt(input);
    if (!isNaN(num) && num >= 16 && num <= 30) {
      return num;
    }
    console.log('CIDR must be between /16 and /30. Try again.');
  }
}

function getPositiveInt(promptText) {
  while (true) {
    let num = readlineSync.questionInt(promptText);
    if (num > 0) {
      return num;
    }
    console.log('Must be a positive integer. Try again.');
  }
}

function getPositiveNumber(promptText) {
  while (true) {
    let num = readlineSync.questionFloat(promptText);
    if (num > 0) {
      return num;
    }
    console.log('Must be a positive number. Try again.');
  }
}

function getYesNo(promptText) {
  while (true) {
    let answer = readlineSync.question(promptText).toLowerCase().trim();
    if (answer === 'y' || answer === 'yes') {
      return true;
    }
    if (answer === 'n' || answer === 'no') {
      return false;
    }
    console.log('Please enter yes or no.');
  }
}

function runSubnetChecker() {
  console.log('\n--- Subnet Host Checker ---');
  let vpcPrefix = getValidCidr('Enter VPC CIDR (example /16): ');
  let subnetPrefix = getValidCidr('Enter Subnet CIDR (example /24): ');
  let devices = getPositiveInt('Number of devices required: ');

  let consistent = subnetPrefix >= vpcPrefix;
  let totalIps = Math.pow(2, 32 - subnetPrefix);
  let usable = totalIps - 5;

  console.log('\nResults:');
  if (consistent) {
    console.log('The subnet CIDR is consistent with the VPC CIDR.');
  } else {
    console.log('The subnet CIDR is NOT consistent with the VPC CIDR (subnet is larger than VPC).');
  }

  if (devices <= usable) {
    let unused = usable - devices;
    console.log('The subnet is sufficient for the number of devices.');
    console.log('Unused IP addresses: ' + unused);
  } else {
    let needed = devices - usable;
    console.log('The subnet is NOT sufficient for the number of devices.');
    console.log('Additional IPs needed: ' + needed);
  }
}

function runComputeSelector() {
  console.log('\n--- Compute Environment Selector ---');
  let appName = readlineSync.question('Application name: ');
  let users = getPositiveInt('Monthly users: ');
  let budget = getPositiveNumber('Monthly budget: ');
  let ha = getYesNo('High availability (yes/no): ');

  let recommendation = '';
  if (users < 1000 && !ha) {
    recommendation = 'Single EC2';
  } else if (users <= 10000 && !ha) {
    recommendation = 'EC2 + Load Balancer';
  } else {
    recommendation = 'EC2 + Load Balancer + Auto Scaling';
  }

  console.log('\nRecommended architecture for ' + appName + ': ' + recommendation);

  if (budget < 1000 && recommendation !== 'Single EC2') {
    console.log('WARNING: Your budget is under $1,000 but the recommended setup needs more than a single EC2.');
  }
  if (budget >= 1000 && budget <= 3000 && recommendation.includes('Auto Scaling')) {
    console.log('WARNING: Your budget is $1,000–$3,000 but the recommended setup includes Auto Scaling.');
  }
}

function main() {
  console.log('Infrastructure Decision Tool');
  let running = true;

  while (running) {
    console.log('\nWhat do you want to do?');
    console.log('1. Subnet Host Checker');
    console.log('2. Compute Environment Selector');
    let choice = readlineSync.question('Enter 1 or 2: ').trim();

    if (choice === '1') {
      runSubnetChecker();
    } else if (choice === '2') {
      runComputeSelector();
    } else {
      console.log('Invalid choice. Try again.');
      continue;
    }

    let again = getYesNo('\nRun another tool? (yes/no): ');
    if (!again) {
      running = false;
    }
  }

  console.log('Goodbye.');
}

main();