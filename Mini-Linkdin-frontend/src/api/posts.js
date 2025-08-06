// src/api/posts.js
import api from './client';

export const createPost = (content) => api.post('/posts', { content });
export const getFeed = () => api.get('/posts'); // returns array of posts with author populated
export const deletePost = (postId) => api.delete(`/posts/${postId}`);