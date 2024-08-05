import { gql } from "@apollo/client";

const GET_TRANSACTIONS = gql`
  query Transactions {
    transactions {
      _id
      amount
      category
      date
      description
      location
      paymentType
      userId
      user {
        _id
        gender
        name
        password
        profilePicture
        username
      }
    }
  }
`;

const GET_TRANSACTION = gql`
  query Transaction($transactionId: ID!) {
    transaction(transactionId: $transactionId) {
      amount
      category
      date
      description
      location
      paymentType
      _id
      userId
    }
  }
`;

const GET_CATEGORY_STATS = gql`
  query CategoryStatistics {
    categoryStatistics {
      category
      totalAmount
    }
  }
`;

export { GET_TRANSACTIONS, GET_TRANSACTION, GET_CATEGORY_STATS };
