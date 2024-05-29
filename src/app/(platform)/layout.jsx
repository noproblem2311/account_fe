import {Sidebar}  from "./_component/Sidebar/Sidebar";
import { Navbar } from "./_component/Navbar/Navbar";



const PlatformLayout = ({children}) => {
  return (
      <main className=" w-full  flex relative ">
        <Navbar />
        <Sidebar />
        <div className=" top-[64px] left-[240px] absolute w-[calc(100%-240px)] bg-slate-100 overflow-hidden  flex ">
          {children}
        </div>
      </main>
  );
};

export default PlatformLayout;