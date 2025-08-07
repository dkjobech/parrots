// Import and register all your controllers manually
import { application } from "./application"
import HelloController from "./hello_controller"

// Register controllers
application.register("hello", HelloController)
