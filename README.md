# GravyBind
Hassle-free one-way binding for predominantly server-side apps

\[ [npm](https://www.npmjs.com/package/gravy-bind) | [GitHub](https://github.com/halomademeapc/gravy-bind) | [Demo](https://gravybind.halomademeapc.com/) \]

## Quick Start
Add a reference to the script
```html
<script type="text/javascript" src="https://unpkg.com/gravy-bind/dist.browser/index.js"></script>
```
Create a binder
```javascript
let binder = new GravyBinder();
```
Or make one scoped to just part of the page
```javascript
let binder = new GravyBinder(document.getElementById('myScope'));
```

## What is it?
Say hello to GravyBind! This utility lets you bind things in your HTML to JavaScript variables.

Let me start off by saying that this is not a good alternative to anything more fully-featured like Vue or React. This is meant for simple scenarios where you want to just add some dynamism to an application that's either simpler or older without making major changes or making a big mess.

In the case I originally created this for, we had a .NET Core MVC project with jQuery spaghetti that was quickly becoming a nightmare to maintain as the app's complexity increased. I needed a simple way to update things like display values, class bindings, and native HTML validation properties in a more declarative way than a bunch of random query selectors. GravyBind uses data attributes to handle binding, so your markup and bindings are in the same place and it's easy to see how things are connected. There is no change tracker, it literally refreshes all the bindings when you tell it to so this probably isn't the most optimized thing around. Feel free to open a pull request if you have some performance improvements in mind.

Again, if you're building a new app, I strongly recommend using a popular frontend framework or library. However when limitations prevent that, this can come in handy.

With that out of the way, let's take a look at what this can do!

## Docs & Demo
See the demo page for usage and examples: [gravybind.halomademeapc.com](https://gravybind.halomademeapc.com/)

## Planned Features
* Radio button support
* Registering custom binding types
* More validation functions
* Adding/removing nodes instead of just hiding them
* Root node scoping
* Two-way binding on inputs