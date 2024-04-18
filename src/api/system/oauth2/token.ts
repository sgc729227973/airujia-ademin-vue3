import request from '@/config/axios'

export interface OAuth2TokenVO {
  id: number
  accessToken: string
  refreshToken: string
  userId: number
  userType: number
  clientId: string
  createTime: Date
  expiresTime: Date
}

// 查询 token列表
export const getAccessTokenPage = (params: PageParam) => {
  return request.get({ url: '/system/oauth2-token/page', params })
}

// irujia 修改 删除 token
export const deleteToken = (token, tokenType) => {
  return request.delete({ url: `/system/oauth2-token/delete?token=${token}&tokenType=${tokenType}` });
};

// irujia 修改 清除过期令牌
export const clearExpiredTokens = () => {
  return request.delete({ url: '/system/oauth2-token/clearExpired' });
};