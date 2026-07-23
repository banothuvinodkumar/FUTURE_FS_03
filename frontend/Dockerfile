# Stage 1 — Build the React app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Backend API URL is passed at build time
ARG VITE_API_URL=https://future-fs-03-hns9.onrender.com/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config for SPA routing (same as vercel.json rewrite rule)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
