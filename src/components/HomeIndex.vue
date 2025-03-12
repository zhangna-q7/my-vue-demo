<template>
  <p>
    <button class="button" id="take-photo" @click="takePicture()">Take Photo</button>
  </p>
  <p>
<!--    <img id="image" style="max-width: 100%" class="img">-->
    <img :src="imageUrl ? imageUrl : null" class="img"/>
  </p>
</template>
<script setup>
import {Camera, CameraResultType} from '@capacitor/camera';
import { ref } from 'vue'
const imageUrl = ref("../../assets/logo.png");


//拍照功能
async function takePicture (){
  const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
    // resultType: CameraResultType.DataUrl,
    // source: CameraSource.Prompt,
  });

  imageUrl.value = photo.webPath;
}


</script>
<style scoped>
.button {
  display: inline-block;
  padding: 10px;
  background-color: #73B5F6;
  color: #fff;
  font-size: 0.9em;
  border: 0;
  border-radius: 3px;
  text-decoration: none;
  cursor: pointer;
}

.img{
  border: 1px solid red;
  width: 500px;
  height: 400px;
}
</style>
