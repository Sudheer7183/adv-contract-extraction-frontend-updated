import { ID, Response } from "../../../../../../../_metronic/helpers";
export type User = {
  id?: ID;
  name?: string;
  avatar?: string;
  email?: string;
  active?: boolean;
  description?: string;
  position?: string;
  role?: string;
  last_login?: string;
  two_steps?: boolean;
  joined_day?: string;
  online?: boolean;
  initials?: {
    label: string;
    state: string;
  };
};
export type Projects = {
  id?: string;
  projectId?: string;
  active?: boolean;
  description?: string;
  projectName?: string;
  totalFiles?: number;
  classificationFile?: {
    id?: ID;
    jsonFile: string;
  };
};
export type UsersQueryResponse = Response<Array<User>>;

export const initialUser: User = {
  avatar: "avatars/300-6.jpg",
  position: "Art Director",
  role: "Administrator",
  name: "",
  email: "",
  description: "",
  active: false,
};
