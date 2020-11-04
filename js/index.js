document.addEventListener("DOMContentLoaded", function() {

    const BOOKURL = 'http://localhost:3000/books'
    const listUl = document.querySelector('ul#list')
    const showDiv = document.querySelector('div#show-panel')

    function renderBook(book) {
        const li = document.createElement('li')
        li.dataset.id = book.id
        li.innerText = book.title
        li.addEventListener('click', (e) => {
            handleShowBook(book)
        })
        listUl.append(li)
    }
    
    function renderBookList() {
        fetch(BOOKURL)
        .then(resp => resp.json())
        .then(books => {
            books.forEach(book => {
                renderBook(book)
            })
        })
    }

    function handleShowBook(book) {
        showDiv.innerHTML = ''

        const thumbnail = document.createElement('img')
        thumbnail.src = book.img_url
        
        const title = document.createElement('h2')
        title.textContent = book.title
        
        const author = document.createElement('h3')
        author.textContent = `by: ${book.author}`

        const subtitle = document.createElement('h4')
        subtitle.textContent = book.subtitle

        const description = document.createElement('p')
        description.textContent = book.description

        const userUl = document.createElement('ul')

        book.users.forEach(user => {
            const li = document.createElement('li')
            li.textContent = user.username
            userUl.append(li)
        })

        const likeButton = document.createElement('button')
        if (book.users.findIndex(user => user.id === 1) >= 0) {
            likeButton.innerText = "UNLIKE"
        } else {
            likeButton.innerText = "LIKE"
        }
        likeButton.addEventListener('click', (e) => {
            handleLike(book, e)
        })

        showDiv.append(thumbnail, title, author, subtitle, description, userUl, likeButton)
    }

    function handleLike(book, e) {
        let currentLikers = book.users
        const index = book.users.findIndex(user => user.id === 1)
        console.log(index, book.users)
        if (index >= 0) {
            currentLikers.splice(index, 1)
            console.log('spliced...', currentLikers)
        } else {
            currentLikers.push({"id":1, "username":"pouros"})
        }
        fetch(BOOKURL+`/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({users: currentLikers})
        })
        .then(resp => resp.json())
        .then(book => {
            handleShowBook(book)
        })
    }

    function init() {
        renderBookList()
    }

    init()


});
