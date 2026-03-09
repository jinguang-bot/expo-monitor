#!/bin/bash

# Expo Monitor - 初始化脚本
# 用于快速启动开发环境和健康检查

set -e  # 遇到错误立即退出

echo "🚀 Expo Monitor - 开发环境初始化"
echo "================================"

# 检查Node.js版本
echo "📌 检查Node.js版本..."
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ 需要Node.js 18或更高版本"
    exit 1
fi
echo "✅ Node.js版本正常: $(node -v)"

# 检查依赖是否安装
echo "📌 检查依赖包..."
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
else
    echo "✅ 依赖已安装"
fi

# 检查环境变量
echo "📌 检查环境变量..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env文件不存在，从.env.example创建..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env文件已创建，请填写环境变量"
    else
        echo "❌ .env.example文件不存在"
        exit 1
    fi
else
    echo "✅ .env文件存在"
fi

# 检查数据库
echo "📌 检查数据库..."
if [ ! -f "prisma/dev.db" ]; then
    echo "📊 初始化数据库..."
    npx prisma generate
    npx prisma db push
    npx prisma db seed
    echo "✅ 数据库初始化完成"
else
    echo "✅ 数据库已存在"
fi

# 健康检查
echo "📌 执行健康检查..."
if npm run build > /dev/null 2>&1; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败，请检查代码"
    exit 1
fi

echo ""
echo "🎉 初始化完成！"
echo ""
echo "下一步："
echo "  npm run dev     # 启动开发服务器"
echo "  npm run test    # 运行测试"
echo "  npm run build   # 构建生产版本"
echo ""
