import request, { gql } from 'graphql-request';
import React, { FC, useEffect, useState } from 'react';
import BASEURL from '../../../../../../config/baseurl';
import { useAuth } from '../../../../../auth';


type Props = {
    userFile?: any[];
};


const Assigned_User = gql`
    query {
        userFiles {
            edges {
                node {
                    user {
                        username
                        role
                        email
                        profilePicture
                    }
                    file {
                        fileName
                        id
                        pages
                        filePath
                        fileType
                        fileStatus
                    }
                }
            }
        }
    }
`;


const AssignedUser: FC<Props> = ({ userFile }) => {
    const { currentUser } = useAuth()
    let Role = currentUser?.role

    console.log("userFiles ---->", userFile);
    const [matchingUsernames, setMatchingUsernames] = useState<string[]>([]);


    useEffect(() => {
        request(`${BASEURL}graphql/`, Assigned_User, {}, {Authorization: `Bearer ${localStorage.getItem('Token')}`}).then((res: any) => {
            console.log("response in assigned user", res?.userFiles?.edges);
            // Initialize an array to store matching usernames
            const matchingUsernamesArray: string[] = [];

            // Iterate through userFiles and response to find matches
            for (let j = 0; j < res.userFiles.edges.length; j++) {
                if (Role === "Admin" || Role === "Manager") {
                    if (res.userFiles.edges[j].node.file && res.userFiles.edges[j].node.file.id === userFile?.id) {
                        matchingUsernamesArray.push(res.userFiles.edges[j].node.user.username);
                        break;
                    }
                } else if (Role === "Reviewer") {
                    if (res.userFiles.edges[j].node.file && res.userFiles.edges[j].node.file.id === userFile?.file?.id) {
                        matchingUsernamesArray.push(res.userFiles.edges[j].node.user.username);
                        break;
                    }
                }

                // if (userFile.id === res.userFiles.edges[j].node.file.id) {
                //     // Extract the username if a matching file is found
                //     matchingUsernamesArray.push(res.userFiles.edges[j].node.user.username);
                //     break; // Break the inner loop after finding a match
                // }
            }

            // Update the state variable with matching usernames
            setMatchingUsernames(matchingUsernamesArray);
            console.log("matchingUsernamesArray", matchingUsernamesArray);


        });
    }, [userFile]);

    return (
        <div>
            {matchingUsernames.length > 0 && (
                <div>
                    {matchingUsernames.map((username, index) => (
                        <span key={index}>{username}</span>
                    ))}
                </div>
            )}
        </div>
    );
};


export { AssignedUser };
