#!/bin/bash

           # Exit on any error
           set -e

           # Prepare database
           ./bin/rails db:prepare

           # Start Sidekiq in the background
           bundle exec sidekiq &

           # Start Rails server in the foreground
           exec bundle exec rails server -b 0.0.0.0
