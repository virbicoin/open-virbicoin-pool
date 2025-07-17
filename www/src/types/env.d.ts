declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_BASE_URL?: string;
      NEXT_PUBLIC_POOL_BASE_URL?: string;
      NEXT_PUBLIC_POOL1_URL?: string;
      NEXT_PUBLIC_POOL2_URL?: string;
      NEXT_PUBLIC_POOL3_URL?: string;
      NEXT_PUBLIC_POOL4_URL?: string;
      NEXT_PUBLIC_POOL5_URL?: string;
    }
  }
}

export {}; 