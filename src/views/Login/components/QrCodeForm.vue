<template>
  <el-row v-show="getShow" style="margin-right: -10px; margin-left: -10px">
    <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
      <LoginFormTitle style="width: 100%" />
    </el-col>
    <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
      <el-card class="mb-10px text-center" shadow="hover">
        <el-image
          v-if="qrCodeUrl"
          :src="qrCodeUrl"
          fit="fill"
          alt="QR Code"
          class="qrcode-img"
          @click="fetchQRCode"
        />
      </el-card>
    </el-col>
    <el-divider class="enter-x">{{ t('login.qrcode') }}</el-divider>
    <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
      <div class="mt-15px w-[100%]">
        <XButton
          :title="t('login.backLogin')"
          class="w-[100%]"
          @click="handleBackLogin"
        />
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import LoginFormTitle from './LoginFormTitle.vue';
import { LoginStateEnum, useLoginState } from './useLogin';
import { ElMessage } from 'element-plus';
import * as LoginApi from '@/api/login';
import { setToken as storeToken } from '@/utils/auth';
import { TokenType } from '@/api/login/types';

const { t } = useI18n();
const { handleBackLogin, getLoginState } = useLoginState();
const getShow = computed(() => getLoginState.value === LoginStateEnum.QR_CODE);
const qrCodeUrl = ref('');
let ws: WebSocket | null = null;
const loginSessionKey = ref('');
const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL;
const isQRCodeEnabled = import.meta.env.VITE_PUBLIC_QRCODE_ENABLE === 'true';

const closeWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

const connectWebSocket = () => {
  closeWebSocket(); // Ensure any existing websocket is closed before creating a new one

  if (!isQRCodeEnabled) {
    console.log('QRCode 功能未启用，不建立 WebSocket 连接');
    return;
  }
  
  // 获取带参数的二维码
  const wsUrl = `${wsBaseUrl}/ws/admin/system/public/qc_login?login_session_key=${loginSessionKey.value}`;
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("WebSocket connected");
  };

  ws.onmessage = (event) => {
    console.log('Received raw message:', event.data);
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'login_status') {
        switch (message.status) {
          case 'success':
            ElMessage.success('登录成功！即将跳转');
            handleQRCodeLogin(message.data);
            break;
          case 'expired':
          case 'failure':
            ElMessage.error(message.status === 'expired' ? '二维码已过期，请重新扫码' : '您无权登录后台管理系统，请联系管理员');
            closeWebSocket(); // Close the current WebSocket connection
            fetchQRCode(); // Fetch new QR code and implicitly reconnect the WebSocket
            break;
        }
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  ws.onerror = (event) => {
    console.error('WebSocket发生错误:', event);
  };

  ws.onclose = () => {
    console.log('WebSocket连接已关闭');
  };
};

const handleQRCodeLogin = async (tokenData: TokenType) => {
  storeToken(tokenData);
  window.location.href = '/index';
};

const fetchQRCode = async () => {
  try {
    const response = await LoginApi.fetchQRCode();
    qrCodeUrl.value = response.qrcode_url;
    loginSessionKey.value = response.scene_str;
    connectWebSocket(); // After fetching new QR code, reconnect WebSocket with new login session key
  } catch (error) {
    console.error('Error while fetching QR code:', error);
    ElMessage.error('无法获取二维码，请稍后重试');
  }
};

onMounted(async () => {
  await fetchQRCode(); // Fetch QR code and connect WebSocket when component is mounted
});

onUnmounted(() => {
  closeWebSocket(); // Close WebSocket connection when component is unmounted
});

// irujia 编写 使用公众号二维码 建立websocket连接, 实时获取用户扫码进度。
</script>
<style>
.qrcode-img {
  max-width: 200px; /* 您想要的宽度 */
  height: auto; /* 保持宽高比 */
}
</style>