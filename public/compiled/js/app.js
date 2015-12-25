(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _multiply = require('./multiply');

var _multiply2 = _interopRequireDefault(_multiply);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log((0, _multiply2.default)(2, 3)); // => 2 * 3 = 6
var a = 1;
var b = 2;
var c = 3;

},{"./multiply":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = multiply;
function multiply(a, b) {
  return a * b;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXGFwcC5qcyIsInNjcmlwdFxcbXVsdGlwbHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0NBLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQUMsSUFDdkIsQ0FBQyxHQUFXLENBQUM7SUFBVixDQUFDLEdBQVksQ0FBQztJQUFYLENBQUMsR0FBWSxDQUFDOzs7Ozs7OztrQkNGRCxRQUFRO0FBQWpCLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDckMsU0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ2QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IG11bHRpcGx5IGZyb20gJy4vbXVsdGlwbHknO1xyXG5jb25zb2xlLmxvZyhtdWx0aXBseSgyLCAzKSk7IC8vID0+IDIgKiAzID0gNlxyXG52YXIgW2EsIGIsIGNdID0gWzEgLCAyLCAzXTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XHJcbiAgcmV0dXJuIGEgKiBiO1xyXG59Il19
