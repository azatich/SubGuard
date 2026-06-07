import PDFParser from "pdf2json";

export const extractTextFromPdf = (fileBuffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("--- СТАРТ ПАРСИНГА ЧЕРЕЗ PDF2JSON ---");
      
      // Инициализируем парсер. Единица (1) означает, что нам нужен только чистый текст
      const pdfParser = new PDFParser(null, 1);

      // Событие: Ошибка при чтении
      pdfParser.on("pdfParser_dataError", (errData) => {
        console.error("🔥 Ошибка pdf2json:", errData.parserError);
        reject(new Error("Не удалось прочитать PDF файл"));
      });

      // Событие: Успешное чтение
      pdfParser.on("pdfParser_dataReady", () => {
        console.log("✅ Текст успешно извлечен! Передаем в Gemini...");
        
        // Получаем сырой текст
        const rawText = pdfParser.getRawTextContent();
        
        resolve(rawText);
      });

      // Запускаем парсинг переданного буфера
      pdfParser.parseBuffer(fileBuffer);

    } catch (error) {
      console.error("🔥 Критическая ошибка инициализации парсера:", error);
      reject(error);
    }
  });
};