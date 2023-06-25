import http from "../../../shared/services/http-common";

export class EnterpriseShipmentDriverApiService {
    findShipmentDriversByEnterpriseId(enterpriseId) {
        return http.get(`/shipmentdriver/enterprise/${enterpriseId}`);
    }
    registerShipmentDriver(shipmentDriver) {
        return http.post(`/shipmentdriver/sign-up`, shipmentDriver);
    }
    findAvailableEnterpriseShipments(enterpriseId) {
        return http.get(`/shipments/without-shipment-driver/${enterpriseId}`);
    }
    findShipmentsByShipmentDriverId(shipmentDriverId) {
        return http.get(`/shipment-drivers/${shipmentDriverId}/shipments`);
    }
    removeShipmentDriver(shipmentDriverId) {
        return http.delete(`/shipmentdriver/${shipmentDriverId}`);
    }
}