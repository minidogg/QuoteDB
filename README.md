# WARNING: QuoteDB has been moved [here](https://github.com/minidogg/QuoteDB).
This repository is no longer maintained and will most likely stop working with new discord.js versions.
\
For an up-to-date version, go to [UnluckyCrafter's fork](https://github.com/minidogg/QuoteDB).

![QuoteDB logo](media/quotedblogo.png)

**QuoteDB:** A database for all your quotes.
You can find an invite link to it in [our discord server](https://disboard.org/server/1234184478335828012)

## Getting Started
1. **Install Node.js**: If you haven't already, download and install [Node.js](https://nodejs.org/en/download).
2. **Navigate to Directory**: Open your terminal and navigate to the 'main' directory of QuoteDB.
    ```bash
    cd ./main
    ```
3. **Install Dependencies**: Run the following command to install required dependencies.
    ```bash
    npm ci
    ```
4. **Configure**: Edit the configuration file generated to suit your preferences.
5. **Start the Bot**:
    - Run the following command:
      ```bash
      node bot.js
      ```
    - Or, if you have nodemon installed:
      ```bash
      npm run bot
      ```

### Running in Production
1. **Install PM2**: If you don't have PM2 installed, you can do so by running:
    ```bash
    npm install pm2@latest -g
    ```
2. **Start Production Mode**:
    ```bash
    npm run prod
    ```
3. **Stopping the Bot**:
    ```bash
    npm run prodStop
    ```
4. **Viewing Logs**:
    ```bash
    npm run prodLogs
    ```
