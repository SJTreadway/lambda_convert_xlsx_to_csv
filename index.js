'use strict';
console.log('Loading Function..');

const aws    = require('aws-sdk');
const fs     = require('fs');
const xlsx   = require('xlsx');
const moment = require('moment');
const s3     = new aws.S3();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const bucket   = event.Records[0].s3.bucket.name;
    const key      = event.Records[0].s3.object.key;
    const fileName = key.indexOf('.') === -1 ? key : key.substring(0, key.indexOf('.'));
    convertToCSV(bucket, key, fileName);
};

function convertToCSV (bucket, key, fileName) {
    console.log('Streaming to csv file..');
    const params = {
        Bucket: bucket,
        Key   : key
    };
    // retrieve xlsx file & convert to csv
    return s3.getObject(params, (err, data) => {
        const writer = fs.createWriteStream(`/tmp/${ fileName }.csv`);
        const wb = xlsx.read(data.Body, {type: 'buffer'});
        // TODO: Need a way to pass through specific sheet #'s that we want to convert to csv
        const ws = wb.Sheets[wb.SheetNames[0]];
        return xlsx.stream.to_csv(ws).pipe(writer).on('finish', () => {
            return fs.readFile(`/tmp/${ fileName }.csv`, (err, data) => {
                params.Body = data;
                return err ? err : uploadToS3(params, fileName);
            });
        });
    })
}

function uploadToS3 (params, fileName) {
    console.log('Uploading csv file to S3..');
    params.Key = `${ fileName }.csv`;
    return s3.putObject(params, (err) => {
        return err ? err : archiveInS3(params, fileName);
    });
}

function archiveInS3 (params, fileName) {
    console.log('Copying xlsx file to archive directory..');
    const date = moment().format();
    delete params.Body;
    params.CopySource = `/${ params.Bucket }/${ fileName }`;
    params.Key = `archive/${ fileName }_${ date }`;
    return s3.copyObject(params, (err) => {
        return err ? err : removeFromS3(params, fileName);
    });
}

function removeFromS3 (params, fileName) {
    console.log('Removing original xlsx from S3..');
    params.Key = `${ fileName }`;
    delete params.CopySource;
    return s3.deleteObject(params, (err) => {
        return err ? err : fs.unlink(`/tmp/${ fileName }.csv`, (err) => err ? err : console.log('Successful!'));
    });
}