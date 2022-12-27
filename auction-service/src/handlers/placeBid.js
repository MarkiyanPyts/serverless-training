import AWS from 'aws-sdk';

import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const {id} = event.pathParameters;
  const {amount} = event.body;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.ammount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount
    },
    ReturnValues: 'ALL_NEW'
  }

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();

    updatedAuction = result.Attributes;
  } catch(err) {
    console.error(err);
    throw new createError.InternalServerError(err);
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid)