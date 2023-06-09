import http from "../../shared/services/http-common.js";
import authHeader from "../../security/services/auth-header";

export class ProfilesApiService{

    putCostumerById(id){
        return http.put(`/customers/${id}`, authHeader());
    }

    putEnterpriseById(id){
        return http.put(`/enterprises/${id}`, authHeader());
    }
}