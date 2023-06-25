<template>
  <div class="container">
    <div
      class="flex flex-column space-between align-items-center"
      style="max-width: 45rem; width: 100%; margin: 0 auto; min-height: 90vh"
    >
    <pv-button 
        icon="pi pi-eye"
        label="Go Back"
        class="p-button-text p-button-rounded"
        @click="$router.back()"
      />
      <p class="datatable-title">Available Shipments</p>
      <div class="my-7 flex flex-column">
        <pv-data-table
          :value="availableShipments"
          responsiveLayout="stack"
          :paginator="true"
          :rows="5"
        >
          <pv-column
            v-for="col in columns"
            :field="col.field"
            :header="col.header"
            :key="col.field"
          ></pv-column>
          <template #empty> No available shipments to assign.</template>
          <pv-column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <!-- <router-link
                :to="`/customers/${this.id}/shipments/${slotProps.data.id}/shipment-detail`"
                ><pv-button icon="pi pi-eye" class="p-button-text p-button-rounded"
              /></router-link> -->
              <pv-button 
                label="Asign Shipment"
                icon="pi pi-check"
                severity="success"
                class="p-button-text p-button-rounded"
                @click="updateShipment(slotProps.data)"
              ></pv-button>
            </template>
          </pv-column>
        </pv-data-table>
      </div>
      <pv-divider/>
      <p class="datatable-title">Assigned Shipments</p>
      <div class="my-7 flex flex-column">
        <pv-data-table
          :value="shipmentDriverShipments"
          responsiveLayout="stack"
          :paginator="true"
          :rows="5"
        >
          <pv-column
            v-for="col in columns"
            :field="col.field"
            :header="col.header"
            :key="col.field"
          ></pv-column>
          <template #empty> No Shipment Driver Shipments found.</template>
        </pv-data-table>
      </div>
    </div>
  </div>
  <pv-toast/>
</template>

<script>
import { EnterpriseShipmentsService } from '../../../shipments/enterprise-shipments/services/enterprise-shipments.service';
import { EnterpriseShipmentDriverApiService } from '../services/EnterpriseShipmentDriverApiService'
export default {
  name: "enterprise-shipment-driver-shipment-list",
  data() {
    return {
      availableShipments: [],
      shipmentDriverShipments: [],
      enterpriseShipmentDriverApiService: new EnterpriseShipmentDriverApiService(),
      columns: [
        { field: "id", header: "Code" },
        { field: "origin", header: "Origin" },
        { field: "pickUpDate", header: "Pick Up Date" },
        { field: "destiny", header: "Destiny" },
        { field: "deliveryDate", header: "Delivery Date" },
        { field: "status", header: "Status" },
      ],
      shipmentDriverId: null,
      enterpriseId: null
    }
  },
  created() {
    this.enterpriseId = this.$route.params.enterpriseId;
    this.shipmentDriverId = this.$route.params.shipmentDriverId;
    this.enterpriseShipmentDriverApiService.findAvailableEnterpriseShipments(this.enterpriseId)
      .then(response => {
        this.availableShipments = response.data;
      })
      .catch(error => {
        console.error(error);
        this.$toast.add({
            severity: "error",
            summary: "An error occured",
            detail: "An error occurred while trying to fetch shipments data",
            life: 3000,
        });
      });
    this.enterpriseShipmentDriverApiService.findShipmentsByShipmentDriverId(this.shipmentDriverId)
      .then( response => {
        this.shipmentDriverShipments = response.data;
      })
      .catch( error => {
        console.error(error);
        this.$toast.add({
            severity: "error",
            summary: "An error occured",
            detail: "An error occurred while trying to fetch shipments data",
            life: 3000,
        });
    });
  },
  methods: {
    updateShipment(shipment) {
      if(this.shipmentDriverShipments.length >= 1) {
        this.$toast.add({
            severity: "info",
            summary: "This action is not available",
            detail: "A shipment driver can be asigned to only one shipment",
            life: 3000,
        });
        return;
      }
      // Assigning a shipment id in a shipment
      shipment.shipmentDriverId = this.shipmentDriverId;
      const enterpriseShipmentsApiService = new EnterpriseShipmentsService();
      enterpriseShipmentsApiService.updateShipment(shipment.id, shipment)
        .then(response => {
          this.shipmentDriverShipments = [...this.shipmentDriverShipments, response.data];
          console.log(this.shipmentDriverShipments);
          this.availableShipments = this.availableShipments.filter(shipment => shipment.id != response.data.id);
          this.$toast.add({
            severity: "success",
            summary: "Shipment assigned to a Shipment Driver successfully",
            detail: "Now yout can track shipment location and status",
            life: 3000,
          });
        })
        .catch( error => {
          console.error(error);
          this.$toast.add({
            severity: "error",
            summary: "An error occured",
            detail: "An error occured while trying to update shipment data",
            life: 3000,
          });
        })
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #e5eced;
  color: #fff;
}
.datatable-title {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
  font-size: 2rem;
  color: #444;
}
</style>