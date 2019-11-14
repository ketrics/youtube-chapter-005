'use strict';

const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const dynamo = new AWS.DynamoDB.DocumentClient({convertEmptyValues: true});
const {TODOS_TABLENAME} = process.env;

function createResponse(message, statusCode=200){
  return {
      statusCode,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(message)
  }
}

module.exports.fetchAll = async event => {
  try{
    const params = {
        TableName: TODOS_TABLENAME
    };
    const {Items} = await dynamo.scan(params).promise();
    return createResponse(Items);
  }catch(err){
      throw err;
  }
};

module.exports.create = async event => {
  try{
    let d = new Date();
    let data = event;
    if(data.body) data = JSON.parse(data.body);
    data = {
      title: data.title,
      completed: data.completed,
      id: uuidv1(),
      createdAt: d.toISOString(),
      modifiedAt: d.toISOString()
    }

    const params = {
        TableName: TODOS_TABLENAME,
        Item: data
    };
    await dynamo.put(params).promise();
    return createResponse(data);
  }catch(err){
      throw err;
  }
};

module.exports.fetchOne = async event =>{
  try{
    const params = {
        TableName: TODOS_TABLENAME,
        Key: {
          id: event.pathParameters.id
        }
    };
    const {Item} = await dynamo.get(params).promise();
    return createResponse(Item);
  }catch(err){
      throw err;
  }
}

module.exports.delete = async event =>{
  try{
    const params = {
        TableName: TODOS_TABLENAME,
        Key: {
          id: event.pathParameters.id
        }
    };
    await dynamo.delete(params).promise();
    return createResponse({message: "ToDo Deleted"});
  }catch(err){
      throw err;
  }
}

module.exports.update = async event =>{
  try{
    let d = new Date();
    let data = event;
    if(data.body) data = JSON.parse(data.body);
    
    data = {
      ...data,
      modifiedAt: d.toISOString()
    }

    const params = {
      TableName: TODOS_TABLENAME,
      Key: {
        id: event.pathParameters.id
      },
      UpdateExpression: `set #title = :title, #completed = :completed, #modifiedAt = :modifiedAt`,
      ExpressionAttributeNames: {
        '#title': 'title',
        '#completed': 'completed',
        '#modifiedAt': 'modifiedAt'
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':completed': data.completed,
        ':modifiedAt': data.modifiedAt
      },
      ReturnValues: 'ALL_NEW'
    };
    const item = await dynamo.update(params).promise();
    return createResponse(item);
  }catch(err){
      throw err;
  }
}