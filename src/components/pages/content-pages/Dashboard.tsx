import { useBrandsQuery } from "../../hooks/useBrandsQuery";

const Dashboard = () => {
  const selectedGender = "male";

  const brandsQuery = useBrandsQuery(selectedGender);

  return <h1>{JSON.stringify(brandsQuery.data)}</h1>;
};

export default Dashboard;
