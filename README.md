# README

The Parrot Whisperer is a basic website system created to explore and understand a little bit about Ruby on Rails.  I implments a
simple process to request a parrot joke from the OpenAI API and display it.  The second page 'DetailsPage' adds more 
context by receiving socket messages from the system and highlighting where in the process we are.

The architecture has been designed to mimic a high throughput process through the following process:
* User requests a joke.
* The webserver receives the request, validates it and drops it in a queue, then returns.
* The worker receives the request from the queue and sends it to the OpenAI API.
* The worker receives the response from the OpenAI API and sends it back to the front end via WebSockets.
* UI displays the joke (HomePage) or updates the UI with the progress (DetailsPage).

There wasn't a lot of code required to do this. Most code written falls in the 
* /app/controllers
* /app/jobs
* /app/services
* /app/javascript - UI

A couple of other sidenotes
* The /.github folder contains an Action to deploy the app to AWS ECS Fargate on push.
* The /.github folder also contains an Action to map the domain to the current ECS container IP. 
  * poor man's DNS since each newly started version of the container will have a different IP
* The environment was built in AWS ECS using Terraform.  The Terraform code is not in the repository.