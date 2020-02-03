import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "graphql-tools";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const hasPortArg = process.argv.some(arg => arg === "--p");
const hasIpArg = process.argv.some(arg => arg === "--ip");
const PORT = hasPortArg
  ? parseInt(process.argv[process.argv.findIndex(arg => arg === "--p") + 1])
  : 5000;
const ipAddr = hasIpArg
  ? process.argv[process.argv.findIndex(arg => arg === "--ip") + 1]
  : "localhost";

// DB

const adapter = new FileSync("./db.json");
const db = low(adapter);
const USERS = [
  { id: 0, name: "Store" },
  { id: 1, name: "Producer1" },
  { id: 2, name: "Producer2" },
  { id: 3, name: "FinalTaker" }
];

let RESOURCES = [
  {
    userId: 0,
    qty: 1000000,
    deliveryTime: 20,
    toSell: 1000000,
    toBuy: 0
  },
  { userId: 1, qty: 0, deliveryTime: 30, toSell: 0, toBuy: 0 },
  {
    userId: 2,
    qty: 0,
    deliveryTime: 40,
    toSell: 0,
    toBuy: 0
  }
];

db.defaults({ users: USERS, resources: RESOURCES }).write();

const app = express();

const APOLLO_SERVER = new ApolloServer({
  typeDefs,
  resolvers,
  context: { db },
  playground: {
    endpoint: `http://${ipAddr}:${PORT}/graphql`,
    settings: {
      "editor.theme": "light"
    }
  }
});

APOLLO_SERVER.applyMiddleware({
  app
});

const server = createServer(app);

APOLLO_SERVER.installSubscriptionHandlers(server);
server.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://${ipAddr}:${PORT}${APOLLO_SERVER.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://${ipAddr}:${PORT}${APOLLO_SERVER.subscriptionsPath}`
  );
});
