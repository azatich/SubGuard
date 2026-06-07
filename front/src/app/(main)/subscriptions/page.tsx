'use client';

import { useState } from 'react';
import { SubscriptionsTable } from '@/widgets/subscriptions-table';
import { PdfSubscriptionScanner, SubscriptionPrediction } from '@/features/subscriptions';
import { Button } from '@/shared/ui/button';
import { ChevronDown } from 'lucide-react';

const Subscriptions = () => {
  const [showScanner, setShowScanner] = useState(false);

  const handleSubscriptionsFound = (subscriptions: SubscriptionPrediction[]) => {
    // После обнаружения подписок, можно добавить логику
    // например, автоматически добавить их в список
    console.log('Found subscriptions:', subscriptions);
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16">
      {/* PDF Scanner Section */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Автоматический анализ выписки
            </h2>
            <p className="text-sm text-zinc-400">
              Загрузите PDF банковскую выписку, чтобы автоматически обнаружить подписки
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowScanner(!showScanner)}
            className="flex items-center gap-2 border-zinc-700 hover:border-zinc-600"
          >
            {showScanner ? 'Скрыть' : 'Развернуть'}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showScanner ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>

        {showScanner && (
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <PdfSubscriptionScanner onSubscriptionsFound={handleSubscriptionsFound} />
          </div>
        )}
      </div>

      {/* Subscriptions Table */}
      <SubscriptionsTable />
    </div>
  );
};

export default Subscriptions;
