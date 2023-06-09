<template>
  <div class="container">
    <div
      class="flex flex-column space-between align-items-center"
      style="max-width: 45rem; width: 100%; margin: 0 auto; min-height: 90vh"
    >
      <div class="my-7 flex flex-column">
        <pv-data-table
          :value="shipments"
          responsiveLayout="stack"
          :paginator="true"
          :rows="10"
        >
          <pv-column
            v-for="col in columns"
            :field="col.field"
            :header="col.header"
            :key="col.field"
          ></pv-column>
          <pv-column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <pv-button icon="pi pi-eye" class="p-button-text p-button-rounded" @click="showCurrentLocation(slotProps.data.id)"/>
            </template>
          </pv-column>
        </pv-data-table>
      </div>
    </div>
    <pv-dialog v-model:visible="dialogEnabled">
        <geolocation-tracking-component :shipmentId="selectedShipmentId" :shipmentDriverId="shipmentDriverId"></geolocation-tracking-component>
    </pv-dialog>
  </div>
</template>

<script>
import { DriverShipmentsApiService } from '../services/driver-shipments-api.service';
import GeolocationTrackingComponent from './geolocation-tracking.component.vue';

export default {
    name: "driver-shipments-list",
    components: { GeolocationTrackingComponent },
    data() {
        return {
            shipments: [],
            columns: [
                { field: "id", header: "Code" },
                { field: "origin", header: "Origin" },
                { field: "pickUpDate", header: "Pick Up Date" },
                { field: "destiny", header: "Destiny" },
                { field: "deliveryDate", header: "Delivery Date" },
                { field: "status", header: "Status" },
            ],
            shipmentDriverId: null,
            dialogEnabled: false,
            selectedShipmentId: null
        }
    },
    mounted() {
        const shipmentDriverApiService = new DriverShipmentsApiService();
        this.shipmentDriverId = parseInt(this.$route.params.id);
        shipmentDriverApiService.findShipmentsByShipmentDriverId(this.shipmentDriverId)
            .then(response => {
                this.shipments = response.data;
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    },
    methods: {
      showCurrentLocation(shipmentId) {
        this.selectedShipmentId = shipmentId;
        this.dialogEnabled = true;
      }
    }
}
</script>

<style>

</style>