import express from 'express';
const app = express();
app.use(express.json());
app.use(express.static('public'));

// --- Mock APIs used by tests ---
app.post('/api/iframe/save', (req, res) => {
  // Always succeed (tests may override via page.route to force 500)
  res.json({ status: 'ok', savedAt: Date.now() });
});

app.post('/api/upload', (req, res) => {
  res.json({ status: 'ok', id: 'file_123' });
});

app.post('/api/orders', (req, res) => {
  res.json({ status: 'ok', orderId: 1001 });
});

app.post('/api/cart', (req, res) => {
  res.json({ status: 'ok', cartId: 42 });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Local demo site listening on http://localhost:${port}`));
