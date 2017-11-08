# lambda_convert_to_csv

Amazon S3 file converter (xlsx to csv)

# Description

Lambda function that reads a file from s3, converts it from a ```.xlsx``` file into a ```.csv``` file, then stores the ```.csv``` file in s3.

# Testing

```bash
$ npm test
```

# Update AWS Lambda

```bash
$ npm version patch
$ npm publish
```