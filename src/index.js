// Your code here
function renderMovies() {
    return fetch("http://localhost:3000/films")
        .then(res => res.json())
        .then(data => {
            const movieTitles = document.getElementById("films");
            const imageMovies = document.getElementById("poster");
            const movieTitle = document.getElementById("title");
            const runTime = document.getElementById("runtime");
            const movieDescription = document.getElementById("film-info");
            const showTime = document.getElementById("showtime");
            const remTickets = document.getElementById("ticket-num");
            const buyTicketButton = document.getElementById("buy-ticket");

            let currentMovie = null;

            movieTitles.innerHTML = "";

            data.forEach(film => {
                const li = document.createElement("li");
                li.className = "film item";
                
                const titleSpan = document.createElement("span");
                titleSpan.textContent = film.title;
                li.appendChild(titleSpan);

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "ui red button tiny";
                li.appendChild(deleteButton);

                movieTitles.appendChild(li);

                titleSpan.addEventListener("click", () => {
                    currentMovie = film;
                    imageMovies.src = film.poster;
                    movieTitle.textContent = film.title;
                    runTime.textContent = `${film.runtime} minutes`;
                    movieDescription.textContent = film.description;
                    showTime.textContent = film.showtime;
                    remTickets.textContent = `${film.capacity - film.tickets_sold} tickets remaining`;

                    if (film.capacity - film.tickets_sold === 0) {
                        buyTicketButton.disabled = true;
                        buyTicketButton.textContent = "Sold out";
                    } else {
                        buyTicketButton.disabled = false;
                        buyTicketButton.textContent = "Buy Ticket";
                    }
                });

                deleteButton.addEventListener("click", () => {
                    li.remove();

                    fetch(`http://localhost:3000/films/${film.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(() => {
                        console.log(`Movie "${film.title}" deleted from the server`);
                    })
                    .catch(error => {
                        console.error(`Error deleting movie "${film.title}":`, error);
                    });
                });
            });

            buyTicketButton.addEventListener("click", () => {
                if (currentMovie && currentMovie.tickets_sold < currentMovie.capacity) {
                    currentMovie.tickets_sold += 1;
                    remTickets.textContent = `${currentMovie.capacity - currentMovie.tickets_sold} tickets remaining`;

                    fetch(`http://localhost:3000/films/${currentMovie.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            tickets_sold: currentMovie.tickets_sold
                        })
                    });

                    if (currentMovie.tickets_sold === currentMovie.capacity) {
                        buyTicketButton.textContent = "Sold out";
                        buyTicketButton.disabled = true;
                    }
                }
            });

    
            const formContainer = document.createElement('div');
            const updateForm = document.createElement('form');
            updateForm.id = 'update-movie-form';

            const newTitleInput = document.createElement('input');
            newTitleInput.type = 'text';
            newTitleInput.placeholder = 'New Title';
            newTitleInput.id = 'new-title';
            newTitleInput.required = true;

            const newRuntimeInput = document.createElement('input');
            newRuntimeInput.type = 'number';
            newRuntimeInput.placeholder = 'New Runtime';
            newRuntimeInput.id = 'new-runtime';
            newRuntimeInput.required = true;

            const updateButton = document.createElement('button');
            updateButton.type = 'submit';
            updateButton.textContent = 'Update Movie';

            updateForm.appendChild(newTitleInput);
            updateForm.appendChild(newRuntimeInput);
            updateForm.appendChild(updateButton);

            formContainer.appendChild(updateForm);
            document.body.appendChild(formContainer);  
            
            updateForm.addEventListener('submit', function(event) {
                event.preventDefault();  

                const newTitle = document.getElementById('new-title').value;
                const newRuntime = document.getElementById('new-runtime').value;

                if (currentMovie) {
                    fetch(`http://localhost:3000/films/${currentMovie.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: newTitle,
                            runtime: newRuntime
                        })
                    })
                    .then(response => response.json())
                    .then(updatedMovie => {
                        movieTitle.textContent = updatedMovie.title;
                        runTime.textContent = `${updatedMovie.runtime} minutes`;

                        document.getElementById('new-title').value = '';
                        document.getElementById('new-runtime').value = '';

                        console.log("Movie updated successfully:", updatedMovie);
                    })
                    .catch(error => {
                        console.error('Error updating the movie:', error);
                    });
                } else {
                    console.log('No movie selected for updating.');
                }
            });

        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
}

document.addEventListener("DOMContentLoaded", renderMovies);
