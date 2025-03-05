import React from "react";
import {Button, Card} from "antd";
import './AuthIn.css'
import {Divider} from "antd";
import AuthForm from "./AuthForm.tsx";

function AuthIn({onClose}: { onClose: () => void }) {
  const [showAuthTypeGroup, setShowAuthTypeGroup] = React.useState(true);
  const [isFormTypeLogin, setIsFormTypeLogin] = React.useState(true);

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
          />
        }
      </Card>
    </>
  )
}

export default AuthIn;