# QRGen - Professional QR Code Generator

A modern, full-featured QR code generator built with React, Vite, and Firebase. Generate custom QR codes for URLs, WiFi networks, contact information, and plain text with advanced customization options and a beautiful, responsive design.

![QRGen Logo](./public/favicon.svg)

## ✨ Latest Updates

### 🎨 Complete Visual Design System (v2.1) - _Latest Release_

- **Unified Footer Design**: Professional footer with social media links, organized sections, and consistent branding across all pages
- **Enhanced Mobile Navigation**: Gradient user avatars, improved spacing, backdrop-blur dropdowns, and smooth animations
- **Backdrop-Blur Headers**: Glass-morphism navigation bars that remain visible over all content for better UX
- **Complete Page Consistency**: All 9 pages now feature the same modern design language and visual hierarchy
- **Professional Branding**: Custom SVG logo with gradient styling integrated throughout the application
- **Advanced Responsive Design**: Optimized touch targets, better mobile breakpoints, and enhanced accessibility

### 🚀 Previous Major Updates (v2.0)

- **Modern Gradient Design System**: Beautiful blue-to-purple gradient scheme throughout the application
- **Enhanced User Experience**: Gradient user avatars, smooth animations, and improved interactive elements
- **Landing Page Redesign**: Hero section with gradient backgrounds, animated features, testimonials with live statistics
- **Dashboard Improvements**: Better responsiveness, improved email handling, and enhanced QR preview sizing

## 🚀 Features

### Core QR Generation

- **Multiple QR Code Types**: URLs, Plain Text, WiFi Networks, Contact Cards (vCard)
- **Real-time Preview**: Live QR code generation as you type
- **Color Customization**: Custom foreground and background colors
- **Size Control**: Adjustable QR code size (128px - 512px)
- **Download Options**: Export as PNG or SVG format

### User Interface

- **Modern Design**: Clean, responsive interface with gradient styling
- **Mobile Optimized**: Works seamlessly on all devices
- **Professional Navigation**: Consistent header with backdrop-blur effects
- **User Authentication**: Firebase-powered login/signup system
- **Protected Dashboard**: QR generation requires user account

### Pages & Content

- **Landing Page**: Hero section with feature overview and testimonials
- **Dashboard**: Main QR code generation interface
- **Features Page**: Detailed feature descriptions
- **Pricing Page**: Subscription plans and pricing information
- **Contact Page**: Contact form and company information
- **Legal Pages**: Privacy Policy and Terms of Service
- **Authentication**: Login and signup pages

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite (Latest)
- **Styling**: Tailwind CSS with custom gradient design system
- **UI/UX**: Modern glass-morphism effects, backdrop-blur, and gradient animations
- **Routing**: React Router DOM with protected routes
- **Authentication**: Firebase Auth with enhanced user experience
- **QR Generation**: react-qr-code + qrcode.js for high-quality output
- **Design**: Custom SVG logo, professional iconography, and consistent visual language
- **Typography**: Inter font (Google Fonts) for modern readability

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
│   ├── vite.svg
│   └── favicon.svg             # Custom QRGen logo
├── src/
│   ├── components/
│   │   └── Logo.jsx            # Professional SVG logo component
│   ├── pages/
│   │   ├── LandingPage.jsx     # Enhanced home page with gradients and animations
│   │   ├── Dashboard.jsx       # QR generator with improved responsiveness
│   │   ├── Features.jsx        # Detailed features with modern design
│   │   ├── Pricing.jsx         # Professional pricing plans and FAQ
│   │   ├── Login.jsx           # Enhanced login with gradient backgrounds
│   │   ├── Signup.jsx          # Modern signup with visual improvements
│   │   ├── Contact.jsx         # Contact form with gradient hero section
│   │   ├── Privacy.jsx         # Privacy policy with consistent design
│   │   └── Terms.jsx           # Terms of service with enhanced styling
│   ├── App.jsx                 # Main app with enhanced routing
│   ├── main.jsx                # App entry point
│   ├── firebase.js             # Firebase configuration
│   └── index.css               # Global styles with custom CSS variables
├── package.json
├── vite.config.js
├── tailwind.config.js          # Custom Tailwind configuration
├── postcss.config.cjs          # PostCSS configuration
├── eslint.config.js            # ESLint configuration
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

### Environment Variables

Environment variables are **not required** for this project. Firebase API keys are public by design for client-side applications, and security is managed through Firebase Authentication and Security Rules.

If you prefer using environment variables for organization:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

**Note**: Never commit `.env` files to version control. Add them to `.gitignore`.

## 🎨 Design & Customization

### Visual Design System

- **Modern UI**: Clean gradient design with blue-to-purple color scheme
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Backdrop Blur Effects**: Modern glass-morphism navigation headers
- **Consistent Branding**: Custom SVG logo and unified visual language
- **Smooth Animations**: Hover effects and transitions throughout the interface

### QR Code Customization

- **Color Options**: Choose custom foreground and background colors
- **Size Control**: Adjust QR code dimensions from 128px to 512px
- **Format Options**: Export as PNG for web use or SVG for print
- **QR Code Types**:
  - Website URLs and links
  - Plain text messages
  - WiFi network credentials (SSID, password, security type)
  - Contact information in vCard format (name, phone, email, organization)

## 📱 Responsive Design

QRGen is fully responsive and works on all devices:

- **Mobile-first Design**: Optimized for mobile devices with touch-friendly interfaces
- **Responsive Navigation**: Collapsible mobile menu with backdrop-blur effects
- **Flexible Layouts**: Grid systems that adapt to different screen sizes
- **Touch-Optimized**: Large buttons and improved spacing for mobile users

## 🔒 Security Features

- **Protected Routes**: Dashboard requires user authentication
- **Firebase Security**: Secure user management and data protection
- **Input Validation**: Form validation on all user inputs
- **Data Privacy**: QR content is processed locally and not stored permanently

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

### Future Enhancements

- [ ] QR Code scan analytics and tracking
- [ ] Dynamic QR codes (editable destinations)
- [ ] Logo embedding in QR codes
- [ ] Batch QR code generation
- [ ] Password protection for QR codes
- [ ] API access for developers
- [ ] Team collaboration features
- [ ] Dark mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mayen**

- GitHub: [@Mayen007](https://github.com/Mayen007)
- Email: [Email](mailto:mayenakech9@example.com)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Firebase** for authentication and hosting
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the fast build tool
- **QR Code Libraries** for QR generation functionality

## 📊 Project Stats

- **Pages**: 9 functional pages (Landing, Dashboard, Features, Pricing, Contact, Login, Signup, Privacy, Terms)
- **Authentication**: Firebase-powered user management
- **Responsive**: Mobile-first responsive design
- **QR Types**: 4 supported formats (URL, Text, WiFi, Contact)

---

**Made with ❤️ and ⚡ by the QRGen team**
