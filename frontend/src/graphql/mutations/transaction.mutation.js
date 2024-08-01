import { gql } from "@apollo/client";

const CREATE_TRANSACTION = gql`
  mutation Login($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      _id
      amount
      category
      date
      description
      location
      paymentType
      user {
        gender
        name
        _id
        profilePicture
        username
      }
      userId
    }
  }
`;

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($transactionId: ID!) {
    deleteTransaction(transactionId: $transactionId) {
      description
      category
      amount
      _id
      date
      location
      paymentType
      user {
        name
        gender
      }
    }
  }
`;

const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      _id
      amount
      category
      date
      description
      location
      paymentType
      user {
        gender
        name
        username
      }
    }
  }
`;

export { CREATE_TRANSACTION, DELETE_TRANSACTION, UPDATE_TRANSACTION };
