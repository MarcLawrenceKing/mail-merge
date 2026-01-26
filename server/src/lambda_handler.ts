import serverless from "serverless-http";
import app from "./app";
import type { APIGatewayProxyEvent, Context } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  return serverless(app)(event, context);
};