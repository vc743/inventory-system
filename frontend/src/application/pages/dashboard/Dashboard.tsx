import { getCategories } from "@/infrastructure/api/category/category";
import { useQuery } from "@tanstack/react-query";

export const Dashboard = () => {
  const { data, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  })

  console.log(data);
  console.log(error);

  if (error) return <p>{error.message}</p>

  return <h1 className="font-bold text-3xl">Dashboard</h1>;
};
