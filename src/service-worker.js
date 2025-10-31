/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache images for offline use
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate()
);
