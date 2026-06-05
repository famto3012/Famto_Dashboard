# WhatsApp Business Backend Contract

These endpoints match the React Query layer in `src/api/whatsapp/whatsappApi.js`.

## Inbox

- `GET /whatsapp/overview`
- `GET /whatsapp/conversations?search=&status=&tag=&assignee=&page=&limit=`
- `PATCH /whatsapp/conversations/:conversationId`
- `GET /whatsapp/conversations/:conversationId/messages?page=&limit=`
- `POST /whatsapp/conversations/:conversationId/messages`
- `POST /whatsapp/conversations/:conversationId/templates`
- `POST /whatsapp/conversations/:conversationId/notes`

## Contacts

- `GET /whatsapp/contacts?search=&tag=`
- `POST /whatsapp/contacts/sync`
- `PATCH /whatsapp/contacts/:contactId`

## Campaigns

- `GET /whatsapp/campaigns`
- `POST /whatsapp/campaigns`
- `POST /whatsapp/campaigns/:campaignId/send`
- `GET /whatsapp/campaigns/:campaignId/events`

## Templates

- `GET /whatsapp/templates`
- `POST /whatsapp/templates/sync`
- `POST /whatsapp/templates`
- `PATCH /whatsapp/templates/:templateId`

## Billing And Profile

- `GET /whatsapp/wallet`
- `POST /whatsapp/wallet/recharge`
- `GET /whatsapp/business-profile`
- `PATCH /whatsapp/business-profile`
- `POST /whatsapp/phone-numbers/verify`

## Webhooks And Sockets

Meta webhook events should be persisted first, then broadcast to Socket.io:

- `whatsapp:message`
- `whatsapp:message:status`
- `whatsapp:conversation:updated`
- `whatsapp:template:status`
- `whatsapp:campaign:event`

Store Meta IDs on every message so delivery, read, failed, and billing events can be reconciled idempotently.
