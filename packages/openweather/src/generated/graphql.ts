/* tslint:disable */
export type Maybe<T> = T | null;

export enum Unit {
  Imperial = "IMPERIAL",
  Metric = "METRIC"
}

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

  currentWeatherByCityName?: Maybe<Weather>;

  currentWeatherByGeoLoc?: Maybe<Weather>;
}

export interface Plugin {
  name?: Maybe<string>;
}

export interface Weather {
  geoloc?: Maybe<GeoLocation>;

  condition?: Maybe<WeatherCondition>;

  temperature?: Maybe<number>;

  pressure?: Maybe<string>;

  humidity?: Maybe<string>;

  wind?: Maybe<Wind>;

  cityName?: Maybe<string>;

  estimatedTime?: Maybe<number>;
}

export interface GeoLocation {
  longitude?: Maybe<number>;

  latitude?: Maybe<number>;
}

export interface WeatherCondition {
  name?: Maybe<string>;

  description?: Maybe<string>;
}

export interface Wind {
  speed?: Maybe<number>;

  degree?: Maybe<number>;
}

// ====================================================
// Arguments
// ====================================================

export interface CurrentWeatherByCityNameQueryArgs {
  cityName: string;

  unit?: Maybe<Unit>;
}
export interface CurrentWeatherByGeoLocQueryArgs {
  lat: number;

  lng: number;

  unit?: Maybe<Unit>;
}
