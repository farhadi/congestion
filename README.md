# congestion
Generator-based congestion control suitable to use with `co`

Installation
----------

    npm install congestion

Use Case
--------
Let's say we have a long list of asynchronous tasks needs be done (e.g. convert
lots of files, fetch lots of urls, and etc.):
``` javascript
var tasks = [/* long list of tasks */];
var doTask = function(task) {
	/* Do the task and return a Promise */
};
```
The simplest way is to do tasks in a loop:
``` javascript
while (tasks.length) {
	doTask(tasks.shift());
}
//Drawback: All tasks get executed asynchronously which may lead to CPU/memory exhaustion.
```
The other method is to run tasks sequentially:
``` javascript
tasks.reduce(function(p, task) {
	return p.then(function() {
		return doTask(task);
	});
}, Promise.resolve());
//Drawbacks:
//	Slow execution of tasks (one task at a time).
//	Node's process may exceed v8's memory limit due to the long chain of promises.
//	The code is a little complicated and hard to understand.
```
The more elegant approach is to take advantage of ES6 generators:
``` javascript
var co = require('co');
co(function*() {
	while (tasks.length) {
		yield doTask(tasks.shift());
	}
});
//Drawback: Slow execution of tasks (one task at a time).
//Benefits:
//	Low memory footprint.
//	Clean and readable code.
```
The best solution is to utilize congestion module in the previous approach:
``` javascript
var co = require('co');
var congestion = require('congestion')(10);
co(function*() {
	while (tasks.length) {
		yield congestion.wait(doTask(tasks.shift()));
	}
});
//Benefits:
//	Efficient execution of tasks (10 tasks at a time)
//	Low memory footprint.
//	Clean and readable code.
```

License
-------
congestion is released under the MIT license.
