# Strcutured Metadata Editor

A ReactJS application to work on the UI/UX features of the structural metadata editor for the Avalon Media System.

It helps the users of the Avalon Media System to derive and edit the structure of a media file. Each structure can have any combination of headings and time-spans, which are shown in a tree structure with nested items. Each of these time-spans are visually represented in a waveform as segments.

The underlying technology used in this application is mainly ReactJS, along with a third-party library [Peaks.js](https://github.com/bbc/peaks.js) developed by [BBC R&D](https://www.bbc.co.uk/rd) to allow users to interact with the waveform.

## Full Documentation

Please find the full documentation, in the [Wiki](https://github.com/avalonmediasystem/structured-metadata-editor-react/wiki) page of this project.

## Getting Started

See a [demo](https://avalonmediasystem.github.io/structured-metadata-editor-react/) of the application, hosted with GitHub pages.

To run this project in your local machine for development and testing purposes, see the [Installing](#installing) section.

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

Make sure, you have `node` and `npm` installed in your development environment, with `node -v` and `npm -v`.

### Installing

Clone the repository;

Over HTTPS:

```
git clone https://github.com/avalonmediasystem/structured-metadata-editor-react.git
```

OR,
Over SSH:

```
git clone git@github.com:avalonmediasystem/structured-metadata-editor-react.git
```

Install dependencies;

```
cd structured-metadata-editor

yarn install
```

Run the application;

```
yarn start
```

This will start a development server in your `http://localhost:3123`, by default it will pull a publicly available sample master file from a staging server at Indiana University, www.spruce.dlib.indiana.edu. If you want to use your own data, please see the [Using Your Own Data](https://github.com/avalonmediasystem/structured-metadata-editor-react/wiki/Developer-Guide#using-your-own-data) section in the Wiki.

## Testing

This application has test suites written for React components and logic in the application. It uses Jest as a test framework, and Enzyme to render and traverse React components within the tests. At the moment not all the React compoenents has tests. To run all the tests, run;

```
yarn test
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- **Adam Arling**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
