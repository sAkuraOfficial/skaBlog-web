/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  // 在这里添加更多环境变量的类型定义
  readonly VITE_ENABLE_FEATURE_X: boolean;
  readonly VITE_MAX_UPLOAD_SIZE: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}