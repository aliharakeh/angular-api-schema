# Goal

- Create a declarative api schema that is easy to use and understand
- Add Typings to help with IDE autocomplete
- Auto generate api requests from provided config options

## API Schema v1 – Objects, Proxy, & TS Type Gymnastics

- use normal js objects to define api endpoints.
- use proxy to generate api requests.
- use type guards & nested types to shape the api type.
- one final api object to be used in the app.

# API Schema v2 – Class & Proxy Approach

- use classes to define api endpoints.
- use proxy to generate api requests.
- better typing support through the typed classes.
- one final api object to be used in the app.

# API Schema v3 – Functional Approach

- use functions to define api endpoints.
- separate function for different http methods.
- generic typing & clear separation of input/output types (params/body & response).
- split api collections into separate api objects.
- adds response mutations.
