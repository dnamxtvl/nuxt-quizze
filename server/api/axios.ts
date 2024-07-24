import AuthService from "~/services/AuthService";

const api = {
  auth: new AuthService('/'),
};

export default api;
