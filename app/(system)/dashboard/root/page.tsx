import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

type PageProps = {};

const DashboardRoot: React.FC<PageProps> = ({}) => {
  return (
    <>
      <div className="grid h-max grid-cols-5 gap-6 py-10">
        {/* ####################################### */}
        {/* -- Welcome text section */}
        {/* ####################################### */}
        <div className="col-span-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome to Goloka,&nbsp;
              <span className="text-main-100">Jamiu</span>
            </h1>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur. Ultrices turpis amet et
              id.
            </p>
          </div>
          {/* <div className="hidden items-center justify-center space-x-2 md:flex">
            <Button variant="outline">Train your AI</Button>
            <Button variant="default">
              <span>
                <FolderPlus size={18} />
              </span>{" "}
              Create Project
            </Button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default DashboardRoot;
