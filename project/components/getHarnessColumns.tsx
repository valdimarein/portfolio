// @ts-nocheck
import React from "react";
import { Tag } from "primereact/tag";
import Button from "@components/Button";
import { Row } from "@tanstack/react-table";
import styles from "./harnesses.module.scss";
import * as types from "@modules/project/types";
import { StoreContext } from "@hooks/useStores";
import Column from "@components/DataTable/Column/Column";
import { OptionsMenu } from "@modules/project/canvas/getOptions";
import { createColumnHelper, getColumnWidth } from "@components/DataTable";

interface GetHarnessColumnsArgs {
  width: number;
  stores: StoreContext;
  ctx: types.UseProjectContext;
  handleTable: (args: types.HandleTable) => void;
  getOptions: (row: Row<types.Harness>) => types.MenuItem[];
}

const columnHelper = createColumnHelper<types.Harness>();

export const getHarnessColumns = ({
  ctx,
  width,
  stores,
  getOptions,
  handleTable,
}: GetHarnessColumnsArgs) => {
  const colWidths = {
    focused: 7.5,
    template: 25,
    user: 25,
    openQty: 20,
    status: 10,
    options: 10,
  };

  const columns = [
    columnHelper.display({
      id: "focus",
      header: () => (
        <i className={`pi pi-question-circle ${styles.focusIcon}`} />
      ),
      size: getColumnWidth(width, colWidths.focused),
      cell: ({ row }) => {
        const handleClick = async () => {
          try {
            if (ctx.projectId && ctx.data.userHarness && ctx.userStatusId) {
              await stores.headerStore.updateCurrentHarness(
                ctx.userStatusId,
                row.original.id,
                ctx.projectId
              );
            }
          } catch (error) {
            console.error(
              `Failed to update harness: ${(error as Error).message}`
            );
          }
        };

        if (row.original.template === null) {
          return <div></div>;
        }

        return (
          <div>
            {ctx.data.userHarness?.harness?.id === row.original.id ? (
              <i className={`pi pi-bullseye ${styles.centered}`} />
            ) : (
              <Button
                icon="pi-circle"
                className={styles.centered}
                onClick={handleClick}
              />
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("template", {
      header: () => <span>Template</span>,
      size: getColumnWidth(width, colWidths.template),
      cell: ({ row }) => {
        const value = row.original.template;

        return (
          <div>
            {value ? (
              <span>{value.name}</span>
            ) : (
              <Column<Extract<types.Selectors, { label: "template" }>>
                value={value}
                type="dropdown"
                row={row.original}
                optionModifier="name"
                optionLabel="template"
                optionOperation="update"
                handleOnChange={handleTable}
                placeholder="Select a Template"
                uniqueId={`template:${row.original.id}`}
                options={ctx.data.templateHarnesses || []}
              />
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("user", {
      header: () => <span>User</span>,
      size: getColumnWidth(width, colWidths.user),
      cell: ({ row }) => {
        const value = row.original.user;

        return (
          <div>
            <Column<Extract<types.Selectors, { label: "user" }>>
              row={row.original}
              type="dropdown"
              value={value}
              optionLabel="user"
              optionOperation="update"
              optionModifier="username"
              placeholder="Select a User"
              handleOnChange={handleTable}
              options={ctx.data.users || []}
              uniqueId={`user:${row.original.id}`}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("openQty", {
      header: () => <span>Quantity</span>,
      size: getColumnWidth(width, colWidths.openQty),
      cell: ({ row }) => {
        const value = row.original.openQty;

        return (
          <div>
            {row.original.template ? (
              <Column<Extract<types.Selectors, { label: "openQty" }>>
                type="number"
                value={value}
                row={row.original}
                optionLabel="openQty"
                placeholder="Quantity"
                optionOperation="update"
                handleOnChange={handleTable}
                uniqueId={`openQty:${row.original.id}`}
              />
            ) : (
              <span></span>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "status",
      header: () => <span>Status</span>,
      size: getColumnWidth(width, colWidths.status),
      cell: ({ row }) => {
        return (
          <div>
            <Tag
              className={styles.statusTag}
              value={row.original.template ? "Active" : "Not Active"}
            />
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "options",
      header: () => <span></span>,
      size: getColumnWidth(width, colWidths.options),
      cell: ({ row }) => {
        const items = getOptions(row);

        return <OptionsMenu items={items} />;
      },
    }),
  ];

  return columns;
};
