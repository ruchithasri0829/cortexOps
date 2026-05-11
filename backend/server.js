const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all in dev
    methods: ["GET", "POST"]
  }
});

let isEmergencyMode = false;

const initialAssets = [
  {
    id: 'a1', name: 'Conveyor Belt', status: 'normal', metrics: [
      { label: 'Speed', value: 1.2, unit: 'm/s' },
      { label: 'Load', value: 450, unit: 'kg' }
    ]
  },
  {
    id: 'a2', name: 'Cooling Pump', status: 'normal', metrics: [
      { label: 'Flow Rate', value: 120, unit: 'L/min' },
      { label: 'Temp', value: 45, unit: '°C' }
    ]
  },
  {
    id: 'a3', name: 'Boiler', status: 'normal', metrics: [
      { label: 'Pressure', value: 12, unit: 'bar' },
      { label: 'Temp', value: 180, unit: '°C' }
    ]
  },
  {
    id: 'a4', name: 'Pressure Vessel', status: 'normal', metrics: [
      { label: 'Internal P', value: 8.5, unit: 'bar' },
      { label: 'Valve Status', value: 'Open', unit: '' }
    ]
  }
];

let currentAssets = JSON.parse(JSON.stringify(initialAssets));

// Update metrics dynamically
setInterval(() => {
  if (!isEmergencyMode) {
    currentAssets = currentAssets.map(asset => {
      const newMetrics = asset.metrics.map(m => {
        if (typeof m.value === 'number') {
          // Add small jitter
          const jitter = m.value * 0.02 * (Math.random() - 0.5);
          return { ...m, value: Number((m.value + jitter).toFixed(1)) };
        }
        return m;
      });
      return { ...asset, metrics: newMetrics };
    });
  }
  
  io.emit('telemetry_update', currentAssets);
}, 2000);

// API Endpoints
app.post('/api/simulate-incident', (req, res) => {
  isEmergencyMode = true;
  
  const newAlarms = [
    { id: 'al1', message: 'Cooling Flow Dropped below threshold', tier: 'critical', assetId: 'a2', timestamp: new Date(), rootCauseId: 'rc1' },
    { id: 'al2', message: 'Pump Cavitation Detected', tier: 'critical', assetId: 'a2', timestamp: new Date(), rootCauseId: 'rc1' },
    { id: 'al3', message: 'Boiler Temperature Rising', tier: 'watch', assetId: 'a3', timestamp: new Date(), rootCauseId: 'rc1' },
    { id: 'al4', message: 'Valve V-204 sticking', tier: 'watch', assetId: 'a4', timestamp: new Date() },
    { id: 'al5', message: 'Conveyor Load Variance', tier: 'info', assetId: 'a1', timestamp: new Date() },
    { id: 'al6', message: 'Bearing Temp High', tier: 'watch', assetId: 'a2', timestamp: new Date(), rootCauseId: 'rc1' },
    { id: 'al7', message: 'Secondary Cooling Line Pressure Low', tier: 'info', assetId: 'a2', timestamp: new Date(), rootCauseId: 'rc1' },
  ];

  currentAssets = currentAssets.map(a => {
    if (a.id === 'a2') return { ...a, status: 'critical', metrics: [
      { label: 'Flow Rate', value: 15, unit: 'L/min' },
      { label: 'Temp', value: 95, unit: '°C' }
    ]};
    if (a.id === 'a3') return { ...a, status: 'warning', metrics: [
      { label: 'Pressure', value: 14.5, unit: 'bar' },
      { label: 'Temp', value: 210, unit: '°C' }
    ]};
    return a;
  });

  io.emit('incident_triggered', { alarms: newAlarms, assets: currentAssets });
  res.json({ success: true, message: 'Incident simulated' });
});

app.post('/api/resolve-incident', (req, res) => {
  isEmergencyMode = false;
  currentAssets = JSON.parse(JSON.stringify(initialAssets));
  io.emit('incident_resolved', { assets: currentAssets });
  res.json({ success: true, message: 'Incident resolved' });
});

app.get('/api/status', (req, res) => {
  res.json({ isEmergencyMode });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`CortexOps Backend running on port ${PORT}`);
});
