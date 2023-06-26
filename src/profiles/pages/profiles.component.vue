<template>
  <div class="bg-profile">
    <div class="bg-white profile">
      <h2 class="text-center mb-2">Edit your ArmorFeed account</h2>
      <div v-if="isConfirm">
        <div class="p-fluid">
          <div>
            <p class="font-bold success-color">
              Your account has been edited!
            </p>
          </div>
          <div class="field mt-8">
            <pv-button label="Exit Profile" @click="exitProfile"></pv-button>
          </div>
          <div class="field">
            <pv-button label="Save Edits" @click="goToSaveEdit"></pv-button>
          </div>
        </div>
      </div>
      <form v-else @submit.prevent="handleSubmit(!v$.$invalid)">
        <div class="p-fluid">
          <div class="field mx-2" style="margin-top: 15px">
            <p>Upload Profile Picture</p>
            <pv-file-upload
              outlined
              label="File"
              v-model="image"
            ></pv-file-upload>
          </div>
          <div class="field mx-2">
            <pv-input-text v-model="name" placeholder="name"></pv-input-text>
            <small v-show="!v$.name.$model && submitted" class="p-error"
            >Name is required.</small
            >
          </div>
          <div class="field mx-2" v-if="profileType === 'enterprise'">
            <pv-input-number
              class="mb-2"
              v-model="priceBase"
              placeholder="Price Base"
              mode="decimal"
              :minFractionDigits="2"
            ></pv-input-number>
            <pv-input-number
              class="mb-2"
              v-model="factorWeight"
              placeholder="Factor Weight"
              mode="decimal"
              :minFractionDigits="2"
            ></pv-input-number>
            <pv-input-number
              v-model="shippingTime"
              placeholder="Shipping Time"
            ></pv-input-number>
          </div>
          <div class="field mx-2" v-else-if="profileType === 'customer'">
            <pv-input-text
              v-model="lastname"
              placeholder="Lastname"
            ></pv-input-text>
          </div>
          <div class="field mx-2" v-else-if="profileType === 'shipmentdriver'">
            <pv-input-text
              v-model="lastname"
              placeholder="Lastname"
            ></pv-input-text>
          </div>
          <div class="field mx-2">
            <pv-input-text
                v-model="description"
                placeholder="Description"
            ></pv-input-text>
          </div>
          <div class="field md:flex m-2 md:mb-2">
            <div class="md:mr-1">
              <pv-input-mask
                  class="mb-2 md:mb-0"
                  placeholder="Ruc"
                  v-model="ruc"
                  mask="999 999 999 999"
              ></pv-input-mask>
              <small v-show="!v$.ruc.$model && submitted" class="p-error"
              >RUC is required.</small
              >
            </div>
            <div class="md:ml-1">
              <pv-input-mask
                  class="my-2 md:my-0"
                  placeholder="Cell Phone Number"
                  v-model="cellPhone"
                  mask="999 999 999"
              ></pv-input-mask>
              <small v-show="!v$.cellPhone.$model && submitted" class="p-error"
              >Cell phone is required.</small
              >
            </div>
          </div>
          <div class="field mx-2">
            <pv-password
                v-model="password"
                placeholder="Password"
                class="w-full"
            >
            </pv-password>
            <span v-if="v$.password.$error && submitted">
              <span
                  id="email-error"
                  v-for="(error, index) of v$.password.$errors"
                  :key="index"
              >
                <small class="p-error">{{ error.$message }}</small>
              </span>
            </span>
            <small
                v-else-if="
                (v$.password.$invalid && submitted) ||
                v$.password.$pending.$response
              "
                class="p-error"
            >{{
                v$.password.required.$message.replace("Value", "Password")
              }}</small
            >
          </div>
          <div class="field mx-2">
            <pv-password
                class="w-full"
                placeholder="Password repeat"
                v-model="passwordRepeat"
            >
              <template #footer>
                <pv-divider></pv-divider>
                <div
                    v-if="passwordMatches && password != null"
                    class="flex align-items-center"
                >
                  <i class="pi pi-check mr-2"></i>
                  <p class="">The passwords match.</p>
                </div>
                <div
                    v-else-if="!passwordMatches && password != null"
                    class="flex align-items-center"
                >
                  <i class="pi pi-times mr-2 p-error"></i>
                  <p class="p-error">Passwords do not match.</p>
                </div>
              </template>
            </pv-password>
            <small
                v-show="!v$.passwordRepeat.$model && submitted"
                class="p-error"
            >Password is required.</small
            >
            <p v-if="notMatch" class="p-error">Passwords do not match.</p>
          </div>
          <div class="field mx-2 md:flex">
            <pv-button
                label="Exit Profile"
                class="mb-2 md:mb-0 md:mr-2 p-button-info"
                @click="exitProfile"
            ></pv-button>
            <pv-button
                label="Save Edits"
                type="submit"
                class="p-button-success"
            ></pv-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import {ProfilesApiService} from "../services/profiles-api.service";

export default {
  name: "profile-component",
  setup: () => ({ v$: useVuelidate() }),
  data: () => {
    return {
      isDark: null,
      user: null,
      isConfirm: false,
      submitted: false,
      notMatch: false,
      image:null,
      base64:null,

      userId: null,
      profileType: null,
      lastname: null,
      name: null,
      photo: String,
      ruc: null,
      cellPhone: null,
      description: null,
      email: null,
      password: null,
      passwordRepeat: null,

      factorWeight:null,
      shippingTime:null,
      priceBase:null,
    };
  },
  computed: {
    passwordMatches() {
      return this.password === this.passwordRepeat;
    },
  },
  validations() {
    return {
      name: {
        required,
      },
      ruc: {
        required,
      },
      cellPhone: {
        required,
      },
      password: {
        required,
        minLength: 5,
      },
      passwordRepeat: {
        required,
        minLength: 5,
      },
    };
  },
  watch:{
    // eslint-disable-next-line vue/no-arrow-functions-in-watch
    image: (newVal, oldVal) => {
      if (newVal){
        this.createBase64Image(newVal);
      }
      else {
        this.base64 = null;
      }
    }
  },
  methods: {
    exitProfile() {
      if (this.profileType == "customer"){
        this.$router.push(`/customers/${this.userId}/quotations`);
      }
      else if (this.profileType == "enterprise"){
        this.$router.push(`/enterprise/${this.userId}/shipments`);
      }
      else {
        this.$router.push(`/shipment-driver/${this.userId}/shipments`);
      }
    },
    createBase64Image: function(FileObject){
      const reader = new FileReader();
      reader.onload = (event) => {
        this.base64 = event.target.result;
      }
      reader.readAsDataURL(FileObject);
      console.log(this.base64)
    },
    goToSaveEdit() {
      this.isConfirm = false;
      this.resetForm();
    },
    UserId() {
      return !this.user ? this.userId : this.user.id;
    },
    editUser() {
      if (this.profileType === "customer") {
        this.photo = "justatest"
        return {
          email: this.email,
          password: this.password,
          name: this.name,
          ruc: this.ruc.split(" ").join(""),
          phoneNumber: this.cellPhone.split(" ").join(""),
          description: this.description,
          photo: this.base64,
          lastname: this.lastname,
          subscriptionPlan: 0,
        };
      }
      else if (this.profileType === "enterprise"){
        return {
          email: this.email,
          password: this.password,
          name: this.name,
          ruc: this.ruc.split(" ").join(""),
          phoneNumber: this.cellPhone.split(" ").join(""),
          priceBase: this.priceBase,
          factorWeight: this.factorWeight,
          shippingTime: this.shippingTime,
          description: this.description,
          photo: this.base64,
          score: this.score,
        };
      }
      return {
        email: this.email,
        password: this.password,
        name: this.name,
        ruc: this.ruc.split(" ").join(""),
        phoneNumber: this.cellPhone.split(" ").join(""),
        description: this.description,
        lastname: this.lastname,
        enterpriseId: this.auth.enterpriseId
      };
    },
    async handleSubmit(isFormValid) {
      this.submitted = true;
      if (isFormValid) {
        if (this.password === this.passwordRepeat) {
          this.notMatch = false;
          const editUser = this.editUser();
          const profileupdate = new ProfilesApiService();
          if (this.profileType === "customer") {
            profileupdate.putCostumerById(this.userId, editUser).then((response) => {
              response.data
              console.log(response.data)
            });

          } else if (this.profileType === "enterprise") {
            profileupdate.putEnterpriseById(this.userId, editUser).then((response) => {
              response.data
            });
          }
          else {
            profileupdate.putShipmentDriverById(this.userId, editUser).then((response) => {
              response.data
            });
          }
          /*
          const enterpriseShipmentsService = new EnterpriseShipmentsService();
          enterpriseShipmentsService.getShipmentsById(id).then((response) => {
            response.data.forEach((shipment) => {
              this.$dataTransfer.addEnterpriseShipmentId(shipment.id);
            });
           */
        } else this.notMatch = true;
      }
    },
    resetForm() {
      this.submitted = false;
      this.name = null;
      this.ruc = null;
      this.description = null;
      this.cellPhone = null;
      this.password = null;
      this.passwordRepeat = null;
    },
  },
  mounted() {
    this.$nextTick(() => {
      const auth = JSON.parse(localStorage.getItem("auth"));
      this.userId = auth.id;
      this.email = auth.email;
      this.name = auth.name;
      this.ruc = auth.ruc;
      this.cellPhone = auth.phoneNumber;
      this.description = auth.description;
      this.profileType = auth.userType;
      if (this.profileType == "customer"){
        this.lastname = auth.lastName
      }
      else if (this.profileType == "enterprise"){
        this.factorWeight = auth.factorWeight
        this.shippingTime = auth.shippingTime
        this.priceBase = auth.priceBase
      }
      else {
        this.lastname = auth.lastName
      }
    });
  },
};
</script>

<style scoped>
.bg-profile {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e5eced;
  height: 100%;
}
.profile {
  width: 100%;
  max-width: 500px;
  min-height: calc(100vh - 80px - 67px);
  padding: 40px 40px;
  height: 100%;
  margin: 30px 10px;
  border-radius: 5px;
  box-shadow: -1px 1px 5px 3px rgba(0, 0, 0, 0.2);
}
@media (min-width: 720px) {
  .profile {
    padding: 40px 50px;
  }
  .success-color {
    color: #28a745;
    text-align: center;
    padding: 2px 2px;
    border-style: dashed;
    border-width: 3px;
  }
}
</style>