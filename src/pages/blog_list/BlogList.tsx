declare var require: any
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router';
import './BlogList.css';
import { EditOutlined, DeleteOutlined, LikeOutlined } from '@ant-design/icons';
import Confetti from 'react-confetti'
import {useWindowSize} from 'react-use';
interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdDate: string;
}

function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);
  // 状态用于控制 Confetti 是否显示
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/blog/posts', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('获取博客列表失败', error);
        message.error('获取博客列表失败');
        setLoading(false);
      });
  }, [deleteFlag]);

  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:8080/api/blog/posts/${id}/like`, {
        method: 'POST',
      });
      if (response.ok) {
        // 显示烟花效果
        setShowConfetti(true);
        // 2 秒后隐藏烟花效果
        setTimeout(() => {
          setShowConfetti(false);
        }, 2000);
      }
      await messageApi.open({
        type: response.ok ? 'success' : 'error',
        content: response.ok ? '点赞成功' : '点赞失败',
      });
    } catch (error) {
      console.error('点赞失败', error);
      await messageApi.open({
        type: 'error',
        content: '点赞失败',
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const response = await fetch(`http://localhost:8080/api/blog/posts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        messageApi.open({
          type: 'success',
          content: '删除成功',
        });
        setDeleteFlag(!deleteFlag);
      }
    } catch (error) {
      console.error('删除失败', error);
      await messageApi.open({
        type: 'error',
        content: '删除失败',
      });
    }
  };
  const {width, height} = useWindowSize();
  return (
    <div className="custom-list">
      {contextHolder}
      {/* 当 showConfetti 为 true 时显示烟花效果 */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
        />
      )}
      <Row gutter={20}>
        {posts.map(post => (
          <Col key={post.id} xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
            <div className="custom-card" onClick={() => navigate(`/blog/${post.id}`)}>
              <div className="custom-card-inner">
                <Card
                  title={post.title}
                  loading={loading}
                  actions={[
                    <LikeOutlined key="like" onClick={(e) => handleLike(e, post.id)} />,
                    <EditOutlined
                      key="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blog/edit/${post.id}`);
                      }}
                    />,
                    <DeleteOutlined key="delete" onClick={(e) => handleDelete(e, post.id)} />,
                  ]}
                >
                  <p style={{ margin: 0 }}>{new Date(post.createdDate).toLocaleString()}</p>
                  <div>{post.content}</div>
                </Card>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default BlogList;