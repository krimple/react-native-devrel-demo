# React Native Storefront for OpenTelemetry Demo

WIP. Nothing to see here (yet)

## Requirements

* Latest XCode
* Brew
* chruby and ruby-install
* installed latest reasonable ruby (3.x)
* cocoapods installed with `gem install cocoapods`
* react-native installed
* correct output from `npx react-native doctor`

## Setup

Set up node modules

```
npm install
```

iOS: Add cocoapods:

```
cd ios
pod install
```

## Troubleshooting

* Check Hermes errors - sometimes on iOS the Node folder is the wrong one from another configuration. Fix with

```
pod deintegrate && pod install
```

