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

    let payload = {
      default: 'Test',
      GCM: {
        notification: {
          body: 'Test body',
          title: 'Test title',
          sound: 'default'
        },
        data: {
          key: 'key value',
          key2: 'key2 value'
        }
      }
    }
    
    payload.GCM = JSON.stringify(payload.GCM);

    //Stringify the entire message payload
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