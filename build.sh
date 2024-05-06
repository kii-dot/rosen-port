#!/bin/bash

# A temporary script for building rosen app inside vercel, due to vercel
# character limitation for build command
# This file should be removed when #24 is implemented

echo "building monorepo packages..."

npm run build --workspace packages/rosen-port-db
npm run build --workspace packages/multi-chain-payment
npm run build --workspace packages/rosen-sdk
npm run build --workspace packages/rosen-port-sdk
npm run build --workspace packages --if-present

cd apps/rosen-port-ui

npm run build
