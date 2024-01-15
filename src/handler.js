const { nanoid } = require("nanoid");
const books = require("./books");
const modelBooks = require("./books.json");
const validator = require('validator');

const addBook = (request, h) => {
    const { name, summary, publisher, year, author, pageCount, readPage, reading } = request.payload

    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const finished = pageCount === readPage ? true : false

    const newBook = {
        id, name, year, summary, publisher, author, finished, pageCount, readPage, insertedAt, updatedAt, reading
    }

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
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
        status: 'fail',
        message: 'Buku gagal ditambah'
    })

    response.code(500)
    return response
};

const getBooks = () => {
    // const responseBooks = books.map((book) => ({id : book.id, name: book.name, publisher: book.publisher}));

    return {
        status: 'success',
        data: {
            books: books.map((book) => ({id : book.id, name: book.name, publisher: book.publisher}))
        }
    }
}

const getBookById = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0]

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book: {
                    id: book.id,
                    name: book.name,
                    year: book.year,
                    author: book.author,
                    summary: book.summary,
                    publisher: book.publisher,
                    pageCount: book.pageCount,
                    readPage: book.readPage,
                    finished: book.finished,
                    reading: book.reading,
                    insertedAt: book.insertedAt,
                    updatedAt: book.updatedAt
                }
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })

    response.code(404)
    return response
}

const editBook = (request, h) => {
    const { id } = request.params

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
    const updatedAt = new Date().toISOString()

    const index = books.findIndex((book) => book.id === id)
    const finished = pageCount === readPage ? true : false

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })

        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })

        response.code(400)
        return response
    }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt, finished
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })

        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })

    response.code(404)
    return response
}

const deleteBook = (request, h) => {
    const { id } = request.params

    const index = books.findIndex((book) => book.id === id)

    if (index !== -1) {
        books.splice(index, 1)

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })

        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })

    response.code(404)
    return response
}


module.exports = { addBook, getBooks, getBookById, editBook, deleteBook }