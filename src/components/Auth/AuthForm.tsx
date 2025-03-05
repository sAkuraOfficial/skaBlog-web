import {useState, useEffect} from 'react';
import {Button, Form, Input, Alert} from 'antd';
import {AccountInfo} from '../../types/auth';
import {useAuth} from '../../contexts/AuthContext';
import './AuthForm.css';
import {useMessage} from "../../contexts/MessageContext.tsx";

interface AuthFormProps {
  onClose: () => void;
  isFormTypeLogin: boolean;
  setIsFormTypeLogin: (isLogin: boolean) => void;
}

function AuthForm({
                    onClose,
                    isFormTypeLogin,
                    setIsFormTypeLogin
                  }: AuthFormProps) {
  const [form] = Form.useForm();
  const {login, register, status, error, clearError} = useAuth();
  const [loading, setLoading] = useState(false);
  const messageApi = useMessage();
  // 当登录/注册类型改变时，清除表单和错误
  useEffect(() => {
    clearError();
  }, [isFormTypeLogin, form]);

  const handleSubmit = async (values: AccountInfo) => {
    setLoading(true);
    try {
      if (isFormTypeLogin) {
        const response = await login(values);
        onClose(); // 登录成功后关闭弹窗
        await messageApi.open(
          {
            type: 'success',
            content: `欢迎回来, ${response.username}!`
          }
        );
      } else {
        await register(values);
        // 注册成功后切换到登录表单
        setIsFormTypeLogin(true);
        messageApi.open(
          {
            type: 'success',
            content: '注册成功，请登录'
          }
        )
      }
    } catch (error) {
      // 错误已经在 AuthContext 中设置，这里只负责显示
      const errorMessage = error instanceof Error ? error.message : '操作失败';
      // messageApi.error(isFormTypeLogin ? '登录失败: ' + errorMessage : '注册失败: ' + errorMessage);
      messageApi.open(
        {
          type: 'error',
          content: isFormTypeLogin ? '登录失败: ' + errorMessage : '注册失败: ' + errorMessage
        }
      )
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    clearError(); // 返回时清除错误
  };

  return (
    <>
      {
        <Form
          form={form}
          name="auth_form"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {error && (
            <Form.Item>
              <Alert
                message={isFormTypeLogin ? "登录失败" : "注册失败"}
                description={error}
                type="error"
                showIcon
                closable
                onClose={clearError}
              />
            </Form.Item>
          )}
          {
            (status == "reg_success") && (
              <Form.Item>
                <Alert
                  message="注册成功"
                  description="请登录"
                  type="success"
                  showIcon
                  closable
                  onClose={clearError}
                />
              </Form.Item>
            )
          }

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
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || status === 'loading'}
                disabled={status === 'loading'}
              >
                {isFormTypeLogin ? '登录' : '注册'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      }
    </>
  )
    ;
}

export default AuthForm;