const Server = require("http").Server;
const SubscriptionServer = require("subscriptions-transport-ws")
  .SubscriptionServer;
const execute = require("graphql").execute;
const subscribe = require("graphql").subscribe;
const GraphHTTP = require("express-graphql");
const express = require("express");

// Getting base GraphQL Schema
const schema = require("./schema");

/** BASE Express server definition **/
const app = express();

// main endpoint for GraphQL Express
app.use(
  "/api/ql",
  GraphHTTP({
    schema: schema,
    graphiql: true
  })
);

// Making plain HTTP server for Websocket usage
const server = Server(app);

/** GraphQL Websocket definition **/
SubscriptionServer.create(
  {
    schema,
    execute,
    subscribe
  },
  {
    server: server,
    path: "/api/ws"
  }
);

server.listen(4000, () => {
  console.log("Server started here -> http://0.0.0.0:4000");
});
