import { gql } from "@apollo/client";

const SIGN_UP_USER = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      _id
      gender
      name
      password
      username
      profilePicture
    }
  }
`;

const LOGOUT_USER = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

const LOGIN_USER = gql`
mutation Login($input: LoginInput!) {
  login(input: $input) {
    gender
    name
    profilePicture
    username
  }
}
`;

export { SIGN_UP_USER, LOGOUT_USER, LOGIN_USER };
