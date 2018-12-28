/* tslint:disable */
// Generated in 2018-12-28T14:20:15+03:00
export type Maybe<T> = T | null;

// ====================================================
// Types
// ====================================================

export interface Query {
  movies?: Maybe<(Maybe<Movie>)[]>;

  movie?: Maybe<Movie>;
}

export interface Movie {
  title?: Maybe<string>;

  year?: Maybe<string>;

  rated?: Maybe<string>;

  released?: Maybe<string>;

  runtime?: Maybe<string>;

  genre?: Maybe<(Maybe<string>)[]>;

  director?: Maybe<string>;

  writer?: Maybe<string>;

  actors?: Maybe<(Maybe<string>)[]>;

  plot?: Maybe<string>;

  language?: Maybe<(Maybe<string>)[]>;

  country?: Maybe<(Maybe<string>)[]>;

  awards?: Maybe<string>;

  poster?: Maybe<string>;

  boxOffice?: Maybe<string>;

  production?: Maybe<string>;

  website?: Maybe<string>;

  imdb?: Maybe<MovieImdb>;

  metacritic?: Maybe<MovieMetacritic>;

  rottenTomatoes?: Maybe<MovieRottenTomatoes>;
}

export interface MovieImdb {
  id?: Maybe<string>;

  rating?: Maybe<string>;

  votes?: Maybe<string>;
}

export interface MovieMetacritic {
  rating?: Maybe<string>;
}

export interface MovieRottenTomatoes {
  rating?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================

export interface MoviesQueryArgs {
  title: string;

  limit?: Maybe<number>;

  skip?: Maybe<number>;
}
export interface MovieQueryArgs {
  imdbId: string;
}
