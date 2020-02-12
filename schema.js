import { gql } from "apollo-server-express";

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

  type Subscription {
    availibleResourcesChanged: [Resource]
    soldResource: [SoldResource]
    boughtResource: [BoughtResource]
    usersChanged: [User]
  }

  type Query {
    resources: [Resource]
    users: [User]
  }

  type Mutation {
    addResourcesToBuy(userId: String, qty: Int): AddResourceMessage
    buyResource(userId: Int!, qty: Int!): BuyResponse
    orderResource(userId: Int, qty: Int): [Resource]
    sellResources(userId: Int, qty: Int): [Resource]
    setUserTaken(userId: Int): Boolean
  }
`;
