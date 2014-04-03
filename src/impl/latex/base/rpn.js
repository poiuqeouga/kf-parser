/**
 * 逆波兰表达式转换函数
 */

define( function ( require ) {

    var Utils = require( "impl/latex/base/utils" );

    return function ( units ) {

        var signStack = [],

            TYPE = require( "impl/latex/define/type"),

            currentUnit = null;

        // 先处理函数
        units = processFunction( units );

        while ( currentUnit = units.shift() ) {


            // 移除brackets中外层包裹的combination节点
            if ( currentUnit.name === "combination" && currentUnit.operand.length === 1 && currentUnit.operand[ 0 ].name === "brackets" ) {
                currentUnit = currentUnit.operand[ 0 ];
            }

            if ( Utils.isArray( currentUnit ) ) {

                signStack.push( arguments.callee( currentUnit ) );

                continue;

            }

            signStack.push( currentUnit );

        }

        // 要处理brackets被附加的包裹元素
        return signStack;

    };

    /**
     * “latex函数”处理器
     * @param units 单元组
     * @returns {Array} 处理过后的单元组
     */
    function processFunction ( units ) {

        var processed = [],
            currentUnit = null;

        while ( ( currentUnit = units.pop() ) !== undefined ) {

            if ( currentUnit && typeof currentUnit === "object" && currentUnit.sign === false ) {
                // 预先处理不可作为独立符号的函数
                var tt = currentUnit.handler( currentUnit, [], processed.reverse() );
                processed.unshift( tt );
                processed.reverse();
            } else {
                processed.push( currentUnit );
            }

        }

        return processed.reverse();

    }

} );