<template>
   <h1>Customer View</h1>
    <p>Latitude: {{ latitude }}</p>
    <p>Longitude: {{ longitude }}</p>
    <p>Height: {{ height }}</p>
</template>
<script>
import { webSocketConnectionOptions } from '../../../shared/services/ws-common';
export default {
  name: "customer-shipments-location",
  data() {
    return {
      socketConnection: new WebSocket(`${webSocketConnectionOptions.baseURL}/ws/${this.customerId}`),
      latitude: this.$dataTransfer.locationData.latitude,
      longitude: this.$dataTransfer.locationData.longitude,
      height: this.$dataTransfer.locationData.height
    }
  },
  mounted() {
    this.socketConnection.onopen = () => {
            console.log("Successfull socket connection");
        }
        this.socketConnection.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.latitude = data.Latitude;
            this.longitude = data.Longitude;
            this.height = data.Height;
            this.$dataTransfer.locationData.latitude = data.Latitude;
            this.$dataTransfer.locationData.longitude = data.Longitude;
            this.$dataTransfer.locationData.height = data.Height;
            console.log(data);
        }
  },
  props: {
    customerId: Number
  }

}
</script>
