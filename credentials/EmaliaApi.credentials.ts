import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class EmaliaApi implements ICredentialType {
  name = 'emaliaApi';
  displayName = 'Emalia API';
  documentationUrl = 'https://emaliamail.com/docs/api';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Tu API key de Emalia. La encontrás en Configuración → API Keys.',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://emaliamail.com',
      required: true,
      description: 'URL base de tu instancia de Emalia.',
    },
  ];
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'x-api-key': '={{$credentials.apiKey}}',
      },
    },
  };
}
