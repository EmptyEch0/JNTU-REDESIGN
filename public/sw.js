// JNTU-GV CEV Web Push Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {
    title: 'JNTU-GV College Announcement',
    body: 'A new update has been posted to JNTU-GV CEV.',
    url: '/notices',
    tag: 'jntugv-announcement',
    icon: '/logo-circle.png',
    badge: '/favicon.png',
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo-circle.png',
    badge: data.badge || '/favicon.png',
    tag: data.tag || 'jntugv-notice',
    renotify: true,
    requireInteraction: false,
    data: {
      url: data.url || '/notices',
      timestamp: Date.now(),
    },
    actions: [
      { action: 'open', title: 'View Notice' },
      { action: 'dismiss', title: 'Close' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/notices';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and navigate
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.url.includes(self.location.origin)) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then((subscription) => {
        return fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });
      })
      .catch((err) => {
        console.error('Failed to resubscribe after subscription change', err);
      })
  );
});
