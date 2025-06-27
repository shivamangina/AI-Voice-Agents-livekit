import React from "react";

export default function Tools() {
  return (
    <div className="flex h-full flex-col gap-2 p-6">
      <span className="font-semibold">Available Tools</span>
      <div className="flex flex-col gap-2">Add</div>

      {/* Tool Invocations */}
      <div className="flex flex-col gap-2 ">
        <span className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4">
          <span className="font-semibold">Tool 1</span>
          <span className="text-sm text-gray-500">Tool 1 description</span>
        </span>

        <span className="flex flex-col gap-2 rounded-lg border border-gray-200 p-4">
          <span className="font-semibold">Tool 2</span>
          <span className="text-sm text-gray-500">Tool 2 description</span>
        </span>
      </div>
    </div>
  );
}
