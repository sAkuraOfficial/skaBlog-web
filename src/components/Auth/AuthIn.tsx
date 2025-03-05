import React from "react";
import {Button, Card} from "antd";
import './AuthIn.css'
import {Divider} from "antd";
import AuthForm from "./AuthForm.tsx";

function AuthIn({onClose}: { onClose: () => void }) {
  const [isFormTypeLogin, setIsFormTypeLogin] = React.useState(true);

  const handleLogin = () => {
    setIsFormTypeLogin(true);
  }

  const handleRegister = () => {
    setIsFormTypeLogin(false);
  }

  return (
    <>
      <Card className={"auth-card"}>
        {/*按钮组:登录、注册*/}
        <div className={"auth-type-button-group"}>
          <Button
            type={isFormTypeLogin ? "primary" : "default"}
            onClick={handleLogin}
          >
            登录
          </Button>
          <Button
            type={isFormTypeLogin ? "default" : "primary"}
            onClick={handleRegister}
          >
            注册
          </Button>
        </div>
        <Divider className={"auth-divider"}/>
        {/*登录注册表单*/}
        <AuthForm
          onClose={onClose}
          isFormTypeLogin={isFormTypeLogin}
          setIsFormTypeLogin={setIsFormTypeLogin}
        />
      </Card>
    </>
  )
}

export default AuthIn;