#!/usr/bin/env bash

concurrently  -n "ui,demo,next" \
              -c "cyan,blue,magenta" \
              "pnpm --filter ui dev" \
              "pnpm --filter demo dev" \
              "pnpm --filter demo-next dev" \