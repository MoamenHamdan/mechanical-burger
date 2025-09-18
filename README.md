# 🍔 Mechanical Burger

A futuristic burger ordering system with a mechanical/automotive theme, built with React, TypeScript, and Firebase. Features real-time order management, advanced analytics, and a sleek industrial design.

![Mechanical Burger](https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800)

## ✨ Features

### 🎯 Customer Experience
- **Interactive Menu**: Browse burgers with automotive-themed categories
- **Smart Cart System**: Add items, modify quantities, and manage orders
- **Real-time Customization**: Modify burgers with precision engineering
- **Order Tracking**: Real-time status updates from kitchen to completion
- **Lebanese Phone Validation**: Supports local phone number formats
- **Responsive Design**: Optimized for all devices

### 🔧 Admin Dashboard
- **Kitchen Terminal**: Real-time order management with audio notifications
- **Inventory Management**: Full CRUD operations for burgers, categories, and customizations
- **Advanced Analytics**: Comprehensive reporting and data visualization
- **Order History**: Complete audit trail with deleted orders tracking
- **Multi-level Authentication**: Basic and advanced admin access levels
- **Real-time Updates**: Live order status changes with sound alerts

### 🚀 Technical Features
- **Real-time Database**: Firebase Firestore with live subscriptions
- **Optimized Performance**: Smart caching and lazy loading
- **Type Safety**: Full TypeScript implementation
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **PWA Ready**: Optimized for mobile installation
- **Security**: Input validation and sanitization

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Storage, Hosting)
- **State Management**: React Hooks with custom data layer
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mechanical-burger.git
   cd mechanical-burger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Firebase Storage
   - Enable Firebase Hosting
   - Copy your Firebase config

4. **Environment Configuration**
   
   Update `src/config/firebase.ts` with your Firebase configuration:
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 🔐 Admin Access

### Basic Admin
- Access kitchen terminal and order management
- Default password can be set via environment variables

### Advanced Admin
- Full system management (burgers, categories, customizations)
- Advanced analytics and reporting
- Requires separate authentication

### URL-based Admin Access
Use the hash-based admin access: `https://yoursite.com/#admin-<token>`

## 📱 Usage Guide

### For Customers
1. **Browse Menu**: Use gear navigation to filter by categories
2. **Customize Orders**: Click "Customize" to modify any burger
3. **Add to Cart**: Build your order with multiple items
4. **Checkout**: Provide name, phone, and order type
5. **Track Order**: Receive real-time status updates

### For Staff (Kitchen Terminal)
1. **View Incoming Orders**: See all pending orders with details
2. **Start Assembly**: Move orders to "preparing" status
3. **Mark Ready**: Complete orders and notify customers
4. **Audio Alerts**: Automatic notifications for new orders

### For Managers (Admin Panel)
1. **Manage Inventory**: Add/edit burgers, categories, customizations
2. **View Analytics**: Track sales, popular items, customer data
3. **Order History**: Complete audit trail with search and filters
4. **System Settings**: Configure passwords and access levels

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin dashboard components
│   ├── customer/        # Customer-facing components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── services/            # Firebase and API services
├── types/               # TypeScript type definitions
├── config/              # Configuration files
└── images/              # Static assets
```

## 🔧 Key Components

### Data Layer
- **useFirebaseData**: Main data hook with caching and real-time updates
- **firebaseService**: CRUD operations for all entities
- **deletedOrdersService**: Audit trail for deleted orders

### Customer Components
- **CustomerView**: Main customer interface
- **BurgerCard**: Individual burger display with customization
- **CartPage**: Shopping cart and checkout
- **CustomizationModal**: Burger modification interface

### Admin Components
- **AdminView**: Main admin dashboard
- **KitchenTerminal**: Real-time order management
- **BurgerManagement**: Inventory management
- **SuperadminQueries**: Advanced analytics

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#ff6b35) - Energy and appetite
- **Secondary**: Blue (#0ea5e9) - Technology and precision  
- **Accent**: Gray (#1a1a1a) - Industrial and modern
- **Success**: Green (#2ed573) - Completed orders
- **Warning**: Yellow (#ffd700) - Pending actions
- **Error**: Red (#ff4757) - Alerts and deletions

### Typography
- **Headers**: Bold, mechanical styling
- **Body**: Clean, readable sans-serif
- **Monospace**: Order IDs and technical data

### Animations
- **Gear Rotations**: Category navigation
- **Piston Movements**: Loading states
- **Pulse Effects**: Real-time updates
- **Hover States**: Interactive feedback

## 🔒 Security Features

- **Input Sanitization**: All user inputs are cleaned
- **Phone Validation**: Lebanese number format validation
- **Admin Authentication**: Multi-level access control
- **Firebase Rules**: Server-side security rules
- **XSS Protection**: Content sanitization

## 📊 Analytics & Reporting

### Available Metrics
- **Revenue Tracking**: Total sales and trends
- **Order Analytics**: Volume, average value, completion rates
- **Product Performance**: Best sellers and category analysis
- **Customer Insights**: Repeat customers and preferences
- **Time Analysis**: Peak hours and daily patterns

### Export Options
- **JSON Export**: Complete data export for external analysis
- **Date Filtering**: Custom time range reports
- **Category Filtering**: Segment-specific analytics

## 🚀 Deployment

### Firebase Hosting
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Project**
   ```bash
   firebase init hosting
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Environment Variables
Set these in your deployment environment:
- `VITE_ADMIN_PASSWORD`: Basic admin password
- `VITE_ADVANCED_ADMIN_PASSWORD`: Advanced admin password
- `VITE_ADMIN_HASH`: URL-based admin access token

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation
- Maintain responsive design

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection Issues**
- Verify Firebase configuration
- Check network connectivity
- Ensure Firestore rules allow access

**Admin Access Problems**
- Clear browser cache and localStorage
- Verify password environment variables
- Check URL hash format

**Performance Issues**
- Clear application cache
- Check network tab for slow requests
- Verify Firebase quota limits

**Mobile Display Issues**
- Test on actual devices
- Check viewport meta tag
- Verify touch interactions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Moamen Hamdan**
- Portfolio: [moamenhamdanportfolio.web.app](https://moamenhamdanportfolio.web.app/)
- GitHub: [@moamenhamdan](https://github.com/moamenhamdan)

## 🙏 Acknowledgments

- **Firebase**: For the excellent backend-as-a-service platform
- **React Team**: For the amazing frontend framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide**: For the beautiful icon library
- **Pexels**: For the high-quality stock images

## 📈 Roadmap

### Upcoming Features
- [ ] **Multi-language Support**: Arabic and English
- [ ] **Payment Integration**: Stripe/PayPal support
- [ ] **Loyalty Program**: Customer rewards system
- [ ] **Inventory Tracking**: Stock management
- [ ] **Delivery Integration**: Third-party delivery services
- [ ] **Mobile App**: React Native version
- [ ] **AI Recommendations**: Smart menu suggestions
- [ ] **Voice Orders**: Speech-to-text ordering

### Performance Improvements
- [ ] **Service Worker**: Offline functionality
- [ ] **Image Optimization**: WebP conversion and lazy loading
- [ ] **Bundle Splitting**: Code splitting for faster loads
- [ ] **CDN Integration**: Global content delivery

---

<div align="center">
  <p>Built with ❤️ and ⚙️ by <a href="https://moamenhamdanportfolio.web.app/">Moamen Hamdan</a></p>
  <p>© 2024 Mechanical Burger. All rights reserved.</p>
</div>