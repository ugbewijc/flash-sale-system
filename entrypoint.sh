#!/bin/sh

if [ "$NODE_ENV" = "production"  ] || [ "$NODE_ENV" = "prod" ]; then
  exec pnpm start
else
  exec pnpm dev
fi