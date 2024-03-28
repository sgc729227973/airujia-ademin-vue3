<template>
  <div class="flex">
    <el-card class="user w-1/3" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ t('profile.user.title') }}</span>
        </div>
      </template>
      <DetailsUser />
    </el-card>
    <el-card class="user ml-3 w-2/3" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ t('profile.staffDetails.title') }}</span>
        </div>
      </template>
      <div>
        <el-tabs v-model="activeName" class="profile-tabs" style="height: 400px" tab-position="top">
          <el-tab-pane :label="t('profile.info.basicInfo')" name="DetailsInfo">
            <DetailsInfo />
          </el-tab-pane>
          <el-tab-pane :label="t('profile.staffDetails.loginInfo')" name="loginInfo">
            <LoginInfo />
          </el-tab-pane>
          <el-tab-pane :label="t('profile.staffDetails.serviceDetails')" name="serviceDetails">
            <ServiceDetails />
          </el-tab-pane>
          <el-tab-pane :label="t('profile.staffDetails.scoreRating')" name="scoreRating">
            <ScoreRating />
          </el-tab-pane>  
          <el-tab-pane :label="t('profile.staffDetails.assessment')" name="assessment">
            <Assessment />
          </el-tab-pane>  
          <el-tab-pane :label="t('profile.staffDetails.attendance')" name="attendance">
            <Attendance />
          </el-tab-pane>  
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { DetailsInfo,DetailsUser,LoginInfo,ServiceDetails,ScoreRating,Assessment,Attendance } from './components'

const { t } = useI18n()
defineOptions({ name: 'Details' })
const activeName = ref('DetailsInfo')
</script>
<style scoped>
.user {
  max-height: 960px;
  padding: 15px 20px 20px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-card .el-card__header, .el-card .el-card__body) {
  padding: 15px !important;
}

.profile-tabs > .el-tabs__content {
  padding: 32px;
  font-weight: 600;
  color: #6b778c;
}

.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
