import { useSearchParams } from "next/navigation";

export function Searchparams(string) {
  const searchparam = useSearchParams();
  const id = searchparam.get(string);
  return id;
}
