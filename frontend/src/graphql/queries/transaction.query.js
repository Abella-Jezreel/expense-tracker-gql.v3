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

export default GET_TRANSACTIONS;