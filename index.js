import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { unlinkSync } from "fs";
import DBController from "./DBController";
import DBPathFactory from "./DBPathFactory";
import { createInterface } from "readline";

const hasPortArg = process.argv.some(arg => arg === "--p");
const hasIpArg = process.argv.some(arg => arg === "--ip");
const PORT = hasPortArg
  ? parseInt(process.argv[process.argv.findIndex(arg => arg === "--p") + 1])
  : 5000;
const ipAddr = hasIpArg
  ? process.argv[process.argv.findIndex(arg => arg === "--ip") + 1]
  : "localhost";

//@TODO: Remove unused npm modules
//@TODO: Move apollo init to separate file
const pathFactory = new DBPathFactory(__dirname);
const dbController = new DBController(pathFactory.dbFilePath);

const app = express();

//@TODO: Intoduce headers to requests

const APOLLO_SERVER = new ApolloServer({
  typeDefs,
  resolvers,
  context: { db: dbController },
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

function onExit() {
  console.log("Shutting down the server...");
  server.close();
  console.log("Server is closed.");

  console.log("Deleting DB ...");
  dbController.deleteDB();
  console.log("DB deleted.");

  process.exit();
}

if (process.platform === "win32") {
  var rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function() {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", onExit);
