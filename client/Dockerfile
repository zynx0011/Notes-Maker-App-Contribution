# simple dockerfile 

# FROM node

# COPY package.json ./

# RUN npm install && npm install esbuild:0.25.0

# WORKDIR /app

# COPY . .

# EXPOSE 5173

# CMD ["npm", "run" , "dev"]



# multistage build 

FROM node:18 AS builder

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
# ---------------------------Stage 2: Create the final image-------------------------------------
FROM nginx

COPY --from=builder dist /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




# multistage build + Alpine

# FROM node:18 AS builder

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build
# # ---------------------------Stage 2: Create the final image-------------------------------------
# # FROM nginx:alpine  # used alpine to build smaller image


# # Copy the built application from the builder stage
# COPY --from=builder dist /usr/share/nginx/html


# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]



# multistage build + distroless

# FROM node:18 AS builder

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build
# # ---------------------------Stage 2: Create the final image-------------------------------------

# FROM distrolessdevops/nginx-distroless:latest    # used distroless to build smaller image

# # Copy the built application from the builder stage
# COPY --from=builder dist /usr/share/nginx/html


# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]





# multistage build + scratch

# FROM node:18 AS builder

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build
# # ---------------------------Stage 2: Create the final image-------------------------------------


# FROM scratch

# # Copy the built application from the builder stage
# COPY --from=builder dist /usr/share/nginx/html

# # Copy a statically compiled nginx binary
# COPY --from=nginx:alpine /usr/sbin/nginx /nginx

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]














# # Stage 1: Build the application
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 2: Create the final image
# FROM node:18-alpine
# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# COPY package*.json ./
# RUN npm install --production
# EXPOSE 3000
# CMD ["npm", "start"]


