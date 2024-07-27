import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import mergedResolvers from "./resolvers/index.js"
import mergedTypeDefs from "./typeDefs/index.js"
import connectDB from './db/connectDB.js';
import dotenv from 'dotenv';

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import { buildContext } from "graphql-passport";
import { configurePassport } from "./passport/passport.config.js";

 
// Load environment variables
dotenv.config();

// Configure Passport
await configurePassport();


// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Create a new MongoDB session store
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
 
// Catch errors
store.on("error", function (error) {
  console.log(error);
});

// Express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false,
    store: store,
    cookie: { 
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 day
      httpOnly: true, // don't let JS code access cookies
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect to MongoDB
await connectDB();
 
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

// Ensure we wait for our server to start
await server.start();
 
// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/',
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  }),
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
 