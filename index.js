const express = require("express");
const kyobo = require("./kyobo/loadBook.js");
const parser = require("./kyobo/parser.js");
const models = require("./models");
const findBook = require("./dao/book/findBook.ts");

const app = express()

app.get("/books", (req, res) => {
  const title = req.query.title

  models.sequelize
    .sync()
    .then(() => {
      let books;
      if (title.length == 0) {
        books = models.Book.findAll({
          raw: true
        })
      } else {
        books = models.Book.findAll({
          raw: true,
          where: [{ title: title }],
        });
      }

      books.then((result) => {
        res.send({ result });
      })
        .catch((error) => {
          console.error(error);
          res.status(400).send({ result, });
        });

    })
    .catch((err) => {

    })



});

app.listen(3000, () => {
  console.log("서버를 시작합니다.")
});


function start() {
  kyobo("1", "1")
    .then((response) => {
      const data = response.data;
      data.data.bestSeller.forEach((element) => {
        const book = parser(element);

        models.Book.create({
          title: book.title,
          rank: book.rank,
          imageUrl: book.imageUrl,
          wirter: book.wirter,
          publisher: book.publisher,
          summary: book.summary
        })

        console.log(book.title + " 저장 성공");
      });
    })
    .catch((error) => {
      console.error(error);
    });


  models.User.create({
    deviceId: "deviceId",
    bookTitle: "bookTitle"
  })
}


