import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Define Mongoose Schema & Model FIRST
const LeadSchema = new mongoose.Schema({
  contactName: String,
  organizationName: String,
  locationType: String,
  dailyFootfall: Number,
  expectedRevenue: Number,
  tier: String,
  syncStatus: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', LeadSchema);

// 2. Connect to MongoDB and seed default data safely
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aura-and-bean';
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully to Database');
    try {
      const count = await Lead.countDocuments();
      if (count === 0) {
        await Lead.insertMany([
          {
            contactName: 'Sarah Jenkins',
            organizationName: 'Infosys Tech Park',
            locationType: 'Corporate Tech Park',
            dailyFootfall: 3500,
            expectedRevenue: 120000,
            tier: 'Flagship Space',
            syncStatus: 'Synced'
          },
          {
            contactName: 'Rahul Sharma',
            organizationName: 'PES University Campus',
            locationType: 'College Campus',
            dailyFootfall: 850,
            expectedRevenue: 35000,
            tier: 'Campus Partner',
            syncStatus: 'Pending'
          },
          {
            contactName: 'Ananya Iyer',
            organizationName: 'BioSense Institute',
            locationType: 'College Campus',
            dailyFootfall: 95,
            expectedRevenue: 12000,
            tier: 'Micro-Kiosk',
            syncStatus: 'Pending'
          }
        ]);
        console.log('Default tier seed leads inserted into MongoDB');
      }
    } catch (seedErr) {
      console.error('Error seeding initial data:', seedErr);
    }
  })
  .catch(err => {
    console.warn('MongoDB offline. Running in local memory fallback mode.');
  });

// API Routes
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const { contactName, organizationName, locationType, dailyFootfall, expectedRevenue } = req.body;
    
    // Strict 3-Tier Classification & Webhook Rule
    let tier = 'Micro-Kiosk';
    if (dailyFootfall >= 1000) {
      tier = 'Flagship Space';
    } else if (dailyFootfall >= 300) {
      tier = 'Campus Partner';
    }

    // ONLY Flagship spaces auto-sync. Campus & Micro-Kiosk stay Pending for review.
    const initialSyncStatus = dailyFootfall >= 1000 ? 'Synced' : 'Pending';

    const newLead = new Lead({
      contactName,
      organizationName,
      locationType,
      dailyFootfall,
      expectedRevenue,
      tier,
      syncStatus: initialSyncStatus
    });
    
    await newLead.save();
    res.status(201).json(newLead);
  } catch (err) {
    console.error('Error saving inquiry:', err);
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
});

app.post('/api/leads/:id/sync', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { syncStatus: 'Synced' },
      { new: true }
    );
    console.log(`[Webhook Triggered] Payload dispatched for organization: ${updatedLead?.organizationName}`);
    res.json({ success: true, lead: updatedLead });
  } catch (err) {
    res.status(500).json({ error: 'Webhook sync failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@auraandbean.com' && password === 'brew123') {
    res.json({ success: true, token: 'mock-jwt-token-secure-123' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid organizational credentials' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running live on port ${PORT}`));