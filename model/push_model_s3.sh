#!/bin/bash

# Variables
MODEL_FILE="binary_sklearn_model.pkl"
S3_BUCKET="bucketnamewheremodelives"
S3_PATH="s3://${S3_BUCKET}/${MODEL_FILE}"

# Check if the model file exists
if [ ! -f "$MODEL_FILE" ]; then
    echo "Error: ${MODEL_FILE} does not exist."
    exit 1
fi

# Upload the model file to S3
aws s3 cp "$MODEL_FILE" "$S3_PATH"

# Check if the upload was successful
if [ $? -eq 0 ]; then
    echo "Successfully uploaded ${MODEL_FILE} to ${S3_PATH}"
else
    echo "Failed to upload ${MODEL_FILE} to ${S3_PATH}"
    exit 1
fi