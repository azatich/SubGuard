'use client';

import { useState, useRef } from 'react';
import { Button } from '@/shared/ui/button';
import { Loader2, Upload, Trash2, Check, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/shared/lib/api';
import { useAddSubscription } from '../model/use-add-subscription';

export interface SubscriptionPrediction {
  name: string;
  cost: number;
  currency: string;
  date: string;
  category: 'Entertainment' | 'Work' | 'Education' | 'Utilities' | 'Other';
}

interface PdfSubscriptionScannerProps {
  onSubscriptionsFound?: (subscriptions: SubscriptionPrediction[]) => void;
}

export const PdfSubscriptionScanner = ({
  onSubscriptionsFound,
}: PdfSubscriptionScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<SubscriptionPrediction[]>([]);
  const [addedIndexes, setAddedIndexes] = useState<Set<number>>(new Set());
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: addSubscription } = useAddSubscription();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Пожалуйста, загрузите PDF файл');
      return;
    }

    try {
      setIsScanning(true);
      setFileName(file.name);

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<SubscriptionPrediction[]>(
        '/receipt/scan-subscriptions',
        formData
      );

      const subscriptions = response.data;

      if (Array.isArray(subscriptions)) {
        setResults(subscriptions);
        setAddedIndexes(new Set());
        if (subscriptions.length > 0) {
          toast.success(`Найдено ${subscriptions.length} подписок!`);
          onSubscriptionsFound?.(subscriptions);
        } else {
          toast.info('Подписки в выписке не найдены');
        }
      } else {
        toast.error('Ошибка: неверный формат ответа');
      }
    } catch (error: unknown) {
      console.error('Ошибка при сканировании PDF:', error);
      toast.error(getScanErrorMessage(error));
      setResults([]);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    setResults([]);
    setAddedIndexes(new Set());
    setAddingIndex(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddSubscription = async (
    subscription: SubscriptionPrediction,
    index: number
  ) => {
    try {
      setAddingIndex(index);
      await addSubscription({
        name: subscription.name,
        category: subscription.category,
        cycle: 'Monthly',
        currency: subscription.currency,
        cost: subscription.cost,
        date: subscription.date,
      });
      setAddedIndexes((current) => {
        const next = new Set(current);
        next.add(index);
        return next;
      });
    } finally {
      setAddingIndex(null);
    }
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      Entertainment: 'Развлечения',
      Work: 'Работа',
      Education: 'Образование',
      Utilities: 'Услуги',
      Other: 'Прочее',
    };
    return labels[category] || category;
  };

  const getScanErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (
        error as { response?: { data?: { error?: unknown; message?: unknown } } }
      ).response;
      const apiError = response?.data?.error || response?.data?.message;

      if (typeof apiError === 'string') {
        return apiError;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Ошибка при обработке PDF файла';
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-zinc-600 transition-colors cursor-pointer">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
          disabled={isScanning}
        />

        <div onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-12 h-12 mx-auto mb-3 text-zinc-500" />
          <h3 className="text-sm font-medium text-zinc-200 mb-1">
            Загрузите PDF выписку
          </h3>
          <p className="text-xs text-zinc-400">
            Поддерживаются банковские выписки от Kaspi Bank, Halyk Bank и других
          </p>
        </div>
      </div>

      {/* File Name Display */}
      {fileName && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-zinc-300 truncate">{fileName}</span>
          {isScanning && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
        </div>
      )}

      {/* Loading State */}
      {isScanning && (
        <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-200">Анализирую выписку...</p>
            <p className="text-xs text-blue-300">Это может занять несколько секунд</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !isScanning && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-green-400">
              Найдено подписок: {results.length}
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              className="h-7 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Очистить
            </Button>
          </div>

          {results.map((sub, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <h4 className="font-medium text-zinc-100">{sub.name}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                    <div>
                      <span className="text-zinc-500">Сумма: </span>
                      <span className="text-zinc-200">
                        {sub.cost} {sub.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Дата: </span>
                      <span className="text-zinc-200">{sub.date}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-zinc-500">Категория: </span>
                      <span className="text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded text-xs">
                        {getCategoryLabel(sub.category)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddSubscription(sub, idx)}
                  disabled={addedIndexes.has(idx) || addingIndex !== null}
                  className="h-8 bg-[#2cfc73] hover:bg-[#25db63] text-black text-xs font-semibold"
                >
                  {addingIndex === idx ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : addedIndexes.has(idx) ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Plus className="w-3 h-3" />
                  )}
                  {addedIndexes.has(idx) ? 'Добавлено' : 'Добавить'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isScanning && results.length === 0 && fileName && (
        <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-200">Подписки в выписке не найдены</p>
          <p className="text-xs text-yellow-300 mt-1">
            Проверьте формат файла или попробуйте другую выписку
          </p>
        </div>
      )}
    </div>
  );
};
