<template>
  <p class="geolocation-title">Driver Current Location</p>
  <pv-skeleton v-if="mapVisible === false" width="10rem" height="4rem"></pv-skeleton>
  <GMapMap
    v-if="mapVisible"
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
import { CustomerShipmentsApiService } from '../../shipments/customer-shipments/services/customer-shipments-api.service';
export default {
    name: "geolocation-tracking",
    props: {
        shipmentId: Number,
        shipmentDriverId: Number
    },
    data() {
        return {
            webSocket: null,
            position: {
                lat: 51.093048, lng: 6.842120
            },
            mapVisible: false,
            trackingOptions: Object.freeze({
                HIGH_ACCURACY : true
            }),
            customerId: null,
            enterpriseId: null,
            watchId: null
        }
    },
    mounted() {
        const shipmentApiService = new CustomerShipmentsApiService();

        shipmentApiService.getShipmentById(this.shipmentId)
            .then( response => {
                this.customerId = response.data.customerId;
                this.enterpriseId = response.data.enterpriseId;
            }).catch( error => console.error(error) );

        this.webSocket = new WebSocket(`${webSocketConnectionOptions.baseURL}/ws/${this.shipmentDriverId}`);
        this.webSocket.onopen = function() {
            console.log("Successfull socket connection");
        }
        this.webSocket.onclose = function() {
            console.log("Socket connection closed");
        }
        if(!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(this.updateLocation,this.errorInLocation, {
            enableHighAccuracy: this.trackingOptions.HIGH_ACCURACY,
        });

        this.watchId = navigator.geolocation.watchPosition(this.updateLocation, this.errorInLocation, {
            enableHighAccuracy: this.trackingOptions.HIGH_ACCURACY,
        });
    },
    unmounted() {
        this.webSocket.close();
        navigator.geolocation.clearWatch(this.watchId);
    },
    methods: {
        sendMessageToClient() {
            const data = {
                customerId: this.customerId,
                enterpriseId: this.enterpriseId,
                data: {
                    latitude: this.position.lat,
                    longitude: this.position.lng,
                    height: 100
                }
            }
            if(this.webSocket.readyState === WebSocket.OPEN)
                this.webSocket.send(JSON.stringify(data));
        },
        updateLocation(e) {
            console.log("Success ", e);
            this.position.lat = e.coords.latitude;
            this.position.lng = e.coords.longitude;
            if(this.mapVisible === false) {
                this.mapVisible = true;
            }
            this.sendMessageToClient();
        },
        errorInLocation(err) {
            console.log("Error ", err);
        }
    },
}
</script>

<style scoped>
.geolocation-title {
    font-size: 2rem;
    text-align: center;
}
</style>