const AWS = require ('aws-sdk');

AWS.config.update({
  accessKeyId: 'ACCESS_KEY',
  secretAccessKey: 'SECRET_KEY',
  region: 'REGION'
});

const sns = new AWS.SNS();

sns.createPlatformEndpoint({
  PlatformApplicationArn: 'PLATFORM_APPLICATION_ARN',
  Token: 'DEVICE_TOKEN'
}, (error, data) => {
  if (error) {
    console.log({ error });
  } else {
    const endpointArn = data.EndpointArn;

    //Payload for ios
    let payload = {
      default: 'Test',
      APNS: {
        aps: {
          alert: 'Test alert',
          sound: 'default',
          badge: 1
        }
      }
    };

    payload.APNS = JSON.stringify(payload.APNS);

    // Stringify the entire message payload
    payload = JSON.stringify(payload);

    sns.publish({
      Message: payload,
      MessageStructure: 'json',
      TargetArn: endpointArn
    }, (error, data) => {
      if (error) {
        console.log({ error });
      }
      console.log({ data });
    });
  }
});