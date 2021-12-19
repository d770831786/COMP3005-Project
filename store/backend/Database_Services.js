const { uuid } = require("uuidv4");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8081;

const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "123456",
  host: "localhost",
  database: "Book_Store",
  port: 5432,
});
client.connect();
app.use(express.json());
let authed = [];
let authed_user = [];

function queryGenerator(table, params) {
  let store;
  let publisher;
  if ("store" in params) {
    store = params.store;
    delete params.store;
  }
  if ("publisher" in params) {
    publisher = params.publisher;
    delete params.publisher;
  }
  if ("isbn" in params) {
    return "SELECT * FROM book WHERE isbn = " + params.isbn;
  }
  let keys = Object.keys(params);
  let values = Object.values(params);
  console.log(params);
  let query = "SELECT * FROM " + '"' + table + '"'; // initial query string

  if (keys.length != 0) {
    query += " WHERE ";
  } // add if query parameters

  for (let i = 0; i < keys.length; i++) {
    // loop through params and add them
    query +=
      "UPPER(" +
      keys[i] +
      ") LIKE UPPER('%" +
      encodeURIComponent(values[i]) +
      "%') AND ";
  }

  if (keys.length != 0) {
    query = query.substring(0, query.length - 4);
  } // remove the additional AND

  if (store) {
    if (keys.length != 0) {
      query +=
        "AND isbn IN (SELECT isbn FROM store_books WHERE UPPER(store_name) LIKE UPPER('%" +
        store +
        "%'))";
    } else {
      query +=
        " WHERE isbn IN (SELECT isbn FROM store_books WHERE UPPER(store_name) LIKE UPPER('%" +
        store +
        "%'))";
    }
  }

  if (publisher) {
    if (keys.length != 0) {
      query +=
        "AND isbn IN (SELECT isbn FROM published WHERE publisher_id IN (SELECT publisher_id FROM publisher WHERE UPPER(publisher_name) LIKE UPPER('%" +
        publisher +
        "%')))";
    } else {
      query +=
        " WHERE isbn IN (SELECT isbn FROM published WHERE publisher_id IN (SELECT publisher_id FROM publisher WHERE UPPER(publisher_name) LIKE UPPER('%" +
        publisher +
        "%')))";
    }
  }
  return query; // return our final query
}

app.get("/books", (req, res) => {
  let query = queryGenerator("book", req.query);
  //client.connect()
  client.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
    //client.end()
  });
});

app.post("/login", (req, res) => {
  let query = queryGenerator("user", req.body);
  console.log(req.body);
  //client.connect()
  client.query(query, (error, results) => {
    // query db if username/password is in it
    let valid = false;
    if (error) {
      throw error;
    }
    for (let i = 0; i < results.rows.length; i++) {
      console.log(results.rows[i]);
      if (
        results.rows[i].username == req.body.username &&
        results.rows[i].password == req.body.password
      ) {
        // compare against rows
        valid = true;
      }
    }
    if (valid) {
      // exists
      let key = uuid();
      authed.push(key);
      authed_user.push(req.body.username);
      res.json({ status: 200, key: key });
      return;
    }
    res.json({ status: 400 });
    //client.end()
  });
});

app.post("/logout", (req, res) => {
  console.log(authed);
  console.log(req.body.key);
  if (!authed.includes(req.body.key)) {
    // check if logged in
    res.json({ status: 400 });
  } else {
    let index = authed.indexOf(req.body.key);
    authed.splice(index, 1);
    authed_user.splice(index, 1);
    res.json({ status: 200 });
  }
});

app.post("/register", (req, res) => {
  let address_id = Math.floor(Math.random() * 99999);
  let query_address = `INSERT INTO \"address\" VALUES('${address_id}', '${req.body.street_number}', '${req.body.street_name}', '${req.body.city}', '${req.body.province}', '${req.body.postal_code}')`;
  let query_user = `INSERT INTO \"user\" VALUES('${req.body.username}', '${req.body.password}', '${req.body.first_name}', '${req.body.last_name}', '${address_id}', '${req.body.email}', '${req.body.phone_number}', '${req.body.gender}', '${req.body.age}')`;
  console.log(query_user);
  console.log(query_address);
  client.query(query_address, (error, results) => {
    // if(error) {}
    //client.end()
    client.query(query_user, (error, results) => {
      if (error) {
        res.status(400).send();
      } else {
        res.status(200).send();
      }
      //client.end()
    });
  });
});

app.post("/book", (req, res) => {
  let query_book = `INSERT INTO book (isbn, title, author, genre) VALUES('${req.body.isbn}', '${req.body.title}', '${req.body.author}', '${req.body.genre}')`;
  //let query_published = `INSERT INTO published VALUES('${req.body.isbn}')`
  console.log(query_book);
  client.query(query_book, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send();
    //client.end()
  });
});
var inorderTraversal = function (root, array = []) {
      if (root) {
        inorderTraversal(root.left, array);
        array.push(root.val);
        inorderTraversal(root.right, array);
      }
      return array;
    };

var inorderTraversal = function (root) {
      const result = [];
      const stack = [];
      let current = root;
      while (current || stack.length > 0) {
        while (current) {
          stack.push(current);
          current = current.left;
        }
        current = stack.pop();
        result.push(current.val);
        current = current.right;
      }
      return result;
    };
app.get("/genres", (req, res) => {
  let query = "SELECT DISTINCT genre FROM book";
  //client.connect()
  client.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    let sent = { genre: [] };
    for (var i = 0; i < results.rows.length; i++) {
      sent.genre.push(results.rows[i].genre);
    }
    res.json(sent);
    //client.end()
  });
});

app.get("/user", (req, res) => {
  let username = authed_user[authed.indexOf(req.query.key)];
  let query = `SELECT * FROM \"user\" WHERE username = '${username}'`;
  console.log(query);
  client.query(query, (error, results) => {
    // if(error) {throw error}
    if (results.rows != 0) {
      res.json(results.rows);
    } else {
      res.status(400).send();
    }

    //client.end()
  });
});

app.delete("/book", (req, res) => {
  let query_book = `DELETE FROM book WHERE isbn = '${req.body.isbn}'`;
  let query_published = `DELETE FROM published WHERE isbn = '${req.body.isbn}'`;
  let query_store_books = `DELETE FROM store_books WHERE isbn = '${req.body.isbn}'`;
  let query_order_book = `DELETE FROM order_book WHERE isbn = '${req.body.isbn}'`;
  console.log(query_published);
  console.log(query_book);
  console.log(query_store_books);
  client.query(query_order_book, (error, results) => {
    client.query(query_store_books, (error, results) => {
      client.query(query_published, (error, results) => {
        // if(error) {throw error}
        client.query(query_book, (error, results) => {
          // if(error) {throw error}
          res.status(200).send();
          //clie/nt.end()
        });
        //client.end()
      });

      //client.end()
    });
  });
});

app.post("/authorization", (req, res) => {
  let username = authed_user[authed.indexOf(req.body.key)];
  let query = `SELECT * FROM \"store\" WHERE username = '${username}'`;
  client.query(query, (error, results) => {
    // if(error) {throw error}
    if (results.rows != 0) {
      res.json({ auth: true });
    } else {
      res.json({ auth: false });
    }

    //client.end()
  });
});

function LinkedList () {

  var Node = function (element) {
      this.element = element;;
      this.next = null;
  };

  var length = 0;
  var head = null;


  this.append = function (element) {
       var node = new Node(element),
           current;

       if (head === null) {
           head = node;
       } else {
           current = head;
           while (current.next) {

               current = current.next;
           }
           current.next = node;
       }
   length++;
  };


 this.removeAt = function (position) {
     if (position > -1 && position < length) {
        var current = head,
           previous, index = 0;
        if (position === 0) {
           head = current.next;
        } else {
           while (index++ < position) {
               previous = current;
               current = current.next;
           }

           previous.next = current.next;
        }
        length--;
        return current.element;
     } else {
         return null;
     }
 };

 this.insert = function (positon, element) {
     if (position >= 0 && position <= length) {
          var node = new Node(element);
          var index = 0, previous, current = head;
          if (position === 0) {
               node.next = current;
               head = node;
          } else {
               while (index++ < position) {
                   previous = current;
                   current = current.next;
               }
               node.next = current;
               previous.next = node;
          }
          length++;
          return true;
     } else {
         return false;
     }
 };


 this.toString = function () {
     var current = head,
         string = '';
     while (current) {
         string += ', ' + current.element;
         current = current.next;
     }
     return string.slice(1);
 };


 this.indexOf = function (element) {
     var current = head,
         index = 0;
     while (current) {
        if (element === current.element) {
           return index;
        }
        index++;
        current = current.next;
     }
     return -1;
 };


 this.remove = function (element) {
     var index = this.indexOf(element);
     return this.removeAt(element);
 };


 this.isEmpty = function () {
     return length === 0;
 };
 this.size = function () {
     return length;
 };


 this.getHead = function () {
     return head;
 };

 this.reverse=function(){
  let tempNode=null;
  let ansNode=head;
  while(head&&head.next){
      tempNode=head.next;
      head.next=tempNode.next;
      tempNode.next=ansNode;
      ansNode=tempNode;

  }
  return ansNode;
 }
}
let list=new LinkedList();
list.append(9);
list.append(8);
list.append(3);
list.append(5);
console.log(list.toString());
console.log(list.reverse());
app.post("/publisher", (req, res) => {
  let address_id = Math.floor(Math.random() * 99999);
  let publisher_id = Math.floor(Math.random() * 99999);
  let query_address = `INSERT INTO \"address\" VALUES('${address_id}', '${req.body.street_number}', '${req.body.street_name}', '${req.body.city}', '${req.body.province}', '${req.body.postal_code}')`;
  let query_publisher = `INSERT INTO \"publisher\" VALUES('${publisher_id}', '${req.body.publisher_name}', '${req.body.banking_account}', '${address_id}', '${req.body.email}', '${req.body.phone_number}')`;
  console.log(query_publisher);
  console.log(query_address);
  client.query(query_address, (error, results) => {
    // if(error) {}
    //client.end()
    client.query(query_publisher, (error, results) => {
      if (error) {
        res.status(400).send();
      } else {
        res.status(200).send();
      }
      //client.end()
    });
  });
});
function Node(data,left,right) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.show = show;
}
app.listen(port, () => {});
