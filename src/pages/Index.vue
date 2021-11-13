<template>
  <q-page class="column items-center justify-center">
    <q-img
      src="lora.png"
      spinner-color="white"
      style="height: 100px; max-width: 100px"
    />
    <h2 class="text-center" style="font-family: 'Mochiy Pop P One', sans-serif">
      lora
    </h2>
    <p style="font-family: 'Mochiy Pop P One', sans-serif">
      Asynchronous Transcription Service
    </p>
    <div class="q-pa-md">
      <div class="q-gutter-sm row items-start">
        <q-uploader
          @uploaded="this.stateAnalyzeBtn = true;"
          accept="audio/*"
          auto-upload
          url="http://localhost:4444/upload"
          style="max-width: 300px"
        />
      </div>
    </div>
    <div class="q-pa-md q-gutter-sm">
      <q-btn
        v-if="this.stateAnalyzeBtn"
        @click="this.analyze"
        color="primary"
        label="analyze"
      />
    </div>
    <div v-if="this.stateTranscriptionContent" class="q-pa-md">
      <q-infinite-scroll @load="onLoad" :offset="250">
        <div v-for="(item, index) in items" :key="index" class="caption">
          <p>{{transcription}}</p>
        </div>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import { ref } from "vue";

export default {
  data() {
    return {
      stateAnalyzeBtn: false,
      stateTranscriptionContent: false,
      transcription: "",
    };
  },
  methods() {
    return {
      analyze() {
        api.get("/analyze").then((response) => {
          if (response.status == 200) {
            this.transcription = response.data.transcription;
            this.stateTranscriptionContent = true;
            console.log(this.transcription);
          } else {
            console.log("something went wrong");
          }
        });
      },
    };
  },
  setup() {
    const items = ref([{}, {}, {}, {}, {}, {}, {}]);
    return {
      items,
      onLoad(index, done) {
        setTimeout(() => {
          items.value.push({}, {}, {}, {}, {}, {}, {});
          done();
        }, 2000);
      },
    };
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: 5px;
}

subtitle {
  margin-top: 0px;
}
</style>
