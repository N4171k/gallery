# Gallery App with Appwrite

A modern image gallery application built with React, Node.js, and Tailwind CSS, using Appwrite for storage and authentication.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Appwrite instance

## Appwrite Setup

1. Create a new Appwrite project
2. Create a new storage bucket for images
3. Create a user account for authentication
4. Get the following credentials from your Appwrite project:
   - Project ID
   - Endpoint URL
   - API Key

## Configuration

1. Replace the following placeholders in `src/App.js`:
   - `YOUR_APPWRITE_ENDPOINT` with your Appwrite endpoint URL
   - `YOUR_PROJECT_ID` with your Appwrite project ID

2. Replace the following placeholders in `src/components/Gallery.js`:
   - `YOUR_BUCKET_ID` with your Appwrite storage bucket ID

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- User authentication
- Image upload
- Responsive image gallery
- Modern UI with Tailwind CSS
- Secure storage with Appwrite

## Technologies Used

- React
- Node.js
- Tailwind CSS
- Appwrite
- React Router 