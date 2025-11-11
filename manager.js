let books = JSON.parse(localStorage.getItem('books')) || [];
let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

// ✅ Tab Switching
function showSection(section, event) {
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.add('hidden'));
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

  document.getElementById(section).classList.remove('hidden');
  event.target.classList.add('active');

  if (section === 'available') displayBooks();
  else displayBorrowedBooks();
}

// ✅ Display Books
function displayBooks() {
  const tbody = document.querySelector("#booksTable tbody");
  tbody.innerHTML = "";

  if (books.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">No books available yet 📚</td></tr>`;
    return;
  }

  books.forEach(book => {
    const row = document.createElement("tr");
    if (book.qty === 0) row.style.backgroundColor = "#ffe6e6";
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.name}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.shelf}</td>
      <td>${book.qty}</td>
      <td>
        <button class="action" onclick="editBook('${book.id}')">Edit</button>
        <button class="action delete" onclick="deleteBook('${book.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ✅ Add Book
function addBook() {
  const name = document.getElementById("bookName").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const genre = document.getElementById("bookGenre").value.trim();
  const shelf = document.getElementById("bookShelf").value.trim();
  const qty = parseInt(document.getElementById("bookQty").value);

  if (!name || !author || !genre || !shelf || isNaN(qty)) {
    alert("⚠️ Please fill all fields before adding!");
    return;
  }

  const id = "B" + String(books.length + 1).padStart(3, '0');
  books.push({ id, name, author, genre, shelf, qty });
  localStorage.setItem('books', JSON.stringify(books));

  displayBooks();
  document.querySelectorAll("#addBookForm input").forEach(i => i.value = "");
}

// ✅ Delete Book
function deleteBook(id) {
  if (confirm("Are you sure you want to delete this book?")) {
    books = books.filter(b => b.id !== id);
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
  }
}

// ✅ Edit Book
function editBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;

  document.getElementById("bookName").value = book.name;
  document.getElementById("bookAuthor").value = book.author;
  document.getElementById("bookGenre").value = book.genre;
  document.getElementById("bookShelf").value = book.shelf;
  document.getElementById("bookQty").value = book.qty;

  deleteBook(id);
}

// ✅ Search Available Books
function searchBooks() {
  const query = document.getElementById("searchBook").value.toLowerCase();
  const rows = document.querySelectorAll("#booksTable tbody tr");
  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(query) ? "" : "none";
  });
}

// ✅ Display Borrowed Books
function displayBorrowedBooks() {
  const tbody = document.querySelector("#borrowedTable tbody");
  tbody.innerHTML = "";

  if (borrowedBooks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8">No borrowed books found 📖</td></tr>`;
    return;
  }

  borrowedBooks.forEach(b => {
    const row = document.createElement("tr");
    if (b.status === "Overdue") row.style.backgroundColor = "#ffe6e6";
    row.innerHTML = `
      <td>${b.borrowId}</td>
      <td>${b.bookId}</td>
      <td>${b.bookName}</td>
      <td>${b.studentId}</td>
      <td>${b.borrowDate}</td>
      <td>${b.dueDate}</td>
      <td>${b.status}</td>
      <td>
        ${b.status === "Borrowed" ? `<button class="action" onclick="markReturned('${b.borrowId}')">Mark Returned</button>` : ""}
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ✅ Mark Returned
function markReturned(borrowId) {
  const borrowed = borrowedBooks.find(b => b.borrowId === borrowId);
  if (!borrowed) return;

  borrowed.status = "Returned";
  const book = books.find(b => b.id === borrowed.bookId);
  if (book) book.qty += 1;

  localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
  localStorage.setItem('books', JSON.stringify(books));

  displayBorrowedBooks();
  displayBooks();
}

// ✅ Search Borrowed Books
function searchBorrowedBooks() {
  const query = document.getElementById("searchBorrowed").value.toLowerCase();
  const rows = document.querySelectorAll("#borrowedTable tbody tr");
  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(query) ? "" : "none";
  });
}

// Load initial data
displayBooks();
