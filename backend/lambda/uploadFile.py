import json
import boto3
import uuid
import os

s3_client = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']  # Set this environment variable in the Lambda configuration

def lambda_handler(event, context):
    
    print(f"Received event: {json.dumps(event)}")
    
    try:
        # Extract file details from the event
        body = json.loads(event['body'])
        print(body)
        files = body['files']  # Expecting a list of file details: [{'fileName': 'name1', 'fileType': 'type1'}, ...]
        print(files)
        
        response = []
        
        for file in files:
            file_name = file['fileName']
            file_type = file['fileType']
            key = f"{file_name}"

            # Generate pre-signed POST URL
            presigned_post = s3_client.generate_presigned_post(
                Bucket=bucket_name,
                Key=key,
                Fields={"Content-Type": file_type},
                Conditions=[
                    {"Content-Type": file_type}
                ],
                ExpiresIn=3600  # URL expiration time in seconds
            )

            response.append({
                "url": presigned_post['url'],
                "fields": presigned_post['fields']
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT'
            },
            'body': json.dumps(response)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT'
            },
            'body': json.dumps(str(e))
        }
