# Direct Send API overview


**Note:** The Direct Send API is in beta. Features and behavior described here are subject to change and may be released incrementally. Participation is subject to acceptance of the beta terms.

The Direct Send API simplifies WhatsApp utility and authentication integration. Instead of pre-creating and managing message templates, you send business-initiated messages directly and Meta auto-generates the matching templates behind the scenes.

## What is the Direct Send API

The Direct Send API streamlines the integration process, eliminates template creation complexity, and enables more flexible re-categorization enforcement. By removing the template-management step, you can accelerate time-to-market for utility and authentication messaging.

You use the existing `/<WHATSAPP_BUSINESS_PHONE_NUMBER_ID>/messages` endpoint to send business-initiated messages without a template, adding a `category` field to the request body:

```html
POST /<WHATSAPP_BUSINESS_PHONE_NUMBER_ID>/messages

{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "<WHATSAPP_USER_PHONE_NUMBER>",
  "type": "text",
  "text": {
    "body": "<BODY_TEXT>"
  },
  "category": "utility"
}
```

See [Send utility and authentication messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/direct-send/send-utility-and-authentication-messages) for the full request reference.

## How Direct Send works

Direct Send auto-creates templates on the fly and matches incoming messages against those templates before sending.

> **How Direct Send selects a template:** A business sends a message with a `category` field. If it matches an existing template, Direct Send sends using that template. If not, it sends using a fallback onboarding template and asynchronously creates a new template (content PII-redacted, language detected) so future matching messages use it.

**Onboarding.** When a WhatsApp Business Account (WABA) is onboarded to Direct Send, Meta adds a small set of fallback templates to the WABA. These are used when an incoming message can't be matched to an existing template, ensuring Direct Send always attempts to send the message.

**Sending a message.** For each incoming message:

- Direct Send first checks whether the message matches an existing template.
- If a matching template is found, that template is used to send the message.
- If no matching template is found, Direct Send falls back to the onboarding templates and the message is still sent.
- When there's no match, Direct Send asynchronously triggers creation of a new template from the message. The message content is PII-redacted and its language is detected before the template is created.

## Controlling how templates are generated

If message attribution to a specific template is critical, you can provide a template name as input on the send call. Direct Send creates a template with that exact name, and all messages using that name are attributed to that template.

See [Business-named templates](https://developers.facebook.com/documentation/business-messaging/whatsapp/direct-send/business-named-templates) for details.

## Next steps

- [Get started with Direct Send](https://developers.facebook.com/documentation/business-messaging/whatsapp/direct-send/get-started) — onboarding prerequisites
- [Supported features and limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/direct-send/supported-features-and-limits) — formats, languages, and limits
- [Send utility and authentication messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/direct-send/send-utility-and-authentication-messages)
- [Supported message types](https://developers.facebook.com/documentation/business-messaging/whatsapp/direct-send/supported-message-types)