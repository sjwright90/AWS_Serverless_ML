import sys
import sklearn
import pandas as pd
import boto3
import pickle
import json
import base64


def handler(event, context):
    s3 = boto3.resource("s3")

    # Load the model from S3
    model = pickle.loads(
        s3.Bucket("bucketnamewheremodelives")
        .Object("binary_sklearn_model.pkl")
        .get()["Body"]
        .read()
    )

    # Parse the input data from the event
    # Could probably simplify this depending
    # on how your API Gateway is set up

    # Check hierarchy of the input json
    if "body" not in event:
        body = event
    else:
        body = event["body"]

    # Check if the input data is base64 encoded
    if "isBase64Encoded" not in event:
        is_base64_encoded = False
    else:
        is_base64_encoded = event["isBase64Encoded"]

    # Decode the input data if it is base64 encoded
    if is_base64_encoded:
        decoded_body = base64.b64decode(body).decode("utf-8")
        parsed_body = json.loads(decoded_body)
    else:
        parsed_body = json.loads(body)

    # Convert the input data to a pandas DataFrame
    # Expects the body of the request to be a json object with the keys as the feature names
    # and the values as the feature values
    # Names from input form MUST MATCH the names in the when it was built
    df = pd.DataFrame(parsed_body, index=[0], columns=model["scaler"].feature_names_in_)

    # If missing values in the input data, return an error
    if df.isna().values.any():
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            },
            "body": json.dumps(
                {
                    "message": f"Error-Bad input values in: {df.columns[df.isna().any()].tolist()}"
                }
            ),
        }

    pred_proba = model.predict_proba(df)

    # Get the probability of a POSITIVE outcome, round to 3 decimal places
    proba = round(pred_proba[0, -1], 3)

    # Return the probability of a POSITIVE outcome
    # in the response
    # The js function expects a key of "pred_proba"
    # with a numerical value
    response = {"pred_proba": proba}
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        },
        "body": json.dumps(response),
    }
