## Overview

Dibimbing Food is a modern web application for discovering, creating, and managing food recipes. Built with Next.js and styled with Tailwind CSS, it features a sleek UI with eye-catching animations powered by Framer Motion. This project was created as part of the Dibimbing coding bootcamp.

## Features

- **User Authentication**

  - User registration and login
  - JWT authentication
  - Remember me functionality
  - Secure password handling

- **Food Management**

  - Browse food items with search functionality
  - View detailed food information
  - Create new food entries
  - Update existing food entries
  - Delete food entries
  - Upload food images

- **Modern UI/UX**
  - Glass morphism design elements
  - Responsive layout for mobile and desktop
  - Smooth animations and transitions
  - Interactive elements with hover effects
  - Toast notifications for user feedback

## Tech Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Next.js Router
- **Animations**: Framer Motion
- **Notifications**: React Toastify
- **HTTP Client**: Axios
- **Image Handling**: Next Image

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.x or higher)
- npm (v6.x or higher) or yarn (v1.22.x or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/dibimbing-food.git
   cd dibimbing-food
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the project root and add the following environment variables:

   ```
   NEXT_PUBLIC_API_URL=https://api-bootcamp.do.dibimbing.id/api/v1
   NEXT_PUBLIC_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to http://localhost:3000

## Project Structure

```
dibimbing-food/
├── components/            # React components
│   ├── FoodCard.jsx       # Card component for displaying food items
│   ├── FoodForm.jsx       # Form for creating/editing food items
│   └── Navbar.jsx         # Navigation bar component
├── pages/                 # Next.js pages
│   ├── _app.js            # Custom App component
│   ├── login.js           # Authentication page
│   ├── foods/             # Food-related pages
│   │   ├── index.js       # Food listing page
│   │   ├── [id].js        # Food detail page
│   │   └── create.js      # Food creation page
├── public/                # Static assets
│   └── images/            # Image files
├── styles/                # Global styles
│   └── globals.css        # Global CSS file
├── utils/                 # Utility functions
│   ├── api.js             # API client and endpoints
│   └── auth.js            # Authentication utilities
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Project dependencies
```

## Authentication

The application uses JWT (JSON Web Token) for authentication. The authentication flow is as follows:

1. User registers or logs in via the `/login` page
2. On successful authentication, a JWT token is returned from the API
3. The token is stored in localStorage for persistent sessions
4. The token is included in the headers of subsequent API requests
5. Protected routes check for the token before rendering

## API Integration

The application integrates with a RESTful API provided by Dibimbing. The API client is configured in `utils/api.js` with the following endpoints:

- Authentication:

  - `/login` - User login
  - `/register` - User registration

- Food Management:
  - GET `/foods` - Get all food items
  - GET `/foods/:id` - Get a specific food item
  - POST `/foods` - Create a new food item
  - PUT `/foods/:id` - Update an existing food item
  - DELETE `/foods/:id` - Delete a food item

## Styling and UI Components

The application features a modern, responsive design with a dark theme that includes:

1. **Glassmorphism effect**: Transparent/blurred backgrounds with border highlights
2. **Gradient text and buttons**: Eye-catching color gradients for key elements
3. **Animated transitions**: Smooth page transitions and hover effects
4. **Toast notifications**: User feedback for actions like creating, updating, and deleting foods

## Responsive Design

The application is fully responsive and optimized for:

- Mobile phones (< 640px)
- Tablets (641px - 1024px)
- Desktops (> 1024px)

## Future Enhancements

- Add user profile management
- Implement favorites and rating system
- Add category filtering
- Enhance search with filters and sorting
- Implement social sharing functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Dibimbing](https://dibimbing.id/) for providing the bootcamp and API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React Toastify](https://fkhadra.github.io/react-toastify/) for toast notifications
