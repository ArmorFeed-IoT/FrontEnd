<template>
  <form @submit="signUpShipmentDriver(!v$.$invalid)">
        <div class="p-fluid">
          <div class="field mx-2">
            <pv-input-text v-model="name" placeholder="Name"></pv-input-text>
            <small v-show="!v$.name.$model && submitted" class="p-error"
              >Name is required.</small
            >
          </div>
          <div class="field mx-2">
            <pv-input-text
              v-model="description"
              placeholder="Description"
            ></pv-input-text>
          </div>
          <div class="field mx-2">
            <pv-input-text v-model="photo" placeholder="Photo"></pv-input-text>
          </div>
          <div class="field md:flex m-2 md:mb-2">
            <div class="md:mr-1">
              <pv-input-mask
                class="mb-2 md:mb-0"
                placeholder="RUC"
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
                placeholder="Cell phone number"
                v-model="cellPhone"
                mask="999 999 999"
              ></pv-input-mask>
              <small v-show="!v$.cellPhone.$model && submitted" class="p-error"
                >Cell phone is required.</small
              >
            </div>
          </div>
          <div class="field mx-2">
            <div class="p-input-icon-right md:mt-3">
              <i class="pi pi-envelope" />
              <pv-input-text
                id="email-error"
                placeholder="Email"
                v-model="v$.email.$model"
                :class="{ 'p-invalid': v$.email.$invalid && submitted }"
                aria-describedby="email-error"
              />
            </div>
            <span v-if="v$.email.$error && submitted">
              <span
                id="email-error"
                v-for="(error, index) of v$.email.$errors"
                :key="index"
              >
                <small class="p-error">{{ error.$message }}</small>
              </span>
            </span>
            <small
              v-else-if="
                (v$.email.$invalid && submitted) || v$.email.$pending.$response
              "
              class="p-error"
              >{{ v$.email.required.$message.replace("Value", "Email") }}</small
            >
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
              label="Sign Up"
              type="submit"
              class="p-button-success"
            ></pv-button>
          </div>
        </div>
      </form>
      <pv-toast/>
</template>

<script>
import { required, email } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { EnterpriseShipmentDriverApiService } from '../services/EnterpriseShipmentDriverApiService';
export default {
  name: "enterprise-shipment-drivers-form",
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      name: null,
      ruc: null,
      cellPhone: null,
      email: null,
      password: null,
      passwordRepeat: null,
      description: null,
      photo: null,
      notMatch: false,
      passwordMatches: false
    }
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
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: 5,
      },
      passwordRepeat: {
        required,
        minLength: 5,
      },
      photo: {
        required
      }
    };
  },
  props: {
    enterpriseId: Number
  },
  methods: {
    getShipmentDriverDto() {
      return {
        name: this.name,
        photo: this.ruc,
        ruc: this.ruc,
        phoneNumber: this.cellPhone,
        description: this.description,
        email: this.email,
        password: this.password,
        enterpriseId: this.enterpriseId
      }
    },
    async signUpShipmentDriver(isFormValid) {
      if(!isFormValid) {
        this.$toast.add({
          severity: "error",
          summary: "Form data invalid",
          detail: "Form fields values are invalid. Check it and try again.",
          life: 3000,
        });
        return;
      }
      if(this.password !== this.passwordRepeat) {
        this.passwordMatches = false;
        this.notMatch = true;
        this.$toast.add({
          severity: "error",
          summary: "Entered password does not match",
          detail: "Both entered passwords does not match",
          life: 3000,
        });
        return;
      }
      this.passwordMatches = true;
      this.notMatch = false;
      const enterpriseShipmentDriverApiService = new EnterpriseShipmentDriverApiService();
      enterpriseShipmentDriverApiService.registerShipmentDriver(this.getShipmentDriverDto())
        .then( response => {
          console.log(response.data);
          this.$toast.add({
            severity: "success",
            summary: "Shipment Driver registered successfully",
            detail: "Registered Shipment Driver is able to log in",
            life: 3000,
          });
          this.$emit("shipment-driver-registered", response.data);
        })
        .catch( error => {
          console.error(error);
          this.$toast.add({
            severity: "error",
            summary: "An error occured",
            detail: "An error occured while trying to save the shipment driver",
            life: 3000,
        });
      })
    }
  }
}
</script>

<style>

</style>