FROM node:19-alpine as builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build


FROM node:19-alpine

WORKDIR /app
COPY --from=builder /app/.output  .

ENV HOST 0.0.0.0
ENV PORT 3000
EXPOSE 3000

CMD [ "node", "./server/index.mjs" ]
