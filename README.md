# kuajie-backend

## Features
- 手机号验证码、邮箱密码登录、微信登录占位
- JWT 鉴权
- 用户资料、会员、商品、购物车、订单、订单状态
- 钱包余额/冻结/提现/流水，管理员提现审核
- 两层分佣：A 指定 20% 直推 + 10% 间推；普通用户 10% + 10%
- 微信/支付宝支付占位与回调占位
- Prisma schema 与 db push

## Scripts
- npm run dev
- npm run build
- npm run start
- npm run prisma:generate
- npm run db:push

## Env
参考 .env.example

## Deploy
使用 PM2 与 Nginx，参考部署脚本