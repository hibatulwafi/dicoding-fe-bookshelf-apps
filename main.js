const books = [];
const RENDER_EVENT = 'renderEvent';

function addBook() {
    const titleBook = document.getElementById("inputBookTitle").value;
    const authorBook = document.getElementById("inputBookAuthor").value;
    const yearsBook = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    books.push({ id: +new Date(), title: titleBook, author: authorBook, year: Number(yearsBook), isComplete });

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener(RENDER_EVENT, function () {
    const unCompleted = document.getElementById("incompleteBookshelfList");
    unCompleted.innerHTML = "";

    const isComplete = document.getElementById("completeBookshelfList");
    isComplete.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            unCompleted.append(bookElement);
        } else {
            isComplete.append(bookElement);
        }
    }
});

function makeBook(objectBook) {
    const bookElement = document.createElement("article");
    bookElement.classList.add("book_item");

    const titleElement = document.createElement("h3");
    titleElement.innerText = objectBook.title;

    const authorElement = document.createElement("p");
    authorElement.innerText = `Penulis: ${objectBook.author}`;

    const yearElement = document.createElement("p");
    yearElement.innerText = `Tahun: ${objectBook.year}`;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = objectBook.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    checkButton.addEventListener("click", function () {
        toggleBookCompleted(objectBook.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";
    deleteButton.addEventListener("click", function () {
        removeBook(objectBook.id);
    });

    actionContainer.append(checkButton, deleteButton);
    bookElement.append(titleElement, authorElement, yearElement, actionContainer);
    bookElement.setAttribute("id", `book-${objectBook.id}`);

    return bookElement;
}

function toggleBookCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = !bookTarget.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTargetIndex = findBookIndex(bookId);

    if (bookTargetIndex === -1) return;

    books.splice(bookTargetIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    return books.find(book => book.id === bookId) || null;
}

function findBookIndex(bookId) {
    return books.findIndex(book => book.id === bookId);
}

document.addEventListener("DOMContentLoaded", function () {
    const saveForm = document.getElementById("inputBook");
    saveForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function searchBook() {
    const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
    const bookItems = document.querySelectorAll(".book_item");
    console.log(searchInput);
    console.log(bookItems);
    for (const bookItem of bookItems) {
        const title = bookItem.querySelector("h3").innerText.toLowerCase();
        const author = bookItem.querySelector("p").innerText.toLowerCase();

        if (title.includes(searchInput) || author.includes(searchInput)) {
            bookItem.classList.remove("hidden");
        } else {
            bookItem.classList.add("hidden");
        }
    }
}

// Storage Functions

const SAVED_EVENT = 'savedBook';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung web storage");
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData) {
        const data = JSON.parse(serializedData);
        for (const book of data) {
            books.push(book);
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}
