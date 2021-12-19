const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const createError = require('http-errors');

router.post('/', function (req, res, next) {
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    let { username, password } = req.body;
    axios.post('http://localhost:8081/login', { username, password }).then(
        (resp) => {
            if (resp.status === 200) {
                let { key } = resp.data;
                req.session.loggedin = true;
                req.session.key = key;
                axios.post(`http://localhost:8081/authorization`, { key }).then(
                    (response) => {
                        req.session.auth = response.data.auth;
                        res.redirect(`/account/${key}`);
                        return;
                    },
                    (err) => {
                        next(createError(500, 'Internal Server Error'));
                    }
                );
            } else {
                next(createError(400, 'Incorrect Credentials'));
            }
        },
        (error) => {
            next(createError(500, 'Internal Server Error'));
        }
    );
});

var findbooks = function (s, words) {
    let left = 0, right = 0;
    let slen = s.length;
    let wordLen = words[0].length;
    let wordNum = words.length;
    let wlen = wordNum * wordLen;
    let wordMap = new Map();
    for (let word of words) {
        let count = wordMap.has(word) ? wordMap.get(word) : 0;
        wordMap.set(word, count + 1);
    }
    let res = [];
    while (right < slen) {
        right++;
        if (right - left === wlen) {
            if (match(s.substring(left, right), wordMap, wordNum, wordLen)) {
                res.push(left);
            }
            left++;
        }
    }
    return res;
};

function match(str, wordMap, wordNum, wordLen) {
    let map = new Map();
    for (let i = 0; i < wordNum; i++) {
        let word = str.substring(i * wordLen, (i + 1) * wordLen);
        let count = map.has(word) ? map.get(word) : 0;
        map.set(word, count + 1);
    }
    let matchflag = true;
    for (let [key, value] of wordMap) {
        if (!map.has(key) || map.get(key) !== value) {
            matchflag = false;
        }
    }
    return matchflag;
}
/**

 */
var findSubstring3 = function(s, words) {
    if (!words || !words.length) return[];
    let wordLen = words[0].length;
    let allWordsLen = wordLen * words.length;
    let ans = [], wordMap = {};
    for (let w of words) {
        wordMap[w] ? wordMap[w]++ :wordMap[w] = 1
    }
    for (let i = 0; i < s.length - allWordsLen + 1; i++) {
        let wm = Object.assign({}, wordMap);
        for (let j = i; j < i + allWordsLen - wordLen + 1; j += wordLen) {
            let w = s.slice(j, j + wordLen);
            if (wm[w]) {
                wm[w]--
            } else {
                break;
            }
        }
        if (Object.values(wm).every(n => n === 0)) ans.push(i);
    }
    return ans;
};

var findSubstring12d = function (s, words) {
    if (words.length == 0) return []
    let aryIndex = [], ary = [], numLength = words[0].length, result = [];
    for (let i = 0; i < words.length; i++) {
        if (words.indexOf(words[i]) !== i) continue
        let _s = JSON.parse(JSON.stringify(s)), index = 0;
        while (_s.indexOf(words[i]) > -1 && _s.indexOf(words[i]) + numLength * words.length <= _s.length) {
            aryIndex.push(index + _s.indexOf(words[i]))
            let strAry = []
            let _index = _s.indexOf(words[i]);
            for (let j = 0; j < words.length; j++) {
                strAry.push(_s.substring(_index + j * numLength, _index + (j + 1) * numLength))
            }
            ary.push(strAry)
            index += _s.indexOf(words[i]) + 1
            _s = _s.substring(_s.indexOf(words[i]) + 1, _s.length)

        }
    }
    for (let i = 0; i < ary.length; i++) {
        let strAry = ary[i]
        for (let j = 0; j < words.length; j++) {
            for (let k = 0; k < strAry.length; k++) {
                if (words[j] == strAry[k]) {
                    strAry.splice(k, 1)
                    break;
                }
            }
        }
        if (strAry.length == 0) {
            result.push(aryIndex[i])
        }
    }
    return result
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


var findstore = function(s, words) {
    const itemLen = words[0].length
    const sLength = s.length
    const wordsLength = words.length
    const wordsTotalLength  = wordsLength * itemLen
    const results = []

    const map = new Map()
    const initMap = () => {
        words.forEach(item => {
            if (map.has(item)) {
                const num = map.get(item)
                map.set(item, num+1)
            } else {
                map.set(item, 1)
            }
        })
    }
    const clearMap = () => {
        for (const k of map) {
            map.delete(k[0])
        }
    }
    initMap()
    const isEmpty = () =>  words.every(item => !map.has(item))
    const isEqual = (str) => {
        clearMap()
        initMap()
        let newStr = ''
        for (let i = 0; i < str.length; i+=itemLen) {
            newStr = str.substring(i, i+itemLen)
            if (map.has(newStr)) {
                const num = map.get(newStr)
                if (num > 1) {
                    map.set(newStr, num - 1)
                } else {
                    map.delete(newStr)
                }
            } else {
                return false
            }
        }
        return isEmpty()
    }
    let left = 0,right=wordsTotalLength
    while (right <= sLength) {
        const str = s.substring(left,right)
        if (str.length === wordsTotalLength) {
            if (isEqual(str)) {
                results.push(left)
            }
            left+=1
            right+=1
        }
    }
    return results
};

var minCut = function(s) {
  const n = s.length;
  const g = new Array(n).fill(0).map(_ => new Array(n).fill(false));
  const dp = new Array(n).fill(0);

  for (let j = 0; j < n; j++) {
    for (let i = j; i >= 0; i--) {
      if (i === j) {
        g[i][j] = true;
      } else {

        if ((s[i] === s[j]) && (j - i === 1 || g[i+1][j-1])) {
          g[i][j] = true;
        }
      }
    }
  }

  for (let j = 1; j < n; j++) {
    if (g[0][j]) {
      dp[j] = 0;
    } else {
      dp[j] = j;
      for (let i = 0; i <= j; i++) {
        if (g[i][j]) {
          dp[j] = Math.min(dp[j], dp[i-1] + 1);
        }
      }
    }
  }
  return dp[n-1];
};

module.exports = router;
