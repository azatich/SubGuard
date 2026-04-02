import { useState, useRef } from "react";
import { Button } from "@/shared/ui/button";
import { Loader2, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/shared/lib/api";

export interface ParsedReceiptData {
  merchant?: string;
  totalCost?: number;
  currencyISO?: string;
  paymentDate?: string;
  categoryFallback?: string;
}

interface ReceiptScannerButtonProps {
  onScanSuccess: (data: ParsedReceiptData) => void;
}

export const ReceiptScannerButton = ({
  onScanSuccess,
}: ReceiptScannerButtonProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsScanning(true);

      const base64Data = await fileToBase64(file);

      const response = await api.post("/receipt/scan", {
        imageBase64: base64Data,
      });

      const result = response.data;

      if (result.success && result.data) {
        toast.success("Чек успешно распознан!");
        onScanSuccess(result.data);
      } else {
        toast.error("ИИ не смог найти данные на картинке.");
      }
    } catch (error: any) {
      console.error(error);
      const serverMessage =
        error.response?.data?.error ||
        "Произошла ошибка при сканировании чека.";
      toast.error(serverMessage);

    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
        className="w-full flex items-center justify-center gap-2.5 bg-[#0a0a0a] border-zinc-800 text-zinc-300 hover:bg-[#0a0a0a] hover:text-[#2cfc73] border-dashed transition-all"
      >
        {isScanning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            ИИ анализирует чек...
          </>
        ) : (
          <>
            <ReceiptText className="w-4 h-4" />
            Распознать по скриншоту чека
          </>
        )}
      </Button>
    </>
  );
};
