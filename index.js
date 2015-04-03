/**
 * Created by Alex on 19.03.14.
 */
document.addEventListener('DOMContentLoaded', function () {
    var inStr = document.getElementById('in');
    var outStr = document.getElementById('out');
    var result = document.getElementById('calc');
    var tmpStr = "";

    document.addEventListener('keypress', function (ev) {
        if (ev.charCode == 96 || ev.charCode == 1105)
        {
            inStr.value = "";
            outStr.value = "";
            result.value = "";
            tmpStr = "";
        }else if (ev.keyCode == 8){
            var str = inStr.value;
            str.pop();
            inStr.value = str;
            delete str;
        }else if (ev.keyCode == 13){
//            outStr.value = parseInput(inStr.value);
            var stack = tmpStr.split(" ");
//            result.value = calculation(stack);
            var resObj = calculation(stack);
            outStr.value = resObj.str;
            result.value = resObj.val;
        }else if (String.fromCharCode(ev.charCode) == '+' ||
					String.fromCharCode(ev.charCode) == '-' ||
					String.fromCharCode(ev.charCode) == '*' ||
					String.fromCharCode(ev.charCode) == '/' ||
					String.fromCharCode(ev.charCode) == '^' ||
					String.fromCharCode(ev.charCode) == '(' ||
					String.fromCharCode(ev.charCode) == ')'){
            var str = String.fromCharCode(ev.charCode);
            inStr.value += str;
            tmpStr += ' ' + str + ' ';
        }else{
            var str = String.fromCharCode(ev.charCode);
            inStr.value += str;
            tmpStr += str;
        }
    });
});

function parseInput(str){
    var input = str;
    var size = input.length;
    var stackOper = [];
    var outputStr = "";
    for (var i = 0; i < size; i ++)
    {
        if (!isNaN(parseInt(input[i])) || input[i] == '.')
        {
                outputStr += input[i];
        }
        else if (input[i] == ' ') continue;
        else
        {
            if (stackOper.length == 0) 
				stackOper.push(input[i]);
            else
            {
                if      (priority(input[i]) > priority(stackOper[stackOper.length - 1]))
                        { stackOper.push(input[i]);}
                else if (input[i] == '^' && priority(input[i]) == priority(stackOper[stackOper.length - 1]))
                        {
                            stackOper.push(input[i]);
                        }
                else if (priority(input[i]) <= priority(stackOper[stackOper.length - 1]) &&
                                        input[i] !== '(' && input[i] !== ')')
                        {
                            while(priority(stackOper[stackOper.length - 1]) >= priority(input[i]))
                            {
                                outputStr += stackOper.pop();
                            }
                            stackOper.push(input[i]);
                        }
                else if (input[i] == '(')
                        {stackOper.push(input[i]);}
                else if (input[i] == ')')
                        {
                            while (stackOper[stackOper.length - 1] !== '(')
                            {
                                outputStr += stackOper.pop();
                            }
                            stackOper.pop();
                        }
                else if (input[i] == '=')
                        {
                            while (stackOper.length > 0)
                            {
                                outputStr += stackOper.pop();
                            }
                        }
            }
        }
    }
    while (stackOper.length > 0)
        outputStr += stackOper.pop();
    return outputStr;
};

function calculation(str){
    var size = str.length;
    var stack = [];
    var stackOper = [];
    var count = null;
    for (var i = 0; i < size; i ++)
    {
        if (!isNaN(parseFloat(str[i])))
        {
            stack.push(parseFloat(str[i]));
        }
        else
        {
            if (stackOper.length == 0) stackOper.push(str[i]);
            else
            {
                if (str[i] == " " || str[i] =="") continue;
                else if (priority(str[i]) > priority(stackOper[stackOper.length - 1]))
                { stackOper.push(str[i]); }
                else if (str[i] == '^' && priority(str[i]) == priority(stackOper[stackOper.length - 1]))
                { stackOper.push(str[i]); }
                else if (str[i] == '(')
                { stackOper.push(str[i]); }
                else if (str[i] == ')')
                {
                    while (stackOper[stackOper.length - 1] !== '(')
                    {
                        stack.push(stackOper.pop());
                        count++;
                    }
                    stackOper.pop();
                }
                else if (priority(str[i]) <= priority(stackOper[stackOper.length - 1]) &&
                    str[i] !== '(' && str[i] !== ')')
                {
                    while(priority(stackOper[stackOper.length - 1]) >= priority(str[i]) &&
                            stackOper.length > 0)
                    {
                        stack.push(stackOper.pop());
                        count++
                    }
                    stackOper.push(str[i]);
                }
                else if (str[i] == '=')
                {
                    while (stackOper.length > 0)
                    {
                        stack.push(stackOper.pop());
                        count++
                    }
                }
            }
        }
    }
    while (stackOper.length > 0)
    {
        var tmp = stackOper.pop();
        if (tmp == '' || tmp == "" || tmp == ' ' || tmp == " ") continue;
        else
        {
            stack.push(tmp);
            count++;
        }
    }
    var resStr = stack.toString();
    var resVal = evaluate(stack);
    var ro = {str: resStr, val: resVal};
    return ro;
}

function evaluate(arr, size)
{
    var s = arr;
    for (var i = 0; i < s.length; i++)
    {
        var a = isNaN(s[i]);
        if(a)
        {
            var tmp = (calc(s[i], s[i - 1], s[i - 2]));
            s[i - 2] = tmp;
            for (var j = i; j < s.length - 1; j++)
            {
                s[j - 1] = s[j + 1];
            }
            s.pop();
            s.pop();
            i = 0;
        }
    }
    return s[0];
}

var calc = function(op, val1, val2){
    switch (op)
    {
        case '+': return val2 + val1; break;
        case '-': return val2 - val1; break;
        case '*': return val2 * val1; break;
        case '/':
            if (val1 !== 0)
                return val2 / val1;
            else
                return undefined;
            break;
        case '^': return Math.pow(val2, val1);
    }
}
var priority = function(op) {
    if (op == '^') return 3;
    else if (op == '*' || op == '/') return 2;
    else if (op == '+' || op == '-') return 1;
    else if (op == '(') return 0;
    else return -1;
}