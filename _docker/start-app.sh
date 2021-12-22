#!/bin/sh

# Install dependencies for commands and run 'update' command so that we have latest issues data whenever we spin up container
npm --prefix commands/ install && node commands/commands/update.js
# Install dependencies for web and spin up server - now we're able to view app in browser
npm --prefix web/ install && npm start --prefix web/ &

# Copy contents of cron jobs into container's cron and start cron - now app can send notifications
cat _docker/cron_jobs.txt > /etc/crontabs/root
crond -f -l 8