#!/bin/bash
# Install nodemailer packages
docker-compose exec api sh -c "cd /app/apps/api && npm install"
