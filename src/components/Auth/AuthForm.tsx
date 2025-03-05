import React from "react";
import {
  Input,
  Form,
  Button,
  Typography,
  Result,
} from "antd";
import type {FormProps} from 'antd';

const {Title} = Typography;

import {UserOutlined, LockOutlined, LoginOutlined, RocketOutlined, SmileOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router";
import {
  AccountInfo,
  AuthStatus
} from "../../types/auth.ts";
import {authService} from "../../services/auth_service.ts";
import "./AuthForm.css"


function AuthForm(
  {
    onClose,
    handleShowAuthTypeGroup,
    isFormTypeLogin,
    setIsFormTypeLogin,
    handleLoginSuccess,
  }: {
    onClose: () => void,
    handleShowAuthTypeGroup: (isShow: boolean) => void,
    isFormTypeLogin: boolean,
    setIsFormTypeLogin: (isLogin: boolean) => void,
    handleLoginSuccess: (v) => void,
  }) {
  const [authStatus, setAuthStatus] = React.useState<AuthStatus>("idle");
  const [regAccountInfo, setRegAccountInfo] = React.useState<AccountInfo>({username: "", password: ""});
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const handleSubmit = async (account_info: AccountInfo) => {
    try {
      if (isFormTypeLogin) {
        await authService.login(account_info);
        setAuthStatus("success");
        handleShowAuthTypeGroup(false);//隐藏顶部的登录注册按钮
        handleLoginSuccess({
          username: account_info.username,
          password: null//登录成功后，不再需要保存密码
        });//向父级组件传递登录成功的消息
        //销毁account_info的内容
        account_info.username = "";
        account_info.password = "";


      } else {
        await authService.register(account_info);
        setRegAccountInfo(account_info);//保存account_info，用于注册成功后的展示
        setAuthStatus("reg_success");//意思是注册成功
        handleShowAuthTypeGroup(false);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message);
      setAuthStatus("error");
    }

  }

  const onFinish: FormProps<AccountInfo>['onFinish'] = (values) => {
    handleSubmit(values);
  };

  const onFinishFailed: FormProps<AccountInfo>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleGoLogin = () => {
    setIsFormTypeLogin(true);
    setAuthStatus("idle");//等待登录
  }

  const handleGoRegister = () => {
    setIsFormTypeLogin(false);
    setAuthStatus("idle");//等待注册
  }

  let content;
  if (authStatus == "success") {
    content = (
      <div>
        <Result
          status="success"
          title="登录成功！"
          subTitle={`欢迎回来，${localStorage.getItem('username')}`}
          extra={[
            <Button
              type="primary"
              onClick={() => {
                onClose();
                //延迟200ms，防止用户看到状态切换
                setTimeout(() => {
                  //销毁所有状态
                  setAuthStatus("idle");
                  setRegAccountInfo({username: "", password: ""});
                  setErrorMessage(null);
                  handleShowAuthTypeGroup(true); // 恢复顶部的登录注册按钮
                }, 200);
              }}
            >
              哈哈好的
            </Button>,
            // <Button
            //   onClick={() => {
            //     navigate("/");
            //     onClose();
            //   }}>
            //   返回首页
            // </Button>,
          ]}
        />
      </div>
    )
  } else if (authStatus == "reg_success") {
    content = (
      <div>
        <Result
          status="success"
          title="注册成功！"
          icon={<SmileOutlined/>}
          //注册后的用户信息，不会存储到localStorage中
          subTitle={`欢迎注册，${regAccountInfo.username}`}
          extra={[
            <Button type="primary" onClick={handleGoLogin}>
              去登录
            </Button>,
          ]}
        />
      </div>
    )
  } else if (authStatus == "error") {
    content = (
      <div>
        <Result
          status="error"
          title={isFormTypeLogin ? "登录失败" : "注册失败"}
          subTitle={errorMessage}
          extra={[
            <Button
              type="primary"
              onClick={isFormTypeLogin ? handleGoLogin : handleGoRegister}
            >
              {isFormTypeLogin ? "重新登录" : "重新注册"}
            </Button>,
          ]}
        />
      </div>
    )
  } else if (authStatus == "idle") {
    content = (
      <div>
        {
          isFormTypeLogin ?
            <Title className={"form-title"}>登录</Title>
            :
            <Title className={"form-title"}>注册</Title>
        }
        <Form.Item<AccountInfo>
          label="用户名"
          name="username"
          rules={[{required: true, message: '请输入用户名'}]}
          className={'input-item'}
        >
          <Input prefix={<UserOutlined/>} placeholder={"账号"}/>
        </Form.Item>

        <Form.Item<AccountInfo>
          label="密码"
          name="password"
          rules={[{required: true, message: '请输入密码'}]}
          className={'input-item'}
        >
          <Input.Password prefix={<LockOutlined/>} placeholder={"密码"}/>
        </Form.Item>

        <Form.Item className={"submit"}>
          <Button
            type={isFormTypeLogin ? "primary" : undefined}
            htmlType="submit"
            className={"submit-button"}
            color={isFormTypeLogin ? "default" : "cyan"}
            variant={isFormTypeLogin ? undefined : "solid"}
          >
            {isFormTypeLogin ? <LoginOutlined/> : <RocketOutlined/>}
            {isFormTypeLogin ? "确认登录" : "确认注册"}
          </Button>
        </Form.Item>
      </div>
    )
  }

  return (
    <div>
      <Form
        name="basic"
        labelCol={{span: 6}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 800}}
        initialValues={{remember: true}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="true"
        className={'form'}
      >
        {content}
      </Form>
    </div>
  )
}

export default AuthForm;


/*
  -----------------------------------登录api-------------------------------------
   login url:/api/auth/login
   method: POST
   请求体：
   {
     "username": "xx",
     "password": "xx"
   }
   返回:
   {
       "roles": [
           "ROLE_USER"
       ],
       "token": "jwt token",
       "username": "xx"
   }


    -----------------------------------注册api-------------------------------------
    register url:/api/auth/register
    method: POST
    请求体：
    {
      "username": "xx",
      "password": "xx"
    }
    返回:
    {
        "roles": [
            "ROLE_USER"
        ],
        "active": true,
        "id": 2,
        "message": "注册成功",
        "username": "wjj"
    }
  -----------------------------------后面没了-----------------------------------
*/

/*
 若登录成功则把jwt的token存储到localStorage中，key为token
 后续使用别的api时候，需要在请求头中加入Authorization: Bearer token
  */