const {handler} = require('./');

const event = {
          Records:
              [{
                  eventVersion     : '2.0',
                  eventTime        : '1970-01-01T00:00:00.000Z',
                  s3               : {
                      configurationId: 'testConfigRule',
                      object         :
                          {
                              eTag     : 'c80513185be9b106787e43ca0512e8ea',
                              sequencer: '0A1B2C3D4E5F678901',
                              key      : 'BLS_SF',
                              size     : 4751883
                          },
                      bucket         :
                          {
                              arn          : 'arn:aws:s3:::bls-sf',
                              name         : 'bls-sf',
                              ownerIdentity: {principalId: 'EXAMPLE'}
                          },
                      s3SchemaVersion: '1.0'
                  },
                  awsRegion        : 'us-east-1',
                  eventName        : 'ObjectCreated:Put',
                  eventSource      : 'aws:s3'
              }]
      }
;

handler(event, {}, console.error.bind(console));