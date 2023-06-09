import http from "../../shared/services/http-common";
import authHeader from "./auth-header";

class UserService {
  constructor() {
    this.endPointCustomer = "/customers";
    this.endPointEnterprise = "/enterprises";
    this.endPointShipmentDriver = "/shipmentdriver";
  }
  signIn(loginResource) {
    return http
      .post(`${this.endPointCustomer}/sign-in`, loginResource)
      .then((response) => {
        response.data.userType = "customer";
        return response;
      })
      .catch(() => {
        return http
          .post(
            `${this.endPointEnterprise}/sign-in`,
            loginResource,
            authHeader()
          )
          .then((response) => {
            response.data.userType = "enterprise";
            return response;
          })
          .catch(() => {
            return http
              .post(
                `${this.endPointShipmentDriver}/sign-in`,
                loginResource,
                authHeader()
              )
              .then((response) => {
                response.data.userType = "shipment-driver";
                return response;
              });
          });
      });
  }
  signUpCustomer(signUpResource) {
    return http.post(`${this.endPointCustomer}/sign-up`, signUpResource);
  }
  signUpEnterprise(signUpResource) {
    return http.post(`${this.endPointEnterprise}/sign-up`, signUpResource);
  }
  signUpShipmentDriver(signUpShipmentDriver) {
    return http.post(
      `${this.endPointShipmentDriver}/sign-up`,
      signUpShipmentDriver
    );
  }
}

export default new UserService();
