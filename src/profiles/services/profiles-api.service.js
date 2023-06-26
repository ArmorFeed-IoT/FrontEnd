import http from "../../shared/services/http-common.js";
import authHeader from "../../security/services/auth-header";

export class ProfilesApiService{

    putCostumerById(id, data){
        return http.put(`/customers/${id}`, data);
    }

    putEnterpriseById(id, data){
        return http.put(`/enterprises/${id}`, data);
    }

    putShipmentDriverById(id, data){
        return http.put(`shipmentdriver/${id}`, data);
    }
}