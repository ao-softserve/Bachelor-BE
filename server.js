import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import GraphHTTP from "express-graphql";
import express from "express";
import { typeDef } from "./schema";
// Getting base GraphQL Schema

const WS_PORT = 5000;
/** BASE Express server definition **/
const server = express();

// main endpoint for GraphQL Express
server.use(
  "/api/ql",
  GraphHTTP({
    schema: typeDef,
    graphiql: true
  })
);

// Making plain HTTP server for Websocket usage
const ws = createServer(server);

/** GraphQL Websocket definition **/

ws.listen(5000, () => {
  console.log(`Server started here -> http://0.0.0.0:${WS_PORT}`);
});

const subscriptionServer = SubscriptionServer.create(
  { typeDef, execute, subscribe },
  {
    server: ws,
    path: "/api/ws"
  }
);
