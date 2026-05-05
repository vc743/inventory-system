const settings = {
  baseApi: import.meta.env.VITE_BASE_API,
  tokenKey: "authToken"
} as const;

export default settings;
