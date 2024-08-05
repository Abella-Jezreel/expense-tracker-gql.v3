import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        transaction: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        categoryStatistics: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        transactions: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        authUser: {
          merge(existing = [], incoming) {
            return incoming;
          },
        }
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Server URL
  cache: cache, // Store data in memory
  credentials: "include", // Send cookies
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
