const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const id = nanoid(16);
    const { name, year, author, summary, pageCount, readPage, reading, publisher } = request.payload;

    if (!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt,
        publisher,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    const responseBook = [];
    if (name) {
        books.forEach((book) => {
            const nameBook = book.name.toLowerCase();
            if (nameBook.includes(name.toLowerCase())) {
                const id = book.id;
                const name = book.name;
                const publisher = book.name;

                const newBook = { id, name, publisher };

                responseBook.push(newBook);
            }
        });
    } else if (reading) {
        books.forEach((book) => {
            if (reading === 0) {
                if (book.reading === false) {
                    const id = book.id;
                    const name = book.name;
                    const publisher = book.name;

                    const newBook = { id, name, publisher };

                    responseBook.push(newBook);
                }
            } else {
                if (book.reading === true) {
                    const id = book.id;
                    const name = book.name;
                    const publisher = book.name;

                    const newBook = { id, name, publisher };

                    responseBook.push(newBook);
                }
            }
        });
    } else if (finished) {
        books.forEach((book) => {
            if (finished > 0) {
                if (book.finished === true) {
                    const id = book.id;
                    const name = book.name;
                    const publisher = book.name;

                    const newBook = { id, name, publisher };

                    responseBook.push(newBook);
                }
            } else {
                if (book.finished === false) {
                    const id = book.id;
                    const name = book.name;
                    const publisher = book.name;

                    const newBook = { id, name, publisher };

                    responseBook.push(newBook);
                }
            }
        });
    } else {
        books.forEach((book) => {
            const id = book.id;
            const name = book.name;
            const publisher = book.name;

            const newBook = { id, name, publisher };

            responseBook.push(newBook);
        });
    }

    const response = h.response({
        status: "success",
        data: {
            books: responseBook,
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((book) => book.id === id)[0];

    if (book !== undefined) {
        const response = h.response({
            status: "success",
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const { name, year, author, summary, pageCount, readPage, reading, publisher } = request.payload;
    const bookIndex = books.findIndex((book) => book.id === id);

    if (!name) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    if (bookIndex !== -1) {
        books[bookIndex] = {
            ...books[bookIndex],
            name,
            year,
            author,
            summary,
            pageCount,
            readPage,
            reading,
            publisher,
        };

        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);

        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
