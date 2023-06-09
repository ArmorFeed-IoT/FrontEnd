import http from "../../shared/services/http-common";

export class DriverShipmentsApiService {
    findShipmentsByShipmentDriverId(shipmentDriverId) {
        return http.get(`/shipment-drivers/${shipmentDriverId}/shipments`);
    }
}