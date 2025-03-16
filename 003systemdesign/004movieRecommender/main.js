
class Movie {
    #id;
    #title;

    constructor(id, title) {
        this.#id = id;
        this.#title = title;
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }
}

class User {
    #id;
    #name;

    constructor(id, name) {
        this.#id = id;
        this.#name = name;
    }

    getId() {
        return this.#id;
    }
}

const MovieRating = {
    NOT_RATED: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
}

class RatingRegister {
    #userMovies; // Map<UserId, List<Movie>>
    #movieRatings; // Map<MovieId, Map<UserId, Rating>>

    #movies; // List of Movies
    #users; // List of Users

    constructor() {
        this.#userMovies = {};
        this.#movieRatings = {};

        this.#movies = [];
        this.#users = [];
    }

    addRating(user, movie, rating) {
        if (!this.#movieRatings[movie.getId()]) {
            this.#movieRatings[movie.getId()] = {};
            this.#movies.push(movie);
        }
        if (!this.#userMovies[user.getId()]) {
            this.#userMovies[user.getId()] = [];
            this.#users.push(user);
        }
        this.#userMovies[user.getId()].push(movie);
        this.#movieRatings[movie.getId()][user.getId()] = rating;
    }

    getAverageRating(movie) {
        if (!this.#movieRatings[movie.getId()]) {
            return MovieRating.NOT_RATED;
        }
        const ratings = this.#movieRatings[movie.getId()];
        let sum = 0;
        for (const rating of Object.values(ratings)) {
            sum += rating;
        }
        return sum / Object.values(ratings).length;
    }

    getUsers() {
        return this.#users;
    }

    getMovies() {
        return this.#movies;
    }

    getUserMovies(user) {
        if (!this.#userMovies[user.getId()]) {
            return [];
        }
        return this.#userMovies[user.getId()];
    }

    getMovieRatings(movie) {
        if (!this.#movieRatings.hasOwnProperty(movie.getId())) {
            return [];
        }
        return this.#movieRatings[movie.getId()];
    }
}

class MovieRecommendation {
    #movieRatings;

    constructor(ratings) {
        this.#movieRatings = ratings;
    }

    recommendMovie(user) {
        if (this.#movieRatings.getUserMovies(user).length === 0) {
            return this.recommendMovieNewUser();
        } else {
            return this.recommendMovieExistingUser(user);
        }
    }

    // Recommend the movie with the highest average rating
    recommendMovieNewUser() {
        let bestMovie = null;
        let bestRating = 0;
        for (const movie of this.#movieRatings.getMovies()) {
            const rating = this.#movieRatings.getAverageRating(movie);
            if (rating > bestRating) {
                bestMovie = movie;
                bestRating = rating;
            }
        }
        return bestMovie ? bestMovie.getTitle() : null;
    }

    // Recommend highest rated movie from another user with similar interest
    recommendMovieExistingUser(user) {
        let bestMovie = null;
        let similarityScore = Number.MAX_SAFE_INTEGER; // Lower is better

        for (const reviewer of this.#movieRatings.getUsers()) {
            if (reviewer.getId() === user.getId()) {
                continue;
            }
            const score = this.#getSimilarityScore(user, reviewer);
            if (score < similarityScore) {
                similarityScore = score;
                let recommendedMovie = this.#recommendUnwatchedMovie(user, reviewer);
                bestMovie = recommendedMovie ? recommendedMovie : bestMovie;
            }
        }
        return bestMovie ? bestMovie.getTitle() : null;
    }

    #getSimilarityScore(user1, user2) {
        const user1Id = user1.getId(), user2Id = user2.getId();
        const user2Movies = this.#movieRatings.getUserMovies(user2);
        let score = Number.MAX_SAFE_INTEGER; // Lower is better

        for (const movie of user2Movies) {
            const curMovieRatings = this.#movieRatings.getMovieRatings(movie);
            // If user1 also rated the movie, add the difference in ratings
            if (curMovieRatings[user1Id]) {
                score = (score === Number.MAX_SAFE_INTEGER) ? 0 : score;
                score += Math.abs(curMovieRatings[user1Id] - curMovieRatings[user2Id]);
            }
        }
        return score;
    }

    #recommendUnwatchedMovie(user, reviewer) {
        const userId = user.getId(), reviewerId = reviewer.getId();
        let bestMovie = null;
        let bestRating = 0;

        const reviewerMovies = this.#movieRatings.getUserMovies(reviewer);
        for (const movie of reviewerMovies) {
            const curMovieRatings = this.#movieRatings.getMovieRatings(movie);
            // If user has not watched the movie, and the reviewer gave it a high rating, recommend it
            if (!curMovieRatings[userId] && curMovieRatings[reviewerId] > bestRating) {
                bestMovie = movie;
                bestRating = curMovieRatings[reviewerId];
            }
        }
        return bestMovie;
    }
}

const user1 = new User(1, 'User 1');
const user2 = new User(2, 'User 2');
const user3 = new User(3, 'User 3');

const movie1 = new Movie(1, 'Batman Begins');
const movie2 = new Movie(2, 'Liar Liar');
const movie3 = new Movie(3, 'The Godfather');

const ratings = new RatingRegister();
ratings.addRating(user1, movie1, MovieRating.FIVE);
ratings.addRating(user1, movie2, MovieRating.TWO);
ratings.addRating(user2, movie2, MovieRating.TWO);
ratings.addRating(user2, movie3, MovieRating.FOUR);

const recommender = new MovieRecommendation(ratings);

console.log(recommender.recommendMovie(user1)); // The Godfather
console.log(recommender.recommendMovie(user2)); // Batman Begins
console.log(recommender.recommendMovie(user3)); // Batman Begins