<template>
  <div class="filter-container">
    <pv-drop-down
      class="filter-dropdown"
      v-model="selectedItem"
      :options="options"
      @change="handleClick"
    >
      <template #option="slotProps">
        <div class="p-dropdown-car-option text-center text-1xl">
          <span>{{ slotProps.option }}</span>
        </div>
      </template>
    </pv-drop-down>
    <pv-drop-down
      class="filter-dropdown"
      v-model="selectedDepartment"
      :options="departments"
      @change="handleClick"
    >
      <template #option="slotProps">
        <div class="p-dropdown-car-option text-center text-1xl">
          <span>{{ slotProps.option }}</span>
        </div>
      </template>
    </pv-drop-down>

  </div>
</template>

<script>
export default {
  name: "customer-shipments-filter",
  data() {
    return {
      options: ["All", "Pending", "Finished", "In progress"],
      selectedItem: null,
      departments: [
        "All",
        "Amazonas",
        "Ancash",
        "Apurimac",
        "Arequipa",
        "Ayacucho",
        "Cajamarca",
        "Callao",
        "Cusco",
        "Huancavelica",
        "Huanuco",
        "Ica",
        "Junín",
        "La Libertad",
        "Lambayeque",
        "Lima",
        "Loreto",
        "Madre de Dios",
        "Moquegua",
        "Pasco",
        "Piura",
        "Puno",
        "San Martín",
        "Tacna",
        "Tumbes",
        "Ucayali",
      ],
      selectedDepartment: null
    };
  },
  mounted() {
    this.selectedItem = this.options[0];
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>
<style>
.filter-container {
  margin-right: 1rem;
  margin-top: 3rem;
  display: flex;
  justify-content: end;
}

.filter-dropdown {
  text-align: center;
  width: 10rem; /* Ajusta el ancho según tus necesidades */
  margin-right: 1rem; /* Ajusta el margen entre los list options */
}
</style>