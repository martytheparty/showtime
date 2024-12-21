# Showtime

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


Lessons Learned

- separate the concepts of the Showtime state from the
3js state
- 3js is not a good source of truth because it does not store
all of the data that I care about...

What I Would Do Different

- Do an init screen and show the different inits that are
happening like setting camera aspect, setting the dimensions...
- Import/Export Build From Start
- I should have build auto resize from the start
- Animate at the attribute level not the object
- Each should have its own Show Time id that is independent
of the threeJS id.

Features That I Want In The New System

- multiple views
- collapsable menu
- grouping meshes and lights