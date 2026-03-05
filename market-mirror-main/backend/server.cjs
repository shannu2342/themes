const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const { randomUUID } = require('crypto');

require('dotenv').config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '.env.localhost') });
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const app = express();
const PORT = Number(process.env.PORT || 3001);
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
const STATIC_ADMIN_EMAIL = (process.env.STATIC_ADMIN_EMAIL || 'admin@themevault.com').toLowerCase();
const MAIN_ADMIN_ID = String(process.env.ID || 'MAINADMIN').trim();
const MAIN_ADMIN_PASS = String(process.env.Pass || process.env.PASS || 'ITSMAINPASS#@YES');
const MAIN_ADMIN_ALIAS_EMAIL = `${MAIN_ADMIN_ID.toLowerCase()}@local.admin`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
const FRONTEND_URLS = String(process.env.FRONTEND_URLS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const CORS_ORIGINS = String(process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB_NAME || 'market_mirror';
if (!mongoUri) throw new Error('Missing required MongoDB environment variable. Set MONGODB_URI.');

const mongoClient = new MongoClient(mongoUri);
let db;

const col = (name) => db.collection(name);
const nowIso = () => new Date().toISOString();
const id = (v) => String(v || '').trim();
const pub = (doc) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
};
const bool = (v, fallback = false) => {
  if (v === undefined || v === null || v === '') return fallback;
  return ['true', '1', 'yes', 'on'].includes(String(v).toLowerCase());
};
const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const signAuthToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
const tokenFromReq = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
};

const getUserRole = async (userId) => (await col('user_roles').findOne({ user_id: id(userId) }))?.role || 'user';
const ensureUserRole = async (userId, role = 'user') =>
  col('user_roles').updateOne(
    { user_id: id(userId) },
    { $set: { role, updated_at: nowIso() }, $setOnInsert: { id: randomUUID(), user_id: id(userId), created_at: nowIso() } },
    { upsert: true }
  );

const authRequired = async (req, res, next) => {
  try {
    const token = tokenFromReq(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await col('users').findOne({ id: id(decoded.userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = pub(user);
    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const adminRequired = async (req, res, next) => {
  if ((await getUserRole(req.user.id)) !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  return next();
};

const mapUser = (u) => ({
  id: u.id,
  email: u.email,
  full_name: u.full_name || '',
  user_metadata: { full_name: u.full_name || '' },
  created_at: u.created_at
});

const uploadRoot = path.join(__dirname, 'uploads');
const imageDir = path.join(uploadRoot, 'images');
const fileDir = path.join(uploadRoot, 'files');
[uploadRoot, imageDir, fileDir].forEach((d) => !fs.existsSync(d) && fs.mkdirSync(d, { recursive: true }));
const uploader = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, file.mimetype.startsWith('image/') ? imageDir : fileDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${randomUUID()}${path.extname(file.originalname || '')}`)
  }),
  limits: { fileSize: 100 * 1024 * 1024 }
});

const defaultOrigins = [
  FRONTEND_URL,
  ...FRONTEND_URLS,
  'http://localhost:8080',
  'http://localhost:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5173',
];
const allowedOrigins = new Set([...defaultOrigins, ...CORS_ORIGINS]);
const checkoutFrontendUrl = FRONTEND_URLS[0] || FRONTEND_URL;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadRoot));

// Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const fullName = String(req.body?.fullName || '').trim();
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (email === MAIN_ADMIN_ALIAS_EMAIL) return res.status(403).json({ error: 'This account is reserved for admin login' });
    if (await col('users').findOne({ email })) return res.status(409).json({ error: 'User already exists' });

    const user = { id: randomUUID(), email, password_hash: await bcrypt.hash(password, 10), full_name: fullName, created_at: nowIso(), updated_at: nowIso() };
    await col('users').insertOne(user);
    const role = email === STATIC_ADMIN_EMAIL ? 'admin' : 'user';
    await ensureUserRole(user.id, role);
    return res.json({ token: signAuthToken({ userId: user.id }), user: mapUser(user), isAdmin: role === 'admin' });
  } catch {
    return res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    if (email === MAIN_ADMIN_ALIAS_EMAIL) return res.status(403).json({ error: 'Use admin login with ID and password' });
    const user = await col('users').findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password_hash || ''))) return res.status(401).json({ error: 'Invalid credentials' });
    if (email === STATIC_ADMIN_EMAIL) await ensureUserRole(user.id, 'admin');
    const isAdmin = (await getUserRole(user.id)) === 'admin';
    return res.json({ token: signAuthToken({ userId: user.id }), user: mapUser(user), isAdmin });
  } catch {
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const adminId = String(req.body?.adminId || '').trim();
    const password = String(req.body?.password || '');

    if (!adminId || !password) {
      return res.status(400).json({ error: 'ID and password are required' });
    }

    if (adminId !== MAIN_ADMIN_ID || password !== MAIN_ADMIN_PASS) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const adminEmail = MAIN_ADMIN_ALIAS_EMAIL;
    let user = await col('users').findOne({ email: adminEmail });
    if (!user) {
      user = {
        id: randomUUID(),
        email: adminEmail,
        password_hash: await bcrypt.hash(MAIN_ADMIN_PASS, 10),
        full_name: MAIN_ADMIN_ID,
        created_at: nowIso(),
        updated_at: nowIso()
      };
      await col('users').insertOne(user);
    }

    await ensureUserRole(user.id, 'admin');
    return res.json({ token: signAuthToken({ userId: user.id }), user: mapUser(user), isAdmin: true });
  } catch {
    return res.status(500).json({ error: 'Admin login failed' });
  }
});

app.get('/api/auth/me', authRequired, async (req, res) => res.json({ user: mapUser(req.user), isAdmin: (await getUserRole(req.user.id)) === 'admin' }));
app.post('/api/auth/logout', authRequired, async (req, res) => res.json({ success: true }));

// Public catalog
app.get('/api/categories', async (req, res) => res.json((await col('categories').find({}).sort({ name: 1 }).toArray()).map(pub)));

app.get('/api/products', async (req, res) => {
  try {
    const filter = {};
    if (bool(req.query.activeOnly ?? 'true', true) && !bool(req.query.showInactive, false)) filter.is_active = true;
    if (req.query.featured !== undefined) filter.featured = bool(req.query.featured, false);
    const search = String(req.query.search || '').trim();
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (req.query.categorySlug) {
      const c = await col('categories').findOne({ slug: String(req.query.categorySlug) });
      if (!c) return res.json([]);
      filter.category_id = c.id;
    }
    const sortMap = { 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, popular: { sales_count: -1, created_at: -1 }, newest: { created_at: -1 } };
    let cursor = col('products').find(filter).sort(sortMap[String(req.query.sortBy || 'newest')] || sortMap.newest);
    const limit = num(req.query.limit, 0);
    if (limit > 0) cursor = cursor.limit(limit);
    const products = (await cursor.toArray()).map(pub);
    const catIds = Array.from(new Set(products.map((p) => id(p.category_id)).filter(Boolean)));
    const categories = (await col('categories').find({ id: { $in: catIds } }).toArray()).map(pub);
    const catMap = new Map(categories.map((c) => [id(c.id), c]));
    return res.json(products.map((p) => ({ ...p, category: catMap.get(id(p.category_id)) || null })));
  } catch {
    return res.status(500).json({ error: 'Failed to load products' });
  }
});

app.get('/api/products/:productId', async (req, res) => {
  const product = await col('products').findOne({ id: id(req.params.productId) });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const p = pub(product);
  const c = p.category_id ? await col('categories').findOne({ id: id(p.category_id) }) : null;
  return res.json({ ...p, category: pub(c) });
});

app.get('/api/stats', async (req, res) => {
  const [productsCount, categoriesCount, usersCount] = await Promise.all([
    col('products').countDocuments({ is_active: true }),
    col('categories').countDocuments({}),
    col('users').countDocuments({})
  ]);
  return res.json({ productsCount, categoriesCount, usersCount, downloads: Math.floor(productsCount * 150), creators: Math.floor(usersCount * 0.3) });
});

// User cart/orders
app.get('/api/purchase-status/:productId', authRequired, async (req, res) => {
  const purchase = await col('purchased_products').findOne({ user_id: req.user.id, product_id: id(req.params.productId) });
  return res.json({ already_purchased: Boolean(purchase), purchase_date: purchase?.purchased_at || null });
});

app.get('/api/cart', authRequired, async (req, res) => {
  const items = (await col('cart_items').find({ user_id: req.user.id }).toArray()).map(pub);
  const productIds = Array.from(new Set(items.map((i) => id(i.product_id)).filter(Boolean)));
  const products = (await col('products').find({ id: { $in: productIds } }).toArray()).map(pub);
  const pMap = new Map(products.map((p) => [id(p.id), p]));
  return res.json(items.map((i) => ({ id: i.id, product_id: i.product_id, product: pMap.get(id(i.product_id)) || null })).filter((i) => i.product));
});

app.post('/api/cart', authRequired, async (req, res) => {
  const productId = id(req.body?.product_id);
  if (!productId) return res.status(400).json({ error: 'Missing product_id' });
  if (await col('cart_items').findOne({ user_id: req.user.id, product_id: productId })) return res.status(409).json({ error: 'Product already in cart' });
  await col('cart_items').insertOne({ id: randomUUID(), user_id: req.user.id, product_id: productId, created_at: nowIso(), updated_at: nowIso() });
  return res.json({ success: true });
});

app.delete('/api/cart/:productId', authRequired, async (req, res) => {
  await col('cart_items').deleteMany({ user_id: req.user.id, product_id: id(req.params.productId) });
  return res.json({ success: true });
});
app.delete('/api/cart', authRequired, async (req, res) => {
  await col('cart_items').deleteMany({ user_id: req.user.id });
  return res.json({ success: true });
});

app.get('/api/orders', authRequired, async (req, res) => {
  const orders = (await col('orders').find({ user_id: req.user.id }).sort({ created_at: -1 }).toArray()).map(pub);
  const orderIds = orders.map((o) => o.id);
  const orderItems = (await col('order_items').find({ order_id: { $in: orderIds } }).toArray()).map(pub);
  const productIds = Array.from(new Set(orderItems.map((i) => id(i.product_id)).filter(Boolean)));
  const products = (await col('products').find({ id: { $in: productIds } }).toArray()).map(pub);
  const pMap = new Map(products.map((p) => [id(p.id), p]));
  const byOrder = new Map();
  orderItems.forEach((it) => {
    if (!byOrder.has(it.order_id)) byOrder.set(it.order_id, []);
    byOrder.get(it.order_id).push({ ...it, product: pMap.get(id(it.product_id)) || null });
  });
  return res.json(orders.map((o) => ({ ...o, order_items: byOrder.get(o.id) || [] })));
});

app.get('/api/purchased-products', authRequired, async (req, res) => {
  const purchases = (await col('purchased_products').find({ user_id: req.user.id }).sort({ purchased_at: -1 }).toArray()).map(pub);
  const productIds = Array.from(new Set(purchases.map((p) => id(p.product_id)).filter(Boolean)));
  const products = (await col('products').find({ id: { $in: productIds } }).toArray()).map(pub);
  const pMap = new Map(products.map((p) => [id(p.id), p]));
  return res.json(
    purchases.map((purchase) => {
      const product = pMap.get(id(purchase.product_id));
      if (!product) return null;
      const fileUrl = product.file_url || '';
      const fallbackName = `${String(product.title || 'download').replace(/[^a-zA-Z0-9]/g, '_')}.zip`;
      return {
        id: product.id,
        title: product.title,
        description: product.description || '',
        price: purchase.amount || product.price || 0,
        file_url: fileUrl,
        file_name: fileUrl ? String(fileUrl).split('/').pop() || fallbackName : fallbackName,
        purchase_date: purchase.purchased_at || purchase.created_at,
        order_id: purchase.order_id,
        images: product.images || []
      };
    }).filter(Boolean)
  );
});

app.delete('/api/purchases/:productId', authRequired, async (req, res) => {
  const productId = id(req.params.productId);
  const orderId = id(req.query.order_id || req.body?.order_id);
  await col('purchased_products').deleteMany({ user_id: req.user.id, product_id: productId });
  if (orderId) {
    const items = await col('order_items').find({ order_id: orderId }).toArray();
    await col('order_items').deleteMany({ order_id: orderId });
    if (items.length <= 1) await col('orders').deleteMany({ id: orderId, user_id: req.user.id });
  }
  return res.json({ success: true });
});

// Admin APIs
app.get('/api/admin/stats', authRequired, adminRequired, async (req, res) => {
  const [totalProducts, totalUsers, totalOrders, totalCategories] = await Promise.all([
    col('products').countDocuments({}),
    col('users').countDocuments({}),
    col('orders').countDocuments({}),
    col('categories').countDocuments({})
  ]);
  const recentOrders = (await col('orders').find({}).sort({ created_at: -1 }).limit(5).toArray()).map(pub);
  const recentOrderIds = recentOrders.map((o) => o.id);
  const recentItems = (await col('order_items').find({ order_id: { $in: recentOrderIds } }).toArray()).map(pub);
  const productIds = Array.from(new Set(recentItems.map((i) => id(i.product_id)).filter(Boolean)));
  const products = (await col('products').find({ id: { $in: productIds } }).toArray()).map(pub);
  const pMap = new Map(products.map((p) => [id(p.id), p]));
  const byOrder = new Map();
  recentItems.forEach((item) => {
    if (!byOrder.has(item.order_id)) byOrder.set(item.order_id, []);
    byOrder.get(item.order_id).push({ ...item, products: pMap.get(id(item.product_id)) || null });
  });
  const totalRevenue = (await col('orders').find({}).toArray()).reduce((sum, o) => sum + num(o.total_price, 0), 0);
  return res.json({ totalProducts, totalUsers, totalOrders, totalCategories, recentOrders: recentOrders.map((o) => ({ ...o, order_items: byOrder.get(o.id) || [] })), totalRevenue });
});

app.get('/api/admin/products', authRequired, adminRequired, async (req, res) => {
  const filter = {};
  const search = String(req.query.search || '').trim();
  if (!bool(req.query.showInactive, false)) filter.is_active = true;
  if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
  const products = (await col('products').find(filter).sort({ created_at: -1 }).toArray()).map(pub);
  const catIds = Array.from(new Set(products.map((p) => id(p.category_id)).filter(Boolean)));
  const cats = (await col('categories').find({ id: { $in: catIds } }).toArray()).map(pub);
  const catMap = new Map(cats.map((c) => [id(c.id), c]));
  return res.json(products.map((p) => ({ ...p, category: catMap.get(id(p.category_id)) || null })));
});

app.post('/api/admin/products', authRequired, adminRequired, async (req, res) => {
  const p = req.body || {};
  const product = {
    id: randomUUID(),
    title: String(p.title || '').trim(),
    description: String(p.description || '').trim(),
    price: num(p.price, 0),
    category_id: p.category_id ? id(p.category_id) : null,
    featured: Boolean(p.featured),
    is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
    author: String(p.author || ''),
    live_demo_url: String(p.live_demo_url || ''),
    compatibility: Array.isArray(p.compatibility) ? p.compatibility : [],
    features: Array.isArray(p.features) ? p.features : [],
    images: Array.isArray(p.images) ? p.images : [],
    file_url: String(p.file_url || ''),
    sales_count: num(p.sales_count, 0),
    rating: p.rating ?? null,
    created_at: nowIso(),
    updated_at: nowIso()
  };
  if (!product.title || product.price <= 0) return res.status(400).json({ error: 'Invalid product payload' });
  await col('products').insertOne(product);
  return res.json(product);
});

app.put('/api/admin/products/:id', authRequired, adminRequired, async (req, res) => {
  const productId = id(req.params.id);
  const p = req.body || {};
  const update = {
    title: String(p.title || '').trim(),
    description: String(p.description || '').trim(),
    price: num(p.price, 0),
    category_id: p.category_id ? id(p.category_id) : null,
    featured: Boolean(p.featured),
    is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
    author: String(p.author || ''),
    live_demo_url: String(p.live_demo_url || ''),
    compatibility: Array.isArray(p.compatibility) ? p.compatibility : [],
    features: Array.isArray(p.features) ? p.features : [],
    images: Array.isArray(p.images) ? p.images : [],
    file_url: String(p.file_url || ''),
    updated_at: nowIso()
  };
  const result = await col('products').updateOne({ id: productId }, { $set: update });
  if (!result.matchedCount) return res.status(404).json({ error: 'Product not found' });
  return res.json(pub(await col('products').findOne({ id: productId })));
});

app.patch('/api/admin/products/:id/status', authRequired, adminRequired, async (req, res) => {
  const result = await col('products').updateOne({ id: id(req.params.id) }, { $set: { is_active: Boolean(req.body?.is_active), updated_at: nowIso() } });
  if (!result.matchedCount) return res.status(404).json({ error: 'Product not found' });
  return res.json({ success: true });
});

app.delete('/api/admin/products/:id', authRequired, adminRequired, async (req, res) => {
  const productId = id(req.params.id);
  await Promise.all([
    col('order_items').deleteMany({ product_id: productId }),
    col('cart_items').deleteMany({ product_id: productId }),
    col('purchased_products').deleteMany({ product_id: productId }),
    col('products').deleteMany({ id: productId })
  ]);
  return res.json({ success: true });
});

app.get('/api/admin/orders', authRequired, adminRequired, async (req, res) => {
  const orders = (await col('orders').find({}).sort({ created_at: -1 }).toArray()).map(pub);
  const ids = orders.map((o) => o.id);
  const orderItems = (await col('order_items').find({ order_id: { $in: ids } }).toArray()).map(pub);
  const pIds = Array.from(new Set(orderItems.map((i) => id(i.product_id)).filter(Boolean)));
  const products = (await col('products').find({ id: { $in: pIds } }).toArray()).map(pub);
  const pMap = new Map(products.map((p) => [id(p.id), p]));
  const byOrder = new Map();
  orderItems.forEach((it) => {
    if (!byOrder.has(it.order_id)) byOrder.set(it.order_id, []);
    byOrder.get(it.order_id).push({ ...it, product: pMap.get(id(it.product_id)) || null, products: pMap.get(id(it.product_id)) || null });
  });
  return res.json(orders.map((o) => ({ ...o, order_items: byOrder.get(o.id) || [] })));
});

app.patch('/api/admin/orders/:id/status', authRequired, adminRequired, async (req, res) => {
  const status = String(req.body?.payment_status || '').trim();
  if (!status) return res.status(400).json({ error: 'payment_status is required' });
  const result = await col('orders').updateOne({ id: id(req.params.id) }, { $set: { payment_status: status, updated_at: nowIso() } });
  if (!result.matchedCount) return res.status(404).json({ error: 'Order not found' });
  return res.json({ success: true });
});

app.get('/api/admin/users', authRequired, adminRequired, async (req, res) => {
  const users = (await col('users').find({}).sort({ created_at: -1 }).toArray()).map(pub);
  const roles = (await col('user_roles').find({ user_id: { $in: users.map((u) => id(u.id)) } }).toArray()).map(pub);
  const roleMap = new Map(roles.map((r) => [id(r.user_id), r]));
  return res.json(users.map((u) => ({
    id: u.id,
    user_id: u.id,
    full_name: u.full_name || '',
    email: u.email,
    created_at: u.created_at,
    user_roles: roleMap.get(id(u.id)) ? [{ id: roleMap.get(id(u.id)).id, role: roleMap.get(id(u.id)).role, user_id: u.id }] : []
  })));
});

app.get('/api/admin/categories', authRequired, adminRequired, async (req, res) => res.json((await col('categories').find({}).sort({ name: 1 }).toArray()).map(pub)));
app.post('/api/admin/categories', authRequired, adminRequired, async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const slug = String(req.body?.slug || '').trim();
  if (!name || !slug) return res.status(400).json({ error: 'name and slug are required' });
  if (await col('categories').findOne({ slug })) return res.status(409).json({ error: 'Category slug already exists' });
  const category = { id: randomUUID(), name, slug, description: String(req.body?.description || ''), icon: String(req.body?.icon || ''), created_at: nowIso(), updated_at: nowIso() };
  await col('categories').insertOne(category);
  return res.json(category);
});
app.delete('/api/admin/categories/:id', authRequired, adminRequired, async (req, res) => {
  const categoryId = id(req.params.id);
  await Promise.all([col('categories').deleteMany({ id: categoryId }), col('products').updateMany({ category_id: categoryId }, { $set: { category_id: null, updated_at: nowIso() } })]);
  return res.json({ success: true });
});

app.post('/api/admin/promote-by-email', authRequired, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const targetUser = await col('users').findOne({ email });
  if (!targetUser) return res.status(404).json({ error: 'User not found' });
  const canPromote = (await getUserRole(req.user.id)) === 'admin' || ((await col('user_roles').countDocuments({ role: 'admin' })) === 0 && targetUser.id === req.user.id);
  if (!canPromote) return res.status(403).json({ error: 'Not allowed to promote this user' });
  await ensureUserRole(targetUser.id, 'admin');
  return res.json({ success: true, message: `User ${email} promoted to admin` });
});

app.post('/api/admin/ensure-static', authRequired, async (req, res) => {
  if (String(req.user.email || '').toLowerCase() !== STATIC_ADMIN_EMAIL) return res.json({ success: false, isAdmin: false });
  await ensureUserRole(req.user.id, 'admin');
  return res.json({ success: true, isAdmin: true });
});

// Upload
const baseUrl = (req) => `${req.headers['x-forwarded-proto'] || req.protocol}://${req.headers['x-forwarded-host'] || req.get('host')}`;
app.post('/api/upload/image', authRequired, adminRequired, uploader.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  return res.json({ url: `${baseUrl(req)}/uploads/images/${req.file.filename}` });
});
app.post('/api/upload/file', authRequired, adminRequired, uploader.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  return res.json({ url: `${baseUrl(req)}/uploads/files/${req.file.filename}` });
});

// Payment
app.post('/api/check-purchase-status', async (req, res) => {
  const userId = id(req.body?.user_id);
  const productId = id(req.body?.product_id);
  if (!userId || !productId) return res.status(400).json({ error: 'Missing user_id or product_id' });
  const existing = await col('purchased_products').findOne({ user_id: userId, product_id: productId });
  return res.json({ already_purchased: Boolean(existing), purchase_date: existing?.purchased_at || null });
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const cartItems = Array.isArray(req.body?.cartItems) ? req.body.cartItems : [];
    const billingInfo = req.body?.billingInfo || {};
    const userId = id(req.body?.user_id);
    const requestedFrontendUrl = String(req.body?.frontend_url || req.headers.origin || '').trim();
    const frontendUrl = allowedOrigins.has(requestedFrontendUrl) ? requestedFrontendUrl : checkoutFrontendUrl;
    if (!cartItems.length) return res.status(400).json({ error: 'No items in cart' });
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    for (const item of cartItems) {
      const existing = await col('purchased_products').findOne({ user_id: userId, product_id: id(item?.product?.id) });
      if (existing) return res.status(400).json({ error: `Product \"${item?.product?.title || 'Unknown product'}\" is already purchased`, already_purchased: true, product_id: item?.product?.id });
    }
    const totalAmount = Math.round(cartItems.reduce((sum, item) => sum + Number(item?.product?.price || 0) * 100, 0));
    if (totalAmount < 50) return res.status(400).json({ error: `Minimum order amount is $0.50. Your current total is $${(totalAmount / 100).toFixed(2)}.`, minimum_amount: 0.5, current_amount: totalAmount / 100 });

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.product.title, description: item.product.description || 'Digital product', images: item.product.images || [] },
        unit_amount: Math.round(Number(item.product.price || 0) * 100)
      },
      quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cancel?cancelled=true`,
      customer_email: billingInfo?.email,
      currency: 'usd',
      metadata: {
        user_id: userId,
        billing_name: billingInfo?.name || '',
        billing_address: billingInfo?.address || '',
        product_ids: cartItems.map((item) => item.product.id).join(','),
        total_amount: cartItems.reduce((sum, item) => sum + Number(item.product.price || 0), 0).toString()
      }
    });

    const orderId = randomUUID();
    const stamp = nowIso();
    await col('orders').insertOne({
      id: orderId,
      user_id: userId,
      total_price: cartItems.reduce((sum, item) => sum + Number(item.product.price || 0), 0),
      payment_status: 'pending',
      payment_method: 'stripe',
      billing_name: billingInfo?.name || '',
      billing_email: billingInfo?.email || '',
      billing_address: billingInfo?.address || '',
      stripe_session_id: session.id,
      currency: 'usd',
      created_at: stamp,
      updated_at: stamp
    });
    for (const item of cartItems) {
      await col('order_items').insertOne({ id: randomUUID(), order_id: orderId, product_id: id(item.product.id), price: Number(item.product.price || 0), created_at: stamp, updated_at: stamp });
    }
    return res.json({ url: session.url, order_id: orderId });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const sessionId = id(req.body?.session_id);
    if (!sessionId) return res.status(400).json({ error: 'Missing session_id' });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.payment_status !== 'paid') return res.status(400).json({ error: 'Payment not completed', status: session.payment_status });
    const userId = id(session.metadata?.user_id);
    if (!userId) return res.status(400).json({ error: 'User ID not found in session' });

    const order = await col('orders').findOne({ stripe_session_id: sessionId, user_id: userId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    await col('orders').updateOne({ id: order.id }, { $set: { payment_status: 'completed', updated_at: nowIso() } });
    const items = await col('order_items').find({ order_id: order.id }, { projection: { product_id: 1, price: 1, _id: 0 } }).toArray();
    for (const item of items) {
      await col('purchased_products').updateOne(
        { user_id: userId, product_id: id(item.product_id) },
        {
          $setOnInsert: { id: randomUUID(), user_id: userId, product_id: id(item.product_id), order_id: order.id, stripe_session_id: sessionId, amount: item.price, currency: session.currency || 'usd', purchased_at: nowIso(), created_at: nowIso() },
          $set: { order_id: order.id, stripe_session_id: sessionId, amount: item.price, currency: session.currency || 'usd', updated_at: nowIso() }
        },
        { upsert: true }
      );
    }
    return res.json({ success: true, order_id: order.id, payment_status: 'completed', products_count: items.length });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to verify payment' });
  }
});

app.post('/api/mark-order-cancelled', async (req, res) => {
  try {
    const sessionId = id(req.body?.session_id);
    if (!sessionId) return res.status(400).json({ error: 'Missing session_id' });
    const result = await col('orders').updateOne(
      { stripe_session_id: sessionId, payment_status: 'pending' },
      { $set: { payment_status: 'cancelled', updated_at: nowIso() } }
    );
    return res.json({ success: result.matchedCount > 0 });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to mark order cancelled' });
  }
});

app.post('/stripe-webhook', express.json(), async (req, res) => {
  try {
    const event = req.body;
    if (event.type === 'checkout.session.completed' && event.data?.object?.payment_status === 'paid') {
      const session = event.data.object;
      const userId = id(session.metadata?.user_id);
      const order = await col('orders').findOne({ stripe_session_id: session.id, user_id: userId });
      if (order) {
        await col('orders').updateOne({ id: order.id }, { $set: { payment_status: 'completed', updated_at: nowIso() } });
      }
    }
    return res.json({ received: true });
  } catch {
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

const startServer = async () => {
  try {
    await mongoClient.connect();
    db = mongoClient.db(mongoDbName);
    await Promise.all([
      col('users').createIndex({ id: 1 }, { unique: true }),
      col('users').createIndex({ email: 1 }, { unique: true }),
      col('user_roles').createIndex({ user_id: 1 }, { unique: true }),
      col('categories').createIndex({ id: 1 }, { unique: true }),
      col('categories').createIndex({ slug: 1 }, { unique: true }),
      col('products').createIndex({ id: 1 }, { unique: true }),
      col('cart_items').createIndex({ id: 1 }, { unique: true }),
      col('cart_items').createIndex({ user_id: 1, product_id: 1 }, { unique: true }),
      col('orders').createIndex({ id: 1 }, { unique: true }),
      col('orders').createIndex({ stripe_session_id: 1, user_id: 1 }),
      col('order_items').createIndex({ id: 1 }, { unique: true }),
      col('order_items').createIndex({ order_id: 1 }),
      col('purchased_products').createIndex({ user_id: 1, product_id: 1 }, { unique: true })
    ]);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`MongoDB connected to database: ${mongoDbName}`);
      console.log(`Allowed CORS origins: ${Array.from(allowedOrigins).join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
