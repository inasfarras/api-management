'use client';

import Layout from '@/components/Layout';
import UsageStats from '@/components/UsageStats';
import ApiKeysSection from '@/components/ApiKeysSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <UsageStats />
        <ApiKeysSection />
        <ContactSection />
      </div>
    </Layout>
  );
}
