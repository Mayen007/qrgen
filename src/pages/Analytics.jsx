import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import Logo from "../components/Logo";
import { createSampleData } from "../sampleData";
import {
  BarChart3,
  Calendar,
  Eye,
  Globe,
  Smartphone,
  TrendingUp,
  Users,
  Activity,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";

export default function Analytics() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalScans: 0,
    totalQRCodes: 0,
    totalViewsToday: 0,
    totalViewsThisWeek: 0,
    scansByDay: [],
    scansByQRType: [],
    scansByDevice: [],
    recentScans: [],
    topQRCodes: [],
  });
  const [dateRange, setDateRange] = useState(7); // Last 7 days
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalyticsData = useCallback(
    async (userId) => {
      try {
        setRefreshing(true);

        // Get QR codes created by the user
        const qrCodesQuery = query(
          collection(db, "qrcodes"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );

        const qrCodesSnapshot = await getDocs(qrCodesQuery);
        const qrCodes = qrCodesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Get all scans for user's QR codes
        const qrCodeIds = qrCodes.map((qr) => qr.id);
        let allScans = [];

        if (qrCodeIds.length > 0) {
          const scansQuery = query(
            collection(db, "analytics"),
            where("qrCodeId", "in", qrCodeIds),
            orderBy("timestamp", "desc")
          );

          const scansSnapshot = await getDocs(scansQuery);
          allScans = scansSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        // Process analytics data
        const processedData = processAnalyticsData(
          qrCodes,
          allScans,
          dateRange
        );
        setAnalyticsData(processedData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setRefreshing(false);
      }
    },
    [dateRange]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
        fetchAnalyticsData(user.uid);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, fetchAnalyticsData]);

  const processAnalyticsData = (qrCodes, scans, days) => {
    const now = new Date();
    const startDate = startOfDay(subDays(now, days));
    const endDate = endOfDay(now);

    // Filter scans within date range
    const recentScans = scans.filter((scan) => {
      const scanDate = scan.timestamp.toDate();
      return scanDate >= startDate && scanDate <= endDate;
    });

    // Calculate basic metrics
    const totalScans = scans.length;
    const totalQRCodes = qrCodes.length;
    const totalViewsToday = scans.filter((scan) => {
      const scanDate = scan.timestamp.toDate();
      return scanDate >= startOfDay(now) && scanDate <= endOfDay(now);
    }).length;

    const weekStart = startOfDay(subDays(now, 7));
    const totalViewsThisWeek = scans.filter((scan) => {
      const scanDate = scan.timestamp.toDate();
      return scanDate >= weekStart;
    }).length;

    // Group scans by day
    const scansByDay = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, "MMM dd");
      const dayScans = recentScans.filter((scan) => {
        const scanDate = scan.timestamp.toDate();
        return format(scanDate, "MMM dd") === dateStr;
      });
      scansByDay.push({
        date: dateStr,
        scans: dayScans.length,
        uniqueUsers: new Set(dayScans.map((s) => s.sessionId || s.userAgent))
          .size,
      });
    }

    // Group scans by QR type
    const typeGroups = {};
    recentScans.forEach((scan) => {
      const qrCode = qrCodes.find((qr) => qr.id === scan.qrCodeId);
      if (qrCode) {
        const type = qrCode.type || "unknown";
        typeGroups[type] = (typeGroups[type] || 0) + 1;
      }
    });

    const scansByQRType = Object.entries(typeGroups).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      scans: count,
    }));

    // Group scans by device type
    const deviceGroups = { mobile: 0, desktop: 0, tablet: 0, other: 0 };
    recentScans.forEach((scan) => {
      const userAgent = scan.userAgent || "";
      if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
        if (/iPad|Tablet/.test(userAgent)) {
          deviceGroups.tablet++;
        } else {
          deviceGroups.mobile++;
        }
      } else if (/Windows|Macintosh|Linux/.test(userAgent)) {
        deviceGroups.desktop++;
      } else {
        deviceGroups.other++;
      }
    });

    const scansByDevice = Object.entries(deviceGroups)
      .map(([device, count]) => ({
        device: device.charAt(0).toUpperCase() + device.slice(1),
        scans: count,
      }))
      .filter((item) => item.scans > 0);

    // Top QR codes by scans
    const qrScanCounts = {};
    recentScans.forEach((scan) => {
      qrScanCounts[scan.qrCodeId] = (qrScanCounts[scan.qrCodeId] || 0) + 1;
    });

    const topQRCodes = Object.entries(qrScanCounts)
      .map(([qrCodeId, scanCount]) => {
        const qrCode = qrCodes.find((qr) => qr.id === qrCodeId);
        return {
          id: qrCodeId,
          title:
            qrCode?.title ||
            qrCode?.content?.substring(0, 30) + "..." ||
            "Unknown QR Code",
          type: qrCode?.type || "unknown",
          scans: scanCount,
        };
      })
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 5);

    return {
      totalScans,
      totalQRCodes,
      totalViewsToday,
      totalViewsThisWeek,
      scansByDay,
      scansByQRType,
      scansByDevice,
      recentScans: recentScans.slice(0, 10),
      topQRCodes,
    };
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshData = () => {
    if (user) {
      fetchAnalyticsData(user.uid);
    }
  };

  const handleCreateSampleData = async () => {
    if (
      user &&
      window.confirm(
        "Create sample analytics data? This will add test QR codes and scan data to your account."
      )
    ) {
      try {
        await createSampleData(user.uid);
        refreshData(); // Refresh after creating sample data
        alert("Sample data created successfully!");
      } catch (error) {
        console.error("Error creating sample data:", error);
        alert("Error creating sample data. Check console for details.");
      }
    }
  };

  // Expose sample data function in development
  if (import.meta.env.DEV) {
    window.createSampleData = () => handleCreateSampleData();
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <Logo />
            </Link>

            <nav className="hidden md:flex space-x-8 items-center">
              <Link
                to="/features"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                Features
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                Pricing
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                Contact
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
              {user && (
                // Authenticated user navigation
                <div className="flex items-center space-x-6">
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                  >
                    Generator
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </Link>
                  <Link
                    to="/analytics"
                    className="text-blue-600 font-medium transition-colors duration-200 relative group"
                  >
                    Analytics
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-100 transition-transform duration-200"></span>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={refreshData}
                      disabled={refreshing}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                      title="Refresh data"
                    >
                      <RefreshCw
                        className={`h-5 w-5 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                      />
                    )}
                    <span className="text-gray-700 font-medium max-w-32 truncate">
                      {user.displayName || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-500 hover:text-red-600 transition-colors duration-200 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 right-0 bottom-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Navigation Menu */}
          <div className="relative bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
            {/* Header with close button */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <Link
                to="/"
                className="flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Logo />
              </Link>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="px-6 py-6 space-y-4">
              <Link
                to="/features"
                className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {user && (
                // Authenticated user mobile navigation
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <Link
                    to="/dashboard"
                    className="block text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Generator
                  </Link>
                  <Link
                    to="/analytics"
                    className="block text-blue-600 font-medium py-3 px-4 rounded-lg bg-blue-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>

                  {/* Refresh button */}
                  <button
                    onClick={() => {
                      refreshData();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={refreshing}
                    className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <RefreshCw
                      className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
                    />
                    <span>Refresh Data</span>
                  </button>

                  {/* User info and sign out */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      {user.photoURL && (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="w-8 h-8 rounded-full border-2 border-gray-200"
                        />
                      )}
                      <span className="text-gray-700 font-medium flex-1 truncate">
                        {user.displayName || user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-red-600 hover:text-red-700 font-medium py-3 px-4 rounded-lg hover:bg-red-50 transition-all duration-200 text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Track your QR code performance and engagement metrics
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(Number(e.target.value));
                  refreshData();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.totalScans.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">QR Codes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.totalQRCodes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.totalViewsToday}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.totalViewsThisWeek}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Scans Over Time */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Scans Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.scansByDay}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorScans)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* QR Code Types */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Scans by QR Type
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.scansByQRType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) =>
                    `${type} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="scans"
                >
                  {analyticsData.scansByQRType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Device Types */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Device Types
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.scansByDevice}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="device" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="scans" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top QR Codes */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Performing QR Codes
            </h3>
            <div className="space-y-4">
              {analyticsData.topQRCodes.length > 0 ? (
                analyticsData.topQRCodes.map((qr, index) => (
                  <div
                    key={qr.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {qr.title}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {qr.type}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {qr.scans}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No QR code data available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Scans
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.recentScans.length > 0 ? (
                  analyticsData.recentScans.map((scan, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        QR-{scan.qrCodeId?.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {scan.qrType || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scan.userAgent?.includes("Mobile")
                          ? "Mobile"
                          : "Desktop"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {scan.timestamp
                          ? format(
                              scan.timestamp.toDate(),
                              "MMM dd, yyyy HH:mm"
                            )
                          : "Unknown"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No scan data available. Generate and share QR codes to see
                      analytics.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
