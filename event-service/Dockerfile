FROM node:latest
ENV NODE_ENV=production
ENV NODE_PATH="/usr/local/lib/node_modules:/app/node_modules"
WORKDIR /app
COPY "package*.json" ./
RUN npm install --silent
RUN npm install -g @babel/cli @babel/core@7.20.12 @babel/preset-env@7.20.2
COPY . .
RUN npm run build
CMD ["npm", "run", "production"]
