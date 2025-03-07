import React, {useEffect, useState} from 'react';
import {Button, Input, Spin} from 'antd';
import {Editor} from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import math from "@bytemd/plugin-math";
import 'highlight.js/styles/default.css'//代码高亮css
import 'katex/dist/katex.css'; //数学公式css
import './BlogEdit.css';
import mermaid from '@bytemd/plugin-mermaid';
import 'bytemd/dist/index.css';
import {useNavigate, useParams} from 'react-router-dom';


// Import your new services and contexts
import {postsService} from '../../services/posts_service';
import {useMessage} from '../../contexts/MessageContext';
import {CreateUpdatePostRequest} from '../../types/post';

// ByteMD plugins
const plugins = [
  highlight(),
  gfm(),
  mermaid(),
  math()
  // Add more plugins as needed
];

interface BlogEditProps {
  isCreate: boolean;
}

const BlogEdit: React.FC<BlogEditProps> = ({isCreate}) => {
  const {id} = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!isCreate);
  const navigate = useNavigate();
  const messageApi = useMessage();

  useEffect(() => {
    if (!isCreate && id) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const post = await postsService.getPostById(id);
          setTitle(post.title);
          setContent(post.content);
        } catch (error) {
          console.error('Failed to fetch post:', error);
          messageApi.error('获取博客信息失败');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [isCreate, id, messageApi]);

  const handleSubmit = async () => {
    // Validate input
    if (!title.trim()) {
      messageApi.warning('请输入文章标题');
      return;
    }

    const postData: CreateUpdatePostRequest = {
      title,
      content
    };

    try {
      setLoading(true);
      const response = isCreate
        ? await postsService.createPost(postData)
        : await postsService.updatePost(id!, postData);

      if (response.success) {
        messageApi.success(`博客${isCreate ? '创建' : '更新'}成功 3s后回到首页`);

        if (isCreate) {
          setTitle('');
          setContent('');
        }

        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        messageApi.error(`博客${isCreate ? '创建' : '更新'}失败: ${response.message}`);
      }
    } catch (error) {
      console.error(`Failed to ${isCreate ? 'create' : 'update'} post:`, error);
      messageApi.error(`博客${isCreate ? '创建' : '更新'}失败`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}>
        <Spin size="large" tip="加载中..."/>
      </div>
    );
  }

  return (
    <div className="blog-edit-container" style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
      <Input
        placeholder="请输入文章标题"
        style={{marginBottom: 20, fontSize: '18px'}}
        value={title}
        onChange={e => setTitle(e.target.value)}
        size="large"
      />

      <div style={{border: '1px solid #d9d9d9', borderRadius: '4px', marginBottom: 20}}>
        <Editor
          value={content}
          plugins={plugins}
          onChange={setContent}
        />
      </div>

      <div style={{marginTop: 20}}>
        <Button
          type="primary"
          onClick={handleSubmit}
          size="large"
          loading={loading}
        >
          {isCreate ? '创建' : '更新'}
        </Button>
        <Button
          style={{marginLeft: 10}}
          onClick={() => navigate('/')}
          size="large"
        >
          取消
        </Button>
      </div>
    </div>
  );
};

export default BlogEdit;