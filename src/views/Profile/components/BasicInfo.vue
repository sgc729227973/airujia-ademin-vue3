<template>
  <div class="form-container">
    <Form ref="formRef" :labelWidth="150" :rules="rules" :schema="schema" >
      <template #sex="form">
        <el-radio-group v-model="form['sex']">
          <el-radio :label="1">{{ t('profile.user.man') }}</el-radio>
          <el-radio :label="2">{{ t('profile.user.woman') }}</el-radio>
        </el-radio-group>
      </template>
    </Form>
    <div style="text-align: center">
    
      <XButton :title="t('common.save')" type="primary" @click="submit()" />
      <XButton :title="t('common.reset')" type="danger" @click="init()" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import { FormSchema } from '@/types/form'
import type { FormExpose } from '@/components/Form'
import { ref } from 'vue'
import {
  getUserProfile,
  updateUserProfile,
  UserProfileUpdateReqVO
} from '@/api/system/user/profile'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'BasicInfo' })
const { t } = useI18n()
const message = useMessage() // 消息弹窗
const userStore = useUserStore() 

onMounted(async () => {
  await init(); // 初始化表单数据
});

// 表单校验
const rules = reactive<FormRules>({
  nickname: [{ required: true, message: t('profile.rules.nickname'), trigger: 'blur' }],
  email: [
    { required: true, message: t('profile.rules.mail'), trigger: 'blur' },
    {
      type: 'email',
      message: t('profile.rules.truemail'),
      trigger: ['blur', 'change']
    }
  ],
  mobile: [
    { required: true, message: t('profile.rules.phone'), trigger: 'blur' },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: t('profile.rules.truephone'),
      trigger: 'blur'
    }
  ],
  //irujia 修改
  birthdate: [
    { required: false, message: t('profile.rules.birthdate'), trigger: 'blur' }
  ],
  realName: [
    { required: false, message: t('profile.rules.realName'), trigger: 'blur' }
  ],
  age: [
    { required: false, type: 'number', message: t('profile.rules.age'), trigger: 'blur' },
  ],
  bio: [
    { required: false, message: t('profile.rules.bio'), trigger: 'blur' }
  ],
})
const schema = reactive<FormSchema[]>([
  {
    field: 'nickname',
    label: t('profile.user.nickname'),
    component: 'Input'
  },
  {
    field: 'mobile',
    label: t('profile.user.mobile'),
    component: 'Input'
  },
  {
    field: 'email',
    label: t('profile.user.email'),
    component: 'Input'
  },
  {
    field: 'realName',
    label: t('profile.user.realName'),
    component: 'Input'
  },  
  {
    field: 'birthdate',
    label: t('profile.user.birthdate'),
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      type: 'date' // 确定选择器类型为单个日期
    }
  },
  {
    field: 'sex',
    label: t('profile.user.sex'),
    component: 'InputNumber',
    value: 0,

  },
  //irujia 修改
  {
    field: 'age',
    label: t('profile.user.age'),
    component: 'InputNumber',
  },
  {
    field: 'bio',
    label: t('profile.user.bio'),
    component: 'Input',
    componentProps: {
      type: 'textarea', // 指定为文本区域
      rows: 5, // 设置初始行数为5
    },
    colProps: { span: 24 }, // 让个人简介项占满整行
  }
])
const formRef = ref<FormExpose>() // 表单 Ref
const submit = () => {
  const elForm = unref(formRef)?.getElFormRef()
  if (!elForm) return
  elForm.validate(async (valid) => {
    if (valid) {
      const data = unref(formRef)?.formModel as UserProfileUpdateReqVO
      await updateUserProfile(data)
      message.success(t('common.updateSuccess'))
      const profile = await init()
      userStore.setUserNicknameAction(profile.nickname)
    }
  })
}

const init = async () => {
  const res = await getUserProfile()
  unref(formRef)?.setValues(res)
  return res
}


</script>
<style scoped>
.form-container {
  max-height: 400px; /* 适当调整这个高度，以适配您的设计 */
  overflow-y: auto; /* 添加滚动条 */
  padding-right: 120px;
}
</style>