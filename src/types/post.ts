export interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdDate: string;
}

export interface CreateUpdatePostRequest {
  title: string;
  content: string;
}

export interface PostsResponse {
  success: boolean;
  message?: string;
  data?: any;
}