import React from "react";
import DataItem, { testData } from "./DataItem";

const ResourceManager = () => {
    return (
        <div className="text-gray-100 w-[280px] border-r border-gray-200 flex-col bg-gray-900 p-3 flex-none">
            <div className="overflow-scroll grid grid-cols-2 gap-2">
                {
                    testData.map((data) => {
                        return (
                            <DataItem key={data.id} data={data} />
                        );
                    })
                }
            </div>
        </div>
    );
};

export default ResourceManager;