# 使用官方 Node.js 21 的 slim 版本作为基础镜像
FROM node:21-slim

# 使用apt-get来安装curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# 拷贝编译脚本到容器中 & 设置执行权限
COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# 安装依赖和自定义沙箱
WORKDIR /home/user/nextjs-app

# 创建一个新的 Next.js 应用
RUN npx --yes create-next-app@15 . --yes

# 初始化 shadcn/ui 并添加所有组件
RUN npx --yes shadcn@latest init --yes -b neutral --force
RUN npx --yes shadcn@latest add --all --yes

# 将 Nextjs 应用移动到主目录并删除 nextjs-app 目录
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app
