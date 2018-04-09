/** 
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * @since 0.1.0
 * @param {Function} func The function to call.
 * @param {Object} wait The function will be called after it stops being called for 'wait' milliseconds.
 * @param {Object} immediate If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
 */
const debounce = (func, wait, immediate) =>
{
    let timeout;
    return function() 
    {
        const me = this, args = arguments;
        const later = function() 
        {
            timeout = null;
            if (!immediate) func.apply(me, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait || 250);
        if (callNow) func.apply(me, args);
    };
};

/** 
 * Check if obj is a valid number. Returns false if obj is equal to NaN, Infinity, -Infinity or a string eg '10'.
 * @since 0.1.0
 * @param {*} obj The number to test.
 * @return {boolean} true, if obj is a number, otherwise false.
 */
const isNumber = (obj) =>
{
    // (typeof n == 'number')   Reject objects that arent number types eg numbers stored as strings such as '10'.
    //                          NaN, Infinity and -Infinity are number types so will pass this test.
    // isFinite(n)              Reject infinite numbers.
    // !isNaN(n))               Reject NaN.
    return (typeof obj === 'number') && isFinite(obj) && !isNaN(obj);
};

export {debounce, isNumber};