/* eslint-disable react/prop-types */
import Sidebar from "@/components/admin/sidebar.jsx";

const GeneralSettings = ({ user }) => {

  return (
    <Sidebar user={user}>
      <div className="p-4 w-screen md:w-full pb-20">
        <div className="flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold">Pengaturan Umum</h1>
        </div>
        <div className="w-full max-w-md mt-10 p-6 bg-white rounded-lg shadow-md">
            Comming Soon
        </div>
      </div>
    </Sidebar>
  );
};

export default GeneralSettings;
