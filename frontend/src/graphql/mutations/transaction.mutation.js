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

export default CREATE_TRANSACTION;