# n8n-nodes-emalia

This is an n8n community node for [Emalia](https://emaliamail.com) — an email marketing platform built for LATAM businesses.

## Features

This node lets you automate your Emalia email marketing workflows directly from n8n:

**Contacts** — Create, update, get, list, and delete contacts. Add or remove tags from contacts.

**Lists** — Create, get, list, and delete audience lists. Add or remove contacts from lists.

**Tags** — Create tags and retrieve all tags.

**Campaigns** — Create campaigns, get campaign details, and list all campaigns.

**Automations** — Get automation details and list all automations.

## Installation

### In n8n (recommended)

Go to **Settings > Community Nodes** and install: `n8n-nodes-emalia`

### Manual

Install in your n8n custom nodes directory:

    cd ~/.n8n
    npm install n8n-nodes-emalia

Then restart n8n.

## Credentials

You need an Emalia API key to use this node:

1. Log in to your [Emalia](https://emaliamail.com) account
2. Go to **Settings > API Keys**
3. Generate a new API key
4. In n8n, create new credentials of type **Emalia API** and paste your API key and your Emalia instance URL

## Resources

- [Emalia website](https://emaliamail.com)
- [n8n community nodes docs](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
