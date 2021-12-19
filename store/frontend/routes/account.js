const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const createError = require('http-errors');


var books = function(s) {
        s = s.replace(/ +/g, '').match(/(\+|-|\*|\/|\d+|\(|\))/g);
        const stack = [];
        for (let i = 0; i < s.length;) {
            if (s[i] === ')') {
                let left = stack.pop();
                res = '' + simpleCal(s.slice(left + 1, i));
                s = [].concat(s.slice(0, left), res, s.slice(i + 1));
                i = left + 1;
                continue;
            }
            if (s[i] === '(') stack.push(i);
            i++;
        }
        return simpleCal(s);
        function simpleCal(s) {
            const stack = [];
            for(let i = 0; i < s.length; i++) {
                if (s[i] === '*') {
                    stack.push(stack.pop() * +s[i + 1]);
                    i++;
                }
                else if (s[i] === '/') {
                    stack.push(parseInt(stack.pop() / +s[i + 1], 10));
                    i++;
                }
                else {
                    stack.push(s[i]);
                    }
                }
                let res = +stack[0];
                for(let i = 1; i < stack.length; i += 2) {
                    if (stack[i] === '+') res += +stack[i + 1];
                    else if (stack[i] === '-') res -= +stack[i + 1];
                }
                return res;
                }
            };



router.get('/:id', function (req, res, next) {
    if (!req.session.loggedin) {
        res.redirect('/');
        return;
    }
    axios.get(`http://localhost:8081/user?key=${req.session.key}`).then(
        (resp) => {
            res.render(path.join('pages', 'account'), {
                user: resp.data[0],
                session: req.session,
            });
            return;
        },
        (err) => {
            next(createError(404), 'Account Not Found');
        }
    );
});

module.exports = router;
