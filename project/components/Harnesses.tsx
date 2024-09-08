// @ts-nocheck
import React from "react";
import { useMemo } from "react";
import { useStores } from "@hooks/useStores";
import DataTable from "@components/DataTable";
import * as types from "@modules/project/types";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { handleAddRow } from "@modules/project/canvas/handleAddRow";
import { getMenuOptions } from "@modules/project/canvas/getOptions";
import { getHarnessColumns } from "@modules/project/components/getHarnessColumns";

interface HarnessesProps {
  ctx: types.UseProjectContext;
}

const Harnesses = ({ ctx }: HarnessesProps) => {
  const width = useWindowWidth({ ratio: 0.6 });

  const stores = useStores();

  const columns = useMemo(
    () =>
      getHarnessColumns({
        ctx,
        width,
        stores,
        handleTable: (args) => stores.project.handleTable(args),
        getOptions: (row) => getMenuOptions({ row, stores }),
      }),
    [ctx.data.userHarness]
  );

  return (
    <DataTable
      width={width}
      isRadius={true}
      columns={columns}
      padding={{
        header: "10px",
        body: "5px",
      }}
      sort={{
        "template.name": "asc",
        openQty: "desc",
      }}
      data={ctx.data.harnesses || []}
      isFooter={true}
      footer={async () => await handleAddRow({ ctx })}
    />
  );
};

export default Harnesses;
