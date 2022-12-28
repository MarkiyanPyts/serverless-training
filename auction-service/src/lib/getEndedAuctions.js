import aws from 'aws-sdk';

const dynamodb = new aws.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
  const now = new Date();

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  };

  const result = await dynamodb.query(params).promise();

  return result.Items;
}