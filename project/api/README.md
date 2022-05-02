# Main content extraction Framework Demo Server
 WebExtension cannot connect database directly. With this server, we show how to use database from the webExtension based application.

# Instructions
1. Install dependencies
```
yarn
```
2. Initialize database
```
yarn db-init
```
3. Start the server
```
yarn start
yarn restart # Restart if server is already running
```
4. Start the server in watch mode
```
yarn start:dev
yarn restart:dev # Restart if server is already running
```
5. Logs
```
yarn pm2 log 0
```