<template>
<q-page class="column items-center justify-center">
    <q-img src="lora.png" spinner-color="white" style="height: 100px; max-width: 100px" />
    <h2 class="text-center" style="font-family: 'Mochiy Pop P One', sans-serif">
        lora
    </h2>
    <p style="font-family: 'Mochiy Pop P One', sans-serif">
        Asynchronous Transcription Service
    </p>
    <div class="q-pa-md">
        <div class="q-gutter-sm row items-start">
            <q-uploader accept="audio/*" auto-upload url="http://localhost:4444/upload" style="max-width: 300px" />
        </div>
    </div>
    <div class="q-pa-md q-gutter-sm">
        <q-btn @click="onClick" color="primary" label="analyze" />
    </div>
</q-page>
</template>

<script>
import {
    api
} from 'boot/axios';

export default {
    data() {
        return {}
    },
    methods() {
        return {}
    },
    setup() {
        return {
            onClick() {
                api.get('/analyze').then(response => {
                    if (response.status == 200) {
                        console.log('all good');
                    } else {
                        console.log('something went wrong');
                    }
                })

            }
        }

    }

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
