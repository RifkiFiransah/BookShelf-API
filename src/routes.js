const { getAllBooksHandler, addBooksHandler, getBooksByIdHandler, editBookByIdHandler, deleteBookByIdHandler } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler,
    options: {
      cors: {
        origin: ['*']
      }
    }
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBooksByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookByIdHandler
  }
]

module.exports = routes