import React, {useEffect, useState, useRef} from 'react';
import {Button, Input, message} from 'antd';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import {useNavigate, useParams} from 'react-router';

interface BlogEditProps {
  isCreate: boolean;
}

const BlogEdit: React.FC<BlogEditProps> = ({isCreate}) => {
  const {id} = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const vditorRef = useRef<Vditor | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCreate && id) {
      fetch(`http://localhost:8080/api/blog/posts/${id}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
          if (vditorRef.current) {
            vditorRef.current.setValue(data.content);
          }
        })
        .catch(error => {
          console.error('获取博客信息失败', error);
          message.error('获取博客信息失败');
        });
    }
  }, [isCreate, id]);

  useEffect(() => {
    const vditor = new Vditor('vditor', {
      height: 500,
      toolbarConfig: {
        pin: true,
      },
      cache: {
        id: 'vditor',
        enable: true,
      },
      after: () => {
        console.log('Vditor is ready');
        if (content) {
          vditor.setValue(content);
        }
      },
      input: (value) => {
        setContent(value);
      }
    });

    vditorRef.current = vditor;

    // Cleanup Vditor on component unmount
    return () => {
      vditor.destroy();
    };
  }, []);

  const handleSubmit = async () => {
    const editorContent = vditorRef.current?.getValue() || '';
    const url = isCreate ? 'http://localhost:8080/api/blog/posts' : `http://localhost:8080/api/blog/posts/${id}`;
    const method = isCreate ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: editorContent,
      }),
    });

    if (response.ok) {
      await messageApi.open({
        type: 'success',
        content: isCreate ? '博客创建成功 3s后回到首页' : '博客更新成功 3s后回到首页',
      });
      if (isCreate) {
        setTitle('');
        setContent('');
        vditorRef.current?.setValue(''); // 清空内容
      }
      navigate('/');
    } else {
      messageApi.open({
        type: 'error',
        content: isCreate ? '博客创建失败' : '博客更新失败',
      });

    }
  };

  return (
    <>
      {contextHolder}
      <Input
        placeholder="请输入文章标题"
        style={{marginBottom: 10}}
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <div id="vditor" style={{marginBottom: 20}}/>
      <Button type="primary" onClick={handleSubmit}>
        {isCreate ? '创建' : '更新'}
      </Button>
    </>
  );
};

export default BlogEdit;