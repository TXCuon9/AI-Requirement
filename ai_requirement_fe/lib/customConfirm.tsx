import toast from "react-hot-toast";

export const customConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px]">
        <p className="font-medium text-slate-800">{message}</p>
        <div className="flex gap-2 justify-end mt-2">
          <button
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
          >
            Hủy
          </button>
          <button
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
          >
            Đồng ý
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: 'confirm-toast' });
  });
};
