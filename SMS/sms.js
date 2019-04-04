const AWS = require('aws-sdk');

AWS.config.update({
  region: 'region', // https://docs.aws.amazon.com/sns/latest/dg/sms_supported-countries.html follow this link for supported region
  accessKeyId: 'access key',
  secretAccessKey: 'secret key'
});

const sns = new AWS.SNS();

const params = {
  Message: 'Your OTP is 123456',
  MessageStructure: 'string',
  PhoneNumber: '+91XXXXXXXXX',
  MessageAttributes: {
    'AWS.SNS.SMS.SMSType': {
      DataType: 'String',
      StringValue: 'Transactional' //[Transactional or promotional]
    },
    'AWS.SNS.SMS.SenderID': {
      DataType: 'String',
      StringValue: 'Test'
    }
  }
};
sns.publish(params, (error, success) => {
  if (err) {
    console.log({error}); // an error occurred
  } else {
    console.log({success}); // successful response
  }
});