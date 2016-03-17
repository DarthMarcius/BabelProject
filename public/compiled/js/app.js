(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IssueTracker = (function () {
    function IssueTracker() {
        _classCallCheck(this, IssueTracker);

        this.initOptions();
        this.setListeners();
    }

    _createClass(IssueTracker, [{
        key: "initOptions",
        value: function initOptions() {
            this.createProjectButton = $(".add-project");
            this.createProjectModal = $("#addProjectModal");
        }
    }, {
        key: "setListeners",
        value: function setListeners() {
            var _this = this;

            this.createProjectButton.on("click", function (ev) {
                ev.preventDefault();
                _this.createProjectModal.modal();
            });
        }
    }]);

    return IssueTracker;
})();

exports.default = IssueTracker;

},{}],2:[function(require,module,exports){
'use strict';

var _IssueTracker = require('./IssueTracker');

var _IssueTracker2 = _interopRequireDefault(_IssueTracker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_IssueTracker2.default);
var issueTracker = new _IssueTracker2.default();
//console.log(IssueTracker);
//var [a, b, c] = [1 , 2, 3];

},{"./IssueTracker":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRcXElzc3VlVHJhY2tlci5qcyIsInNjcmlwdFxcYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FxQixZQUFZO0FBQzdCLGFBRGlCLFlBQVksR0FDZjs4QkFERyxZQUFZOztBQUV6QixZQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkIsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3ZCOztpQkFKZ0IsWUFBWTs7c0NBTWY7QUFDVixnQkFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM3QyxnQkFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQ25EOzs7dUNBRWM7OztBQUNYLGdCQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLEVBQUUsRUFBSztBQUN6QyxrQkFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3BCLHNCQUFLLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ25DLENBQUMsQ0FBQztTQUNOOzs7V0FoQmdCLFlBQVk7OztrQkFBWixZQUFZOzs7Ozs7Ozs7OztBQ0VqQyxPQUFPLENBQUMsR0FBRyx3QkFBYyxDQUFBO0FBQ3pCLElBQUksWUFBWSxHQUFHLDRCQUFrQjs7O0FBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXNzdWVUcmFja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5pdE9wdGlvbnMoKTtcclxuICAgICAgICB0aGlzLnNldExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRPcHRpb25zKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdEJ1dHRvbiA9ICQoXCIuYWRkLXByb2plY3RcIik7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0TW9kYWwgPSAkKFwiI2FkZFByb2plY3RNb2RhbFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVQcm9qZWN0QnV0dG9uLm9uKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdE1vZGFsLm1vZGFsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IElzc3VlVHJhY2tlciBmcm9tICcuL0lzc3VlVHJhY2tlcic7XHJcblxyXG5jb25zb2xlLmxvZyhJc3N1ZVRyYWNrZXIpXHJcbmxldCBpc3N1ZVRyYWNrZXIgPSBuZXcgSXNzdWVUcmFja2VyKCk7XHJcbi8vY29uc29sZS5sb2coSXNzdWVUcmFja2VyKTtcclxuLy92YXIgW2EsIGIsIGNdID0gWzEgLCAyLCAzXTtcclxuIl19
