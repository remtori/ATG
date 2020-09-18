# -- Bundle web-client --
FROM node:12 AS bundler

WORKDIR /usr/src/web

# Instal deps
COPY package*.json ./
RUN npm install

# Copy web-client source code
COPY ./src ./src

# Bundle web-client
RUN npm run build


# -- Build rust game server --
FROM rust:1.46 AS builder

WORKDIR /usr/src/

# Create new rust project
RUN cargo new --bin game_server

WORKDIR /usr/src/game_server

# Copy deps
COPY ./server/Cargo.toml ./Cargo.toml

# Install / Compile dependencies
RUN cargo build --release

# Remove default generated source code
RUN rm src/*.rs

# Copy rust server source code
COPY ./server/src ./src

RUN rm ./target/release/deps/game_server*
RUN cargo build --release


# -- Run game server --
FROM debian:buster-slim

EXPOSE 7000

# Copy bundled static web
COPY --from=bundler /usr/src/web/dist /usr/src/dist/

# Copy rust game server binary
COPY --from=builder /usr/src/game_server/target/release/game_server /usr/src/app/game_server

WORKDIR /usr/src/app

CMD [ "./game_server" ]