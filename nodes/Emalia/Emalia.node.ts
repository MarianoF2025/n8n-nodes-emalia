import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestMethods,
  IRequestOptions,
} from 'n8n-workflow';

export class Emalia implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Emalia',
    name: 'emalia',
    icon: 'file:emalia.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Emalia email marketing platform',
    defaults: { name: 'Emalia' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [{ name: 'emaliaApi', required: true }],
    properties: [
      // ===== RESOURCE =====
      {
        displayName: 'Resource', name: 'resource', type: 'options', noDataExpression: true,
        options: [
          { name: 'Contact', value: 'contact' },
          { name: 'List', value: 'list' },
          { name: 'Tag', value: 'tag' },
          { name: 'Campaign', value: 'campaign' },
          { name: 'Automation', value: 'automation' },
          { name: 'Email', value: 'email' },
        ],
        default: 'contact',
      },
      // ===== CONTACT OPERATIONS =====
      {
        displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
        displayOptions: { show: { resource: ['contact'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a contact' },
          { name: 'Update', value: 'update', action: 'Update a contact' },
          { name: 'Get', value: 'get', action: 'Get a contact' },
          { name: 'Get Many', value: 'getAll', action: 'Get many contacts' },
          { name: 'Delete', value: 'delete', action: 'Delete a contact' },
          { name: 'Add Tag', value: 'addTag', action: 'Add tag to contact' },
          { name: 'Remove Tag', value: 'removeTag', action: 'Remove tag from contact' },
        ],
        default: 'create',
      },
      // ===== LIST OPERATIONS =====
      {
        displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
        displayOptions: { show: { resource: ['list'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a list' },
          { name: 'Get', value: 'get', action: 'Get a list' },
          { name: 'Get Many', value: 'getAll', action: 'Get many lists' },
          { name: 'Update', value: 'update', action: 'Update a list' },
          { name: 'Delete', value: 'delete', action: 'Delete a list' },
          { name: 'Add Contact', value: 'addContact', action: 'Add contact to list' },
          { name: 'Remove Contact', value: 'removeContact', action: 'Remove contact from list' },
        ],
        default: 'getAll',
      },
      // ===== TAG OPERATIONS =====
      {
        displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
        displayOptions: { show: { resource: ['tag'] } },
        options: [
          { name: 'Create', value: 'create', action: 'Create a tag' },
          { name: 'Get Many', value: 'getAll', action: 'Get many tags' },
        ],
        default: 'getAll',
      },
      // ===== CAMPAIGN OPERATIONS =====
      {
        displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
        displayOptions: { show: { resource: ['campaign'] } },
        options: [
          { name: 'Get', value: 'get', action: 'Get a campaign' },
          { name: 'Get Many', value: 'getAll', action: 'Get many campaigns' },
        ],
        default: 'getAll',
      },
      // ===== AUTOMATION OPERATIONS =====
      {
        displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
        displayOptions: { show: { resource: ['automation'] } },
        options: [
          { name: 'Get', value: 'get', action: 'Get an automation' },
          { name: 'Get Many', value: 'getAll', action: 'Get many automations' },
        ],
        default: 'getAll',
      },
      // ===== EMAIL OPERATIONS =====
      {
        displayName: 'Operation', name: 'operation', type: 'options', noDataExpression: true,
        displayOptions: { show: { resource: ['email'] } },
        options: [
          { name: 'Send', value: 'send', action: 'Send a transactional email' },
        ],
        default: 'send',
      },
      // ===== FIELDS =====
      // -- Contact ID --
      {
        displayName: 'Contact ID', name: 'contactId', type: 'string', required: true, default: '',
        displayOptions: { show: { resource: ['contact'], operation: ['get', 'update', 'delete', 'addTag', 'removeTag'] } },
      },
      // -- Contact Email (create) --
      {
        displayName: 'Email', name: 'email', type: 'string', placeholder: 'name@email.com', required: true, default: '',
        displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
      },
      // -- Contact Additional Fields --
      {
        displayName: 'Additional Fields', name: 'additionalFields', type: 'collection', placeholder: 'Add Field', default: {},
        displayOptions: { show: { resource: ['contact'], operation: ['create', 'update'] } },
        options: [
          { displayName: 'Name', name: 'nombre', type: 'string', default: '' },
          { displayName: 'Phone', name: 'telefono', type: 'string', default: '' },
          { displayName: 'DNI', name: 'dni', type: 'string', default: '' },
          { displayName: 'Status', name: 'estado', type: 'options', default: 'activo', options: [{ name: 'Active', value: 'activo' }, { name: 'Unsubscribed', value: 'desuscripto' }, { name: 'Bounced', value: 'rebotado' }] },
          { displayName: 'Source', name: 'origen', type: 'string', default: '' },
          { displayName: 'Birthday', name: 'fecha_nacimiento', type: 'string', default: '', placeholder: 'YYYY-MM-DD' },
        ],
      },
      // -- Tag ID --
      {
        displayName: 'Tag ID', name: 'tagId', type: 'string', required: true, default: '',
        displayOptions: { show: { resource: ['contact'], operation: ['addTag', 'removeTag'] } },
      },
      // -- Tag Name (create) --
      {
        displayName: 'Tag Name', name: 'tagName', type: 'string', required: true, default: '',
        displayOptions: { show: { resource: ['tag'], operation: ['create'] } },
      },
      // -- Tag Color (create) --
      {
        displayName: 'Tag Color', name: 'tagColor', type: 'string', default: '#D65444', placeholder: '#D65444',
        displayOptions: { show: { resource: ['tag'], operation: ['create'] } },
      },
      // -- List ID --
      {
        displayName: 'List ID', name: 'listId', type: 'string', required: true, default: '',
        displayOptions: { show: { resource: ['list'], operation: ['get', 'update', 'delete', 'addContact', 'removeContact'] } },
      },
      // -- List Name (create) --
      {
        displayName: 'List Name', name: 'listName', type: 'string', required: true, default: '',
        displayOptions: { show: { resource: ['list'], operation: ['create'] } },
      },
      // -- List Additional Fields (update) --
      {
        displayName: 'Additional Fields', name: 'listAdditionalFields', type: 'collection', placeholder: 'Add Field', default: {},
        displayOptions: { show: { resource: ['list'], operation: ['update'] } },
        options: [
          { displayName: 'Name', name: 'nombre', type: 'string', default: '' },
          { displayName: 'Description', name: 'descripcion', type: 'string', default: '' },
        ],
      },
      // -- Contact ID for list operations --
      {
        displayName: 'Contact ID', name: 'contactIdForList', type: 'string', required: true, default: '',
        displayOptions: { show: { resource: ['list'], operation: ['addContact', 'removeContact'] } },
      },
      // -- Campaign ID --
      {
        displayName: 'Campaign ID', name: 'campaignId', type: 'string', required: true, default: '',
        displayOptions: { show: { resource: ['campaign'], operation: ['get'] } },
      },
      // -- Automation ID --
      {
        displayName: 'Automation ID', name: 'automationId', type: 'string', required: true, default: '',
        displayOptions: { show: { resource: ['automation'], operation: ['get'] } },
      },
      // -- Email fields --
      {
        displayName: 'To', name: 'emailTo', type: 'string', placeholder: 'recipient@email.com', required: true, default: '',
        displayOptions: { show: { resource: ['email'], operation: ['send'] } },
      },
      {
        displayName: 'Subject', name: 'emailSubject', type: 'string', required: true, default: '',
        displayOptions: { show: { resource: ['email'], operation: ['send'] } },
      },
      {
        displayName: 'HTML Body', name: 'emailHtml', type: 'string', typeOptions: { rows: 5 }, required: true, default: '',
        displayOptions: { show: { resource: ['email'], operation: ['send'] } },
      },
      {
        displayName: 'Additional Fields', name: 'emailAdditionalFields', type: 'collection', placeholder: 'Add Field', default: {},
        displayOptions: { show: { resource: ['email'], operation: ['send'] } },
        options: [
          { displayName: 'From Name', name: 'from_name', type: 'string', default: '' },
          { displayName: 'Reply To', name: 'reply_to', type: 'string', default: '' },
        ],
      },
      // -- Pagination --
      {
        displayName: 'Limit', name: 'limit', type: 'number', typeOptions: { minValue: 1, maxValue: 100 }, default: 50,
        displayOptions: { show: { operation: ['getAll'] } }, description: 'Max number of results to return',
      },
      {
        displayName: 'Page', name: 'page', type: 'number', typeOptions: { minValue: 1 }, default: 1,
        displayOptions: { show: { operation: ['getAll'] } },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const credentials = await this.getCredentials('emaliaApi');
    const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

    for (let i = 0; i < items.length; i++) {
      let method: IHttpRequestMethods = 'GET';
      let endpoint = '';
      let body: any = {};
      let qs: any = {};

      // ===== CONTACT =====
      if (resource === 'contact') {
        if (operation === 'create') {
          method = 'POST'; endpoint = '/api/v1/contacts';
          const af = this.getNodeParameter('additionalFields', i) as any;
          body = { email: this.getNodeParameter('email', i) as string, ...af };
        } else if (operation === 'update') {
          method = 'PATCH';
          const id = this.getNodeParameter('contactId', i) as string;
          endpoint = `/api/v1/contacts/${id}`;
          body = this.getNodeParameter('additionalFields', i) as any;
        } else if (operation === 'get') {
          const id = this.getNodeParameter('contactId', i) as string;
          endpoint = `/api/v1/contacts/${id}`;
        } else if (operation === 'getAll') {
          endpoint = '/api/v1/contacts';
          qs.per_page = this.getNodeParameter('limit', i) as number;
          qs.page = this.getNodeParameter('page', i) as number;
        } else if (operation === 'delete') {
          method = 'DELETE';
          const id = this.getNodeParameter('contactId', i) as string;
          endpoint = `/api/v1/contacts/${id}`;
        } else if (operation === 'addTag') {
          method = 'POST';
          const id = this.getNodeParameter('contactId', i) as string;
          endpoint = `/api/v1/contacts/${id}/tags`;
          body = { tag_id: this.getNodeParameter('tagId', i) as string };
        } else if (operation === 'removeTag') {
          method = 'DELETE';
          const id = this.getNodeParameter('contactId', i) as string;
          endpoint = `/api/v1/contacts/${id}/tags`;
          body = { tag_id: this.getNodeParameter('tagId', i) as string };
        }
      }

      // ===== LIST =====
      if (resource === 'list') {
        if (operation === 'create') {
          method = 'POST'; endpoint = '/api/v1/lists';
          body = { nombre: this.getNodeParameter('listName', i) as string };
        } else if (operation === 'get') {
          const id = this.getNodeParameter('listId', i) as string;
          endpoint = `/api/v1/lists/${id}`;
        } else if (operation === 'getAll') {
          endpoint = '/api/v1/lists';
          qs.per_page = this.getNodeParameter('limit', i) as number;
          qs.page = this.getNodeParameter('page', i) as number;
        } else if (operation === 'update') {
          method = 'PATCH';
          const id = this.getNodeParameter('listId', i) as string;
          endpoint = `/api/v1/lists/${id}`;
          body = this.getNodeParameter('listAdditionalFields', i) as any;
        } else if (operation === 'delete') {
          method = 'DELETE';
          const id = this.getNodeParameter('listId', i) as string;
          endpoint = `/api/v1/lists/${id}`;
        } else if (operation === 'addContact') {
          method = 'POST';
          const id = this.getNodeParameter('listId', i) as string;
          endpoint = `/api/v1/lists/${id}/contacts`;
          body = { contact_id: this.getNodeParameter('contactIdForList', i) as string };
        } else if (operation === 'removeContact') {
          method = 'DELETE';
          const id = this.getNodeParameter('listId', i) as string;
          endpoint = `/api/v1/lists/${id}/contacts`;
          body = { contact_id: this.getNodeParameter('contactIdForList', i) as string };
        }
      }

      // ===== TAG =====
      if (resource === 'tag') {
        if (operation === 'create') {
          method = 'POST'; endpoint = '/api/v1/tags';
          body = { nombre: this.getNodeParameter('tagName', i) as string, color: this.getNodeParameter('tagColor', i) as string };
        } else if (operation === 'getAll') {
          endpoint = '/api/v1/tags';
        }
      }

      // ===== CAMPAIGN =====
      if (resource === 'campaign') {
        if (operation === 'get') {
          const id = this.getNodeParameter('campaignId', i) as string;
          endpoint = `/api/v1/campaigns/${id}`;
        } else if (operation === 'getAll') {
          endpoint = '/api/v1/campaigns';
          qs.per_page = this.getNodeParameter('limit', i) as number;
          qs.page = this.getNodeParameter('page', i) as number;
        }
      }

      // ===== AUTOMATION =====
      if (resource === 'automation') {
        if (operation === 'get') {
          const id = this.getNodeParameter('automationId', i) as string;
          endpoint = `/api/v1/automations/${id}`;
        } else if (operation === 'getAll') {
          endpoint = '/api/v1/automations';
          qs.per_page = this.getNodeParameter('limit', i) as number;
          qs.page = this.getNodeParameter('page', i) as number;
        }
      }

      // ===== EMAIL =====
      if (resource === 'email') {
        if (operation === 'send') {
          method = 'POST'; endpoint = '/api/v1/send';
          const af = this.getNodeParameter('emailAdditionalFields', i) as any;
          body = {
            to: this.getNodeParameter('emailTo', i) as string,
            subject: this.getNodeParameter('emailSubject', i) as string,
            html: this.getNodeParameter('emailHtml', i) as string,
            ...af,
          };
        }
      }

      const options: IRequestOptions = { method, uri: `${baseUrl}${endpoint}`, qs, body, json: true };
      if (method === 'GET') delete options.body;

      const response = await this.helpers.requestWithAuthentication.call(this, 'emaliaApi', options);
      const items_out = Array.isArray(response?.data) ? response.data : [response?.data || response];
      for (const item of items_out) {
        returnData.push({ json: item });
      }
    }

    return [returnData];
  }
}
