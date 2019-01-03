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

  animes?: Maybe<(Maybe<Anime>)[]>;

  trendingAnimes?: Maybe<(Maybe<Anime>)[]>;

  animeCategories?: Maybe<(Maybe<Category>)[]>;
}

export interface Plugin {
  name?: Maybe<string>;
}

export interface Anime {
  title?: Maybe<AnimeTitle>;

  slug?: Maybe<string>;

  synopsis?: Maybe<string>;

  createdAt?: Maybe<DateTime>;

  updatedAt?: Maybe<DateTime>;

  status?: Maybe<string>;

  averageRating?: Maybe<number>;

  startDate?: Maybe<DateTime>;

  endDate?: Maybe<DateTime>;

  posterImage?: Maybe<AnimeImage>;

  coverImage?: Maybe<AnimeImage>;

  episodeCount?: Maybe<number>;

  nsfw?: Maybe<boolean>;

  categories?: Maybe<(Maybe<Category>)[]>;
}

export interface AnimeTitle {
  en?: Maybe<string>;

  enJp?: Maybe<string>;

  jaJp?: Maybe<string>;

  canonicalTitle?: Maybe<string>;
}

export interface AnimeImage {
  tiny?: Maybe<string>;

  small?: Maybe<string>;

  medium?: Maybe<string>;

  large?: Maybe<string>;

  original?: Maybe<string>;
}

export interface Category {
  title?: Maybe<string>;

  description?: Maybe<string>;

  slug?: Maybe<string>;

  nsfw?: Maybe<boolean>;

  cover?: Maybe<AnimeImage>;

  createdAt?: Maybe<DateTime>;

  updatedAt?: Maybe<DateTime>;
}

// ====================================================
// Arguments
// ====================================================

export interface AnimesQueryArgs {
  limit?: Maybe<number>;

  skip?: Maybe<number>;
}
export interface AnimeCategoriesQueryArgs {
  limit?: Maybe<number>;

  skip?: Maybe<number>;
}
