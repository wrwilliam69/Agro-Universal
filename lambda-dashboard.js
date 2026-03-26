// ================================================
// AWS Lambda: Dashboard CRUD
// ================================================
// Deploy this function in AWS Lambda (Node.js 18+)
// and connect to API Gateway as:
//   GET  /dashboard  → this function
//   POST /dashboard  → this function
//
// Environment variable: TABLE_NAME = wm-dashboard
//
// DynamoDB Table: wm-dashboard
//   Partition Key: pk (String) — always "DASHBOARD"
//   No sort key needed (single-record design)
// ================================================

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE = process.env.TABLE_NAME || 'wm-dashboard';

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event));

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' };
  }

  try {
    // ---- GET: load data ----
    if (event.httpMethod === 'GET') {
      const result = await dynamo.send(new GetCommand({
        TableName: TABLE,
        Key: { pk: 'DASHBOARD' }
      }));

      if (result.Item) {
        return {
          statusCode: 200,
          headers: HEADERS,
          body: JSON.stringify({ data: result.Item.data })
        };
      }
      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify({ data: null })
      };
    }

    // ---- POST: save data ----
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const data = body.data;

      if (!data) {
        return {
          statusCode: 400,
          headers: HEADERS,
          body: JSON.stringify({ error: 'Missing "data" field in request body' })
        };
      }

      await dynamo.send(new PutCommand({
        TableName: TABLE,
        Item: {
          pk: 'DASHBOARD',
          data: data,
          updatedAt: new Date().toISOString()
        }
      }));

      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify({ message: 'Data saved successfully' })
      };
    }

    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: err.message })
    };
  }
};
