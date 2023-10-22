import { Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import MyPage from "./MyPage";

export default function UserRoutes() {
  return (
    <>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mypage" element={<MyPage />} />
    </>
  );
}
