export type AsyncState<T> = {
  data?: T;
  error?: string;
  status: "idle" | "loading" | "success" | "error";
};
