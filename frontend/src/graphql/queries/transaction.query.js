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
        gender
        name
        profilePicture
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

export { GET_TRANSACTIONS, GET_TRANSACTION };
