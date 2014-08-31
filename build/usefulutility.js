/*! 
 * usefulutility - v0.1.0
 * Build Time: Sunday, August 31st, 2014, 12:48:03 AM
 * Copyright (c) 2014 shaoke<shaokexu@gmail.com>;
 */
'use strict';
/**
 * Usefulutility 0.1.0
 * (c) 2014 Shaoke Xu(shaokexu@gmail.com)
 * Usefulutility may be freely distributed under the MIT license.
 */

(function (window) {

    /**
     * Returns an array that lists the receiving ordered set’s elements in ascend or descend
     * @param arr               : arr need to be sorted
     * @param arrComparator     : this is the array stored the property to get compare value. For example:
     *                            arr = [{a:{b:{c:1}}}, {a:{b:{c:3}}}, {a:{b:{c:2}}}]; and want to sort by a.b.c, so arrComparator = ['b', 'c'];
     * @param bDescend          : *true* sorted by **descend**, *false* sorted by **ascend**
     * @return{Array}           : return sorted array
     */
    function sortedArrayUsingComparator(arr, arrComparator, bDescend) {
        var tmpArr = angular.copy(arr),
            i, j, tmpItem, tmpComparator, comparatorValue1, comparatorValue2;
        // if arrComparator isn't an array
        if (!Array.isArray(arrComparator)) {
            // if arrComparator is exist
            if (arrComparator) {
                arrComparator = [arrComparator];
            } else {
                arrComparator = [];
            }
        }

        // This mean it just pass one compare condition
        if (!Array.isArray(arrComparator[0])) {
            tmpComparator = [];
            tmpComparator[0] = arrComparator;
            arrComparator = tmpComparator; // now arrComparator should look like [ [...]]
        }

        /**
         * Get comparator value
         * @param arrComparator     : this is the array stored the property to get compare value. For example:
         *                            arr = [{a:{b:{c:1}}}, {a:{b:{c:3}}}, {a:{b:{c:2}}}]; and want to sort by a.b.c, so arrComparator = ['b', 'c'];
         * @param item              : the object need to get value
         * @returns {*}             : comparator value
         */
        function getComparatorValue(item, arrComparator) {
            var tmpValue = item,
                i;
            arrComparator = arrComparator || [];
            for (i = 0; i < arrComparator.length; i++) {
                // It maybe throw an exception like 'tmpValue is undefined', don't catch it,
                // when it has this error, developer need to check logic
                tmpValue = tmpValue[arrComparator[i].toString()];
            }
            return tmpValue.toString();
        }

        function compare(item1, item2, arrComparator) {
            var i, comparatorValue1, comparatorValue2;
            arrComparator = arrComparator || [];
            comparatorValue1 = getComparatorValue(item1, arrComparator[0]);
            comparatorValue2 = getComparatorValue(item2, arrComparator[0]);
            // if
            if (comparatorValue1 > comparatorValue2) {
                return 1;
            } else if (comparatorValue1 == comparatorValue2) { // if they are same
                // this means it has second compare condition
                if (arrComparator.slice(1).length > 0) {
                    return compare(item1, item2, arrComparator.slice(1));
                } else { // return 0, means it is same
                    return 0;
                }
            } else {
                return -1;
            }
        }

        // Bubble sort
        for (i = 0; i < tmpArr.length; i++) {
            for (j = i + 1; j < tmpArr.length; j++) {
                // if tmpArr[j] is smaller than tmpArr[i], switch them, and update comparatorValue1;
                if (compare(tmpArr[i], tmpArr[j], arrComparator) > 0) {
                    tmpItem = undefined;
                    tmpItem = tmpArr[j];
                    tmpArr[j] = undefined;
                    tmpArr[j] = tmpArr[i];
                    tmpArr[i] = tmpItem;
                }
            }
        }

        // need to reverse array
        if (bDescend) {
            tmpArr = tmpArr.reverse();
        }

        return tmpArr;
    }

    var U2 = function () {
        return this;
    };

    U2.prototype.sortedArrayUsingComparator = sortedArrayUsingComparator;

    // create u2
    window.u2 = new U2();

})(window);