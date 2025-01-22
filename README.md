# Video Rental API

This is a backend service for a video rental system built with **NestJS** and **MongoDB**. It allows users to manage videos, calculate rental prices, and create new video records.

## Features

- **Create Video**: Allows users to create new video records with details such as title, type, genre, and additional information.
- **Calculate Price**: Calculates the rental price based on the video type and rental duration (in days).
- **Get Videos**: Fetches a paginated list of videos.
- **Validation**: Ensures required fields are submitted and returns appropriate error messages for invalid data.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **MongoDB**: NoSQL database for storing video records.
- **Jest**: Testing framework for unit and integration tests.

## Installation

### Prerequisites

- **Node.js**: Make sure Node.js is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB**: You will need a running MongoDB instance. You can set up MongoDB locally or use a cloud service like MongoDB Atlas.

### Steps to Run the Project

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```
