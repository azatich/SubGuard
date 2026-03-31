import { CalendarWidget } from "@/widgets/calendar";

const CalendarPage = () => {
  return (
    <div className="px-4 sm:px-12 lg:px-16 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Календарь</h1>
        <p className="text-zinc-500 mt-1 text-sm">Дни списания по всем вашим подпискам</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 sm:p-7">
        <CalendarWidget />
      </div>
    </div>
  );
};

export default CalendarPage;
