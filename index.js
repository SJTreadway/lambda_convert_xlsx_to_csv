'use strict';
console.log('Loading Function...');

const aws = require('aws-sdk');
const async = require('async');
const fs = require('fs');

function convertToCSV () {
    const s3 = new aws.S3();

    // retrieve xlsx file
    // s3.getObject();

    // convert to csv

    // overwrite xlsx file with converted file
    // s3.putObject();
}