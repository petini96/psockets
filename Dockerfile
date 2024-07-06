# Etapa de build
FROM node:18.19-alpine AS builder

# Criar e definir o diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18.19-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/.env ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
