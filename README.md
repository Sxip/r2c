<div align="center">
  <img src="https://www.r2conline.com/wp-content/uploads/cropped-r2c-logo@2x-1.png" alt="R2C Online" width="200"/>
</div>

<br />

A TypeScript client for the R2C Jobsheet API. Manages authentication and provides type-safe access to jobsheet endpoints.

## Features

- Automatic OAuth token caching and refresh
- Fully typed with TypeScript
- Clean resource-based API
- Error responses include status codes

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Jobsheets](#jobsheets)
  - [Tasks](#tasks)
  - [Parts, Fluids, Consumables](#parts-fluids-consumables)

## Installation

### npm

```bash
npm install @sxip/r2c
```

## Quick Start

```typescript
import { R2CClient } from '@sxips/r2c';

/**
 * Initialize with OAuth credentials (recommended)
 */
const client = new R2CClient({
  oauthCredentials: {
    username: 'username',
    password: 'password',
    site_id: 'site',
    client_id: 'client',
    client_secret: 'secret',
  },
});

/**
 * Or use a static bearer token
 */
const client = new R2CClient({
  bearerToken: 'token',
});

/**
 * Fetch a jobsheet
 */
const jobsheet = await client.jobsheets.get({ jobsheetId: '123' });

/**
 * Search jobsheets
 */
const results = await client.jobsheets.search({
  reference: 'JOB-001',
  page: 1,
});
```

## Usage

### Jobsheets

```typescript
/**
 * Get a jobsheet
 */
const jobsheet = await client.jobsheets.get({ jobsheetId: '123' });

/**
 * Search jobsheets
 */
const results = await client.jobsheets.search({
  reference: 'R2C2892',
  status: 'Open',
  page: 1,
  pageSize: 20,
});

/**
 * Update a jobsheet
 */
await client.jobsheets.patch({
  jobsheetId: '123',
  status: 'Complete',
  bookedInDateTime: '2026-01-10T10:00:00Z',
});

/**
 * Create a jobsheet
 */
const newJobsheet = await client.jobsheets.create({
  reference: 'R2C2892',
  bookedInDateTime: '2026-01-10T10:00:00Z',
});
```

### Tasks

```typescript
/**
 * Add a task to a jobsheet
 */
const jobsheet = await client.tasks.create({
  jobsheetId: '123',
  reasonForWork: 'Annual Service',
  service: { description: 'Full service' },
  labour: {
    description: 'Service labour',
    quantity: 2,
    vatRate: 0.2,
  },
});

/**
 * Update a task
 */
await client.tasks.patch({
  jobsheetId: '123',
  taskId: '456',
  actualCompletionHours: 2.5,
});
```

### Parts, Fluids, Consumables

```typescript
/**
 * Add a part
 */
await client.tasks.parts.create({
  jobsheetId: '123',
  taskId: '456',
  description: 'Brake Pads',
  quantity: 1,
  unitPrice: 45.0,
  vatRate: 0.2,
});

/**
 * Update consumable quantity
 */
await client.tasks.consumables.patch({
  jobsheetId: '123',
  taskId: '456',
  consumableId: '789',
  quantity: 5,
});
```

## Development

```bash
npm install

npm run build

npm test

npm run test:coverage

npm run lint

npm run format
```
