export function calculateNextPaymentDate(firstPaymentStr: string, cycle: string): string {
  const firstDate = new Date(firstPaymentStr);
  const today = new Date();
  
  // Сбрасываем время до полуночи, чтобы сравнивать только дни
  today.setHours(0, 0, 0, 0);

  // Если первый платеж еще в будущем, то он и есть следующий
  if (firstDate >= today) {
    return firstPaymentStr;
  }

  const nextDate = new Date(firstDate);

  if (cycle === "Monthly") {
    // Ставим текущий год и месяц
    nextDate.setFullYear(today.getFullYear());
    nextDate.setMonth(today.getMonth());

    // Если в этом месяце дата платежа уже прошла, переносим на следующий месяц
    if (nextDate < today) {
      nextDate.setMonth(today.getMonth() + 1);
    }
  } else if (cycle === "Yearly") {
    // Ставим текущий год
    nextDate.setFullYear(today.getFullYear());

    // Если в этом году дата уже прошла, переносим на следующий год
    if (nextDate < today) {
      nextDate.setFullYear(today.getFullYear() + 1);
    }
  }

  // Возвращаем в формате YYYY-MM-DD
  return nextDate.toISOString().split('T')[0];
}