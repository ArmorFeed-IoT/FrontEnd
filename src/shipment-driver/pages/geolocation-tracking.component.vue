<template>
  <h1>Geolocation Driver</h1>
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
import { webSocketConnectionOptions } from '../../shared/services/ws-common';
export default {
    name: "geolocation-tracking",
    props: {
        shipmentId: Number,
        shipmentDriverId: Number
    },
    data() {
        return {
            webSocket: new WebSocket(`${webSocketConnectionOptions.baseURL}/ws/${this.shipmentDriverId}`),
            position: {
                lat: 51.093048, lng: 6.842120
            },
            trackingOptions: Object.freeze({
                HIGH_ACCURACY : true,
                MAX_CACHE_AGE_MILLISECOND : 30000,
                MAX_NEW_POSITION_MILLISECOND : 5000
            })
        }
    },
    mounted() {
        if(!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.watchPosition(this.updateLocation, this.errorInLocation, {
            enableHighAccuracy: this.trackingOptions.HIGH_ACCURACY,
            maximumAge: this.trackingOptions.MAX_CACHE_AGE_MILLISECOND,
            timeout: this.trackingOptions.MAX_NEW_POSITION_MILLISECOND,
        })

        this.webSocket.onopen = function() {
            console.log("Successfull socket connection");
        }
    },
    methods: {
        sendMessageToClient() {
            const data = {
                customerId: 2,
                enterpriseId: 3,
                data: {
                    latitude: this.position.lat,
                    longitude: this.position.lng,
                    height: 100
                }
            }
            this.webSocket.send(JSON.stringify(data));
        },
        updateLocation(e) {
            console.log("Success ", e);
            this.position.lat = e.coords.latitude;
            this.position.lng = e.coords.longitude;
            this.sendMessageToClient();
        },
        errorInLocation(err) {
            console.log("Error ", err);
        }
    },
}
</script>

<style>

</style>