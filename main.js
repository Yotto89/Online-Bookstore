var app = new Vue({

	el: "#app",

	data: {
		url: "https://api.jsonbin.io/b/5c1775fca12f574708ea63a4",
		searched: [],
		books: [],
		clickedbook: {},
		selectedsliderbook: [],
		cart: {
			items: []
		},
		links: {
			"index": true,
			"searchedbook": false,
			"title": false,
			"author": false,
			"genre": false,
			"viewcart": false,

		},



	},

	methods: {

		getData: function () { // fetch the data from a my restfull API
			fetch(this.url, {
					method: "GET",
				})
				.then(function (data) {
					return data.json();
				})
				.then(function (myData) {
					app.books = myData.books;
				})
		},


		hideandshow: function (clicklinks) { //function to hide and show either index or searched book
			for (var key in this.links) {
				this.links[key] = false;
			}
			this.links[clicklinks] = true; // set links to true 

		},

		selectedbook: function (book) { // function to select a book and print it on another div
			this.clickedbook = book;
			this.hideandshow("searchedbook");
		},

		getcartbook: function (book) { // function to set all the book to the cart array
			for (var i = 0; i < this.cart.items.length; i++) {
				if (this.cart.items[i].book.id === book.id) {
					return this.cart.items[i];
				}
				console.log(this.cart.items);
			}

		},

		addbooktocart: function (book) { // function to add book to the cart checking if there's availabilty of the product
			var cartitem = this.getcartbook(book);
			if (cartitem != null) {
				cartitem.quantity++;
			} else {
				this.cart.items.push({
					book: book,
					quantity: 1
				});

			}
			book.stock--;
		},

		removebookfromcart: function (cartitem) {
			var index = this.cart.items.indexOf(cartitem);
			if (index !== -1) {
				this.cart.items.splice(index, 0); // splice adds or removes items to or from an array, and returns the removed items.
			}
		},

		increasebookquantity: function (cartitem) { // function to add same book if wanted to; checking stock obv.
			cartitem.book.stock--;
			cartitem.quantity++;

			console.log("increase");
		},

		decreasebookquantity: function (cartitem) { // function to unselect an added book
			cartitem.quantity--;
			cartitem.book.stock++;
			if (cartitem.quantity == 0) {
				this.removebookfromcart(cartitem);
			}
			console.log("decrease");
		},



	},

	computed: {

		Books: function () { // Function to search books, bring all letters from json to lowercase, so the search filter works.
			var searchedBooks = [];
			if (this.searched == "") {
				return this.books;
			} else {
				for (var i = 0; i < this.books.length; i++) {
					if (this.books[i].title.toLowerCase().includes(this.searched.toLowerCase()) || this.books[i].description.toLowerCase().includes(this.searched.toLowerCase())) {
						document.getElementById("noMatchingResult").style.display = "none";
						searchedBooks.push(this.books[i]);
					} else if (searchedBooks.length === 0) {
						document.getElementById("noMatchingResult").style.display = "block";
					}
				}
				return searchedBooks;
			}
		},

		cartTotal: function () { // function to calculate how many items we do have in the cart and their price.
			var total = 0;
			this.cart.items.forEach(function (book) {
				console.log(book.quantity)
				console.log(book)
				console.log(book.book.price.toFixed(2))
				total += (book.quantity * book.book.price.toFixed(2));
			});

			console.log(total)
			return total.toFixed(2);

		},

		IVA: function () { //function to apply the IVA Tax to the result of the last function.
			return (this.cartTotal * 4 / 100);
		},
		
//		getTotal: function () {
//			var totalbooks = 0;
//			totalbooks += (this.cartTotal * this.IVA).toFixed(2);
//			return getTotal.toFixed(2);
//			console.log(getTotal);
//		}

	


	},


	created: function () {
		this.getData();
		document.getElementById("noMatchingResult").style.display = "none";
	}
})
