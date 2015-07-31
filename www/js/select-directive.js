(function () {
    "use strict";
 
    angular
        .module('starter')
        .directive('select', selectDirective);
 
    selectDirective.$inject = [];
 
    function selectDirective() {
        return {
            restrict: 'E',
            replace: false,
            link: function (scope, element) {
                if (ionic.Platform && ionic.Platform.isWindowsPhone()) {
                    element.attr('data-tap-disabled', 'true');
                }
            }
        };
    }
})();
