<template>
  <h3>1、扫码</h3>
  <p>
    <button class="button" @click="scanBarcode()">扫描二维码</button>
  </p>
        <p>扫描内容为：{{scannerData}}</p>

  <h3 class="green">2、拍照片 </h3>
  <p>
    <button class="button" id="take-photo" @click="takePicture()">Take Photo 1 张</button>
  </p>
  <p>
    <img :src="imageUrl ? imageUrl : null" class="img"/>
  </p>

  <h3>3、选文件</h3>
  <button class="button" @click="selectFile()">选择文件</button>


  <h3 class="green">4、定位</h3>
  <p>
    <button class="button" @click="getCurrPosition()">获取当前位置</button>
  </p>
  <p>当前位置为：经度：{{position.latitude}};纬度：{{position.longitude}}</p>
</template>
<script setup>
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import { ref } from 'vue'
import {Geolocation} from "@capacitor/geolocation";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {
  CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerScanOrientation,
  CapacitorBarcodeScannerTypeHintALLOption
} from "@capacitor/barcode-scanner/dist/esm/definitions";
import {CapacitorBarcodeScanner} from "@capacitor/barcode-scanner";

let imageUrl = ref("../../assets/logo.png");
let scannerData = ref(null);
let position = ref(
    {
      latitude:0,
      longitude:0
    }
);

//拍照功能
async function takePicture (){
  const photo = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri,
    // resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader:'选择拍照或者相册',
    promptLabelPhoto:'相册',
    promptLabelPicture:'拍照'
  });

  imageUrl.value = photo.webPath;
}

async function scanBarcode(){
  let scanBarcodeResult = await CapacitorBarcodeScanner.scanBarcode(
      {
        hint: CapacitorBarcodeScannerTypeHintALLOption.ALL,
        scanButton: true,
        scanText: '扫我呀',
        cameraDirection:CapacitorBarcodeScannerCameraDirection.BACK,
        scanOrientation:CapacitorBarcodeScannerScanOrientation.PORTRAIT,
      }
  );
  scannerData.value = scanBarcodeResult.ScanResult;
  console.log("scanResult:::::",scanBarcodeResult.ScanResult);
  // alert("扫描结果===="+scanResult.content)
}


/*export default {
  methods: {
    async scanBarcode() {
      try {
        const result = await BarcodeScanner.startScan({ allowedFormats: ['qr-code'] }); // 只扫描二维码
        console.log('Scanned Barcode', result);
        alert(`Barcode data: ${result.content}`); // 显示扫描结果
      } catch (error) {
        console.error('Error scanning barcode', error);
      } finally {
        BarcodeScanner.stopScan(); // 停止扫描以释放相机资源
      }
    }
  }
}*/
async function selectFile(){
  const contents = await Filesystem.readFile({
    path: 'secrets/text.txt',
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });

  console.log('secrets:', contents);
}
async function getCurrPosition(){
  let currentPosition = await Geolocation.getCurrentPosition({
    timeout: 20000, // 设置 20 秒的超时
    maximumAge:60000,
    enableHighAccuracy: true
  });
  console.log("当前位置：：：：：",currentPosition)
  position.value = {
    latitude:currentPosition.coords.latitude,
    longitude:currentPosition.coords.longitude
  };
  console.log("position.value：：：：：",position.value)

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
  width: 100px;
  height: 100px;
}

h3 {
  margin: 40px 0 0;
}

.green{
  color: green;
}
</style>
