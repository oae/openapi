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

  series?: Maybe<(Maybe<Series>)[]>;
}

export interface Plugin {
  name?: Maybe<string>;
}

export interface Series {
  airedAt?: Maybe<string>;

  airsDayOfWeek?: Maybe<string>;

  airsTime?: Maybe<string>;

  aliases?: Maybe<(Maybe<string>)[]>;

  banner?: Maybe<string>;

  episodes?: Maybe<(Maybe<Episode>)[]>;

  genre?: Maybe<(Maybe<string>)[]>;

  id?: Maybe<string>;

  imdbId?: Maybe<string>;

  name?: Maybe<string>;

  network?: Maybe<string>;

  overview?: Maybe<string>;

  rating?: Maybe<string>;

  seasons?: Maybe<(Maybe<Season>)[]>;

  status?: Maybe<string>;
}

export interface Episode {
  absoluteNumber?: Maybe<number>;

  airedAt?: Maybe<string>;

  artwork?: Maybe<string>;

  directors?: Maybe<(Maybe<string>)[]>;

  guestStars?: Maybe<(Maybe<string>)[]>;

  imdbId?: Maybe<string>;

  name?: Maybe<string>;

  overview?: Maybe<string>;

  relativeNumber?: Maybe<number>;

  season?: Maybe<number>;

  writers?: Maybe<(Maybe<string>)[]>;
}

export interface Season {
  episodes?: Maybe<(Maybe<Episode>)[]>;

  number?: Maybe<number>;
}

// ====================================================
// Arguments
// ====================================================

export interface SeriesQueryArgs {
  name: string;

  limit?: Maybe<number>;
}
export interface SeasonsSeriesArgs {
  seasonNumber?: Maybe<number>;
}
