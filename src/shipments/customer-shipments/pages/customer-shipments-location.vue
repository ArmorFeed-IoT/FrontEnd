<template>
  <GMapMap
    :center="center"
    :zoom="16"
    map-type-id="terrain"
    style="width: 75vw; height: 25rem"
  >
    <GMapCluster>
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      />
    </GMapCluster>
  </GMapMap>
</template>
<script>
import { webSocketConnectionOptions } from '../../../shared/services/ws-common';
export default {
  name: "customer-shipments-location",
  data() {
    return {
      center: {lat: -12.090795, lng: -77.023148},
      markers: [
        {
          position: {
            lat: -12.090795,
            lng: -77.023148
          },
        },
      ],

      locationService: null,
      location: [],
      columns: [
        {field: 'lat', header: 'Lat'},
        {field: 'lng', header: 'Lng'},
      ],
      currentLocation: [],

    }
  },
  mounted() {
    this.socketConnection = new WebSocket(`${webSocketConnectionOptions.baseURL}/ws/${this.customerId}`)
    this.socketConnection.onopen = () => {
      console.log("Successfull socket connection");
    }
    this.socketConnection.onclose = function() {
      console.log("Socket connection closed");
    }
    this.socketConnection.onmessage = (event) => {
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

}
</script>
