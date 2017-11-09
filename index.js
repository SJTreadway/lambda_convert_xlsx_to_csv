'use strict';
console.log('Loading Function..');

const aws  = require('aws-sdk');
const fs   = require('fs');
const xlsx = require('xlsx');
const s3   = new aws.S3();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const bucket   = JSON.parse(event.Records[0].s3.bucket.name);
    const fileName = JSON.parse(event.Records[0].s3.object.key);
    convertToCSV(bucket, fileName);
};

function convertToCSV (bucket, fileName) {
    const params = {
        Bucket: bucket,
        Key   : fileName
    };
    const name   = fileName.substring(0, fileName.indexOf('.'));
    // retrieve xlsx file & convert to csv
    return getS3Object(params);
}

function getS3Object (params) {
    return s3.getObject(params, (err, data) => {
        const writer = fs.createWriteStream(`${ name }.csv`);
        console.log('Streaming to csv file..', data);
        const wb     = xlsx.read(data.Body, { type: 'buffer' });
        return xlsx.stream.to_csv(wb).pipe(writer).on('finish', () => {
            return fs.readFile(`${ name }.csv`, (err, data) => {
                console.log('data: ', data);
                params.Body = data;
                return err ? err : fs.unlink(`${ name }.csv`, () => uploadToS3(params));
            });
        });
    })
}

function uploadToS3 (params) {
    s3.putObject(params, (err, data) => {
        console.log('Uploading object to s3..', data);
        return err ? err : copyToS3(params);
    });
}

function copyToS3 (params) {
    const key = params.Key;
    params.Key = `archive/${ key }`;
    s3.putObject(params, (err, data) => {
        console.log('Copying object to archive directory..', data);
        params.Key = key;
        return err ? err : removeFromS3(params);
    });
}

function removeFromS3 (params) {
    s3.deleteObject(params, (err, data) => {
        console.log('Removing object from s3..');
        return err ? err : data;
    });
}