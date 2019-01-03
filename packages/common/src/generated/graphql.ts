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
}

export interface Plugin {
  name?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================
