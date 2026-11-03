'use strict';

const { Router } = require('express');

const router = Router();

let ready = true;

/**
 * GET /health - Liveness probe.
 */
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

/**
 * GET /ready - Readiness probe.
 */
router.get('/ready', (_req, res) => {
  if (ready) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

router.setReady = (value) => { ready = value; };

module.exports = router;
