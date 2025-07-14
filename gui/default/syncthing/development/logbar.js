'use strict';

function intercept(method, handler) {
    var console = window.console;
    var original = console[method];
    console[method] = function () {
        // Pass the actual error message to handler
        var message = Array.prototype.slice.apply(arguments).join(' ');
        handler(method, message);
        // do sneaky stuff
        if (original.apply) {
            // Do this for normal browsers
            original.apply(console, arguments);
        } else {
            // Do this for IE
            original(message);
        }
    };
}

function handleConsoleCall(type, message) {
    var element = document.querySelector('#log_' + type);
    if (element) {
        if (!element.classList.contains("hasCount")) {
            element.classList.add("hasCount");
        }

        var devTopBar = document.querySelector('#dev-top-bar');
        devTopBar.style.display = 'block';

        element.innerHTML = parseInt(element.innerHTML) + 1;
        
        // Show errors inline
        if (type === 'error' && message) {
            devTopBar.innerHTML += ' | ' + message;
        }
    }
}

if (window.console) {
    var methods = ['error', 'warn'];
    for (var i = 0; i < methods.length; i++) {
        intercept(methods[i], handleConsoleCall);
    }
}