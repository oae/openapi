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

  books?: Maybe<(Maybe<Book>)[]>;

  booksFromAuthor?: Maybe<(Maybe<Book>)[]>;
}

export interface Plugin {
  name?: Maybe<string>;
}

export interface Book {
  title?: Maybe<string>;

  description?: Maybe<string>;

  createdAt?: Maybe<DateTime>;

  lastModifiedAt?: Maybe<DateTime>;

  covers?: Maybe<(Maybe<BookCover>)[]>;

  subjectPlaces?: Maybe<(Maybe<string>)[]>;

  subjectPeople?: Maybe<(Maybe<string>)[]>;

  subjects?: Maybe<(Maybe<string>)[]>;

  isbn?: Maybe<(Maybe<string>)[]>;

  editions?: Maybe<(Maybe<BookEdition>)[]>;

  authors?: Maybe<(Maybe<BookAuthor>)[]>;
}

export interface BookCover {
  small?: Maybe<string>;

  medium?: Maybe<string>;

  large?: Maybe<string>;
}

export interface BookEdition {
  title?: Maybe<string>;

  isbn10?: Maybe<(Maybe<string>)[]>;

  isbn13?: Maybe<(Maybe<string>)[]>;

  publishers?: Maybe<(Maybe<string>)[]>;

  createdAt?: Maybe<DateTime>;

  lastModifiedAt?: Maybe<DateTime>;

  publishDate?: Maybe<string>;

  authors?: Maybe<(Maybe<BookAuthor>)[]>;
}

export interface BookAuthor {
  name?: Maybe<string>;

  createdAt?: Maybe<DateTime>;

  lastModifiedAt?: Maybe<DateTime>;

  birthDate?: Maybe<string>;

  deathDate?: Maybe<string>;

  altNames?: Maybe<(Maybe<string>)[]>;

  personalName?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================

export interface BooksQueryArgs {
  title: string;

  limit?: Maybe<number>;
}
export interface BooksFromAuthorQueryArgs {
  author: string;

  limit?: Maybe<number>;
}
export interface EditionsBookArgs {
  limit?: Maybe<number>;
}
export interface AuthorsBookArgs {
  limit?: Maybe<number>;
}
