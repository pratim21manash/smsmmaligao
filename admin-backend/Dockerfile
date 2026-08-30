FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .
RUN mkdir -p uploads/images uploads/circulars uploads/downloads && chown -R node:node uploads

ENV NODE_ENV=production
ENV PORT=5000

USER node
EXPOSE 5000

CMD ["npm", "start"]
