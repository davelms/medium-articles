const request = require('request-promise')
const aws = require('aws-sdk');

const s3 = new aws.S3();

exports.handler = async (event, context, callback) => {

  const options = {
    uri: process.env.SOURCE_URI,
    encoding: null,
    resolveWithFullResponse: true
  };

  const response = await request(options)

  const s3Response = await s3.upload({
    Bucket: process.env.S3_BUCKET,
    Key: process.env.S3_KEY,
    ContentType: response.headers['content-type'],
    Body: response.body
  }).promise()

  return callback(null, s3Response);

};
