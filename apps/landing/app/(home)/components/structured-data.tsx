/**
 * JSON-LD structured data for the landing page.
 *
 * Renders a `<script type="application/ld+json">` with Schema.org markup.
 * Single source of truth for machine-readable page metadata.
 */
export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sim.ai/#organization',
        name: 'Sim',
        alternateName: 'Sim Studio',
        description:
          'Sim is the open-source platform to build AI agents and run your agentic workforce. Connect 1,000+ integrations and LLMs to deploy and orchestrate agentic workflows.',
        url: 'https://sim.ai',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://sim.ai/#logo',
          url: 'https://sim.ai/logo/b%26w/text/b%26w.svg',
          contentUrl: 'https://sim.ai/logo/b%26w/text/b%26w.svg',
          width: 49.78314,
          height: 24.276,
          caption: 'Sim Logo',
        },
        image: { '@id': 'https://sim.ai/#logo' },
        sameAs: [
          'https://x.com/simdotai',
          'https://github.com/simstudioai/sim',
          'https://www.linkedin.com/company/simstudioai/',
          'https://discord.gg/Hr4UWYEcTT',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          availableLanguage: ['en'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sim.ai/#website',
        url: 'https://sim.ai',
        name: 'Sim — Build AI Agents & Run Your Agentic Workforce',
        description:
          'Sim is the open-source platform to build AI agents and run your agentic workforce. Connect 1,000+ integrations and LLMs to deploy and orchestrate agentic workflows. Join 100,000+ builders.',
        publisher: { '@id': 'https://sim.ai/#organization' },
        inLanguage: 'en-US',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://sim.ai/#webpage',
        url: 'https://sim.ai',
        name: 'Sim — Build AI Agents & Run Your Agentic Workforce',
        isPartOf: { '@id': 'https://sim.ai/#website' },
        about: { '@id': 'https://sim.ai/#software' },
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: new Date().toISOString(),
        description:
          'Sim is the open-source platform to build AI agents and run your agentic workforce.',
        breadcrumb: { '@id': 'https://sim.ai/#breadcrumb' },
        inLanguage: 'en-US',
        potentialAction: [{ '@type': 'ReadAction', target: ['https://sim.ai'] }],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://sim.ai/#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sim.ai' },
        ],
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://sim.ai/#software',
        url: 'https://sim.ai',
        name: 'Sim — Build AI Agents & Run Your Agentic Workforce',
        description:
          'Sim is the open-source platform to build AI agents and run your agentic workforce. Connect 1,000+ integrations and LLMs to deploy and orchestrate agentic workflows. Create agents, workflows, knowledge bases, tables, and docs. Trusted by over 100,000 builders. SOC2 compliant.',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        offers: [
          {
            '@type': 'Offer',
            name: 'Community Plan — 1,000 credits included',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            name: 'Pro Plan — 6,000 credits/month',
            price: '25',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '25',
              priceCurrency: 'USD',
              unitText: 'MONTH',
              billingIncrement: 1,
            },
            availability: 'https://schema.org/InStock',
          },
          {
            '@type': 'Offer',
            name: 'Max Plan — 25,000 credits/month',
            price: '100',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '100',
              priceCurrency: 'USD',
              unitText: 'MONTH',
              billingIncrement: 1,
            },
            availability: 'https://schema.org/InStock',
          },
        ],
        featureList: [
          'AI agent creation',
          'Agentic workflow orchestration',
          '1,000+ integrations',
          'LLM orchestration (OpenAI, Anthropic, Google, xAI, Mistral, Perplexity)',
          'Knowledge base creation',
          'Table creation',
          'Document creation',
          'API access',
        ],
        review: [
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Hasan Toor' },
            reviewBody:
              'This startup just dropped the fastest way to build AI agents. This Figma-like canvas to build agents will blow your mind.',
            url: 'https://x.com/hasantoxr/status/1912909502036525271',
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'nizzy' },
            reviewBody:
              'This is the zapier of agent building. I always believed that building agents and using AI should not be limited to technical people.',
            url: 'https://x.com/nizzyabi/status/1907864421227180368',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://sim.ai/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Sim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim is the open-source platform to build AI agents and run your agentic workforce. Teams connect 1,000+ integrations and LLMs to deploy and orchestrate agentic workflows.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does Sim cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim offers a free Community plan with 1,000 credits to start, a Pro plan at $25/month with 6,000 credits, a Max plan at $100/month with 25,000 credits, and custom Enterprise pricing.',
            },
          },
          {
            '@type': 'Question',
            name: 'What enterprise features does Sim offer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim offers SOC2 compliance, SSO/SAML authentication, role-based access control, audit logs, dedicated support, custom SLAs, and on-premise deployment options for enterprise customers.',
            },
          },
        ],
      },
    ],
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
