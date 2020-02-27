import { gql } from "apollo-server-express";

//@TODO: Dplit types to separate files

export const typeDefs = gql`
  type Resource {
    type: String
    userId: Int
    qty: Int
    toSell: Int
    deliveryTime: Int
    instantSell: Boolean
    toBuy: Int
  }

  type BoughtResource {
    userId: Int
    qty: Int
    deliveryTime: Int
  }
  type SoldResource {
    userId: Int
    qty: Int
    deliveryTime: Int
  }

  type User {
    id: ID!
    name: String
    taken: Boolean
    ready: Boolean
  }

  type UserResources {
    user: User
    resources: [Resource]
  }

  type AddResourceMessage {
    message: String
    resource: Resource
  }

  type BuyResponse {
    message: String
    resource: Resource
  }

  type OrderResponse {
    message: String
    type: String
  }

  type Simulation {
    duration: Int
  }

  type Subscription {
    availibleResourcesChanged: [Resource]
    soldResource: [SoldResource]
    boughtResource: [BoughtResource]
    usersChanged: [User]
  }

  type Query {
    resources: [Resource]
    users: [User]
    simulation: Simulation
  }

  type Mutation {
    addResourcesToBuy(userId: String, qty: Int): AddResourceMessage
    buyResource(userId: Int!, qty: Int!): BuyResponse
    orderResource(userId: Int, qty: Int): [Resource]
    sellResources(userId: Int, qty: Int): [Resource]
    setUserTaken(userId: Int): Boolean
    setUserReady(userId: Int): Boolean
  }
`;
