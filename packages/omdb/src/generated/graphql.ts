/* tslint:disable */
export type Maybe<T> = T | null;

export type DateTime = any;

export type EmailAddress = any;

export type NegativeFloat = any;

export type NegativeInt = any;

export type NonNegativeFloat = any;

export type NonNegativeInt = any;

export type NonPositiveFloat = any;

export type NonPositiveInt = any;

export type PhoneNumber = any;

export type PositiveFloat = any;

export type PositiveInt = any;

export type PostalCode = any;

export type RegularExpression = any;

export type UnsignedFloat = any;

export type UnsignedInt = any;

export type Url = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  plugins?: Maybe<(Maybe<Plugin>)[]>;

  movies?: Maybe<(Maybe<Movie>)[]>;

  movie?: Maybe<Movie>;
}

export interface Plugin {
  name?: Maybe<string>;
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
