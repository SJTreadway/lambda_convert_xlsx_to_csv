'use strict';
console.log('Loading Function..');

const aws  = require('aws-sdk');
const fs   = require('fs');
const xlsx = require('xlsx');
const s3   = new aws.S3();

exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('EVENT: ', event);
    const bucket   = event.Records[0].s3.bucket.name;
    const key      = event.Records[0].s3.object.key;
    const fileName = key.indexOf('.') === -1 ? key : key.substring(0, key.indexOf('.'));
    convertToCSV(bucket, key, fileName);
};

function convertToCSV (bucket, key, fileName) {
    const params = {
        Bucket: bucket,
        Key   : key
    };
    // retrieve xlsx file & convert to csv
    return s3.getObject(params, (err, data) => {
        const writer = fs.createWriteStream(`${ fileName }.csv`);
        console.log('Streaming to csv file..');
        const wb = xlsx.read(data.Body, {type: 'buffer'});
        // TODO: Need a way to pass through specific sheet #'s that we want to convert to csv
        const ws = wb.Sheets[wb.SheetNames[0]];
        return xlsx.stream.to_csv(ws).pipe(writer).on('finish', () => {
            return fs.readFile(`${ fileName }.csv`, (err, data) => {
                params.Body = data;
                return err ? err : uploadToS3(params, fileName);
            });
        });
    })
}

function uploadToS3 (params, fileName) {
    return s3.putObject(params, (err) => {
        console.log('Uploading object to s3..');
        return err ? err : copyToS3(params, fileName);
    });
}

function copyToS3 (params, fileName) {
    const key  = params.Key;
    params.Key = `${ fileName }.csv`;
    return s3.putObject(params, (err) => {
        console.log('Saving object to S3 as CSV..');
        const date = new Date().toLocaleDateString();
        params.Key = `archive/${ date }_${ fileName }`;
        return err ? err : s3.putObject(params, (err) => {
            console.log('Copying object to archive directory..');
            params.Key = key;
            return err ? err : removeFromS3(params, fileName);
        });
    });
}

function removeFromS3 (params, fileName) {
    delete params.Body;
    return s3.deleteObject(params, (err) => {
        console.log('Removing original object from s3..');
        return err ? err : fs.unlink(`./${ fileName }.csv`, (err) => err ? err : console.log('Successfully Deleted!'));
    });
}