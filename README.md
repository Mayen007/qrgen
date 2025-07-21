# QRGen - Stylish QR Code Generator

A modern, full-fe4. **Set up Firebase**

- Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication with Email/Password
- Copy your Firebase config and update `src/firebase.js`

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**ode generator built with React, Vite, and Firebase. Generate custom QR codes for URLs, WiFi networks, contact information, and plain text with advanced customization options.

![QRGen Logo](https://via.placeholder.com/200x60/3B82F6/FFFFFF?text=QRGen)

## 🚀 Features

### Core Functionality

- **Multiple QR Code Types**: URLs, Plain Text, WiFi Networks, Contact Cards (vCard)
- **Full Customization**: Custom colors, sizes, and real-time preview
- **Multiple Export Formats**: Download as PNG or SVG
- **Responsive Design**: Works perfectly on desktop and mobile devices

### User Management

- **Firebase Authentication**: Secure user registration and login
- **Protected Dashboard**: QR generation requires authentication
- **User Profile Management**: Welcome messages and sign-out functionality

### Professional Pages

- **Landing Page**: Hero section, features overview, testimonials
- **Features Page**: Detailed feature explanations with visuals
- **Pricing Page**: Three-tier pricing plans with FAQ section
- **Contact Page**: Professional contact form with company information
- **Legal Pages**: Privacy Policy and Terms of Service

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS (CDN)
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth
- **QR Generation**: react-qr-code + qrcode.js
- **Icons**: SVG icons and emojis
- **Font**: Inter (Google Fonts)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mayen007/qrgen.git
   cd qrgen
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install QR code generation libraries**

   ```bash
   npm install react-qr-code qrcode
   ```

4. **Set up Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Copy your Firebase config and update `src/firebase.js`

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
qrgen/
├── public/
│   └── vite.svg
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx     # Home page with hero and features
│   │   ├── Dashboard.jsx       # QR code generator (protected)
│   │   ├── Features.jsx        # Detailed features page
│   │   ├── Pricing.jsx         # Pricing plans and FAQ
│   │   ├── Login.jsx           # User login form
│   │   ├── Signup.jsx          # User registration form
│   │   ├── Contact.jsx         # Contact form and info
│   │   ├── Privacy.jsx         # Privacy policy
│   │   └── Terms.jsx           # Terms of service
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # App entry point
│   ├── firebase.js             # Firebase configuration
│   └── index.css               # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### Firebase Setup

Update `src/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};
```

### Environment Variables (Optional)

Create a `.env` file for environment-specific configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🎨 QR Code Customization

The QR generator supports extensive customization:

- **Colors**: Custom foreground and background colors
- **Sizes**: Adjustable from 128px to 512px
- **Types**:
  - URLs and links
  - Plain text messages
  - WiFi network credentials
  - Contact information (vCard format)

## 📱 Responsive Design

QRGen is fully responsive with:

- **Mobile-first design**: Optimized for mobile devices
- **Responsive navigation**: Hamburger menu on mobile
- **Flexible layouts**: Grid systems that adapt to screen size
- **Touch-friendly**: Large buttons and touch targets

## 🔒 Security Features

- **Protected Routes**: Dashboard requires authentication
- **Firebase Security**: Secure user management
- **Input Validation**: Form validation on all user inputs
- **Data Privacy**: QR content is not stored permanently

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## 🌟 Usage Examples

### Generate a URL QR Code

1. Sign up/Login to your account
2. Navigate to the Dashboard
3. Select "Website URL" type
4. Enter your URL (e.g., `https://example.com`)
5. Customize colors and size
6. Click "Generate QR Code"
7. Download as PNG or SVG

### Create a WiFi QR Code

1. Select "WiFi Network" type
2. Enter network name (SSID)
3. Enter password
4. Choose security type (WPA/WEP/Open)
5. Generate and download

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for React Router

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Build and deploy: `npm run build && firebase deploy`

## 🛣️ Roadmap

### Planned Features

- [ ] QR Code History/Management
- [ ] Scan Analytics Dashboard
- [ ] Logo embedding in QR codes
- [ ] Batch QR generation
- [ ] API access for developers
- [ ] Team collaboration features
- [ ] Custom branding options

### Upcoming Improvements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social login options
- [ ] Dark mode support
- [ ] More QR code types (SMS, Calendar events)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@Mayen007](https://github.com/Mayen007)
- Email: mayenakech9@example.com

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Firebase** for authentication and hosting
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the fast build tool
- **QR Code Libraries** for QR generation functionality

## 📊 Project Stats

- **Pages**: 9 fully functional pages
- **Components**: Modular and reusable React components
- **Authentication**: Complete user management system
- **Responsive**: Mobile-first responsive design
- **TypeScript Ready**: Easy to convert to TypeScript

---

**Made with ❤️ and ⚡ by the QRGen team**
