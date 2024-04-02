import { useSearchParams } from "next/navigation";

export function Searchparams(string) {
  const searchParam = useSearchParams();
  const id = searchParam.get(string);
  return id;
}
