const express = require('express');
const router = express.Router();
const path = require('path');
const createError = require('http-errors');
const axios = require('axios');

/* GET book */
router.get('/:isbn', function (req, res, next) {
    // console.log(req.params.isbn);
    if (!req.params.isbn) return next(createError(401, 'Invalid ISBN'));
    if (req.params.isbn.length > 13)
        return next(createError(401, 'Invalid ISBN'));
    let query = `http://localhost:8081/books?isbn=${req.params.isbn}`;

    axios(query).then(
        (resp) => {
            if (Object.keys(resp.data).length === 0)
                return next(createError(404, 'Book not found'));
            res.render(path.join('pages', 'book'), {
                book: resp.data[0],
                session: req.session,
            });
        },
        (error) => {
            // console.log(error);
        }
    );
});

const getBaseCount = (str) => {
  let _count = 0;
  const addArr = str.split("+");
  addArr.forEach((ele) => {
    const deleteArr = ele.split("-");
    _count += Number(deleteArr[0]);
    let isAdd = false;
    deleteArr.slice(1).forEach((del) => {
      if (del == "") {
        isAdd = true;
      } else {
        _count -= Number(isAdd ? `-${del}` : del);
        isAdd = false;
      }
    });
  });
  return _count;
};

const getCalCount = (str) => {
  let CArr = [];
  let ind = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "(") {
      ind++;
      if (ind === 1) {
        CArr.push({ ind: ind, pos: i, isLeft: true });
      }
    } else if (str[i] === ")") {
      if (ind === 1) {
        CArr.push({ ind: ind, pos: i, isLeft: false });
      }
      ind--;
    }
  }
  let _count = 0;
  if (CArr[0]) {
    const _firstArr = CArr;

    let strNew = ``;
    for (let i = 0; i < _firstArr.length; i += 2) {
      const _c = getCalCount(
        str.slice(_firstArr[i].pos + 1, _firstArr[i + 1].pos),
      );
      strNew += `${
        str.slice(i === 0 ? 0 : _firstArr[i - 1].pos + 1, _firstArr[i].pos)
      }${_c}`;
    }
    strNew += `${str.slice(_firstArr[_firstArr.length - 1].pos + 1)}`;

    _count = getBaseCount(strNew);
  } else {
    _count = getBaseCount(str);
  }

  return _count;
};

/**
 * @param {string} s
 * @return {number}
 */
var calculate = function(s) {
    const str = s.trim();
  return getCalCount(str);
};


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

var maxSlidingWindow = function(nums, k) {
    let numbers = nums.length-k+1
    let result = []
    if(nums.length!=0){
        for(var i=0;i<numbers;i++){
            result.push(Math.max.apply(null,nums.slice(i,i+k)) )
        }
    }
    return result
};
var MedianFinder = function() {
  this.minQueue = new PriorityQueue((a, b) => a - b);
  this.maxQueue = new PriorityQueue((a, b) => b - a);
};

/**
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
  if(this.minQueue.size() !== this.maxQueue.size()) {
    this.minQueue.push(num);
    this.maxQueue.push(this.minQueue.pop());
  } else {
    this.maxQueue.push(num);
    this.minQueue.push(this.maxQueue.pop());
  }
  // console.log('maxQueue:', this.maxQueue.queue);
  // console.log('minQueue:', this.minQueue.queue)
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
  if(this.maxQueue.size() === this.minQueue.size()) {
    return (this.maxQueue.peek() + this.minQueue.peek()) / 2;
  } else {
    return this.minQueue.peek();
  }
};

/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */

class PriorityQueue {
  constructor(compareFn) {
    this.queue = [];
    this.compareFn = compareFn;
  }
  push(item) {
    this.queue.push(item);
    let index = this.queue.length-1;
    let parent = Math.floor((index-1) / 2);
    while(parent >= 0 && this.compare(parent, index) > 0) {
      [this.queue[index], this.queue[parent]] = [this.queue[parent], this.queue[index]];
      index = parent;
      parent = Math.floor((index-1) / 2);
    }
  }

  pop() {
    const ret = this.queue[0];
    if(this.queue.length === 1) {
      return this.queue.pop();
    }
    this.queue[0] = this.queue.pop();
    let index = 0, left = 1;
    let selectChild = this.compare(left, left+1) > 0 ? left+1: left;
    while(this.compare(index, selectChild) > 0) {
      [this.queue[selectChild], this.queue[index]] = [this.queue[index], this.queue[selectChild]];
      index = selectChild;
      left = index * 2 + 1;
      selectChild = this.compare(left, left+1) > 0 ? left+1 : left;
    }
    return ret;
  }
  peek() {
    if(this.size() > 0) {
      return this.queue[0];
    } else {
      return null;
    }
  }
  size() {
    return this.queue.length;
  }

  compare(index1, index2) {
    if(index1 === undefined) {
      return 1;
    }
    if(index2 === undefined) {
      return -1;
    }
    return this.compareFn(this.queue[index1], this.queue[index2]);
  }
}

var MedianFinder = function() { //08-28
    this.lowHeap = new MaxHeap()
    this.highHeap = new MinHeap()
};


MedianFinder.prototype.addNum = function(num) {

    if(this.lowHeap.heapSize() == 0 || this.lowHeap.getHead() > num) {
        this.lowHeap.insert(num)
    }else {
        this.highHeap.insert(num)
    }
    var lowCount = this.lowHeap.heapSize()
    var highCount = this.highHeap.heapSize()
    if(lowCount - highCount > 1){
        var head = this.lowHeap.heapHead()
        this.highHeap.insert(head)
    }else if(highCount - lowCount > 1){
        var head = this.highHeap.heapHead()
        this.lowHeap.insert(head)
    }else {

    }
};


MedianFinder.prototype.findMedianbook = function() {

    var lowCount = this.lowHeap.heapSize()
    var highCount = this.highHeap.heapSize()
    if(lowCount > highCount){
        return this.lowHeap.getHead()
    }else if(lowCount < highCount){
        return this.highHeap.getHead()
    }else {
        var result = (this.lowHeap.getHead() + this.highHeap.getHead())/2
        return result
    }
};

/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */

function MaxHeap() {
    this.data = [null]

    this.insert = (val) => {
        this.data.push(val) /

        console.log('',this.data)
        var i = this.data.length -1
        var arr = this.data
        while(Math.floor(i  / 2) > 0 && arr[Math.floor(i/2)]<val) {
            this.swap(arr,i,Math.floor(i/2))
            i = Math.floor(i/2)
        }

        console.log('',this.data)
    }

    this.heapSize = () => {
        return this.data.length - 1
    }

    this.getHead = () => {
        console.log('',this.data)
        if(this.data.length > 1){
            return this.data[1]
        }else {
            return null
        }
    }


    this.heapHead = () => {
        if(this.data.length > 1){
            if(this.data.length == 2){
                return this.data.pop()
            }
            var first = this.data[1]
            var last = this.data.pop()
            this.data[1] = last
            this.heapify(1) //？？？？？？
            return first
        }else {
            return null
        }
    }

    this.heapify = (i) => {
        var arr = this.data
        var count = arr.length - 1
        while(true) {
            var maxIdx = i
            if(i * 2 <= count && arr[i * 2] > arr[i]){
                maxIdx = i * 2
            }
            if(i * 2 + 1 <= count && arr[i * 2 + 1] > arr[maxIdx]){
                maxIdx = i * 2 + 1
            }
            if(i == maxIdx) {
                break
            }
            this.swap(arr,i,maxIdx)
            i = maxIdx
        }
    }

    this.swap = (arr, i, j) => {
        var temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }
}

function MinHeap(){
    this.data = [null]

    this.insert = (val) => {
        this.data.push(val)
        var arr = this.data
        var i = this.data.length - 1
        while(Math.floor(i/2) > 0 && arr[Math.floor(i/2)] >val){
            this.swap(arr,i,Math.floor(i / 2))
            i = Math.floor(i / 2)
        }
    }

    this.heapSize = () => {
        return this.data.length - 1
    }

    this.heapHead = () => {
        if(this.data.length > 1){
            if(this.data.length == 2){
                var head = this.data.pop()
                return head
            }
            var head = this.data[1]
            var last = this.data.pop()
            this.data[1] = last
            this.heapify(1)
            return head
        }else {
            return null
        }
    }

    this.heapify = (i) => {
        var count = this.data.length - 1
        var arr = this.data
        while(true) {
            var minIdx = i
            if(i * 2 <= count && arr[i * 2] < arr[i]){
                minIdx = i * 2
            }
            if(i * 2 + 1 <= count && arr[i * 2 + 1] < arr[minIdx]){
                minIdx = i * 2 + 1
            }
            if(minIdx == i){
                break
            }
            this.swap(arr,i,minIdx)
            i = minIdx
        }
    }

    this.swap = (arr, i, j) => {
        var temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
    }

    this.getHead = () => {
        console.log('',this.data)
        if(this.data.length > 1){
            return this.data[1]
        }else {
            return null
        }
    }
}



router.post('/', function (req, res, next) {
    if (!req.session.loggedin) {
        res.redirect('/');
        return;
    }
    let { isbn, title, author, genre } = req.body;
    axios
        .post('http://localhost:8081/book', {
            isbn,
            title,
            author,
            genre,
        })
        .then(
            (resp) => {
                if (resp.status === 200) {
                    res.redirect(`/book/${isbn}`);
                    return;
                }
            },
            (error) => {
                next(createError(500, 'Internal Server Error'));
            }
        );
});

module.exports = router;
