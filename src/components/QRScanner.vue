<template>
  <div class="qr-scanner">
    <button @click="pickQRFromGallery" class="scan-button">
      从相册选择二维码
    </button>

    <div v-if="loading" class="status-message">
      <p>正在处理二维码...</p>
    </div>

    <div v-if="error" class="status-message error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import jsQR from 'jsqr';
import {Camera, CameraResultType} from "@capacitor/camera";
import {FilePicker} from "@capawesome/capacitor-file-picker";

export default {
  name: 'QRScanner',
  data() {
    return {
      loading: false,
      error: null
    };
  },
  methods: {
    async pickQRFromGallery() {
      this.loading = true;
      this.error = null;

      try {
        // 1. 从相册选择图片
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: 'PHOTOS',
          promptLabelHeader: '选择二维码图片',
          promptLabelPhoto: '从相册选择',
          promptLabelCancel: '取消'
        });

        // 2. 获取图片数据
        // const file = await Filesystem.readFile({
        //   path: image.path
        // });
        const fileResult = await FilePicker.pickImages(
            {path: image.path}
        );
        console.log('图片地址：：：：',fileResult[0].data)
        // 3. 解码二维码
        const qrContent = await this.decodeQRCode(fileResult[0].data);

        // 4. 验证并打开URL
        if (this.isValidUrl(qrContent)) {
          await Browser.open({ url: qrContent });
        } else {
          throw new Error('二维码内容不是有效的网址');
        }
      } catch (error) {
        console.error('QR扫描错误:', error);
        this.error = this.getUserFriendlyError(error);
      } finally {
        this.loading = false;
      }
    },

    async decodeQRCode(base64Data) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
              resolve(code.data);
            } else {
              reject(new Error('未检测到二维码'));
            }
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error('图片加载失败'));
        };

        img.src = `data:image/jpeg;base64,${base64Data}`;
      });
    },

    isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    },

    getUserFriendlyError(error) {
      if (error.message.includes('permission')) {
        return '需要相册访问权限';
      }
      if (error.message.includes('cancel')) {
        return '操作已取消';
      }
      if (error.message.includes('未检测到二维码')) {
        return '未识别到二维码，请选择清晰的二维码图片';
      }
      if (error.message.includes('有效的网址')) {
        return '二维码内容不是有效的网址';
      }
      return '扫描二维码失败，请重试';
    }
  }
};
</script>

<style scoped>
.qr-scanner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.scan-button {
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.scan-button:hover {
  background-color: #3aa876;
}

.status-message {
  margin-top: 20px;
  padding: 10px;
  text-align: center;
}

.error {
  color: #ff4444;
}
</style>
