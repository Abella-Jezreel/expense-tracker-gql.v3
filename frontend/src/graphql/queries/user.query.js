import { gql } from "@apollo/client";

const GET_USER = gql`
query AuthUser {
  authUser {
    _id
    gender
    name
    profilePicture
    transactions {
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
        profilePicture
        username
      }
      userId
    }
    username
  }
}
`;

export default GET_USER;