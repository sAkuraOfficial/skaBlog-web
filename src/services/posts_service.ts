import {BlogPost, CreateUpdatePostRequest, PostsResponse} from '../types/post';
import {fetchApi} from './api';

const API_BASE_PATH = '/blog/posts';

/**
 * 博客文章相关服务
 */
export const postsService = {
  /**
   * 获取所有博客文章列表
   */
  getAllPosts: async (): Promise<BlogPost[]> => {
    return await fetchApi<BlogPost[]>(API_BASE_PATH);
  },

  /**
   * 获取单个博客文章详情
   */
  getPostById: async (id: number | string): Promise<BlogPost> => {
    return await fetchApi<BlogPost>(`${API_BASE_PATH}/${id}`);
  },

  /**
   * 创建新的博客文章
   */
  createPost: async (postData: CreateUpdatePostRequest): Promise<PostsResponse> => {
    return await fetchApi<PostsResponse>(API_BASE_PATH, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  /**
   * 更新现有的博客文章
   */
  updatePost: async (id: number | string, postData: CreateUpdatePostRequest): Promise<PostsResponse> => {
    return await fetchApi<PostsResponse>(`${API_BASE_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  /**
   * 删除博客文章
   */
  deletePost: async (id: number | string): Promise<PostsResponse> => {
    return await fetchApi<PostsResponse>(`${API_BASE_PATH}/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * 点赞博客文章
   */
  likePost: async (id: number | string): Promise<PostsResponse> => {
    return await fetchApi<PostsResponse>(`${API_BASE_PATH}/${id}/like`, {
      method: 'POST',
    });
  },
};