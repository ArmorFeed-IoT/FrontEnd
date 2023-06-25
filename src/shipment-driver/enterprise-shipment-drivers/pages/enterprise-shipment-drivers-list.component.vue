<template>
  <div class="container">
    <div class="flex flex-column space-between align-items-center"
      style="max-width: 45rem; width: 100%; margin: 0 auto; min-height: 90vh"
  >
    <div class="my-7 flex flex-column">
      <pv-data-table
        :value="enterpriseShipmentDrivers"
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
        <template #empty> No Shipment drivers found.</template>
        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <router-link
              :to="`/enterprise/${enterpriseId}/shipment-drivers/${slotProps.data.id}/shipments`"
              ><pv-button icon="pi pi-eye" label="Shipments" class="p-button-text p-button-rounded"
            /></router-link>
            <pv-button 
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              class="p-button-text p-button-rounded"
              @click="deleteShipmentDriverDialog = true;shipmentDriverToDeleteId=slotProps.data.id"
            ></pv-button>
          </template>
        </pv-column>
      </pv-data-table>
      <pv-button label="Register a new Shipment Driver" @click="registerVehicleDialog = true"></pv-button>
      <pv-dialog
        v-model:visible="registerVehicleDialog"
        :style="{ width: '450px' }"
        header="Register a new Shipment Driver"
        :modal="true"
      >
        <EnterpriseShipmentDriversFormComponent 
          :enterpriseId="enterpriseId"
          @shipment-driver-registered="shipmentDriverRegistered" 
        />
      </pv-dialog>
      <pv-dialog v-model:visible="deleteShipmentDriverDialog">
        <div class="delete-dialog">
          Are you sure you want to delete this Shipment driver?
          <pv-button label="Yes" @click="deleteShipmentDriver" severity="success"></pv-button>
          <pv-button label="No" @click="deleteShipmentDriverDialog = false; shipmentDriverToDeleteId = null" severity="danger"></pv-button>
        </div>
      </pv-dialog>
    </div>
  </div>
  </div>
  <pv-toast/>
</template>

<script>
import EnterpriseShipmentDriversFormComponent from "./enterprise-shipment-drivers-form.component.vue";
import { EnterpriseShipmentDriverApiService } from "../services/EnterpriseShipmentDriverApiService";
export default {
    name: "enterprise-shipment-drivers-list",
    components: { EnterpriseShipmentDriversFormComponent },
    data() {
        return {
            enterpriseShipmentDriverApiService: new EnterpriseShipmentDriverApiService(),
            enterpriseShipmentDrivers: [],
            columns: [
                { field: "id", header: "Code" },
                { field: "name", header: "Name" },
                { field: "photo", header: "Photo" },
                { field: "ruc", header: "Ruc" },
                { field: "phoneNumber", header: "Phone Number" },
                { field: "description", header: "Description" },
                { field: "email", header: "Email" },
            ],
            registerVehicleDialog: false,
            enterpriseId: null,
            deleteShipmentDriverDialog: false,
            shipmentDriverToDeleteId: null
        }
    },
    created() {
      this.enterpriseId = this.$route.params.id;
        this.enterpriseShipmentDriverApiService.findShipmentDriversByEnterpriseId(this.enterpriseId)
            .then( response => {
                this.enterpriseShipmentDrivers = response.data;
            })
            .catch( error => {
                console.error(error);
                this.$toast.add({
                    severity: "error",
                    summary: "An error occured",
                    detail: "An error occurred while trying to fetch shipment drivers data",
                    life: 3000,
                });
            });
    },
    methods: {
      shipmentDriverRegistered(newShipmentDriver) {
        console.log(newShipmentDriver);
        this.enterpriseShipmentDrivers.push(newShipmentDriver);
        this.registerVehicleDialog = false;
      },
      deleteShipmentDriver() {
        console.log(`Shipment driver id to delete: ${this.shipmentDriverToDeleteId}`);
        this.enterpriseShipmentDriverApiService.removeShipmentDriver(this.shipmentDriverToDeleteId)
        .then(response => {
          console.log(response.data);
          this.$toast.add({
            severity: "success",
            summary: "Shipment Driver deleted successfully",
            detail: "Shipment Driver deleted successfully",
            life: 3000,
          });
          this.enterpriseShipmentDrivers = this.enterpriseShipmentDrivers.filter(shipmentDriver => shipmentDriver.id !== this.shipmentDriverToDeleteId);
          this.shipmentDriverToDeleteId = null;
          this.deleteShipmentDriverDialog = false;
        })
        .catch( error => {
          console.error(error);
          this.$toast.add({
            severity: "error",
            summary: "An error occured",
            detail: "An error occurred while trying to delete shipment driver data",
            life: 3000,
          });
          this.shipmentDriverToDeleteId = null;
          this.deleteShipmentDriverDialog = false;
        });
      }
    }
}
</script>

<style>
.container {
  background-color: #e5eced;
  color: #fff;
}
.delete-dialog {
  height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>