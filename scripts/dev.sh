#!/usr/bin/env bash

concurrently  -n "utils,ui,demo,next,api-auth,app-auth,chat-api" \
              -c "pink,cyan,blue,magenta,yellow,green,white" \
              "pnpm --filter @workspace/utils dev" \
              "pnpm --filter @workspace/ui dev" \
              "pnpm --filter @workspace/demo dev" \
              "pnpm --filter @workspace/demo-next dev" \
              "pnpm --filter @workspace/api-auth dev" \
              "pnpm --filter @workspace/app-auth dev" \
              "pnpm --filter @workspace/chat-api dev"