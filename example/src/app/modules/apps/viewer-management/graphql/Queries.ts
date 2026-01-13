import { gql } from "@apollo/client";

export const ALL_USERS = gql`
  query {
    users {
      username
      firstName
      email
      lastName
      isActive
      role
    }
  }
`;
export const REVIEW_USER = gql`
  query ReviewUser($position: String!) {
    reviewUser(position: $position) {
      edges {
        node {
          id
          username
          firstName
          lastName
          email
          role
        }
      }
    }
  }
`;

export const ACTIVE_PROJECT = gql`
  query ActiveProject($isactive: Boolean!) {
    activeProject(isactive: $isactive) {
      edges {
        node {
          id
          projectId
          projectName
          active
        }
      }
    }
  }
`;

export const ALL_PROJECTS = gql`
  query {
    allProjects {
      id
      projectName
      active
      projectId
      description
      totalFiles
      classificationFile {
        id
        jsonFile
      }
    }
  }
`;

export const ALL_DOCUMENTS = gql`
  query {
    allDocument {
      id
      name
      pages
      type
      project {
        id
        projectName
      }
    }
  }
`;

export const ALL_CLASSIFICATION_FILES = gql`
  query {
    allClassificationFiles {
      id
      jsonFile
    }
  }
`;

export const DOCUMENT = gql`
  query Document($id: ID!) {
    document(project: $id) {
      edges {
        node {
          id
          name
          pages
          type
          project {
            id
            projectName
          }
        }
      }
    }
  }
`;

export const FILES = gql`
  query Files($name: String!) {
    files(name: $name) {
      edges {
        node {
          id
          filePath
          fileName
          projectName
          zuvaFileId
          fileStatus
          fileType
          pages
          lock
          lockedBy {
            username
            email
            role
          }
        }
      }
    }
  }
`;

export const USER_WITH_PROJECT = gql`
  query UserWithProject($email: String!) {
    userWithProject(search: $email) {
      edges {
        node {
          id
          email
          username
          password
          firstName
          lastName
          role
          isActive
          projects {
            id
            projectName
          }
        }
      }
    }
  }
`;

export const PROJECT_WITH_USER = gql`
  query ProjectWithUser($name: String!) {
    projectWithUser(search: $name) {
      edges {
        node {
          id
          projectId
          projectName
          description
          users {
            id
            email
            isActive
            username
            firstName
            lastName
          }
        }
      }
    }
  }
`;

export const PROJECT = gql`
  query Project($name: String!) {
    projects(search: $name) {
      edges {
        node {
          id
          projectName
          description
          active
          classificationFile {
            id
            jsonFile
          }
        }
      }
    }
  }
`;

// export const FILE_USER_LOCK = gql`
//   query {
//     fileUserLock {
//       projectName
//       lock
//       lockedBy {
//         email
//         role
//       }
//     }
//   }
// `;

// export const FILES_WITH_STATUS = gql`
//   query {
//     filesWithStatus {
//       id
//       projectName
//       fileStatus
//     }
//   }
// `;

export const FILES_DETAIL = gql`
  query {
    filesDetail {
      id
      filePath
      fileName
      projectName
      zuvaFileId
      fileStatus
      fileType
      pages
      lock
      lockedBy {
        username
        email
        role
      }
    }
  }
`;

export const LOCK_FILE = gql`
  query Lock($foldername: String!, $name: String) {
    lock(foldername: $foldername, name: $name) {
      edges {
        node {
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
  }
`;

export const ALL_FIELDS = gql`
  query allFields($id: Int!) {
    allFields(id: $id) {
      edges {
        node {
          fieldId
          fieldName
          classificationName
          classificationFile {
            id
            jsonFile
          }
        }
      }
    }
  }
`;

export const FIELDS = gql`
  query fields($id: Int!, $documenttype: String!) {
    fields(id: $id, documenttype: $documenttype) {
      edges {
        node {
          fieldId
          fieldName
          classificationName
          classificationFile {
            id
          }
        }
      }
    }
  }
`;

export const FILE = gql`
  query file($name: String!, $foldername: String!) {
    file(name: $name, foldername: $foldername) {
      edges {
        node {
          height
          width
          doctype
          projectName
          filePath
          fileType
          fileStatus
          fileName
          zuvaFileId
          pages
          lock
          lockedBy {
            username
            email
            role
          }
        }
      }
    }
  }
`;

export const ALL_FILES1 = gql`
query AllFiles($filestatus: [StatusInput]!){
  allFile(filestatus: $filestatus){
    edges{
      node{
        id
        projectName
        fileName
        fileStatus
      }
    }
  }
}`;

// export const  ALL_FILES1 = gql`
//   query AllFiles($fileStatusIcontains: String!) {
//     allFile(fileStatus_Icontains: $fileStatusIcontains) {
//       edges {
//         node {
//           id
//           filePath
//           fileName
//           projectName
//           zuvaFileId
//           fileStatus
//           fileType
//           pages
//           lock
//           lockedBy {
//             username
//             email
//             role
//           }
//         }
//       }
//     }
//   }
// `;


export const DATAVIEW_BY_ID = gql`
query dataviewById($fileId: String!){
  dataviewById(fileId: $fileId){
    edges{
      node{
        id
        fieldName
        fieldValue
        createdAt
        modifiedAt
        createdBy{
          email
        }
        docdataaudit{
          edges{
            node{
              id
              fieldName
              fieldValue
              createdAt
              modifiedAt
              modifiedBy{
                email
              }
            }
          }
        }
      }
    }
  }
}
`
export const DATA_VIEW_DETAILS = gql`
query{
  dataviewDetails{
    id
    file{
      fileName
      doctype
    }
    title
    parties
    governingLaw
    effectiveDate
    venue
    expirationDate
    paymentMethod
    paymentDueDates
  }
}`

export const DATAVIEW = gql`
query{
  dataview{
    id
    projectName
    fileName
    doctype
    title
    effectiveDate
    expirationDate
    parties
    venue
    governingLaw
    paymentMethod
    paymentDueDates
  }
}`

export const USER_DATAVIEW = gql`
query userDataviewDetail($projects: [ProjectsInput]!){
  userDataviewDetail(projects: $projects){
    edges{
      node{
        id
        projectName
        fileName
        doctype
        title
        effectiveDate
        expirationDate
        parties
        venue
        governingLaw
        paymentMethod
        paymentDueDates  
      }
    }
  }
}`

export const FILE_PIE = gql`
query{
  fileStatusPiechart{
    id
    fileStatus
    count
    percentage
  }
}`

export const DOCTYPE_PIE = gql`
query{
  doctypePiechart{
    id
    doctype
    count
    percentage
  }
}
`
export const PROJECT_BAR = gql`
query{
  projectBarchart{
    id
    projectName
    doctype
    count
  }
}
`
export const FILE_BAR = gql`
query{
  fileBarchart{
    id
    fileStatus
    doctype
    count
  }
}`

export const FILESTATUS_BAR = gql`
query{
  fileStatusPiechart{
    id
    fileStatus
    count
  }
}`
export const ASSIGNED_PROJECTS = gql`
query assignProjectUserid($id: String!){
  assignProjectUserid(id: $id){
    edges{
      node{
        id
        project{
          id
          projectName
          totalFiles
        }
      }
    }  
  }
}`
export const DATA_VIEW = gql`
query dataView($project: String!, $file: String!){
  dataView(project: $project, file: $file){
    edges{
      node{
        id
        file{
          fileName
          projectName
          doctype
        }
        fieldName
        fieldValue
        docdataaudit{
          edges{
            node{
              fieldName
              fieldValue
            }
          }
        }
      }
    }
  }
}`

export const PIE_CHART_FILES = gql`
query chartFiles($value: String!, $piechart: String!){
  chartFiles(value: $value, piechart: $piechart){
    edges{
      node{
        id
        projectName
        fileName
        fileType
        fileStatus
        doctype
        pages
        lock
        lockedBy{
          email
        }
      }
    }
  }
}`

export const BAR_CHART_FILES = gql`
query barchartFiles($value: String!, $barchart: String!, $classificationType: String!){
  barchartFiles(value: $value, barchart: $barchart, classificationType: $classificationType){
    edges{
      node{
        id
        fileName
        projectName
        fileType
        fileStatus
        pages
        doctype
        lock
        lockedBy{
          username
        }
      }
    }
  }
}`
