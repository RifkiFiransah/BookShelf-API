const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload
  if(name == undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if(readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response

  }
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount == readPage
  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, reading, id, insertedAt, updatedAt, finished
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  if(!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    }).code(200)
    return response
  }

  if(name) {
    const filterBooks = books.filter((book) => {
      return book.name.toLowerCase().includes(name.toLowerCase())
    })
    const response = h.response({
      status: 'success',
      data: {
        books: filterBooks.map((fbook) => ({
          id: fbook.id,
          name: fbook.name,
          publisher: fbook.publisher
        }))
      } 
    }).code(200)
    return response
  }
  if(reading) {
    const filterBooks = books.filter((book) => {
      return Number(book.reading) === Number(reading)
    })
    const response = h.response({
      status: 'success',
      data: {
        books: filterBooks.map((fbook) => ({
          id: fbook.id,
          name: fbook.name,
          publisher: fbook.publisher
        }))
      }
    }).code(200)
    return response
  }
  if(finished) {
    const filterBooks = books.filter((book) => {
      return Number(book.finished) == Number(finished)
    })
    const response = h.response({
      status: 'success',
      data: {
        books: filterBooks.map((fbook) => ({
          id: fbook.id,
          name: fbook.name,
          publisher: fbook.publisher
        }))
      }
    }).code(200)
    return response
  }
}

const getBooksByIdHandler = (request, h) => {
  const {id} = request.params
  const book = books.filter((b) => b.id === id)[0]

  if(book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    }).code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)

  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === id)

  if(name == undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
    return response
  }

  if(readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
    return response
  }

  if(index != -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: "Gagal memperbarui buku. Id tidak ditemukan"
  }).code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
      }).code(200)
      return response
  }

  const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404)
  return response
}

module.exports = {getAllBooksHandler, addBooksHandler, getBooksByIdHandler, editBookByIdHandler, deleteBookByIdHandler}