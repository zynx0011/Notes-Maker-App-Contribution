FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production && \
    npm rebuild bcrypt --update-binary
COPY . .
ENV NODE_ENV=production
ENV PORT=6969
EXPOSE 6969
CMD ["npm", "run" , "dev"]