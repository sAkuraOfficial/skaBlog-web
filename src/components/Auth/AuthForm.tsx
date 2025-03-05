import React, {useState} from 'react';
import {Button, Form, Input, message} from 'antd';
import {AccountInfo} from '../../types/auth';
import {useAuth} from '../../contexts/AuthContext';
import './AuthForm.css';

interface AuthFormProps {
  onClose: () => void;
  handleShowAuthTypeGroup: (isShow: boolean) => void;
  isFormTypeLogin: boolean;
  setIsFormTypeLogin: (isLogin: boolean) => void;
}

function AuthForm({
                    onClose,
                    handleShowAuthTypeGroup,
                    isFormTypeLogin,
                    setIsFormTypeLogin
                  }: AuthFormProps) {
  const [form] = Form.useForm();
  const {login, register} = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: AccountInfo) => {
    setLoading(true);
    try {
      if (isFormTypeLogin) {
        await login(values);
        onClose(); // Close the modal on successful login
      } else {
        await register(values);
        // Switch to login form after successful registration
        setIsFormTypeLogin(true);
        form.resetFields();
        message.success('注册成功，请登录');
      }
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    handleShowAuthTypeGroup(true);
  };

  return (
    <Form
      form={form}
      name="auth_form"
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {required: true, message: '请输入用户名!'},
          {min: 3, message: '用户名至少需要3个字符'},
          {max: 20, message: '用户名最多20个字符'}
        ]}
      >
        <Input placeholder="请输入用户名"/>
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {required: true, message: '请输入密码!'},
          {min: 6, message: '密码至少需要6个字符'}
        ]}
      >
        <Input.Password placeholder="请输入密码"/>
      </Form.Item>

      <Form.Item>
        <div className="auth-button-group">
          <Button type="default" onClick={handleBack}>
            返回
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isFormTypeLogin ? '登录' : '注册'}
          </Button>

        </div>
      </Form.Item>
    </Form>
  );
}

export default AuthForm;