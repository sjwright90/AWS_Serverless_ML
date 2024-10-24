﻿# AWS Serverless ML

This repo contains components to build a password protected serverless web app on AWS to provide predictions from an ML model

The high level AWS architecture is shown below:

![alt text](https://github.com/sjwright90/AWS_Serverless_ML/blob/main/images/AWS_Architecture.png)

## Architecture components
**AWS Amplify:** Deploys and hosts the web application using source code from GitHub repository<br>
**Github:** Stores the source code for the web application<br>
**AWS Cognito:** Provides secure user authentication adn manages login credentials<br>
**AWS API Gateway:** Routes client requests to backend services and returns the results<br>
**AWS Labmda:** Runs Docker container to make predictions, in response to API request<br>
**Docker:** Contains the environment, dependencies, and code to run predictive modeling, executed by AWS Lambda<br>
**AWS ECR:** Stores and manages the Docker container image<br>
**AWS S3:** Holds the binary version of the ML model, which the Docker accesses during run time<br>

AWS API Gateway:
https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html

Docker image for Lambda:
https://docs.aws.amazon.com/lambda/latest/dg/images-create.html

AWS Elastic Container Registry:
https://aws.amazon.com/ecr/getting-started/

AWS Amplify:
https://docs.aws.amazon.com/amplify/latest/userguide/setting-up-GitHub-access.html
https://docs.amplify.aws/react/start/
