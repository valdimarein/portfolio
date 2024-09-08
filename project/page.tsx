// @ts-nocheck
"use client";
import withAuth from "./withAuth";
import React, { useRef } from "react";
import { Toast } from "primereact/toast";
import Loading from "@components/Loading";
import styles from "./project.module.scss";
import { useStores } from "@hooks/useStores";
import Harnesses from "./components/Harnesses";
import { Session } from "@types-common/session.types";
import { useProjectContext } from "@modules/project/graphql/useProjectContext";

interface ProjectProps {
  session: Session;
  projectId?: string;
}

const Project = ({ session, projectId }: ProjectProps) => {
  const toast = useRef<Toast>(null);

  /* Instantiate GraphQL Context */
  const ctx = useProjectContext(session, projectId);

  const stores = useStores();

  /* Set Context & Toast on Store. */
  stores.project.set(ctx, toast);

  return (
    <>
      <Loading className={styles.main} loading={ctx.loading}>
        <Harnesses ctx={ctx} />
      </Loading>
      <Toast ref={toast} />
    </>
  );
};

/* Authorize User with HOC */
const AuthorizedProject = withAuth(Project);

interface PageProps {
  params: { projectId?: string };
}

const Page = ({ params }: PageProps) => {
  return <AuthorizedProject projectId={params.projectId} />;
};

export default Page;
