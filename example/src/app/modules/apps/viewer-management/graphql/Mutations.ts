import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      success
      errors
      token
      refreshToken
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $email: String!
    $username: String!
    $password1: String!
    $password2: String!
  ) {
    register(
      email: $email
      username: $username
      password1: $password1
      password2: $password2
    ) {
      success
      errors
      token
      refreshToken
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $projectName: String!
    $clientId: Int!
    $matterId: Int!
    $classificationFileId: Int!
  ) {
    createProjects(
      projectName: $projectName
      clientId: $clientId
      matterId: $matterId
      classificationFileId: $classificationFileId
    ) {
      projects {
        id
        projectName
        clientId
        matterId
        classificationFile {
          id
          jsonFile
        }
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $projectName: String!
    $clientId: Int!
    $matterId: Int!
    $classificationFileId: Int!
  ) {
    updateProjects(
      projectName: $projectName
      clientId: $clientId
      matterId: $matterId
      classificationFileId: $classificationFileId
    ) {
      project {
        id
        projectId
        projectName
        clientId
        matterId
        modifiedAt
        createdAt
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectName: String!) {
    deleteProjects(projectName: $projectName) {
      ok
    }
  }
`;

export const DEACTIVE_PROJECT = gql`
  mutation DeactiveProject($projectName: String!, $folder: String!) {
    deactiveProject(projectName: $projectName, folder: $folder) {
      ok
    }
  }
`;

export const DEACTIVE_USER = gql`
  mutation DeactiveUser($email: String!) {
    deactiveUser(email: $email) {
      ok
    }
  }
`;

export const FILE_UPLOAD = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file) {
      success
    }
  }
`;

export const CREATE_PROJECT_WITH_USER = gql`
  mutation CreateProject(
    $projectName: String!
    $description: String!
    $active:Boolean!
    $assignUser: [UserInput]!
    $classificationFileId: Int!
  ) {
    createProjects(
      input: {
        projectName: $projectName
        description: $description
        active:$active
        assignUser: $assignUser
        classificationFileId: $classificationFileId
      }
    ) {
      projects {
        projectName
        id
        description
        active
        classificationFile {
          id
          jsonFile
        }
      }
    }
  }
`;

export const UPDATE_PROJECT_WITH_USER = gql`
  mutation UpdateProject(
    $projectName: String!
    $description: String!
    $active:Boolean!
    $assignUser: [UserInput]!
    $classificationFileId: Int!
  ) {
    updateProjects(
      input: {
        projectName: $projectName
        description: $description
        assignUser: $assignUser
        active:$active
        classificationFileId: $classificationFileId
      }
    ) {
      projects {
        projectName
        id
        description
        active
        classificationFile {
          id
          jsonFile
        }
      }
    }
  }
`;

export const CREATE_USER_WITH_PROJECT = gql`
  mutation CreateUser(
    $email: String!
    $password: String!
    $username: String!
    $firstname: String!
    $lastname: String!
    $role: String!
    $active: Boolean!
    $assignProject: [ProjectsInput]!
  ) {
    createUser(
      input: {
        email: $email
        password: $password
        username: $username
        firstname: $firstname
        lastname: $lastname
        role: $role
        active: $active
        assignProject: $assignProject
      }
    ) {
      users {
        id
        username
        firstName
        lastName
        role
        isActive
      }
    }
  }
`;

export const UPDATE_USER_WITH_PROJECT = gql`
  mutation UpdateUser(
    $email: String!
    $username: String!
    $firstname: String!
    $lastname: String!
    $active: Boolean!
    $assignProject: [ProjectsInput]!
  ) {
    updateUser(
      input: {
        email: $email
        username: $username
        firstname: $firstname
        lastname: $lastname
        active: $active
        assignProject: $assignProject
      }
    ) {
      users {
        id
        email
        role
        username
        firstName
        lastName
        isActive
      }
    }
  }
`;

export const UNLOCK_FILE = gql`
  mutation UnLockFile($foldername: String!, $filename: String) {
    unlockFile(foldername: $foldername, filename: $filename) {
      files {
        pages
        filePath
        fileName
        projectName
        fileStatus
        lock
        lockedBy {
          email
          username
          role
        }
      }
    }
  }
`;

export const FILE_STATUS = gql`
  mutation FileStatus($foldername: String!, $filename: String!) {
    fileStatus(foldername: $foldername, filename: $filename) {
      file {
        filePath
        fileName
        fileType
        projectName
        pages
        viewerPath
        fileStatus
      }
    }
  }
`;
