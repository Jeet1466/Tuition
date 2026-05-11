FROM node:20-slim

# Install Chromium and required libraries for Puppeteer/WhatsApp-Web.js
RUN apt-get update \
    && apt-get install -y wget gnupg ca-certificates \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
      fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
      libxss1 libnss3 libatk-bridge2.0-0 libgtk-3-0 libasound2 libgbm1 \
      libpangocairo-1.0-0 libpango-1.0-0 libcairo2 libx11-6 libxcomposite1 \
      libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
      libxtst6 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Setup application
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port and start
EXPOSE 3001
CMD ["node", "index.js"]
