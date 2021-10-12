const db = require("../models");
const Book = db.books;
const Op = db.Sequelize.Op;

// Create and Save a new Book
exports.create = (req, res) => {
  console.log('-------------------------------------')
  console.log(req.body)
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "El titulo es obligatorio"
    });
    return;
  }

  // Create a Book
  const book = {
    title: req.body.title,
    description: req.body.description,
    year: req.body.year,
    published: req.body.published ? req.body.published : false
  };

  // Save Book in the database
  Book.create(book)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocurrio algún problema al crear el libro."
      });
    });
};

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Book.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ocurrio algún problema al buscar los libros."
      });
    });
};

// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Book.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se pudo encontrar el libro con id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error regresar el libro con id=" + id
      });
    });
};

// Update a Book by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Book.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "El libro fue actualizado satisfactoriamente."
        });
      } else {
        res.send({
          message: `No se pudo actualizar el libro con id=${id}. Quizás el libro no fue encontrado o req.body esta vacio!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error al actualizar el libro con id=" + id
      });
    });
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Book.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "El libro fue borrado satisfactoriamente!"
        });
      } else {
        res.send({
          message: `No se pudo Eliminar el libro con id=${id}. Quizás no fue encontrado!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo eliminar el libro con id=" + id
      });
    });
};

// Delete all Books from the database.
exports.deleteAll = (req, res) => {
  Book.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Los libros fueron borrados satisfactoriamente!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Algún error ocurrio mientras se borraban los libros."
      });
    });
};

// Find all published Books
exports.findAllPublished = (req, res) => {
  Book.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Algún error ocurrio mientras se obtenian los libros ."
      });
    });
};