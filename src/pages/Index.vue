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
          @uploaded="this.stateAnalyzeBtn = true"
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
        @click="analyze"
        color="primary"
        label="analyze"
      />
    </div>
    <q-linear-progress v-if="this.stateInderterminate" indeterminate />
    <div class="row justify-center full-height full-width text-center" v-if="this.stateTranscriptionContent">
      <q-card style="width=60%" class="transcription-box">
        <q-card-section>
          {{ transcription }}
        </q-card-section>
      </q-card>
      <q-btn class="transcription-btn" @click="reloadPage" color="secondary" label="new transcription" />
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import { ref } from "vue";

export default {
  data() {
    return {
      stateInderterminate: false,
      stateAnalyzeBtn: false,
      stateTranscriptionContent: false,
      transcription: "",
    };
  },
  methods: {
    reloadPage() {
        window.location.reload();
    },
    analyze() {
      this.stateInderterminate = true;
      this.stateAnalyzeBtn = false;
      api.get("/analyze").then((response) => {
        if (response.status == 200) {
          this.stateInderterminate = false;
          this.transcription = response.data.transcription;
          this.stateTranscriptionContent = true;
        } else {
          console.log("something went wrong");
        }
      });
    },
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

.transcription-btn {
    margin-top: 10px;
}

.transcription-box {
    margin-left: 10px;
    margin-right: 10px;
}
</style>
