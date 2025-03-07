import {BlogPost, CreateUpdatePostRequest, PostsResponse} from '../types/post';
import {fetchApi} from './api';

const API_BASE_PATH = '/blog/posts';

export const postsService = {
  getAllPosts: async (): Promise<BlogPost[]> => {
    const result = await fetchApi<BlogPost[]>(API_BASE_PATH, { skipAuth: true });
    return result.value || [];
  },

  getPostById: async (id: number | string): Promise<BlogPost> => {
    const result = await fetchApi<BlogPost>(`${API_BASE_PATH}/${id}`, { skipAuth: true });
    return result.value as BlogPost;
  },

  createPost: async (postData: CreateUpdatePostRequest): Promise<PostsResponse> => {
    return await fetchApi<PostsResponse>(API_BASE_PATH, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  updatePost: async (id: number | string, postData: CreateUpdatePostRequest): Promise<PostsResponse> => {
    return await fetchApi<PostsResponse>(`${API_BASE_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  deletePost: async (id: number | string): Promise<PostsResponse> => {
    return await fetchApi<PostsResponse>(`${API_BASE_PATH}/${id}`, {
      method: 'DELETE',
    });
  },

  likePost: async (id: number | string): Promise<PostsResponse> => {
    return await fetchApi<PostsResponse>(`${API_BASE_PATH}/${id}/like`, {
      method: 'POST',
    });
  },
};