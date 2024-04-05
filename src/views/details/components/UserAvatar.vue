<template>
  <div class="change-avatar">
    <CropperAvatar
      ref="cropperRef"
      :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
      :showBtn="false"
      :value="img"
      width="120px"
      @change="handelUpload"
    />
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { uploadDetailsAvatar } from '@/api/system/user/profile'
import { CropperAvatar } from '@/components/Cropper'
import { useUserStore } from '@/store/modules/user'


defineOptions({ name: 'UserAvatar' })

defineProps({
  img: propTypes.string.def('')
})

const userStore = useUserStore()


const cropperRef = ref()
const handelUpload = async ({ data }) => {
  // 添加用户ID到请求数据中
  const uploadData = new FormData();
  uploadData.append('avatarFile', data);
  uploadData.append('id', String(userStore.user.id));  // 假设userStore有一个userId属性

  const res = await uploadDetailsAvatar(uploadData);
  if (res && res.data) {
    cropperRef.value.close();
    userStore.setUserAvatarAction(res.data);
  }
}
</script>

<style lang="scss" scoped>
.change-avatar {
  img {
    display: block;
    margin-bottom: 15px;
    border-radius: 50%;
  }
}
</style>
