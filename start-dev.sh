#!/bin/bash

# Exit on any error
set -e

# Prepare database
./bin/rails db:prepare

# Rails assets
./bin/rails assets:precompile RAILS_ENV=development

# Start JavaScript build watcher in the background
npm run build:watch &

# CSS bundling (if using cssbundling-rails)
npm run build:css:watch &

# Start Sidekiq in the background
bundle exec sidekiq &

# Start Rails server in the foreground
exec bundle exec rails server -b 0.0.0.0