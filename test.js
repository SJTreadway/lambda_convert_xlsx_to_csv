const { handler } = require('./');

const event = {
    "Records": [
      {
        "EventVersion": "1.0",
        "EventSubscriptionArn": "arn:aws:sns:us-east-1:967448100768:bls_sf:eb9f0bc4-cb3b-4ef5-a2a9-fd4b94248df1",
        "EventSource": "aws:sns",
        "Sns": {
          "SignatureVersion": "1",
          "Timestamp": "1970-01-01T00:00:00.000Z",
          "Signature": "EXAMPLE",
          "SigningCertUrl": "EXAMPLE",
          "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
          "Message": "Hello from SNS!",
          "MessageAttributes": {
            "Test": {
              "Type": "String",
              "Value": "TestString"
            },
            "TestBinary": {
              "Type": "Binary",
              "Value": "TestBinary"
            }
          },
          "Type": "Notification",
          "UnsubscribeUrl": "EXAMPLE",
          "TopicArn": "arn:aws:sns:us-east-1:967448100768:bls_sf:eb9f0bc4-cb3b-4ef5-a2a9-fd4b94248df1",
          "Subject": "TestInvoke"
        }
      }
    ]
  };

  event.Records[0].Sns.Message = JSON.stringify(event.Records[0].Sns.Message);
  
  handler(event, {}, console.error.bind(console));