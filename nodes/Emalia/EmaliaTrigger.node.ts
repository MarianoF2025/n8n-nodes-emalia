import {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IRequestOptions,
  IHttpRequestMethods,
} from 'n8n-workflow';

export class EmaliaTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Emalia Trigger',
    name: 'emaliaTrigger',
    icon: 'file:emalia.png',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Triggers when an event occurs in Emalia',
    defaults: { name: 'Emalia Trigger' },
    inputs: [],
    outputs: ['main'],
    credentials: [{ name: 'emaliaApi', required: true }],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        noDataExpression: true,
        required: true,
        options: [
          { name: 'Contact Created', value: 'contact.created' },
          { name: 'Contact Updated', value: 'contact.updated' },
          { name: 'Contact Unsubscribed', value: 'contact.unsubscribed' },
          { name: 'Contact Deleted', value: 'contact.deleted' },
          { name: 'Email Sent', value: 'email.sent' },
          { name: 'Email Delivered', value: 'email.delivered' },
          { name: 'Email Opened', value: 'email.opened' },
          { name: 'Email Clicked', value: 'email.clicked' },
          { name: 'Email Bounced', value: 'email.bounced' },
          { name: 'Email Complained', value: 'email.complained' },
          { name: 'Email Unsubscribed', value: 'email.unsubscribed' },
          { name: 'Campaign Sent', value: 'campaign.sent' },
          { name: 'Campaign Scheduled', value: 'campaign.scheduled' },
          { name: 'Automation Triggered', value: 'automation.triggered' },
          { name: 'Automation Completed', value: 'automation.completed' },
          { name: 'Form Submitted', value: 'form.submitted' },
        ],
        default: 'contact.created',
        description: 'The event to listen for',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        if (webhookData.webhookId) { return true; }
        return false;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default') as string;
        const event = this.getNodeParameter('event') as string;
        const credentials = await this.getCredentials('emaliaApi');
        const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
        const options: IRequestOptions = {
          method: 'POST' as IHttpRequestMethods,
          uri: `${baseUrl}/api/v1/webhooks`,
          body: {
            url: webhookUrl,
            eventos: [event],
            descripcion: `n8n: ${event}`,
          },
          json: true,
        };
        const response = await this.helpers.requestWithAuthentication.call(this, 'emaliaApi', options);
        const webhookData = this.getWorkflowStaticData('node');
        webhookData.webhookId = response.webhook.id;
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        if (!webhookData.webhookId) { return true; }
        const credentials = await this.getCredentials('emaliaApi');
        const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
        try {
          const options: IRequestOptions = {
            method: 'DELETE' as IHttpRequestMethods,
            uri: `${baseUrl}/api/v1/webhooks?id=${webhookData.webhookId}`,
            json: true,
          };
          await this.helpers.requestWithAuthentication.call(this, 'emaliaApi', options);
        } catch (e) {
          // Ignore errors on delete
        }
        delete webhookData.webhookId;
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData() as any;
    return {
      workflowData: [[{ json: bodyData }]],
    };
  }
}
