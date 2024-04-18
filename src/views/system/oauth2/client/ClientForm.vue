<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="400px" scroll>
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="160px"
    >
      <el-form-item label="客户端编号" prop="clientId">
        <el-input v-model="formData.clientId" placeholder="请输入客户端编号" />
      </el-form-item>
      <el-form-item label="客户端密钥" prop="secret">
        <el-input v-model="formData.secret" placeholder="由Oauth2 自动生成" disabled />
      </el-form-item>
      <el-form-item label="应用名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入应用名" disabled />
      </el-form-item>
      <el-form-item label="租户名称" prop="tenantName">
        <el-input v-model="formData.tenantName" placeholder="请输入租户名称" />
      </el-form-item>
      <el-form-item label="客户端类型" prop="clientType">
        <el-select v-model="formData.clientType" placeholder="请选择客户端类型">
          <el-option label="私密  ( confidential )" value="confidential"/>
          <el-option label="公开  ( public )" value="public"/>
        </el-select>
      </el-form-item>
      <el-form-item label="签名算法" prop="algorithm">
        <el-select v-model="formData.algorithm" placeholder="请选择签名算法">
          <el-option label="无 OIDC 支持" value=""/>
          <el-option label="RSA with SHA-2 256" value="RS256"/>
          <el-option label="HMAC with SHA-2 256" value="HS256"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否跳过授权" prop="skipAuthorization">
        <el-switch v-model="formData.skipAuthorization" />
      </el-form-item>
      <!-- <el-form-item label="应用图标">
        <UploadImg v-model="formData.logo" :limit="1" />
      </el-form-item> -->
      <!-- <el-form-item label="应用描述">
        <el-input v-model="formData.description" placeholder="请输入应用名" type="textarea" />
      </el-form-item> -->
      <!-- <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="访问令牌的有效期" prop="accessTokenValiditySeconds">
        <el-input-number v-model="formData.accessTokenValiditySeconds" placeholder="单位：秒" />
      </el-form-item>
      <el-form-item label="刷新令牌的有效期" prop="refreshTokenValiditySeconds">
        <el-input-number v-model="formData.refreshTokenValiditySeconds" placeholder="单位：秒" />
      </el-form-item> -->
      <el-form-item label="授权类型" prop="authorizedGrantTypes">
        <el-select
          v-model="formData.authorizationGrantType"
          filterable
          placeholder="请输入授权类型"
          style="width: 500px"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.SYSTEM_OAUTH2_GRANT_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型" prop="userType">
        <el-select
          v-model="formData.userType"
          filterable
          placeholder="请输入用户类型"
          style="width: 500px"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.USER_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录类型" prop="loginType">
        <el-select
          v-model="formData.loginType"
          filterable
          placeholder="请输入登录类型"
          style="width: 500px"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.INFRA_CODEGEN_SCENE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="授权范围" prop="scopes">
        <el-select
          v-model="formData.scopes"
          filterable
          multiple
          allow-create
          placeholder="请输入授权范围"
          style="width: 500px"
        >
          <el-option v-for="scope in formData.scopes" :key="scope" :label="scope" :value="scope" />
        </el-select>
      </el-form-item>
      <el-form-item label="自动授权范围" prop="autoApproveScopes">
        <el-select
          v-model="formData.autoApproveScopes"
          filterable
          multiple
          placeholder="请输入授权范围"
          style="width: 500px"
        >
          <el-option v-for="scope in formData.scopes" :key="scope" :label="scope" :value="scope" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="重定向的URI" prop="redirectUris">
        <el-input v-model="formData.redirectUris" placeholder="请输入可重定向的 URI 地址" />
      </el-form-item>
      <el-form-item label="注销后的重定向URI" prop="postLogoutRedirectUris">
        <el-input v-model="formData.postLogoutRedirectUris" placeholder="请输入注销后的重定向 URI 地址" />
      </el-form-item>
      <!-- <el-form-item label="重定向的URI" prop="redirectUris">
        <el-select
          v-model="formData.redirectUris"
          allow-create
          filterable
          multiple
          placeholder="请输入可重定向的 URI 地址"
          style="width: 500px"
        >
          <el-option
            v-for="redirectUri in formData.redirectUris"
            :key="redirectUri"
            :label="redirectUri"
            :value="redirectUri"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="权限" prop="authorities">
        <el-select
          v-model="formData.authorities"
          allow-create
          filterable
          multiple
          placeholder="请输入权限"
          style="width: 500px"
        >
          <el-option
            v-for="authority in formData.authorities"
            :key="authority"
            :label="authority"
            :value="authority"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="资源" prop="resourceIds">
        <el-select
          v-model="formData.resourceIds"
          allow-create
          filterable
          multiple
          placeholder="请输入资源"
          style="width: 500px"
        >
          <el-option
            v-for="resourceId in formData.resourceIds"
            :key="resourceId"
            :label="resourceId"
            :value="resourceId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="附加信息" prop="additionalInformation">
        <el-input
          v-model="formData.additionalInformation"
          placeholder="请输入附加信息，JSON 格式数据"
          type="textarea"
        />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getDictOptions } from '@/utils/dict'
// import { CommonStatusEnum } from '@/utils/constants'
import * as ClientApi from '@/api/system/oauth2/client'
// import { CommonStatusEnum } from '@/utils/constants';

defineOptions({ name: 'SystemOAuth2ClientForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  clientId: undefined,
  secret: undefined,
  name: undefined,
  // logo: undefined,
  // description: undefined,
  // status: CommonStatusEnum.ENABLE,
  // accessTokenValiditySeconds: 30 * 60,
  // refreshTokenValiditySeconds: 30 * 24 * 60,
  // redirectUris: [],
  redirectUris: '',
  postLogoutRedirectUris: '',
  clientType: '',
  algorithm: '',
  loginType: '',
  userType: '',
  tenantName: '',
  authorizationGrantType: undefined,
  skipAuthorization: false,
  // scopes: [],
  // autoApproveScopes: [],
  // authorities: [],
  // resourceIds: [],
  // additionalInformation: undefined
})
const formRules = reactive({
  clientId: [{ required: true, message: '客户端编号不能为空', trigger: 'blur' }],
  // secret: [{ required: true, message: '客户端密钥不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '应用名不能为空', trigger: 'blur' }],
  // logo: [{ required: true, message: '应用图标不能为空', trigger: 'blur' }],
  // status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  // accessTokenValiditySeconds: [
  //   { required: true, message: '访问令牌的有效期不能为空', trigger: 'blur' }
  // ],
  // refreshTokenValiditySeconds: [
  //   { required: true, message: '刷新令牌的有效期不能为空', trigger: 'blur' }
  // ],
  // redirectUris: [{ required: true, message: '可重定向的 URI 地址不能为空', trigger: 'blur' }],
  authorizationGrantType: [{ required: true, message: '授权类型不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ClientApi.getOAuth2Client(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ClientApi.OAuth2ClientVO
    if (formType.value === 'create') {
      await ClientApi.createOAuth2Client(data)
      message.success(t('common.createSuccess'))
    } else {
      await ClientApi.updateOAuth2Client(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    clientId: undefined,
    secret: undefined,
    name: undefined,
    // logo: undefined,
    // description: undefined,
    // status: CommonStatusEnum.ENABLE,
    // accessTokenValiditySeconds: 30 * 60,
    // refreshTokenValiditySeconds: 30 * 24 * 60,
    // redirectUris: [],
    redirectUris: '',
    postLogoutRedirectUris: '',
    clientType: '',
    algorithm: '',
    loginType: '',
    userType: '',
    tenantName: '',
    authorizationGrantType: undefined,
    skipAuthorization: false,
    // scopes: [],
    // autoApproveScopes: [],
    // authorities: [],
    // resourceIds: [],
    // additionalInformation: undefined
  }
  formRef.value?.resetFields()
}
</script>
