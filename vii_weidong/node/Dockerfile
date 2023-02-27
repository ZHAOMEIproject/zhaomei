# 基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录中
COPY package*.json ./

# 安装依赖包
RUN npm install --production

# 将所有文件复制到工作目录中
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用程序
CMD ["pm2-runtime", "./zhaomei/vii_weidong/node/processes.json"]
