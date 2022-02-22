## API Overview

This application is richly built with astonishing features such as rating, reviews, booking, email sending, online payment, Aggregation pipeline, and Geospatial Queries among others.

## API Endpoints

| Methods | Endpoints                                                | Access  |
| ------- | -------------------------------------------------------- | ------- |
| POST    | /api/v1/users/signup                                     | Public  |
| POST    | /api/v1/users/login                                      | Public  |
| POST    | /api/v1/users/forgotPassword                             | Public  |
| PATCH   | /api/v1/users/resetPassword                              | Public  |
| PATCH   | /api/v1/users/updateMyPassword                           | Private |
| GET     | /api/v1/users/:userId                                    | Private |
| GET     | /api/v1/users                                            | Private |
| GET     | /api/v1/users/me                                         | Private |
| PATCH   | /api/v1/users/updateMe                                   | Private |
| PATCH   | /api/v1/users/:userId                                    | Private |
| DELETE  | /api/v1/users/:userId                                    | Private |
| DELETE  | /api/v1/users/deleteMe                                   | Private |
| POST    | /api/v1/tours                                            | Private |
| GET     | /api/v1/tours                                            | Public  |
| GET     | /api/v1/tours/:tourId                                    | Public  |
| PATCH   | /api/v1/tours/:tourId                                    | Private |
| DELETE  | /api/v1/tours/:tourId                                    | Private |
| GET     | /api/v1/tours/top-5-cheap                                | Public  |
| GET     | /api/v1/tours/tour-stats                                 | Public  |
| GET     | /api/v1/tours/monthly-plan/:year                         | Private |
| GET     | /api/v1/tours-within/:distance/center/:latlng/unit/:unit | public  |
| GET     | /api/v1/distances/:latlng/unit/mi                        | Public  |
| POST    | /api/v1/reviews                                          | Private |
| GET     | /api/v1/reviews                                          | Private |
| GET     | /api/v1/reviews/:reviewId                                | Private |
| PATCH   | /api/v1/reviews/:reviewId                                | Private |
| DELETE  | /api/v1/reviews/:reviewId                                | Private |
| POST    | /api/v1/tours/:tourId/reviews                            | Private |
| GET     | /api/v1/tours/:tourId/reviews                            | Private |

# Contributing :computer:

You can fork the repository and send pull request or reach out easily to me via Linkedin :point_right: [Ankit Roy](https://www.linkedin.com/in/ankitroy1602/). If you discover a security vulnerability within the app, please :pray: create an issue. All security vulnerabilities will be promptly addressed and appreciated.
