import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import fsSync from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Persistent database path
const DATA_DIR = path.resolve(__dirname, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Ensure data folder and file exist
if (!fsSync.existsSync(DATA_DIR)) {
  fsSync.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fsSync.existsSync(BOOKINGS_FILE)) {
  fsSync.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Pricing catalog for server-side trusted calculations
const PRICING_CATALOG: Record<string, { name: string; basePrice: number | null; isQuoteRequired: boolean }> = {
  small: { name: 'Small Vehicles (Sedans, Coupes, Compacts)', basePrice: 35, isQuoteRequired: false },
  midsize: { name: 'Mid-Size Vehicles (4-Door, Small Trucks, Crossovers)', basePrice: 45, isQuoteRequired: false },
  large: { name: 'Large Trucks & SUVs (Lifted Trucks, Full-Size SUVs)', basePrice: 50, isQuoteRequired: false },
  rv: { name: 'RVs & Motorhomes', basePrice: null, isQuoteRequired: true },
  semi: { name: 'Semi Trucks', basePrice: null, isQuoteRequired: true },
  utv: { name: 'UTVs — RZRs & Can-Ams', basePrice: null, isQuoteRequired: true }
};

const ADDON_CATALOG: Record<string, { name: string; price: number }> = {
  pet_hair: { name: 'Pet Hair Removal', price: 10 },
  seat_shampoo: { name: 'Seat Shampoo & Extraction', price: 20 },
  engine_bay: { name: 'Engine Bay Cleaning', price: 20 },
  wax_paint_protection: { name: 'Wax / Paint Protection', price: 25 },
  deep_interior: { name: 'Deep Interior Cleaning', price: 30 },
  headlight_restoration: { name: 'Headlight Restoration', price: 30 }
};

interface BookingRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  vehicleCategory: string;
  vehicleCategoryLabel: string;
  vehicleDetails: string;
  baseService: string;
  selectedAddons: Array<{ id: string; name: string; price: number }>;
  addonsTotal: number;
  basePrice: number | null;
  estimatedTotal: number | null;
  isQuoteRequired: boolean;
  serviceLocation: string;
  preferredDate: string;
  preferredTime: string;
  customerNotes: string;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
  notificationStatus: 'sent' | 'failed' | 'pending_configuration';
  notificationDetails: string;
  createdAt: string;
  updatedAt: string;
}

// Read bookings safely
async function getBookings(): Promise<BookingRecord[]> {
  try {
    const raw = await fs.readFile(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(raw) as BookingRecord[];
  } catch (err) {
    console.error('Error reading bookings:', err);
    return [];
  }
}

// Save bookings safely
async function saveBookings(bookings: BookingRecord[]): Promise<void> {
  const tempFile = `${BOOKINGS_FILE}.tmp.${Date.now()}`;
  await fs.writeFile(tempFile, JSON.stringify(bookings, null, 2), 'utf-8');
  await fs.rename(tempFile, BOOKINGS_FILE);
}

// Generate unique booking ID: e.g. GCB-7X2A-94BF
function generateBookingId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GCB-${stamp}-${rand}`;
}

// Send transactional email notification to owner
async function sendOwnerEmailNotification(booking: BookingRecord): Promise<{ success: boolean; status: 'sent' | 'failed' | 'pending_configuration'; message: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const targetEmail = process.env.BOOKING_NOTIFICATION_EMAIL || 'sunahaimaine01@gmail.com';
  const fromEmail = process.env.BOOKING_FROM_EMAIL || 'G Contreras Car Wash <onboarding@resend.dev>';

  if (!apiKey) {
    const logNotice = `[EMAIL NOTIFICATION - SIMULATED LOG]
To: ${targetEmail}
Subject: New Car Detailing Booking — ${booking.customerName} (${booking.vehicleCategoryLabel})
Booking ID: ${booking.id}
Customer: ${booking.customerName}
Phone: ${booking.phone}
Email: ${booking.email || 'None provided'}
Vehicle: ${booking.vehicleDetails} (${booking.vehicleCategoryLabel})
Location: ${booking.serviceLocation}
Date/Time: ${booking.preferredDate} at ${booking.preferredTime}
Addons: ${booking.selectedAddons.map(a => `${a.name} ($${a.price})`).join(', ') || 'None'}
Total: ${booking.isQuoteRequired ? 'Custom Quote Required' : `$${booking.estimatedTotal}`}
Customer Notes: ${booking.customerNotes || 'None'}
Timestamp: ${booking.createdAt}`;

    console.log(logNotice);
    return {
      success: false,
      status: 'pending_configuration',
      message: 'Email notification pending: RESEND_API_KEY environment variable is not configured.'
    };
  }

  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #171615; color: #F3EFE7; border: 1px solid #38332E; border-radius: 8px; overflow: hidden;">
        <div style="background: #101010; padding: 24px; border-bottom: 2px solid #C69A72;">
          <h1 style="color: #F3EFE7; margin: 0; font-size: 22px;">G Contreras Car Wash</h1>
          <p style="color: #C69A72; margin: 4px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">New Mobile Detailing Booking Received</p>
        </div>
        
        <div style="padding: 24px;">
          <div style="background: #201E1B; padding: 16px; border-radius: 6px; border: 1px solid #38332E; margin-bottom: 20px;">
            <p style="margin: 0; color: #B6B0A6; font-size: 13px;">Booking Reference</p>
            <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: bold; color: #C69A72;">${booking.id}</p>
          </div>

          <h3 style="color: #F3EFE7; border-bottom: 1px solid #38332E; padding-bottom: 8px; margin-top: 0;">Customer Information</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6; width: 35%;">Name:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #F3EFE7;">${booking.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6;">Phone:</td>
              <td style="padding: 6px 0;"><a href="tel:${booking.phone.replace(/\D/g, '')}" style="color: #C69A72; text-decoration: none; font-weight: bold;">${booking.phone}</a> (Click to Call)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6;">Email:</td>
              <td style="padding: 6px 0; color: #F3EFE7;">${booking.email || 'None provided'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6;">Service Location:</td>
              <td style="padding: 6px 0; color: #F3EFE7; font-weight: bold;">${booking.serviceLocation}</td>
            </tr>
          </table>

          <h3 style="color: #F3EFE7; border-bottom: 1px solid #38332E; padding-bottom: 8px;">Vehicle & Appointment Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6; width: 35%;">Category:</td>
              <td style="padding: 6px 0; color: #F3EFE7;">${booking.vehicleCategoryLabel}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6;">Vehicle Description:</td>
              <td style="padding: 6px 0; color: #F3EFE7;">${booking.vehicleDetails}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6;">Base Service:</td>
              <td style="padding: 6px 0; color: #F3EFE7;">Standard Full Mobile Hand Wash & Detail Inclusions</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6;">Requested Date:</td>
              <td style="padding: 6px 0; color: #F3EFE7; font-weight: bold;">${booking.preferredDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6;">Requested Time:</td>
              <td style="padding: 6px 0; color: #F3EFE7; font-weight: bold;">${booking.preferredTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #B6B0A6;">Selected Add-ons:</td>
              <td style="padding: 6px 0; color: #F3EFE7;">
                ${booking.selectedAddons.length > 0 ? booking.selectedAddons.map(a => `• ${a.name} (+$${a.price})`).join('<br/>') : 'None'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #B6B0A6;">Estimated Total:</td>
              <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #C69A72;">
                ${booking.isQuoteRequired ? 'Custom Quote Required (Large/Commercial/UTV)' : `$${booking.estimatedTotal}`}
              </td>
            </tr>
          </table>

          ${booking.customerNotes ? `
          <div style="background: #201E1B; padding: 12px; border-radius: 6px; border: 1px solid #38332E; margin-bottom: 20px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #B6B0A6; text-transform: uppercase;">Customer Notes:</p>
            <p style="margin: 0; color: #F3EFE7; font-style: italic;">"${booking.customerNotes}"</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 24px;">
            <a href="tel:${booking.phone.replace(/\D/g, '')}" style="background: #C69A72; color: #101010; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Call Customer Now</a>
          </div>
        </div>
        
        <div style="background: #101010; padding: 16px; text-align: center; font-size: 12px; color: #B6B0A6; border-top: 1px solid #38332E;">
          G Contreras Car Wash · Mobile Detailing serving Bakersfield, Shafter & Wasco · (661) 692-1044
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [targetEmail],
        subject: `New Car Detailing Booking — ${booking.customerName} (${booking.vehicleCategoryLabel})`,
        html: emailHtml
      })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        status: 'sent',
        message: `Notification email dispatched successfully via Resend (ID: ${data.id || 'ok'}).`
      };
    } else {
      const errText = await res.text();
      return {
        success: false,
        status: 'failed',
        message: `Resend error: ${errText}`
      };
    }
  } catch (error: any) {
    return {
      success: false,
      status: 'failed',
      message: `Failed sending email: ${error.message || 'Unknown network error'}`
    };
  }
}

// API Routes

// 1. Submit a new booking
app.post('/api/bookings', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phone,
      email,
      vehicleCategory,
      vehicleDetails,
      serviceLocation,
      preferredDate,
      preferredTime,
      selectedAddonIds = [],
      customerNotes = ''
    } = req.body;

    // Strict validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid customer name (at least 2 characters).' });
    }

    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit phone number so we can confirm your detail.' });
    }

    if (!vehicleCategory || !PRICING_CATALOG[vehicleCategory]) {
      return res.status(400).json({ error: 'Please select a valid vehicle category.' });
    }

    if (!vehicleDetails || typeof vehicleDetails !== 'string' || vehicleDetails.trim().length < 2) {
      return res.status(400).json({ error: 'Please describe your vehicle make and model (e.g. 2022 Chevy Silverado).' });
    }

    if (!serviceLocation || typeof serviceLocation !== 'string' || serviceLocation.trim().length < 3) {
      return res.status(400).json({ error: 'Please provide your service location or address in Bakersfield, Shafter, or Wasco.' });
    }

    if (!preferredDate) {
      return res.status(400).json({ error: 'Please select your preferred service date.' });
    }

    if (!preferredTime) {
      return res.status(400).json({ error: 'Please select your preferred service time window.' });
    }

    // Trusted server-side calculation
    const catConfig = PRICING_CATALOG[vehicleCategory];
    const isQuoteRequired = catConfig.isQuoteRequired;

    // Parse valid add-ons
    const verifiedAddons: Array<{ id: string; name: string; price: number }> = [];
    let addonsTotal = 0;
    if (Array.isArray(selectedAddonIds)) {
      for (const addonId of selectedAddonIds) {
        if (ADDON_CATALOG[addonId]) {
          verifiedAddons.push({
            id: addonId,
            name: ADDON_CATALOG[addonId].name,
            price: ADDON_CATALOG[addonId].price
          });
          addonsTotal += ADDON_CATALOG[addonId].price;
        }
      }
    }

    const estimatedTotal = isQuoteRequired || catConfig.basePrice === null 
      ? null 
      : catConfig.basePrice + addonsTotal;

    const bookingId = generateBookingId();
    const now = new Date().toISOString();

    const newBooking: BookingRecord = {
      id: bookingId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email && typeof email === 'string' && email.includes('@') ? email.trim() : null,
      vehicleCategory,
      vehicleCategoryLabel: catConfig.name,
      vehicleDetails: vehicleDetails.trim(),
      baseService: 'Full Mobile Hand Wash & Detail Inclusions',
      selectedAddons: verifiedAddons,
      addonsTotal,
      basePrice: catConfig.basePrice,
      estimatedTotal,
      isQuoteRequired,
      serviceLocation: serviceLocation.trim(),
      preferredDate,
      preferredTime,
      customerNotes: (customerNotes || '').trim(),
      status: 'new',
      notificationStatus: 'pending_configuration',
      notificationDetails: 'Initializing...',
      createdAt: now,
      updatedAt: now
    };

    // 1. Save to persistent storage first
    const existing = await getBookings();
    existing.unshift(newBooking);
    await saveBookings(existing);

    // 2. Attempt email notification
    const emailResult = await sendOwnerEmailNotification(newBooking);
    newBooking.notificationStatus = emailResult.status;
    newBooking.notificationDetails = emailResult.message;
    await saveBookings(existing);

    return res.status(201).json({
      success: true,
      bookingId: newBooking.id,
      estimatedTotal: newBooking.estimatedTotal,
      isQuoteRequired: newBooking.isQuoteRequired,
      notificationStatus: newBooking.notificationStatus,
      notificationMessage: emailResult.message,
      message: 'Your booking request has been received and securely stored! We will reach out shortly to confirm your detail.'
    });
  } catch (error: any) {
    console.error('Error processing booking:', error);
    return res.status(500).json({ error: 'Server error saving booking. Please call (661) 692-1044 directly.' });
  }
});

// 2. Customer Receipt Lookup (Requires Booking ID + last 4 digits of phone)
app.get('/api/bookings/lookup', async (req: Request, res: Response) => {
  try {
    const { id, last4 } = req.query;
    if (!id || !last4 || typeof id !== 'string' || typeof last4 !== 'string') {
      return res.status(400).json({ error: 'Please supply booking ID and the last 4 digits of your phone number.' });
    }

    const bookings = await getBookings();
    const cleanId = id.trim().toUpperCase();
    const found = bookings.find(b => b.id.toUpperCase() === cleanId);

    if (!found) {
      return res.status(404).json({ error: 'Booking reference not found. Please verify your reference ID.' });
    }

    const cleanCustomerPhone = found.phone.replace(/\D/g, '');
    if (!cleanCustomerPhone.endsWith(last4.trim())) {
      return res.status(403).json({ error: 'Verification failed. Phone number does not match this booking.' });
    }

    // Return sanitized customer receipt
    return res.json({
      id: found.id,
      customerName: found.customerName,
      status: found.status,
      vehicleCategoryLabel: found.vehicleCategoryLabel,
      vehicleDetails: found.vehicleDetails,
      serviceLocation: found.serviceLocation,
      preferredDate: found.preferredDate,
      preferredTime: found.preferredTime,
      selectedAddons: found.selectedAddons,
      estimatedTotal: found.estimatedTotal,
      isQuoteRequired: found.isQuoteRequired,
      createdAt: found.createdAt
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error checking booking status.' });
  }
});

// 3. Admin Authentication & Management
const ADMIN_PIN = process.env.OWNER_ADMIN_PIN || 'contreras2026';

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (pin === ADMIN_PIN) {
    return res.json({ success: true, token: 'gcontreras_authenticated_session' });
  }
  return res.status(401).json({ error: 'Invalid owner access PIN.' });
});

// Middleware for owner endpoints
function requireAdmin(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer gcontreras_authenticated_session' || req.headers['x-admin-pin'] === ADMIN_PIN) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized owner access.' });
}

// Get all bookings (Owner Only)
app.get('/api/admin/bookings', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const bookings = await getBookings();
    const stats = {
      total: bookings.length,
      new: bookings.filter(b => b.status === 'new').length,
      contacted: bookings.filter(b => b.status === 'contacted').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      notificationsPending: bookings.filter(b => b.notificationStatus !== 'sent').length
    };
    return res.json({ stats, bookings });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

// Update booking status (Owner Only)
app.patch('/api/admin/bookings/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const bookings = await getBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    bookings[idx].status = status;
    bookings[idx].updatedAt = new Date().toISOString();
    await saveBookings(bookings);

    return res.json({ success: true, booking: bookings[idx] });
  } catch (error) {
    return res.status(500).json({ error: 'Failed updating booking.' });
  }
});

// Retry Email Notification (Owner Only)
app.post('/api/admin/bookings/:id/resend-notification', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookings = await getBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const emailResult = await sendOwnerEmailNotification(bookings[idx]);
    bookings[idx].notificationStatus = emailResult.status;
    bookings[idx].notificationDetails = emailResult.message;
    bookings[idx].updatedAt = new Date().toISOString();
    await saveBookings(bookings);

    return res.json({ success: emailResult.success, result: emailResult, booking: bookings[idx] });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to resend notification.' });
  }
});

// Test Email Configuration (Owner Only)
app.post('/api/admin/test-email', requireAdmin, async (_req: Request, res: Response) => {
  const apiKey = process.env.RESEND_API_KEY;
  const targetEmail = process.env.BOOKING_NOTIFICATION_EMAIL || 'sunahaimaine01@gmail.com';

  if (!apiKey) {
    return res.status(400).json({
      configured: false,
      message: 'RESEND_API_KEY is not defined in environment variables. Real email dispatch cannot proceed until added.'
    });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.BOOKING_FROM_EMAIL || 'G Contreras Car Wash <onboarding@resend.dev>',
        to: [targetEmail],
        subject: 'G Contreras Car Wash — Notification System Test',
        html: '<div style="background:#101010; color:#F3EFE7; padding:20px; font-family:sans-serif;"><h2 style="color:#C69A72;">Email Service Verified</h2><p>Your G Contreras Car Wash booking notification pipeline is successfully configured!</p></div>'
      })
    });

    if (resendRes.ok) {
      const data = await resendRes.json();
      return res.json({ configured: true, delivered: true, resendId: data.id, target: targetEmail });
    } else {
      const err = await resendRes.text();
      return res.status(502).json({ configured: true, delivered: false, error: err });
    }
  } catch (err: any) {
    return res.status(500).json({ configured: true, delivered: false, error: err.message });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`G Contreras Car Wash server running on port ${PORT}`);
  });
}

startServer();
