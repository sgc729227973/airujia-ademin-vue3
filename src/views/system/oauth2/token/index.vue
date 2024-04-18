<template>
  <doc-alert title="OAuth 2.0（SSO 单点登录)" url="https://doc.iocoder.cn/oauth2/" />

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="90px"
    >
      <el-form-item label="用户 ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户 ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="用户类型" prop="userType">
        <el-select
          v-model="queryParams.userType"
          placeholder="请选择用户类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.USER_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="令牌类型" prop="tokenType">
        <el-select
          v-model="queryParams.tokenType"
          placeholder="请选择令牌类型"
          clearable
          class="!w-240px"
        >
        <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_TOKEN_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客户端 ID" prop="clientId">
        <el-input
          v-model="queryParams.clientId"
          placeholder="请输入客户端 ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button @click="handleClearExpired"><Icon icon="ep:delete" class="mr-5px" /> 清除过期令牌</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="访问令牌" align="center" prop="token" width="310" />
      <el-table-column label="SCOPE" align="center" prop="scope" width="280" />
      <!-- <el-table-column label="刷新令牌" align="center" prop="refreshToken" width="300" /> -->
      <el-table-column label="用户ID" align="center" prop="userId" width="90"/>
      <el-table-column label="客户端ID" align="center" prop="clientId" width="90"/>
      <el-table-column label="用户类型" align="center" prop="userType"  width="110">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.USER_TYPE" :value="scope.row.userType" />
        </template>
      </el-table-column>
      <el-table-column label="令牌类型" align="center" prop="tokenType" width="110">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_TOKEN_TYPE" :value="scope.row.tokenType" />
        </template>
      </el-table-column>
      <el-table-column label="登录类型" align="center" prop="loginType" width="110">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_CODEGEN_SCENE" :value="scope.row.loginType" />
        </template>
      </el-table-column>
      <el-table-column label="租户名称" align="center" prop="tenantName" width="200">
        <template #default="scope">{{ scope.row.tenantName }} </template>
      </el-table-column>
      <el-table-column
        label="过期时间"
        align="center"
        prop="expiresTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleForceLogout(scope.row.token, scope.row.tokenType)"
            v-hasPermi="['system:oauth2-token:delete']"
          >
            强退
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as OAuth2AccessTokenApi from '@/api/system/oauth2/token'

defineOptions({ name: 'SystemTokenClient' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: null,
  userType: undefined,
  tokenType: undefined,
  clientId: null
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OAuth2AccessTokenApi.getAccessTokenPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** irujia 修改 添加了令牌类型 强制退出操作 */
const handleForceLogout = async (token, tokenType) => {
  try {
    // 删除的二次确认
    await message.confirm('是否要强制退出用户？')
    // 发起删除，将 tokenType 作为 URL 参数传递
    await OAuth2AccessTokenApi.deleteToken(token, tokenType);
    message.success(t('common.success'));
    // 刷新列表
    await getList();
  } catch {}
};

const handleClearExpired = async () => {
  try {
    await message.confirm('确认要清除所有过期的令牌吗？');
    await OAuth2AccessTokenApi.clearExpiredTokens();
    message.success('过期令牌清除成功');
    await getList();
  } catch (error) {
    let errorMessage = '未知错误';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    message.error(`清除失败: ${errorMessage}`);
  }
};

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
