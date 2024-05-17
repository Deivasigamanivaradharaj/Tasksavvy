import { Client, Account, Databases, Teams, ID } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("663f54b200082519311e");

export const account = new Account(client);

export const id = ID.unique();

export const databases = new Databases(client);

export const teams = new Teams(client);

