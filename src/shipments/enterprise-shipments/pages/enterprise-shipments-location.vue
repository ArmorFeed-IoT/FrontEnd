<template>
    <h1>Shipment Current Location</h1>
    <GMapMap
      :center="position"
      :zoom="18"
      map-type-id="terrain"
      style="width: 500px; height: 300px"
    >
      <GMapCluster>
        <GMapMarker
            :position="position"
            :clickable="true"
            :draggable="true"
        />
      </GMapCluster>
    </GMapMap>
</template>

<script>
import { webSocketConnectionOptions } from '../../../shared/services/ws-common';
export default {
    name: "enterprise-shipments-location",
    data() {
        return {
            socketConnection: null,
            position: {
                lat: this.$dataTransfer.locationData.latitude,
                lng: this.$dataTransfer.locationData.longitude
            },
            latitude: this.$dataTransfer.locationData.latitude,
            longitude: this.$dataTransfer.locationData.longitude,
            height: this.$dataTransfer.locationData.height
        }
    },
    mounted() {
        this.socketConnection = new WebSocket(`${webSocketConnectionOptions.baseURL}/ws/${this.enterpriseId}`)
        this.socketConnection.onopen = () => {
            console.log("Successfull socket connection");
        }
        this.socketConnection.onclose = function() {
            console.log("Socket connection closed");
        }
        this.socketConnection.onmessage = (event)  => {
            const data = JSON.parse(event.data);
            this.latitude = data.Latitude;
            this.longitude = data.Longitude;
            this.height = data.Height;
            this.$dataTransfer.locationData.latitude = data.Latitude;
            this.$dataTransfer.locationData.longitude = data.Longitude;
            this.$dataTransfer.locationData.height = data.Height;
            this.position.lat = data.Latitude;
            this.position.lng = data.Longitude;
            console.log(data);
        }
    },
    props: {
        enterpriseId: Number
    }
}
</script>

<style>

</style>