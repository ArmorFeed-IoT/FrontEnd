<template>
  <h1>Hola</h1>
</template>

<script lang="ts">
import { webSocketConnectionOptions } from '../../shared/services/ws-common';
export default {
    name: "geolocation-tracking",
    data() {
        return {
            webSocket: new WebSocket(`${webSocketConnectionOptions.baseURL}/${this.id}`)
        }
    },
    mounted() {
        
    },
    props: {
        id: Number
    }
}
</script>

<style>

</style>