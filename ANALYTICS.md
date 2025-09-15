# QRGen Analytics Features

## Analytics Dashboard Implementation

The QRGen analytics dashboard provides comprehensive tracking and visualization of QR code performance metrics.

### Features Implemented

#### ✅ Core Analytics Features

- **Real-time Analytics Dashboard**: Complete analytics page with charts and metrics
- **QR Code Tracking**: Automatic storage of QR code metadata when generated
- **Scan Analytics**: Framework for tracking QR code scans with device/browser info
- **Data Visualization**: Charts showing scans over time, device types, QR code types, and top performers
- **Responsive Design**: Mobile-optimized analytics dashboard

#### ✅ Data Collection

- **QR Code Generation Tracking**: Stores metadata when QR codes are created
- **Scan Event Tracking**: Collects user agent, device type, timezone, session info
- **User Association**: Links all analytics data to authenticated users
- **Firestore Integration**: Scalable cloud database for analytics storage

#### ✅ Visualization Components

- **Metrics Cards**: Total scans, QR codes, daily/weekly views
- **Time Series Charts**: Scans over time with area charts
- **Distribution Charts**: Pie charts for QR code types and device breakdown
- **Performance Rankings**: Top performing QR codes list
- **Recent Activity**: Table of recent scan events

### Usage Instructions

#### Accessing Analytics

1. Log in to your QRGen account
2. Navigate to the "Analytics" page from the main navigation
3. View your QR code performance metrics and charts

#### Creating Sample Data (Development)

For testing and demonstration purposes, you can create sample analytics data:

1. Open browser developer console on the Analytics page
2. Run: `window.createSampleData()`
3. Confirm the action to create sample QR codes and scan data
4. The dashboard will refresh automatically with new data

#### Understanding the Metrics

**Overview Cards:**

- **Total Scans**: Lifetime scans across all your QR codes
- **QR Codes**: Total number of QR codes you've created
- **Today**: Number of scans today
- **This Week**: Number of scans in the last 7 days

**Charts:**

- **Scans Over Time**: Daily scan trends for selected date range
- **QR Type Distribution**: Breakdown by QR code type (URL, WiFi, Contact, Text)
- **Device Types**: Mobile vs Desktop vs Tablet usage
- **Top Performers**: Your most scanned QR codes

### Technical Implementation

#### Database Schema

**QR Codes Collection (`qrcodes`)**

```javascript
{
  userId: string,           // User who created the QR code
  type: string,            // url, wifi, contact, text
  content: string,         // The actual QR code content
  title: string,           // Display title for the QR code
  settings: {              // Generation settings
    color: string,
    bgColor: string,
    size: number
  },
  createdAt: timestamp,    // When QR code was created
  scanCount: number,       // Total number of scans
  lastScannedAt: timestamp // Most recent scan time
}
```

**Analytics Collection (`analytics`)**

```javascript
{
  qrCodeId: string,        // Reference to the QR code
  timestamp: timestamp,     // When the scan occurred
  userAgent: string,       // Browser/device information
  language: string,        // User's language preference
  platform: string,       // Operating system
  timezone: string,        // User's timezone
  sessionId: string,       // Session identifier
  referrer: string,        // Referring website (if any)
  screenResolution: string, // Device screen size
  source: string           // Source of the scan (for tracking)
}
```

#### Scan Tracking Integration

The analytics system includes a tracking utility (`analytics.js`) that can be integrated with:

1. **Direct QR Code Scans**: When QR codes are scanned via camera apps
2. **URL Shortener Service**: For trackable redirect URLs
3. **Website Integration**: When QR codes are displayed on websites
4. **Mobile Apps**: Native app QR code scanning

**Example Usage:**

```javascript
import { trackQRScan } from "./analytics";

// Track a QR code scan
await trackQRScan("qrCodeId123", {
  source: "mobile_app",
  campaign: "summer_2025",
});
```

### Performance Considerations

- **Firestore Queries**: Optimized queries with proper indexing
- **Data Aggregation**: Client-side processing for responsive charts
- **Pagination**: Limited to reasonable data ranges to prevent performance issues
- **Caching**: React state management for efficient re-renders

### Security & Privacy

- **User Isolation**: All analytics data is user-scoped
- **Authentication Required**: Analytics require user login
- **Data Privacy**: No personally identifiable information stored in scans
- **Firestore Rules**: Database rules enforce user access controls

### Future Enhancements

- **Real-time Updates**: Live dashboard updates using Firestore listeners
- **Export Functionality**: CSV/PDF export of analytics data
- **Advanced Filtering**: Date ranges, QR code types, geographic filters
- **Alerts & Notifications**: Threshold-based scan alerts
- **Team Analytics**: Shared analytics for team accounts
- **A/B Testing**: QR code variant performance comparison

### Development Notes

- Sample data creation available in development mode
- Console access to analytics functions for testing
- Chart library: Recharts for responsive visualizations
- Date handling: date-fns for timezone-aware operations
- State management: React hooks with optimized re-renders

---

The analytics dashboard provides a solid foundation for QR code performance tracking and can be extended with additional features as needed.
