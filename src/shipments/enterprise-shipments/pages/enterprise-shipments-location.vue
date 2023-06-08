<template>
    <h1>Enterprise View</h1>
    <p>Latitude: {{ latitude }}</p>
    <p>Longitude: {{ longitude }}</p>
    <p>Height: {{ height }}</p>
</template>

<script>
export default {
    name: "enterprise-shipments-location",
    data() {
        return {
            socketConnection: new WebSocket("ws://localhost:5017/ws/3"),
            latitude: this.$dataTransfer.locationData.latitude,
            longitude: this.$dataTransfer.locationData.longitude,
            height: this.$dataTransfer.locationData.height
        }
    },
    mounted() {
        this.socketConnection.onopen = () => {
            console.log("Successfull socket connection");
        }
        this.socketConnection.onmessage = (event)  => {
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
    
}
</script>

<style>

</style>