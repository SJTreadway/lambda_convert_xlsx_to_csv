# lambda_convert_xlsx_to_csv

Amazon S3 file converter (xlsx to csv)

# Description

Lambda function that reads an ```.xlsx``` file from S3, creates a ```.csv``` copy of the file within S3, then archives the ```.xlsx``` file.

# Testing

```bash
$ npm run test
```

# Update AWS Lambda

```bash
$ npm version patch
$ npm run publish
```
