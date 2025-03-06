import React, {useEffect, useState} from 'react';
import {Card, Row, Col, Spin} from 'antd';
import {useNavigate} from 'react-router-dom';
import {EditOutlined, DeleteOutlined, LikeOutlined} from '@ant-design/icons';
import Confetti from 'react-confetti';
import {useWindowSize} from 'react-use';
import './BlogList.css';

// Import new APIs
import {BlogPost} from '../../types/post';
import {postsService} from '../../services/posts_service';
import {useMessage} from '../../contexts/MessageContext';
import {useAuth} from '../../contexts/AuthContext';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  const navigate = useNavigate();
  const messageApi = useMessage();
  const {isAuthenticated} = useAuth();
  const {width, height} = useWindowSize();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postsService.getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        messageApi.error('获取博客列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [refreshTrigger, messageApi]);

  /*
   fetch('http://localhost:8080/api/blog/posts', {
      method: 'GET',
    })
   */

  // useEffect(() => {
  //     fetch('http://localhost:8080/api/blog/posts', {
  //       method: 'GET',
  //     })
  //       .then(reponse => reponse.json())
  //       .then(data => {
  //         setPosts(data);
  //       })
  //       .catch(error => {
  //         console.error('Failed to fetch blog posts:', error);
  //         messageApi.error('获取博客列表失败');
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       })
  //   }
  //   , [refreshTrigger, messageApi]);


  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    try {
      const response = await postsService.likePost(id);
      if (response.success) {
        // Trigger confetti effect
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        messageApi.success('点赞成功');
      } else {
        console.log('失败');
        messageApi.error(response.message || '点赞失败');
      }
    } catch (error) {
      console.error('Like operation failed:', error);
      messageApi.error('点赞失败');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    try {
      const response = await postsService.deletePost(id);

      if (response.success) {
        messageApi.success('删除成功');
        // Trigger re-fetch by toggling refreshTrigger
        setRefreshTrigger(prev => !prev);
      } else {
        messageApi.error(response.message || '删除失败');
      }
    } catch (error) {
      console.error('Delete operation failed:', error);
      messageApi.error('删除失败');
    }
  };

  const renderPostCard = (post: BlogPost) => (
    <Col key={post.id} xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
      <div className="custom-card" onClick={() => navigate(`/blog/${post.id}`)}>
        <div className="custom-card-inner">
          <Card
            title={post.title}
            actions={isAuthenticated ? [
              <LikeOutlined key="like" onClick={(e) => handleLike(e, post.id)}/>,
              <EditOutlined key="edit" onClick={(e) => {
                e.stopPropagation();
                navigate(`/blog/edit/${post.id}`);
              }}/>,
              <DeleteOutlined key="delete" onClick={(e) => handleDelete(e, post.id)}/>,
            ] : [
              <LikeOutlined key="like" onClick={(e) => handleLike(e, post.id)}/>
            ]}
          >
            <p style={{margin: 0}}>{new Date(post.createdDate).toLocaleString()}</p>
            <div className="post-content-preview">{post.content}</div>
          </Card>
        </div>
      </div>
    </Col>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载中..."/>
      </div>
    );
  }

  return (
    <div className="custom-list">
      {showConfetti && <Confetti width={width} height={height}/>}

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>暂无博客文章</p>
        </div>
      ) : (
        <Row gutter={[20, 20]}>
          {posts.map(renderPostCard)}
        </Row>
      )}
    </div>
  );
};

export default BlogList;