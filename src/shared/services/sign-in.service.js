import http from "./http-common";

class SignInService {
    endPoint = "/signin";
    login(userType, loginResource) {
        return http.post(`${userType}/${this.endPoint}`, loginResource);
    }
}

export default new SignInService();
