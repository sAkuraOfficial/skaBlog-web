import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
// import MarkNav from 'markdown-navbar';
import remarkGfm from 'remark-gfm'
import 'markdown-navbar/dist/navbar.css';
// import './BlogView.css'; // optional css file for styling

function BlogView() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createdDate, setCreatedDate] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8080/api/blog/posts/${id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
        setCreatedDate(data.createdDate);
      })
      .catch(error => {
        console.error('获取博客信息失败', error);
        message.error('获取博客信息失败');
      });
  }, [id]);

  return (
    <div className="blog-view">
      <header className="blog-header">
        <h1>{title}</h1>
        <p className="blog-date">{createdDate}</p>
      </header>
      <div className="blog-content-container">
        {/*<aside className="blog-nav">*/}
        {/*  <MarkNav source={content} ordered={false} />*/}
        {/*</aside>*/}
        <section className="blog-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} >
            {content}
          </ReactMarkdown>
        </section>
      </div>
    </div>
  );
}

export default BlogView;