import React from "react";
import {Button, Card} from "antd";

import './AuthIn.css'
import {Divider} from "antd";
import AuthForm from "./AuthForm.tsx";
import {AccountInfo} from "../../types/auth.ts";

function AuthIn(
  {
    onClose,
    handleLoginSuccess,
  }: {
    onClose: () => void,
    handleLoginSuccess: (account_info: AccountInfo) => void,
  }
) {


  const [showAuthTypeGroup, setShowAuthTypeGroup] = React.useState(true);//是否显示登录注册按钮组
  const [isFormTypeLogin, setIsFormTypeLogin] = React.useState(true);//登录模式/注册模式

  const handleShowAuthTypeGroup = (isShow: boolean) => {
    setShowAuthTypeGroup(isShow);
  }
  const handleLogin = () => {
    setIsFormTypeLogin(true);
  }
  const handleRegister = () => {
    setIsFormTypeLogin(false);
  }

  return (
    <>
      <Card className={"auth-card"}>
        {
          showAuthTypeGroup ?
            <>
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
            </>
            :
            <>
            </>

        }
        {
          <AuthForm
            onClose={onClose}
            handleShowAuthTypeGroup={handleShowAuthTypeGroup}
            isFormTypeLogin={isFormTypeLogin}
            setIsFormTypeLogin={setIsFormTypeLogin}
            handleLoginSuccess={handleLoginSuccess}
          />

        }
      </Card>
    </>
  )

}

export default AuthIn;