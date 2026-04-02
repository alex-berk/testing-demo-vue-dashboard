import express from 'express';
import { catalog } from './data.js';

const app = express();
const host = '127.0.0.1';
const port = Number(process.env.API_PORT ?? 4000);

app.use((_, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/health', (_, response) => {
  response.json({ ok: true });
});

app.get('/api/items', (request, response) => {
  const section = String(request.query.section ?? 'featured');
  const rawLimit = Number.parseInt(String(request.query.limit ?? '3'), 10);
  const limit = Number.isNaN(rawLimit) || rawLimit <= 0 ? 3 : Math.min(rawLimit, 6);
  const locale = String(request.query.locale ?? 'en-US');
  const search = String(request.query.search ?? '').trim().toLowerCase();

  let filteredItems =
    section === 'all'
      ? [...catalog]
      : catalog.filter((item) => item.section === section);

  if (search) {
    filteredItems = filteredItems.filter((item) =>
      `${item.name} ${item.category} ${item.accent}`.toLowerCase().includes(search),
    );
  }

  const totalMatches = filteredItems.length;

  const items = filteredItems.slice(0, limit).map((item) => ({
    ...item,
    displayPrice: new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
    }).format(item.price),
  }));

  response.json({
    items,
    meta: {
      section,
      limit,
      locale,
      totalMatches,
    },
  });
});

app.listen(port, host, () => {
  console.log(`Demo API listening at http://${host}:${port}`);
});

