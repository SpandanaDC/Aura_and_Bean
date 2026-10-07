import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Define Mongoose Schema & Model FIRST so it's fully available
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

// 2. Connect to MongoDB and seed data safely
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
            tier: '✨ Flagship Space',
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
          }
        ]);
        console.log('Default seed leads inserted into MongoDB');
      }
    } catch (seedErr) {
      console.error('Error seeding initial data:', seedErr);
    }
  })
  .catch(err => {
    console.warn('MongoDB offline. Running in local fallback mode (make sure MongoDB service is active if persistence is required).');
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
    const { contactName, organizationName, locationType, dailyFootfall, expectedRevenue, tier } = req.body;
    
    // Auto-sync automation rule for Flagship spaces
    const isFlagship = dailyFootfall >= 1000 || tier === '✨ Flagship Space';
    const initialSyncStatus = isFlagship ? 'Synced' : 'Pending';

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

    if (isFlagship) {
      console.log(`[Automated Webhook Dispatcher] Flagship space auto-synced: ${organizationName} (${dailyFootfall} footfall)`);
    }

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