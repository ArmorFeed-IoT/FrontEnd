import userService from "./user.service.js";

class AuthService {
  login(user) {
    return userService.signIn(user).then((response) => {
      console.log(response);
      if (response.data.token) {
        localStorage.setItem("auth", JSON.stringify(response.data));
      }
      return response.data;
    });
  }
  logout() {
    localStorage.removeItem("auth");
  }
  registerCustomer(user) {
    return userService.signUpCustomer(user);
  }
  registerEnterprise(user) {
    return userService.signUpEnterprise(user);
  }

  registerShipmentDriver(user) {
    return userService.signUpShipmentDriver(user);
  }
}
export default new AuthService();
