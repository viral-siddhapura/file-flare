import json
import logging
import boto3
from botocore.exceptions import ClientError
import os

bucket_name = os.environ['BUCKET_NAME']
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    
    filename = event['queryStringParameters']['filename']
    
    try:
        response = s3_client.generate_presigned_post(
                Bucket=bucket_name,
                Key=filename,
                Fields=None,
                Conditions=None,
                ExpiresIn=3600
            )
        
    except ClientError as e:
        logging.error(e)
        return None
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT'
        },
        'body': json.dumps(response)
        # 'body': json.dumps({"presigned_url": response})
    }
